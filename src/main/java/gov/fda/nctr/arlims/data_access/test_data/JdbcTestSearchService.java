package gov.fda.nctr.arlims.data_access.test_data;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import static java.lang.String.join;

import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.fda.nctr.arlims.data_access.DatabaseConfig;
import gov.fda.nctr.arlims.models.dto.LabTestTypeCode;
import gov.fda.nctr.arlims.models.dto.SampleOpTest;
import gov.fda.nctr.arlims.models.dto.scoped_test_search.TestSearchField;
import gov.fda.nctr.arlims.models.dto.scoped_test_search.TestSearchFieldType;
import gov.fda.nctr.arlims.models.dto.scoped_test_search.TestTypeSearchScope;
import static gov.fda.nctr.arlims.data_access.test_data.TestVSampleOpTestRowMapper.TESTV_SAMPLE_OP_TEST_MAPPED_COLS;
import static java.util.Collections.emptyMap;


@Service
public class JdbcTestSearchService implements TestSearchService
{
    private final DatabaseConfig databaseConfig;
    private final JdbcTemplate jdbc;
    private final ObjectMapper jsonSerializer;

    private static final String TESTV_SAMPLE_OP_TEST_MAPPED_COLS_STR = join(",", TESTV_SAMPLE_OP_TEST_MAPPED_COLS);

    public JdbcTestSearchService
        (
            DatabaseConfig databaseConfig,
            JdbcTemplate jdbcTemplate
        )
    {
        this.databaseConfig = databaseConfig;
        this.jdbc = jdbcTemplate;
        this.jsonSerializer = Jackson2ObjectMapperBuilder.json().build();
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
            SearchCondition cond = makeFullTextSearchCondition(textQuery);
            whereCriteria.add(cond.whereClauseCondition);
            params.addValues(cond.paramValues);
        });

        String tsProp = testTimestampProperty.orElse("created");

        getTestTimestampCondition(tsProp, fromTimestamp, toTimestamp).ifPresent(cond -> {
            whereCriteria.add(cond.whereClauseCondition);
            params.addValues(cond.paramValues);
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

        return doTestsQuery(whereCriteria, params);
    }

    private SearchCondition makeFullTextSearchCondition(String textQuery)
    {
        switch ( databaseConfig.getPrimaryDatabaseType() )
        {
            case POSTGRESQL:
            {
                return new SearchCondition(
                    "to_tsvector('test_data_text_search_config', test_data_json) @@ to_tsquery(:textQuery)",
                    "textQuery",
                    textQuery
                );
            }
            case ORACLE:
            {
                String escapedTextQuery = "{" + textQuery.replace('{', ' ').replace('}', ' ') + "}";
                return new SearchCondition(
                    "contains(test_data_json, :textQuery) > 0",
                    "textQuery",
                    escapedTextQuery
                );
            }
            default:
                throw new RuntimeException("Database type not recognized for text query construction.");
        }
    }

    public List<SampleOpTest> findTestsByTypeSpecificScopedSearch
        (
            LabTestTypeCode testTypeCode,
            String scopeName,
            String searchValue,
            Optional<Instant> fromTimestamp,
            Optional<Instant> toTimestamp,
            Optional<String>  timestampProperty
        )
    {
        TestTypeSearchScope searchScope = getTestTypeSearchScope(testTypeCode, scopeName);

        List<String> whereCriteria = new ArrayList<>();
        MapSqlParameterSource params = new MapSqlParameterSource();

        SearchCondition ssCond = makeScopedSearchCondition(searchScope, searchValue);
        whereCriteria.add(ssCond.whereClauseCondition);
        params.addValues(ssCond.paramValues);

        String tsProp = timestampProperty.orElse("created");
        getTestTimestampCondition(tsProp, fromTimestamp, toTimestamp).ifPresent(cond -> {
            whereCriteria.add(cond.whereClauseCondition);
            params.addValues(cond.paramValues);
        });

        return doTestsQuery(whereCriteria, params);
    }

    private SearchCondition makeScopedSearchCondition
        (
            TestTypeSearchScope searchScope,
            String searchValueString
        )
    {
        switch ( databaseConfig.getPrimaryDatabaseType() )
        {
            case POSTGRESQL:
            {
                String fieldCondsStr =
                    searchScope.getSearchFields().stream()
                    .map(sf -> makeScopedSearchFieldCond(sf, searchValueString))
                    .collect(Collectors.joining(" or "));

                return new SearchCondition(fieldCondsStr, emptyMap());
            }
            case ORACLE:
            {
                // TODO: Implement scoped searches for Oracle.
                throw new RuntimeException("Oracle scoped searches are not yet supported.");
            }
            default:
                throw new RuntimeException("Database type not recognized for scoped test search query construction.");
        }
    }

    private String makeScopedSearchFieldCond(TestSearchField field, String searchString)
    {
        StringBuilder keyPathOpenings = new StringBuilder();
        StringBuilder revClosings = new StringBuilder();

        for (String key: field.getKeyPath())
        {
            if ( key.equals("[]") )
            {
                keyPathOpenings.append('[');
                revClosings.append(']');
            }
            else
            {
                keyPathOpenings.append("{\"").append(key).append("\":");
                revClosings.append('}');
            }
        }

        String val = field.getFieldType() == TestSearchFieldType.STR ? "\"" + searchString + "\"" : searchString;

        return "test_data_json @> '" + keyPathOpenings + " " + val + revClosings.reverse().toString() + "'";
    }

    public TestTypeSearchScope getTestTypeSearchScope(LabTestTypeCode testTypeCode, String scopeName)
    {
        String sql =
            "select tt.code, tt.short_name, ttss.scope_name, ttss.scope_descr, ttss.search_fields " +
            "from test_type_search_scope ttss " +
            "join test_type tt on tt.id = ttss.test_type_id " +
            "where tt.code = ? and ttss.scope_name = ?";

        Object[] params = new Object[]{testTypeCode.toString(), scopeName};

        RowMapper<TestTypeSearchScope> rowMapper = getTestTypeSearchScopeRowMapper();

        return jdbc.queryForObject(sql, params, rowMapper);
    }

    public List<TestTypeSearchScope> getLabGroupTestTypeSearchScopes(long labGroupId)
    {
        String sql =
            "select tt.code, tt.short_name, ttss.scope_name, ttss.scope_descr, ttss.search_fields " +
            "from test_type_search_scope ttss " +
            "join test_type tt on tt.id = ttss.test_type_id " +
            "where ttss.test_type_id in (" +
              "select lgtt.test_type_id from lab_group_test_type lgtt where lgtt.lab_group_id = ?" +
            ")";

        Object[] params = new Object[]{labGroupId};

        RowMapper<TestTypeSearchScope> rowMapper = getTestTypeSearchScopeRowMapper();

        return jdbc.query(sql, params, rowMapper);
    }

    private Optional<SearchCondition> getTestTimestampCondition
        (
            String tsProp,
            Optional<Instant> fromTimestamp,
            Optional<Instant> toTimestamp
        )
    {
        StringBuilder whereCond = new StringBuilder();
        Map<String,Object> paramVals = new HashMap<>();

        fromTimestamp.ifPresent(fts -> {
            whereCond.append(tsProp + " >= :fts");
            paramVals.put("fts", new java.sql.Timestamp(fts.toEpochMilli()));
        });

        toTimestamp.ifPresent(tts -> {
            whereCond.append((whereCond.length() > 0 ? " and " : "") + tsProp + " <= :tts");
            paramVals.put("tts", new java.sql.Timestamp(tts.toEpochMilli()));
        });

        if ( whereCond.length() == 0 )
            return Optional.empty();
        else
            return Optional.of(new SearchCondition(whereCond.toString(), paramVals));
    }

    private RowMapper<TestTypeSearchScope> getTestTypeSearchScopeRowMapper()
    {
        return (rs, rowNum) -> {
            try
            {
                LabTestTypeCode testTypeCode = LabTestTypeCode.valueOf(rs.getString(1));
                String testTypeShortName = rs.getString(2);
                String scopeName = rs.getString(3);
                String scopeDescr = rs.getString(4);
                List<TestSearchField> ttss = Arrays.asList(
                jsonSerializer.readValue(rs.getString(5).getBytes(), TestSearchField[].class)
                );

                return new TestTypeSearchScope(testTypeCode, testTypeShortName, scopeName, scopeDescr, ttss);
            }
            catch (Exception e)
            {
                throw new RuntimeException(e);
            }
        };
    }

    private List<SampleOpTest> doTestsQuery(List<String> whereCriteria, MapSqlParameterSource params)
    {
        String sql =
            "select " + TESTV_SAMPLE_OP_TEST_MAPPED_COLS_STR + " " +
            "from test_v " +
            (!whereCriteria.isEmpty() ? "where " + join(" and ", whereCriteria) : "");

        RowMapper<SampleOpTest> rowMapper = new TestVSampleOpTestRowMapper(false);

        return new NamedParameterJdbcTemplate(jdbc).query(sql, params, rowMapper);
    }

}

class SearchCondition
{
    String whereClauseCondition;
    Map<String,Object> paramValues;

    SearchCondition(String whereClauseCondition, Map<String,Object> paramValues)
    {
        this.whereClauseCondition = whereClauseCondition;
        this.paramValues = paramValues;
    }

    SearchCondition(String whereClauseCondition, String paramName, Object paramValue)
    {
        this.whereClauseCondition = whereClauseCondition;
        paramValues = new HashMap<>();
        paramValues.put(paramName, paramValue);
    }
}
