package gov.fda.nctr.arlims.data_access.auditing;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import javax.transaction.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.models.dto.AuditEntry;


@Service
public class JdbcAuditLogService implements AuditLogService
{
    private final JdbcTemplate jdbc;

    private final ObjectWriter jsonWriter;

    public JdbcAuditLogService(JdbcTemplate jdbcTemplate)
    {
        this.jdbc = jdbcTemplate;
        ObjectMapper mapper = Jackson2ObjectMapperBuilder.json().build();
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ssZ");
        mapper.setDateFormat(df);
        this.jsonWriter = mapper.writer();
    }

    @Override
    @Transactional
    public long addLogEntry
        (
            Instant timestamp,
            long labGroupId,
            long empId,
            String username,
            String action,
            String objectType,
            Optional<String> objectContextMetadataJson,
            Optional<String> objectFromValueJson,
            Optional<String> objectToValueJson
        )
    {
        String sql =
            "insert into audit_entry\n" +
            "(timestamp, lab_group_id, acting_emp_id, acting_username, action, object_type," +
             "object_context_metadata_json, object_from_value_json, object_to_value_json)\n" +
            "values(?,?,?,?,?,?,?,?,?)";

        PreparedStatementCreator psc = conn -> {
            final PreparedStatement ps = conn.prepareStatement(sql, new String[] {"ID"});
            ps.setTimestamp(1, new Timestamp(timestamp.toEpochMilli()));
            ps.setLong(2, labGroupId);
            ps.setLong(3, empId);
            ps.setString(4, username);
            ps.setString(5, action);
            ps.setString(6, objectType);
            ps.setString(7, objectContextMetadataJson.orElse(null));
            ps.setString(8, objectFromValueJson.orElse(null));
            ps.setString(9, objectToValueJson.orElse(null));
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
    public List<AuditEntry> getLogEntries
        (
            long labGroupId,
            Instant fromTimestamp,
            Optional<Set<String>> usernames,
            Optional<Set<String>> actions,
            Optional<Set<String>> objectTypes
        )
    {
        // TODO
        return null;
    }


}
