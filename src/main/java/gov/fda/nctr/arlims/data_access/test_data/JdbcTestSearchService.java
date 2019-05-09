package gov.fda.nctr.arlims.data_access.test_data;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import static java.lang.String.join;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.DatabaseConfig;
import gov.fda.nctr.arlims.models.dto.SampleOpTest;
import static gov.fda.nctr.arlims.data_access.test_data.TestVSampleOpTestRowMapper.TESTV_SAMPLE_OP_TEST_MAPPED_COLS;


@Service
public class JdbcTestSearchService implements TestSearchService
{
    private final DatabaseConfig databaseConfig;
    private final JdbcTemplate jdbc;

    private static final String TESTV_SAMPLE_OP_TEST_MAPPED_COLS_STR = join(",", TESTV_SAMPLE_OP_TEST_MAPPED_COLS);

    public JdbcTestSearchService
        (
            DatabaseConfig databaseConfig,
            JdbcTemplate jdbcTemplate
        )
    {
        this.databaseConfig = databaseConfig;
        this.jdbc = jdbcTemplate;
    }

    @Override
    public List<SampleOpTest> findTestsByFullTextSearch
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
            TextSearchCondition cond = makeTextSearchCondition(textQuery);
            whereCriteria.add(cond.whereClauseCondition);
            params.addValue(cond.textQueryParamName, cond.textQueryParamValue);
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

        RowMapper<SampleOpTest> rowMapper = new TestVSampleOpTestRowMapper(false);

        return new NamedParameterJdbcTemplate(jdbc).query(sql, params, rowMapper);
    }

    private TextSearchCondition makeTextSearchCondition(String textQuery)
    {
        switch ( databaseConfig.getPrimaryDatabaseType() )
        {
            case POSTGRESQL:
            {
                String escapedTextQuery = textQuery; // TODO: Clean Postgres text query.
                return new TextSearchCondition(
                    "to_tsvector('test_data_text_search_config', test_data_json) @@ to_tsquery(:textQuery)",
                    "textQuery",
                    escapedTextQuery
                );
            }
            case ORACLE:
            {
                String escapedTextQuery = "{" + textQuery.replace('{', ' ').replace('}', ' ') + "}";
                return new TextSearchCondition(
                    "contains(test_data_json, :textQuery) > 0",
                    "textQuery",
                    escapedTextQuery
                );
            }
            default:
                throw new RuntimeException("Database type not recognized for text query construction.");
        }
    }

}

class TextSearchCondition {

    String whereClauseCondition;
    String textQueryParamName;
    String textQueryParamValue;

    public TextSearchCondition(String whereClauseCondition, String textQueryParamName, String textQueryParamValue)
    {
        this.whereClauseCondition = whereClauseCondition;
        this.textQueryParamName = textQueryParamName;
        this.textQueryParamValue = textQueryParamValue;
    }

}
