package gov.fda.nctr.arlims.data_access.test_data;

import java.io.IOError;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ExecutionException;
import static java.lang.String.join;
import javax.transaction.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.lob.DefaultLobHandler;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.auditing.AuditLogService;
import gov.fda.nctr.arlims.data_access.auditing.AttachedFileDescription;
import gov.fda.nctr.arlims.data_access.facts.FactsAccessService;
import gov.fda.nctr.arlims.models.dto.*;


@Service
public class JdbcLabsDSTestDataService extends ServiceBase implements TestDataService
{
    private final JdbcTemplate jdbc;
    private final FactsAccessService factsAccessService;
    private final AuditLogService auditLogSvc;

    private static final String EMPTY_STRING_MD5 = "D41D8CD98F00B204E9800998ECF8427E";

    private static final List<String> TESTV_SAMPLE_OP_TEST_MAPPED_COLS =
        Arrays.asList(
            "TEST_ID",
            "OP_ID",
            "SAMPLE_TRACKING_NUM",
            "SAMPLE_TRACKING_SUB_NUM",
            "PAC",
            "PRODUCT_NAME",
            "TYPE_CODE",
            "TYPE_NAME",
            "TYPE_SHORT_NAME",
            "CREATED",
            "CREATED_BY_EMP",
            "LAST_SAVED",
            "LAST_SAVED_BY_EMP",
            "ATTACHED_FILES_COUNT",
            "BEGIN_DATE",
            "NOTE",
            "STAGE_STATUSES_JSON",
            "REVIEWED",
            "REVIEWED_BY_EMP",
            "SAVED_TO_FACTS",
            "SAVED_TO_FACTS_BY_EMP",
            "LID",
            "PAF",
            "SUBJECT"
        );

    private static final String TESTV_SAMPLE_OP_TEST_MAPPED_COLS_STR = join(",", TESTV_SAMPLE_OP_TEST_MAPPED_COLS);

    public JdbcLabsDSTestDataService
        (
            JdbcTemplate jdbcTemplate,
            FactsAccessService factsAccessService,
            AuditLogService auditLogSvc
        )
    {
        this.jdbc = jdbcTemplate;
        this.factsAccessService = factsAccessService;
        this.auditLogSvc = auditLogSvc;

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
            final PreparedStatement ps = conn.prepareStatement(sql, new String[] {"ID"});
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

        String sql =
            "update test\n" +
            "set test_data_json = ?, stage_statuses_json = ?, last_saved = ?, " +
                "last_saved_by_emp_id = ?, test_data_md5 = ?\n" +
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

        String sql =
            "update test\n" +
            "set test_data_json = ?, stage_statuses_json = ?, last_saved = ?, last_saved_by_emp_id = ?, test_data_md5 = ?\n" +
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
    public List<TestAttachedFileMetadata> getTestAttachedFileMetadatas(long testId)
    {
        String sql =
            "select tf.id, tf.label, ordering, tf.test_data_part, tf.name, length(tf.data), tf.uploaded " +
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
            "select tf.id, tf.label, tf.ordering, tf.test_data_part, tf.name, length(tf.data), tf.uploaded " +
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

    @Override
    @Transactional
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
                    final PreparedStatement ps = conn.prepareStatement(sql, new String[] {"ID"});
                    ps.setLong(1, testId);
                    ps.setString(2, label.orElse(null));
                    ps.setInt(3, ordering);
                    ps.setString(4, testDataPart.orElse(null));
                    ps.setString(5, file.getOriginalFilename());
                    ps.setTimestamp(6, now);
                    DefaultLobHandler lobHandler = new DefaultLobHandler();
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
    public TestAttachedFileContents getTestAttachedFileContents
        (
            long attachedFileId,
            long testId
        )
    {
        String sql = "select name, length(data), data from test_file where id = ? and test_id = ?";

        RowMapper<TestAttachedFileContents> rowMapper = (row, rowNum) ->
            new TestAttachedFileContents(
                row.getString(1),
                row.getLong(2),
                row.getBinaryStream(3)
            );

        return jdbc.queryForObject(sql, rowMapper, attachedFileId, testId);
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
                Collections.singletonList(attachedFileMd)
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
        String testTypeCode = (String)contextRow.get("TEST_TYPE_CODE");

        return new TestAuditInfo(testTypeCode, testRow, contextRow);
    }

    @Override
    public List<SampleOpTest> findTests
        (
            Optional<String> searchText,
            Optional<Instant> fromTimestamp,
            Optional<Instant> toTimestamp,
            Optional<String> testTimestampProperty,
            Optional<List<String>> labTestTypeCodes
        )
    {
        List<String> whereCriteria = new ArrayList<>();
        MapSqlParameterSource params = new MapSqlParameterSource();

        searchText.ifPresent(textQuery -> {
            whereCriteria.add("contains(test_data_json, :textQuery) > 0");
            params.addValue("textQuery", textQuery);
        });

        String tsProp = testTimestampProperty.orElse("created");
        fromTimestamp.ifPresent(fts -> {
            whereCriteria.add(tsProp + " >= :fts");
            params.addValue("fts", new java.sql.Timestamp(fts.toEpochMilli()));
        });
        toTimestamp.ifPresent(tts -> {
            whereCriteria.add(tsProp + " <= :tts");
            params.addValue("tts", new java.sql.Timestamp(tts.toEpochMilli()));
        });

        labTestTypeCodes.ifPresent(codes -> {
            if ( codes.isEmpty() )
                whereCriteria.add("type_code is null");
            else
            {
                whereCriteria.add("type_code in (:typeCodes)");
                params.addValue("typeCodes", codes);
            }
        });

        String sql =
            "select " + TESTV_SAMPLE_OP_TEST_MAPPED_COLS_STR + " from test_v\n" +
            (!whereCriteria.isEmpty() ? "where " + join("\nand\n", whereCriteria): "");

        RowMapper<SampleOpTest> rowMapper = getTestVSampleOpTestRowMapper();

        return new NamedParameterJdbcTemplate(jdbc).query(sql, params, rowMapper);
    }

    // RowMapper creating SampleOpTests from TEST_V rows, assuming column order specified in TESTV_SAMPLE_OP_TEST_MAPPED_COLS.
    private RowMapper<SampleOpTest> getTestVSampleOpTestRowMapper()
    {
        return (row, rowNum) -> {
            LabTestMetadata tmd =
                new LabTestMetadata(
                    row.getLong(1),
                    row.getLong(2),
                    row.getLong(3),
                    row.getLong(4),
                    row.getString(5),
                    row.getString(6),
                    LabTestTypeCode.valueOf(row.getString(7)),
                    row.getString(8),
                    row.getString(9),
                    row.getTimestamp(10).toInstant(),
                    row.getString(11),
                    row.getTimestamp(12).toInstant(),
                    row.getString(13),
                    row.getInt(14),
                    Optional.ofNullable(row.getString(15)).map(LocalDate::parse),
                    Optional.ofNullable(row.getString(16)),
                    Optional.ofNullable(row.getString(17)),
                    Optional.ofNullable(row.getTimestamp(18)).map(Timestamp::toInstant),
                    Optional.ofNullable(row.getString(19)), // reviewed by emp
                    Optional.ofNullable(row.getTimestamp(20)).map(Timestamp::toInstant),
                    Optional.ofNullable(row.getString(21)) // saved to facts by emp
                );

            Optional<String> lid = Optional.ofNullable(row.getString(22));
            Optional<String> paf = Optional.ofNullable(row.getString(23));
            Optional<String> subject = Optional.ofNullable(row.getString(24));

            SampleOp s =
                new SampleOp(
                    tmd.getOpId(),
                    tmd.getSampleTrackingNumber(),
                    tmd.getSampleTrackingSubNumber(),
                    tmd.getPac(),
                    lid,
                    paf,
                    tmd.getProductName(),
                    Optional.empty(),
                    Optional.empty(),
                    Optional.empty(), // last refreshed from FACTS not available when sample metadata comes from test record
                    subject,
                    Optional.empty(), // tests omitted
                    Optional.empty()  // assignments omitted
                );

            return new SampleOpTest(s, tmd);
        };
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
