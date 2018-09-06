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
import javax.transaction.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.lob.DefaultLobHandler;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.auditing.AuditLogService;
import gov.fda.nctr.arlims.data_access.auditing.AttachedFileDescription;
import gov.fda.nctr.arlims.models.dto.*;


@Service
public class JdbcTestDataService extends ServiceBase implements TestDataService
{
    private final JdbcTemplate jdbc;
    private final AuditLogService auditLogSvc;

    private static final String EMPTY_STRING_MD5 = "D41D8CD98F00B204E9800998ECF8427E";

    public JdbcTestDataService
        (
            JdbcTemplate jdbcTemplate,
            AuditLogService auditLogSvc
        )
    {
        this.jdbc = jdbcTemplate;
        this.auditLogSvc = auditLogSvc;
    }

    @Transactional
    @Override
    public long createTest
        (
            long sampleId,
            LabTestTypeCode testTypeCode,
            String testBeginDate,
            AppUser user
        )
    {
        java.sql.Timestamp now = new java.sql.Timestamp(System.currentTimeMillis());

        String sql =
            "insert into test " +
                "(sample_id, test_type_id, lab_group_id, begin_date, test_data_md5," +
                "created, created_by_emp_id, last_saved, last_saved_by_emp_id)\n" +
            "values(" +
                "?," +
                "(select id from test_type where code = ?)," +
                "(select lab_group_id from employee where id = ?)," +
                "TO_DATE(?, 'YYYY-MM-DD')," + // begin_date
                "'" + EMPTY_STRING_MD5 + "'," +
                "?,?,?,?" + // created* and last_saved* fields
            ")";

        PreparedStatementCreator psc = conn -> {
            final PreparedStatement ps = conn.prepareStatement(sql, new String[] {"ID"});
            ps.setLong(1, sampleId);
            ps.setString(2, testTypeCode.toString());
            ps.setLong(3, user.getEmployeeId());
            ps.setString(4, testBeginDate);
            ps.setTimestamp(5, now);
            ps.setLong(6, user.getEmployeeId());
            ps.setTimestamp(7, now);
            ps.setLong(8, user.getEmployeeId());
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
        jdbc.update("delete from test_managed_resource where test_id = ?", testId);
        jdbc.update("delete from test_unmanaged_resource where test_id = ?", testId);
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
    public boolean saveTestData
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

        String newMd5 = md5OfUtf8Bytes(testDataJson);

        String sql =
            "update test\n" +
            "set test_data_json = ?, stage_statuses_json = ?, last_saved = ?, last_saved_by_emp_id = ?, test_data_md5 = ?\n" +
            "where id = ? and test_data_md5 = ?";

        int updateCount =
            jdbc.update(
                sql,
                testDataJson,
                stageStatusesJson,
                new java.sql.Timestamp(Instant.now().toEpochMilli()),
                user.getEmployeeId(),
                newMd5,
                testId,
                previousMd5
            );

        boolean saved = updateCount > 0; // optimistic update may have missed due to concurrent update

        if ( saved )
        {
            logTestDataSaved(testId, origTestData.getTestDataJson(), testDataJson, user);
        }

        return saved;
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
            "t.sample_id, s.sample_num, s.pac, s.product_name, tt.code, tt.name, " +
            "tt.short_name, t.created, ce.short_name created_by_emp, t.last_saved, " +
            "se.short_name last_saved_emp, " +
            "(select count(*) from test_file tf where tf.test_id = t.id) attached_files_count," +
            "TO_CHAR(t.begin_date, 'YYYY-MM-DD') begin_date, " +
            "t.note, t.stage_statuses_json, t.reviewed, re.short_name reviewed_by_emp, " +
            "t.saved_to_facts, fe.short_name saved_to_facts_by_emp\n" +
            "from Test t\n" +
            "join Sample s on t.sample_id = s.id\n" +
            "join Test_Type tt on t.test_type_id = tt.id\n" +
            "join Employee ce on ce.id = t.created_by_emp_id\n" +
            "join Employee se on se.id = t.last_saved_by_emp_id\n" +
            "left join Employee re on re.id = t.reviewed_by_emp_id\n" +
            "left join employee fe on fe.id = t.last_saved_by_emp_id\n" +
            "where t.id = ?";

        RowMapper<LabTestMetadata> rowMapper = (row, rowNum) ->
            new LabTestMetadata(
                testId,
                row.getLong(1),
                row.getString(2),
                row.getString(3),
                Optional.ofNullable(row.getString(4)),
                LabTestTypeCode.valueOf(row.getString(5)),
                row.getString(6),
                row.getString(7),
                row.getTimestamp(8).toInstant(),
                row.getString(9),
                row.getTimestamp(10).toInstant(),
                row.getString(11),
                row.getInt(12),
                Optional.ofNullable(row.getString(13)).map(LocalDate::parse),
                Optional.ofNullable(row.getString(14)),
                Optional.ofNullable(row.getString(15)),
                Optional.ofNullable(row.getTimestamp(16)).map(Timestamp::toInstant),
                Optional.ofNullable(row.getString(17)), // reviewed by emp
                Optional.ofNullable(row.getTimestamp(18)).map(Timestamp::toInstant),
                Optional.ofNullable(row.getString(19)) // saved to facts by emp
            );

        return jdbc.queryForObject(sql, rowMapper, testId);
    }

    @Override
    public List<TestAttachedFileMetadata> getTestAttachedFileMetadatas(long testId)
    {
        String sql =
            "select tf.id, tf.role, tf.name, length(tf.data), tf.uploaded " +
            "from test_file tf " +
            "where tf.test_id = ?";

        RowMapper<TestAttachedFileMetadata> rowMapper = (row, rowNum) ->
            new TestAttachedFileMetadata(
                testId,
                row.getLong(1),
                Optional.ofNullable(row.getString(2)),
                row.getString(3),
                row.getLong(4),
                row.getTimestamp(5).toInstant()
            );

        return jdbc.query(sql, rowMapper, testId);
    }

    private TestAttachedFileMetadata getTestAttachedFileMetadata(long testId, long attachedFileId)
    {
        String sql =
            "select tf.id, tf.role, tf.name, length(tf.data), tf.uploaded " +
            "from test_file tf " +
            "where tf.id = ?";

        RowMapper<TestAttachedFileMetadata> rowMapper = (row, rowNum) ->
            new TestAttachedFileMetadata(
                testId,
                row.getLong(1),
                Optional.ofNullable(row.getString(2)),
                row.getString(3),
                row.getLong(4),
                row.getTimestamp(5).toInstant()
            );

        return jdbc.queryForObject(sql, rowMapper, attachedFileId);
    }

    @Override
    @Transactional
    public List<Long> attachFilesToTest
        (
            long testId,
            List<MultipartFile> files,
            Optional<String> role,
            AppUser user
        )
    {
        java.sql.Timestamp now = new java.sql.Timestamp(System.currentTimeMillis());

        try
        {
            String sql = "insert into test_file(test_id, role, name, uploaded, data) values(?, ?, ?, ?, ?)";

            List<Long> createdIds = new ArrayList<>(files.size());

            for ( MultipartFile file: files )
            {
                InputStream is = file.getInputStream();

                PreparedStatementCreator psc = conn -> {
                    final PreparedStatement ps = conn.prepareStatement(sql, new String[] {"ID"});
                    ps.setLong(1, testId);
                    ps.setString(2, role.orElse(null));
                    ps.setString(3, file.getOriginalFilename());
                    ps.setTimestamp(4, now);
                    DefaultLobHandler lobHandler = new DefaultLobHandler();
                    lobHandler.getLobCreator().setBlobAsBinaryStream(ps, 5, is, -1);
                    return ps;
                };

                final KeyHolder holder = new GeneratedKeyHolder();

                jdbc.update(psc, holder);

                createdIds.add(holder.getKey().longValue());
            }

            logFilesAttached(testId, files, createdIds, role, user);

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
            Optional<String> role,
            AppUser user
        )
    {
        TestAuditInfo testAuditInfo = getTestAuditInfo(testId, false);

        List<AttachedFileDescription> fileDescrs = makeAttachedFileDescriptions(files, attachedFileIds, role);

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
            Optional<String> role
        )
    {
        List<AttachedFileDescription> attachedFileDescrs = new ArrayList<>();

        for (int i = 0; i < AttachedFiles.size(); ++i)
        {
            MultipartFile f = AttachedFiles.get(i);
            long id = attachedFileIds.get(i);
            attachedFileDescrs.add(new AttachedFileDescription(id, f.getOriginalFilename(), f.getSize(), role));
        }

        return attachedFileDescrs;
    }

    @Transactional
    @Override
    public void updateTestAttachedFileMetadata
        (
            long testId,
            long attachedFileId,
            Optional<String> role,
            String name,
            AppUser user

        )
    {
        logAttachedFileMetadataChange(testId, attachedFileId, role, name, user);

        String sql = "update test_file set name = ?, role = ? where id = ? and test_id = ?";

        int affectedCount = jdbc.update(sql, name, role, attachedFileId, testId);

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
            Optional<String> role,
            String name,
            AppUser user
        )
    {
        TestAuditInfo testAuditInfo = getTestAuditInfo(testId, false);

        TestAttachedFileMetadata origMd = getTestAttachedFileMetadata(testId, attachedFileId);
        TestAttachedFileMetadata newMd = new TestAttachedFileMetadata(testId, attachedFileId, role, name, origMd.getSize(), origMd.getUploadedInstant());

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
              "s.id sample_id, s.facts_status sample_facts_status, s.lab_group_id lab_group_id, lg.name lab_group, " +
              "s.last_refreshed_from_facts, s.lid, s.pac, s.paf, s.product_name, s.received, s.sample_num, s.sampling_org, " +
              "t.id test_id, t.begin_date test_begin_date, tt.short_name test_type_short_name, " +
              "tt.name test_type_name, tt.code \"TEST_TYPE_CODE\"\n" +
            "from sample s\n" +
            "join lab_group lg on s.lab_group_id = lg.id\n" +
            "join test t on t.sample_id = s.id\n" +
            "join test_type tt on t.test_type_id = tt.id\n" +
            "where t.id = ?";

        Map<String,Object> contextRow = jdbc.queryForMap(contextSql, testId);
        Map<String,Object> testRow = includeTestRow ?
            jdbc.queryForMap("select * from test where id = ?", testId)
            : new HashMap<>();
        String testTypeCode = (String)contextRow.get("TEST_TYPE_CODE");

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
