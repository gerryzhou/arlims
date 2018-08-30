package gov.fda.nctr.arlims.data_access.change_auditing;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Optional;

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


@Service
public class JdbcDataChangeAuditingService implements DataChangeAuditingService
{
    private final JdbcTemplate jdbc;

    private final ObjectWriter jsonWriter;

    public JdbcDataChangeAuditingService(JdbcTemplate jdbcTemplate)
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
    public long logDataChange
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
            "insert into data_change\n" +
            "(timestamp, lab_group_id, creating_emp_id, creating_username, action, object_type," +
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


}
