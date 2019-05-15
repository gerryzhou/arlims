package gov.fda.nctr.arlims.data_access.test_data;

import java.io.IOError;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

import static gov.fda.nctr.arlims.data_access.DatabaseConfig.DatabaseType.POSTGRESQL;
import static java.lang.String.join;
import static java.util.Collections.singletonList;
import javax.transaction.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.commons.io.IOUtils;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.lob.LobHandler;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import gov.fda.nctr.arlims.data_access.DatabaseConfig;
import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.auditing.AuditLogService;
import gov.fda.nctr.arlims.data_access.auditing.AttachedFileDescription;
import gov.fda.nctr.arlims.models.dto.*;
import static gov.fda.nctr.arlims.data_access.test_data.TestVSampleOpTestRowMapper.TESTV_SAMPLE_OP_TEST_MAPPED_COLS;


@Service
public class JdbcLabsDSTestDataService extends ServiceBase implements TestDataService
{
    private final AuditLogService auditLogSvc;
    private final DatabaseConfig databaseConfig;
    private final JdbcTemplate jdbc;

    private static final String EMPTY_STRING_MD5 = "D41D8CD98F00B204E9800998ECF8427E";

    private static final String TESTV_SAMPLE_OP_TEST_MAPPED_COLS_STR = join(",", TESTV_SAMPLE_OP_TEST_MAPPED_COLS);

    public JdbcLabsDSTestDataService
        (
            AuditLogService auditLogSvc,
            DatabaseConfig databaseConfig,
            JdbcTemplate jdbcTemplate
        )
    {
        this.auditLogSvc = auditLogSvc;
        this.databaseConfig = databaseConfig;
        this.jdbc = jdbcTemplate;
    }

    @Transactional
    @Override
    public long createTest
        (
            long sampleOpId,
            LabTestTypeCode testTypeCode,
            String testBeginDate,
            long sampleTrackingNumber,
            long sampleTrackingSubNumber,
            String pac,
            String productName,
            Optional<String> lid,
            Optional<String> paf,
            Optional<String> subject,
            AppUser user
        )
    {
        java.sql.Timestamp now = new java.sql.Timestamp(System.currentTimeMillis());

        String sql =
            "insert into test (" +
                "op_id, test_type_id, lab_group_id, begin_date, test_data_md5," +
                "created, created_by_emp_id, last_saved, last_saved_by_emp_id," +
                "sample_tracking_num, sample_tracking_sub_num, pac, product_name,lid, paf, subject" +
            ")\n" + // sample md
            "values(" +
                "?," +
                "(select id from test_type where code = ?)," +
                "(select lab_group_id from employee where id = ?)," +
                "TO_DATE(?, 'YYYY-MM-DD')," + // begin_date
                "'" + EMPTY_STRING_MD5 + "'," +
                "?,?,?,?," + // created* and last_saved* fields
                "?,?,?,?,?,?,?" + // sample metadata
            ")";

        PreparedStatementCreator psc = conn -> {
            String idCol = databaseConfig.normalizePrimaryDatabaseIdentifier("id");
            final PreparedStatement ps = conn.prepareStatement(sql, new String[] {idCol});
            ps.setLong(1, sampleOpId);
            ps.setString(2, testTypeCode.toString());
            ps.setLong(3, user.getEmployeeId());
            ps.setString(4, testBeginDate);
            ps.setTimestamp(5, now);
            ps.setLong(6, user.getEmployeeId());
            ps.setTimestamp(7, now);
            ps.setLong(8, user.getEmployeeId());
            ps.setLong(9, sampleTrackingNumber);
            ps.setLong(10, sampleTrackingSubNumber);
            ps.setString(11, pac);
            ps.setString(12, productName);
            ps.setString(13, lid.orElse(null));
            ps.setString(14, paf.orElse(null));
            ps.setString(15, subject.orElse(null));
            return ps;
        };

        final KeyHolder holder = new GeneratedKeyHolder();

        jdbc.update(psc, holder);

        long testId = holder.getKey().longValue();

        logTestCreated(testId, user);

        return testId;
    }

    private void logTestCreated(long testId, AppUser user)
    {
        TestAuditInfo testAuditInfo = getTestAuditInfo(testId, true);

        auditLogSvc.addEntry(
            Instant.now(),
            user.getLabGroupId(),
            Optional.of(testId),
            user.getEmployeeId(),
            user.getUsername(),
            "create",
            "test",
            Optional.of(rowToJson(testAuditInfo.testIdentifyingMetadata)),
            Optional.empty(),
            Optional.of(rowToJson(testAuditInfo.testRow))
        );
    }

    @Transactional
    @Override
    public void deleteTest(long testId, AppUser user)
    {
        logTestToBeDeleted(testId, user);

        jdbc.update("delete from test_file where test_id = ?", testId);
        int updateCount = jdbc.update("delete from test where id = ?", testId);

        if ( updateCount == 0 )
            throw new RuntimeException("delete failed: no test with id " + testId + " was found");
    }

    private void logTestToBeDeleted(long testId, AppUser user)
    {
        TestAuditInfo testAuditInfo = getTestAuditInfo(testId, true);

        auditLogSvc.addEntry(
            Instant.now(),
            user.getLabGroupId(),
            Optional.of(testId),
            user.getEmployeeId(),
            user.getUsername(),
            "delete",
            "test",
            Optional.of(rowToJson(testAuditInfo.testIdentifyingMetadata)),
            Optional.of(rowToJson(testAuditInfo.testRow)),
            Optional.empty()
        );
    }

    @Override
    public VersionedTestData getVersionedTestData(long testId)
    {
        String sql =
            "select t.test_data_json, t.test_data_md5, e.short_name, t.last_saved\n" +
            "from test t\n" +
            "join employee e on t.last_saved_by_emp_id = e.id\n" +
            "where t.id = ?";

        RowMapper<VersionedTestData> rowMapper = (row, rowNum) -> {
            Optional<String> data = Optional.ofNullable(row.getString(1));
            String md5 = row.getString(2);
            String savedBy = row.getString(3);
            Instant savedInstant = row.getTimestamp(4).toInstant();
            return new VersionedTestData(testId, data, new DataModificationInfo(savedBy, savedInstant, md5));
        };

        return jdbc.queryForObject(sql, rowMapper, testId);
    }

    @Transactional
    @Override
    public Optional<String> saveTestData
        (
            long testId,
            String testDataJson,
            String stageStatusesJson,
            String previousMd5,
            AppUser user
        )
    {
        // Get the current database test data before the update attempt, for the purpose of data change logging.
        // It's OK if the data is updated from elsewhere between this read and the steps below, because in that
        // case the optimistic update will update no record (not found based on expected md5), and so no logging
        // will need to be done.
        VersionedTestData origTestData = getVersionedTestData(testId);

        String md5 = md5OfUtf8Bytes(testDataJson);

        String jsonPosParam = databaseConfig.getPrimaryDatabaseType() == POSTGRESQL ? "?::jsonb" : "?";

        String sql =
            "update test " +
            "set test_data_json = " + jsonPosParam + "," +
                "stage_statuses_json = " + jsonPosParam + "," +
                "last_saved = ?, " +
                "last_saved_by_emp_id = ?," +
                "test_data_md5 = ? " +
            "where id = ? and test_data_md5 = ?";

        int updateCount =
            jdbc.update(
                sql,
                testDataJson,
                stageStatusesJson,
                new java.sql.Timestamp(Instant.now().toEpochMilli()),
                user.getEmployeeId(),
                md5,
                testId,
                previousMd5
            );

        Optional<String> savedMd5 = updateCount > 0 ? Optional.of(md5) : Optional.empty();

        savedMd5.ifPresent(_md5 ->
            logTestDataSaved(testId, origTestData.getTestDataJson(), testDataJson, user)
        );

        return savedMd5;
    }

    @Transactional
    @Override
    public void restoreTestData
        (
            long testId,
            String testDataJson,
            String stageStatusesJson,
            AppUser user
        )
    {
        String newMd5 = md5OfUtf8Bytes(testDataJson);

        String jsonPosParam = databaseConfig.getPrimaryDatabaseType() == POSTGRESQL ? "?::jsonb" : "?";

        String sql =
            "update test " +
            "set test_data_json = " + jsonPosParam + "," +
                "stage_statuses_json = ?," +
                "last_saved = ?," +
                "last_saved_by_emp_id = ?," +
                "test_data_md5 = ? " +
            "where id = ?";

        int updateCount =
            jdbc.update(sql,
                testDataJson,
                stageStatusesJson,
                new java.sql.Timestamp(Instant.now().toEpochMilli()),
                user.getEmployeeId(),
                newMd5,
                testId
            );

        boolean saved = updateCount > 0;

        if ( saved )
        {
            VersionedTestData origTestData = getVersionedTestData(testId);

            logTestDataSaved(testId, origTestData.getTestDataJson(), testDataJson, user);
        }
        else
            throw new RuntimeException("test id not found");
    }

    @Transactional
    @Override
    public void restoreTestDatas(List<TestSaveData> saveDatas, AppUser user)
    {
        for (TestSaveData saveData: saveDatas)
        {
            log.info("Restoring test save data for test " + saveData.getTestId() + ".");

            restoreTestData(
                saveData.getTestId(),
                saveData.getTestDataJson(),
                saveData.getStageStatusesJson(),
                user
            );
        }
    }

    private void logTestDataSaved
        (
            long testId,
            Optional<String> origTestDataJson,
            String updatedTestDataJson,
            AppUser user
        )
    {
        TestAuditInfo testAuditInfo = getTestAuditInfo(testId, false);

        boolean unchanged = origTestDataJson.map(origJson -> origJson.equals(updatedTestDataJson)).orElse(false);

        String action = unchanged ? "save-unchanged" : "update";

        auditLogSvc.addEntry(
            Instant.now(),
            user.getLabGroupId(),
            Optional.of(testId),
            user.getEmployeeId(),
            user.getUsername(),
            action,
            "test-data",
            Optional.of(rowToJson(testAuditInfo.testIdentifyingMetadata)),
            unchanged ? Optional.empty() : origTestDataJson,
            Optional.of(updatedTestDataJson)
        );
    }

    @Override
    public Optional<DataModificationInfo> getTestDataModificationInfo(long testId)
    {
        String sql =
            "select e.short_name, t.last_saved, t.test_data_md5\n" +
            "from test t\n" +
            "join employee e on t.last_saved_by_emp_id = e.id\n" +
            "where t.id = ?";

        RowMapper<DataModificationInfo> rowMapper = (row, rowNum) -> {
            String savedBy = row.getString(1);
            Instant savedInstant = row.getTimestamp(2).toInstant();
            String md5 = row.getString(3);
            return new DataModificationInfo(savedBy, savedInstant, md5);
        };

        List<DataModificationInfo> maybeMod = jdbc.query(sql, rowMapper, testId);

        switch (maybeMod.size())
        {
            case 0: return Optional.empty();
            case 1: return Optional.of(maybeMod.get(0));
            default: throw new RuntimeException("Expected at most one test record for a test id.");
        }
    }

    @Override
    public LabTestMetadata getTestMetadata(long testId)
    {
        String sql =
            "select " +
            "t.op_id,sample_tracking_num,sample_tracking_sub_num,pac,product_name," +
            "tt.code, tt.name, tt.short_name, t.created, " +
            "ce.short_name created_by_emp, t.last_saved, se.short_name last_saved_emp, " +
            "(select count(*) from test_file tf where tf.test_id = t.id) attached_files_count," +
            "TO_CHAR(t.begin_date, 'YYYY-MM-DD') begin_date, " +
            "t.note, t.stage_statuses_json, t.reviewed, re.short_name reviewed_by_emp, " +
            "t.saved_to_facts, fe.short_name saved_to_facts_by_emp\n" +
            "from test t\n" +
            "join test_type tt on t.test_type_id = tt.id\n" +
            "join employee ce on ce.id = t.created_by_emp_id\n" +
            "join employee se on se.id = t.last_saved_by_emp_id\n" +
            "left join employee re on re.id = t.reviewed_by_emp_id\n" +
            "left join employee fe on fe.id = t.last_saved_by_emp_id\n" +
            "where t.id = ?";

        SqlRowSet rs = jdbc.queryForRowSet(sql, testId);

        if ( !rs.next() )
            throw new RuntimeException("Test not found.");

        return
            new LabTestMetadata(
                testId,
                rs.getLong(1),
                rs.getLong(2),
                rs.getLong(3),
                rs.getString(4),
                rs.getString(5),
                LabTestTypeCode.valueOf(rs.getString(6)),
                rs.getString(7),
                rs.getString(8),
                rs.getTimestamp(9).toInstant(),
                rs.getString(10),
                rs.getTimestamp(11).toInstant(),
                rs.getString(12),
                rs.getInt(13),
                Optional.ofNullable(rs.getString(14)).map(LocalDate::parse),
                Optional.ofNullable(rs.getString(15)),
                Optional.ofNullable(rs.getString(16)),
                Optional.ofNullable(rs.getTimestamp(17)).map(Timestamp::toInstant),
                Optional.ofNullable(rs.getString(18)), // reviewed by emp
                Optional.ofNullable(rs.getTimestamp(19)).map(Timestamp::toInstant),
                Optional.ofNullable(rs.getString(20)) // saved to facts by emp
            );
    }

    @Override
    public SampleOpTest getSampleOpTestMetadata(long testId)
    {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("testId", testId);

        String sql =
            "select " + TESTV_SAMPLE_OP_TEST_MAPPED_COLS_STR + " " +
            "from test_v where test_id = :testId";

        RowMapper<SampleOpTest> rowMapper = new TestVSampleOpTestRowMapper(false);

        return new NamedParameterJdbcTemplate(jdbc).queryForObject(sql, params, rowMapper);
    }

    @Override
    public List<TestAttachedFileMetadata> getTestAttachedFileMetadatas(long testId)
    {
        String sql =
            "select tf.id, tf.label, ordering, tf.test_data_part, tf.name, blob_size(tf.data), tf.uploaded " +
            "from test_file tf " +
            "where tf.test_id = ? " +
            "order by tf.ordering";

        RowMapper<TestAttachedFileMetadata> rowMapper = (row, rowNum) ->
            new TestAttachedFileMetadata(
                testId,
                row.getLong(1),
                Optional.ofNullable(row.getString(2)),
                row.getInt(3),
                Optional.ofNullable(row.getString(4)),
                row.getString(5),
                row.getLong(6),
                row.getTimestamp(7).toInstant()
            );

        return jdbc.query(sql, rowMapper, testId);
    }

    private TestAttachedFileMetadata getTestAttachedFileMetadata(long testId, long attachedFileId)
    {
        String sql =
            "select tf.id, tf.label, tf.ordering, tf.test_data_part, tf.name, blob_size(tf.data), tf.uploaded " +
            "from test_file tf " +
            "where tf.id = ?";

        RowMapper<TestAttachedFileMetadata> rowMapper = (row, rowNum) ->
            new TestAttachedFileMetadata(
                testId,
                row.getLong(1),
                Optional.ofNullable(row.getString(2)),
                row.getInt(3),
                Optional.ofNullable(row.getString(4)),
                row.getString(5),
                row.getLong(6),
                row.getTimestamp(7).toInstant()
            );

        return jdbc.queryForObject(sql, rowMapper, attachedFileId);
    }

    @Transactional
    @Override
    public List<Long> attachFilesToTest
        (
            long testId,
            List<MultipartFile> files,
            Optional<String> label,
            int ordering,
            Optional<String> testDataPart,
            AppUser user
        )
    {
        java.sql.Timestamp now = new java.sql.Timestamp(System.currentTimeMillis());

        try
        {
            String sql = "insert into test_file(test_id, label, ordering, test_data_part, name, uploaded, data) " +
                         "values(?,?,?,?,?,?,?)";

            List<Long> createdIds = new ArrayList<>(files.size());

            for ( MultipartFile file: files )
            {
                InputStream is = file.getInputStream();

                PreparedStatementCreator psc = conn -> {
                    String idCol = databaseConfig.normalizePrimaryDatabaseIdentifier("id");
                    final PreparedStatement ps = conn.prepareStatement(sql, new String[] {idCol});
                    ps.setLong(1, testId);
                    ps.setString(2, label.orElse(null));
                    ps.setInt(3, ordering);
                    ps.setString(4, testDataPart.orElse(null));
                    ps.setString(5, file.getOriginalFilename());
                    ps.setTimestamp(6, now);
                    LobHandler lobHandler = databaseConfig.makePrimaryDatabaseLobHandler();
                    lobHandler.getLobCreator().setBlobAsBinaryStream(ps, 7, is, -1);
                    return ps;
                };

                final KeyHolder holder = new GeneratedKeyHolder();

                jdbc.update(psc, holder);

                createdIds.add(holder.getKey().longValue());
            }

            logFilesAttached(testId, files, createdIds, label, ordering, testDataPart, user);

            return createdIds;
        }
        catch(IOException e)
        {
            throw new IOError(e);
        }
    }

    private void logFilesAttached
        (
            long testId,
            List<MultipartFile> files,
            List<Long> attachedFileIds,
            Optional<String> label,
            int ordering,
            Optional<String> testDataPart,
            AppUser user
        )
    {
        TestAuditInfo testAuditInfo = getTestAuditInfo(testId, false);

        List<AttachedFileDescription> fileDescrs =
            makeAttachedFileDescriptions(files, attachedFileIds, label, ordering, testDataPart);

        try
        {
            String descrsJson = auditLogSvc.getJsonWriter().writeValueAsString(fileDescrs);

            auditLogSvc.addEntry(
                Instant.now(),
                user.getLabGroupId(),
                Optional.of(testId),
                user.getEmployeeId(),
                user.getUsername(),
                "attach-files",
                "test",
                Optional.of(rowToJson(testAuditInfo.testIdentifyingMetadata)),
                Optional.empty(),
                Optional.of(descrsJson)
            );
        }
        catch (JsonProcessingException e)
        {
            throw new RuntimeException(e);
        }
    }

    private List<AttachedFileDescription> makeAttachedFileDescriptions
        (
            List<MultipartFile> AttachedFiles,
            List<Long> attachedFileIds,
            Optional<String> label,
            int ordering,
            Optional<String> testDataPart
        )
    {
        List<AttachedFileDescription> attachedFileDescrs = new ArrayList<>();

        for (int i = 0; i < AttachedFiles.size(); ++i)
        {
            MultipartFile f = AttachedFiles.get(i);
            long id = attachedFileIds.get(i);
            attachedFileDescrs.add(
                new AttachedFileDescription(id, f.getOriginalFilename(), f.getSize(), label, ordering, testDataPart)
            );
        }

        return attachedFileDescrs;
    }

    @Transactional
    @Override
    public void updateTestAttachedFileMetadata
        (
            long testId,
            long attachedFileId,
            Optional<String> label,
            int ordering,
            Optional<String> testDataPart,
            String name,
            AppUser user
        )
    {
        logAttachedFileMetadataChange(testId, attachedFileId, label, ordering, testDataPart, name, user);

        String sql = "update test_file set name = ?, label = ?, ordering = ?, test_data_part = ?" +
                     "where id = ? and test_id = ?";

        int affectedCount =
            jdbc.update(
                sql,
                name,
                label.orElse(null),
                ordering,
                testDataPart.orElse(null),
                attachedFileId,
                testId
            );

        switch (affectedCount)
        {
            case 1: return;
            case 0: throw new RuntimeException("Attached file data not updated: no record found for given attached file id and test id.");
            default: throw new RuntimeException("Attached file update unexpectedly reported " + affectedCount + " rows as updated.");
        }
    }

    private void logAttachedFileMetadataChange
        (
            long testId,
            long attachedFileId,
            Optional<String> label,
            int ordering,
            Optional<String> testDataPart,
            String name,
            AppUser user
        )
    {
        TestAuditInfo testAuditInfo = getTestAuditInfo(testId, false);

        TestAttachedFileMetadata origMd = getTestAttachedFileMetadata(testId, attachedFileId);
        TestAttachedFileMetadata newMd =
            new TestAttachedFileMetadata(
                testId,
                attachedFileId,
                label,
                ordering,
                testDataPart,
                name,
                origMd.getSize(),
                origMd.getUploadedInstant()
            );

        try
        {
            String origJson = auditLogSvc.getJsonWriter().writeValueAsString(origMd);
            String newJson = auditLogSvc.getJsonWriter().writeValueAsString(newMd);

            auditLogSvc.addEntry(
                Instant.now(),
                user.getLabGroupId(),
                Optional.of(testId),
                user.getEmployeeId(),
                user.getUsername(),
                "update",
                "test-attached-file-metadata",
                Optional.of(rowToJson(testAuditInfo.testIdentifyingMetadata)),
                Optional.of(origJson),
                Optional.of(newJson)
            );
        }
        catch (JsonProcessingException e)
        {
            throw new RuntimeException(e);
        }
    }

    @Override
    public AttachedFileBasicMetadata getTestAttachedFileBasicMetadata
        (
            long attachedFileId,
            long testId
        )
    {
        String sql = "select name, blob_size(data) from test_file where id = ? and test_id = ?";

        RowMapper<AttachedFileBasicMetadata> rowMapper = (rs, rowNum) ->
            new AttachedFileBasicMetadata(rs.getString(1), rs.getLong(2));

        return jdbc.queryForObject(sql, rowMapper, attachedFileId, testId);
    }

    @Transactional
    @Override
    public void writeTestAttachedFileContentsToStream
        (
            long attachedFileId,
            long testId,
            OutputStream os
        )
    {
        String sql = "select data from test_file where id = ? and test_id = ?";

        Object[] paramVals = new Object[]{attachedFileId, testId};

        jdbc.query(sql, paramVals, rs -> {
            try ( InputStream is = databaseConfig.makePrimaryDatabaseLobHandler().getBlobAsBinaryStream(rs, 1) )
            {
                IOUtils.copyLarge(is, os);
                os.flush();
            }
            catch (IOException e)
            {
                throw new RuntimeException(e.getMessage(), e);
            }
        });
    }

    @Transactional
    @Override
    public void deleteTestAttachedFile
        (
            long testId,
            long attachedFileId,
            AppUser user
        )
    {
        logTestAttachedFileToBeDeleted(testId, attachedFileId, user);

        String sql = "delete from test_file where id = ? and test_id = ?";

        int affectedCount = jdbc.update(sql, attachedFileId, testId);

        switch (affectedCount)
        {
            case 1: return;
            case 0: throw new RuntimeException("Attached file data not deleted: no record found for given attached file id and test id.");
            default: throw new RuntimeException("Attached file delete unexpectedly reported " + affectedCount + " rows as affected.");
        }
    }

    private void logTestAttachedFileToBeDeleted
        (
            long testId,
            long attachedFileId,
            AppUser user
        )
    {
        TestAuditInfo testAuditInfo = getTestAuditInfo(testId, false);

        TestAttachedFileMetadata attachedFileMd = getTestAttachedFileMetadata(testId, attachedFileId);

        try
        {
            String mdJson = auditLogSvc.getJsonWriter().writeValueAsString(
                singletonList(attachedFileMd)
            );

            auditLogSvc.addEntry(
                Instant.now(),
                user.getLabGroupId(),
                Optional.of(testId),
                user.getEmployeeId(),
                user.getUsername(),
                "detach-files",
                "test",
                Optional.of(rowToJson(testAuditInfo.testIdentifyingMetadata)),
                Optional.of(mdJson),
                Optional.empty()
            );
        }
        catch (JsonProcessingException e)
        {
            throw new RuntimeException(e);
        }
    }

    private TestAuditInfo getTestAuditInfo(long testId, boolean includeTestRow)
    {
        String contextSql =
            "select\n" +
              "t.id test_id, t.op_id op_id, lg.name lab_group, " +
              "t.begin_date test_begin_date, tt.short_name test_type_short_name, " +
              "tt.name test_type_name, tt.code \"TEST_TYPE_CODE\"\n" +
            "from test t\n" +
            "join lab_group lg on t.lab_group_id = lg.id\n" +
            "join test_type tt on t.test_type_id = tt.id\n" +
            "where t.id = ?";

        Map<String,Object> contextRow = jdbc.queryForMap(contextSql, testId);
        Map<String,Object> testRow = includeTestRow ?
            jdbc.queryForMap("select * from test where id = ?", testId)
            : new HashMap<>();
        String testTypeCode = (String)contextRow.get(databaseConfig.normalizePrimaryDatabaseIdentifier("test_type_code"));

        return new TestAuditInfo(testTypeCode, testRow, contextRow);
    }


    private static String md5(byte[] data)
    {
        try
        {
            MessageDigest m = MessageDigest.getInstance("MD5");

            m.update(data, 0, data.length);

            BigInteger i = new BigInteger(1, m.digest());

            return String.format("%1$032X", i);
        }
        catch (NoSuchAlgorithmException e)
        {
            e.printStackTrace();
            throw new RuntimeException("Could not obtain Md5 MessageDigest instance.");
        }
    }

    private static String md5OfUtf8Bytes(String s)
    {
        return md5(s.getBytes(StandardCharsets.UTF_8));
    }

    private String rowToJson(Map<String,Object> row)
    {
        try
        {
            return auditLogSvc.getJsonWriter().writeValueAsString(row);
        }
        catch(JsonProcessingException jpe)
        {
            throw new RuntimeException(jpe);
        }
    }

    private static class TestAuditInfo
    {
        String testTypeCode;
        Map<String,Object> testIdentifyingMetadata;
        Map<String,Object> testRow;

        TestAuditInfo(String testTypeCode, Map<String,Object> testRow, Map<String,Object> testIdentifyingMetadata)
        {
            this.testTypeCode = testTypeCode;
            this.testRow = testRow;
            this.testIdentifyingMetadata = testIdentifyingMetadata;
        }
    }

}
