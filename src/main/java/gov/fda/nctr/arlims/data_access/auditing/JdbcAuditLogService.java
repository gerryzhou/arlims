package gov.fda.nctr.arlims.data_access.auditing;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.DatabaseConfig;
import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.models.dto.AuditLogEntry;
import static gov.fda.nctr.arlims.data_access.DatabaseConfig.DatabaseType.POSTGRESQL;


@Service
public class JdbcAuditLogService extends ServiceBase implements AuditLogService
{
    private final DatabaseConfig databaseConfig;

    private final JdbcTemplate jdbc;

    private final ObjectWriter jsonWriter;

    public JdbcAuditLogService
        (
            DatabaseConfig databaseConfig,
            JdbcTemplate jdbcTemplate
        )
    {
        this.databaseConfig = databaseConfig;
        this.jdbc = jdbcTemplate;
        this.jsonWriter = makeJsonWriter();
    }

    @Transactional
    @Override
    public long addEntry
        (
            Instant timestamp,
            long labGroupId,
            Optional<Long> testId,
            long empId,
            String username,
            String action,
            String objectType,
            Optional<String> objectContextMetadataJson,
            Optional<String> objectFromValueJson,
            Optional<String> objectToValueJson
        )
    {
        String jsonPosParam = databaseConfig.getPrimaryDatabaseType() == POSTGRESQL ? "?::jsonb" : "?";

        String sql =
            "insert into audit_entry\n" +
            "(timestamp, lab_group_id, test_id, acting_emp_id, acting_username, action, object_type," +
             "object_context_metadata_json, object_from_value_json, object_to_value_json)\n" +
            "values(?,?,?,?,?,?,?,"+jsonPosParam+","+jsonPosParam+","+jsonPosParam+")";

        PreparedStatementCreator psc = conn -> {
            String idCol = databaseConfig.normalizePrimaryDatabaseIdentifier("id");
            final PreparedStatement ps = conn.prepareStatement(sql, new String[] {idCol});
            ps.setTimestamp(1, new Timestamp(timestamp.toEpochMilli()));
            ps.setLong(2, labGroupId);
            ps.setObject(3, testId.orElse(null), java.sql.Types.INTEGER);
            ps.setLong(4, empId);
            ps.setString(5, username);
            ps.setString(6, action);
            ps.setString(7, objectType);
            ps.setString(8, objectContextMetadataJson.orElse(null));
            ps.setString(9, objectFromValueJson.orElse(null));
            ps.setString(10, objectToValueJson.orElse(null));
            return ps;
        };

        final KeyHolder holder = new GeneratedKeyHolder();

        jdbc.update(psc, holder);

        return holder.getKey().longValue();
    }

    @Override
    public ObjectWriter getJsonWriter()
    {
        return jsonWriter;
    }

    @Override
    public List<AuditLogEntry> getEntries
        (
            long labGroupId,
            Optional<Long> testId,
            Optional<Instant> fromTimestamp,
            Optional<Instant> toTimestamp,
            Optional<String> actingUsername,
            boolean includeChangeData, // whether to include from/to data values
            boolean includeUnchangedSaves // whether test data saves with identical from/to values should be included
        )
    {
        List<String> conds = new ArrayList<>();
        List<Object> params = new ArrayList<>();

        conds.add("lab_group_id = ?");
        params.add(labGroupId);

        testId.ifPresent(id -> {
            conds.add("test_id = ?");
            params.add(id);
        });

        fromTimestamp.ifPresent(ts -> {
            conds.add("timestamp >= ?");
            params.add(new Timestamp(ts.toEpochMilli()));
        });

        toTimestamp.ifPresent(ts -> {
            conds.add("timestamp <= ?");
            params.add(new Timestamp(ts.toEpochMilli()));
        });

        actingUsername.ifPresent(username -> {
            conds.add("acting_emp_id in (select e.id from employee e where e.fda_email_account_name = ?)");
            params.add(username);
        });

        if ( !includeUnchangedSaves )
            conds.add("action <> 'save-unchanged'");

        String sql =
            "select id, timestamp, test_id, acting_emp_id, acting_username, action, " +
            "object_type, object_context_metadata_json" +
            (includeChangeData ? ", object_from_value_json, object_to_value_json" : "") + "\n" +
            "from audit_entry\n" +
            "where " + String.join("\nand ", conds) + "\n" +
            "order by timestamp";

        RowMapper<AuditLogEntry> rowMapper = (row, rowNum) ->
            new AuditLogEntry(
                row.getLong(1),
                row.getTimestamp(2).toInstant(),
                labGroupId,
                Optional.of(row.getLong(3)),
                row.getLong(4),
                row.getString(5),
                row.getString(6),
                row.getString(7),
                Optional.ofNullable(row.getString(8)),
                includeChangeData ? Optional.ofNullable(row.getString(9)) : Optional.empty(),
                includeChangeData ? Optional.ofNullable(row.getString(10)) : Optional.empty()
            );

        return jdbc.query(sql, params.toArray(), rowMapper);
    }

    @Override
    public List<Long> getTestModifyingEmployees(long testId)
    {
        String sql = "select distinct acting_emp_id from audit_entry where test_id = ?";

        return jdbc.queryForList(sql, Long.class, testId);
    }


    private ObjectWriter makeJsonWriter()
    {
        ObjectMapper mapper = Jackson2ObjectMapperBuilder.json().build();
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ssZ");
        mapper.setDateFormat(df);
        return mapper.writer();
    }
}
