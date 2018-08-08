package gov.fda.nctr.arlims.data_access;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.models.dto.DataModificationInfo;
import gov.fda.nctr.arlims.models.dto.LabTestMetadata;
import gov.fda.nctr.arlims.models.dto.LabTestTypeCode;
import gov.fda.nctr.arlims.models.dto.VersionedTestData;


@Service
public class JdbcTestDataService implements TestDataService
{
    private final JdbcTemplate jdbc;

    private static final String EMPTY_STRING_MD5 = "D41D8CD98F00B204E9800998ECF8427E";

    public JdbcTestDataService(JdbcTemplate jdbcTemplate)
    {
        this.jdbc = jdbcTemplate;
    }

    @Override
    public long createTest
        (
            long empId,
            long sampleId,
            LabTestTypeCode testTypeCode,
            String testBeginDate
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
            ps.setLong(3, empId);
            ps.setString(4, testBeginDate);
            ps.setTimestamp(5, now);
            ps.setLong(6, empId);
            ps.setTimestamp(7, now);
            ps.setLong(8, empId);
            return ps;
        };

        final KeyHolder holder = new GeneratedKeyHolder();

        jdbc.update(psc, holder);

        return holder.getKey().longValue();
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

    @Transactional @Override
    public boolean saveTestDataJson
        (
            long testId,
            String testDataJson,
            String stageStatusesJson,
            long empId,
            String previousMd5
        )
    {
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
                empId,
                newMd5,
                testId,
                previousMd5
            );

        return updateCount > 0;
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
    public LabTestMetadata getLabTestMetadata(long testId)
    {
        String sql =
            "select " +
            "t.sample_id, s.sample_num, s.pac, s.product_name, tt.code, tt.name, " +
            "tt.short_name, t.created, ce.short_name created_by_emp, t.last_saved, " +
            "se.short_name last_saved_emp, TO_CHAR(t.begin_date, 'YYYY-MM-DD') begin_date, " +
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
                Optional.ofNullable(row.getString(12)).map(LocalDate::parse),
                Optional.ofNullable(row.getString(13)),
                Optional.ofNullable(row.getString(14)),
                Optional.ofNullable(row.getTimestamp(15)).map(Timestamp::toInstant),
                Optional.ofNullable(row.getString(16)), // reviewed by emp
                Optional.ofNullable(row.getTimestamp(17)).map(Timestamp::toInstant),
                Optional.ofNullable(row.getString(18)) // saved to facts by emp
            );

        return jdbc.queryForObject(sql, rowMapper, testId);
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
        try
        {
            return md5(s.getBytes("UTF-8"));
        }
        catch(UnsupportedEncodingException e) { throw new RuntimeException(e); }
    }
}