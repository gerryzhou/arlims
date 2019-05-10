package gov.fda.nctr.arlims.controllers;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;

import gov.fda.nctr.arlims.data_access.test_data.TestSearchService;
import gov.fda.nctr.arlims.exceptions.BadRequestException;
import gov.fda.nctr.arlims.models.dto.AppUser;
import gov.fda.nctr.arlims.models.dto.LabTestTypeCode;
import gov.fda.nctr.arlims.models.dto.SampleOpTest;
import gov.fda.nctr.arlims.security.AppUserAuthentication;
import gov.fda.nctr.arlims.models.dto.scoped_test_search.TestTypeSearchScope;


@RestController
@RequestMapping("/api/test-search")
public class TestSearchController
{
    private final TestSearchService testSearchService;
    private final ObjectMapper jsonSerializer;


    public TestSearchController(TestSearchService testSearchService)
    {
        this.testSearchService = testSearchService;
        this.jsonSerializer = Jackson2ObjectMapperBuilder.json().build();
    }

    @GetMapping("test-type-search-scopes")
    public List<TestTypeSearchScope> getTestTypeSearchScopes
        (
            Authentication authentication
        )
    {
        AppUser currentUser = ((AppUserAuthentication)authentication).getAppUser();

        return testSearchService.getLabGroupTestTypeSearchScopes(currentUser.getLabGroupId());
    }


    @GetMapping("full-text")
    public List<SampleOpTest> fullTextSearch
        (
            @RequestParam(value="tq",  required=false) Optional<String> searchText,
            @RequestParam(value="fts", required=false) Optional<Instant> fromTimestamp,
            @RequestParam(value="tts", required=false) Optional<Instant> toTimestamp,
            @RequestParam(value="tsp", required=false) Optional<String>  timestampProperty,
            @RequestParam(value="ltt", required=false) Optional<String>  labTestTypeCodesJson
        )
    {
        Optional<List<String>> labTestTypeCodes = labTestTypeCodesJson.map(this::parseJsonStringArray);

        timestampProperty.ifPresent(tsProp -> {
            if ( !tsProp.equals("created")  &&
            !tsProp.equals("last_saved") &&
            !tsProp.equals("begin_date") &&
            !tsProp.equals("reviewed") &&
            !tsProp.equals("saved_to_facts") )
                throw new IllegalArgumentException("Invalid timestamp property in tests search.");
        });

        return
            testSearchService.findTestsByFullTextSearch(
                searchText,
                fromTimestamp,
                toTimestamp,
                timestampProperty,
                labTestTypeCodes
            );
    }

    @GetMapping("scoped/{testTypeCode}/{scopeName}")
    public List<SampleOpTest> typeSpecificScopedSearch
        (
            @PathVariable("testTypeCode") String testTypeCode,
            @PathVariable("scopeName") String scopeName,
            @RequestParam(value="sv") String searchValue,
            @RequestParam(value="fts", required=false) Optional<Instant> fromTimestamp,
            @RequestParam(value="tts", required=false) Optional<Instant> toTimestamp,
            @RequestParam(value="tsp", required=false) Optional<String>  timestampProperty
        )
    {
        timestampProperty.ifPresent(tsProp -> {
            if ( !tsProp.equals("created")  &&
                 !tsProp.equals("last_saved") &&
                 !tsProp.equals("begin_date") &&
                 !tsProp.equals("reviewed") &&
                 !tsProp.equals("saved_to_facts") )
                throw new IllegalArgumentException("Invalid timestamp property in tests search.");
        });

        return
            testSearchService.findTestsByTypeSpecificScopedSearch(
                LabTestTypeCode.valueOf(testTypeCode),
                scopeName,
                searchValue,
                fromTimestamp,
                toTimestamp,
                timestampProperty
            );
    }


    private List<String> parseJsonStringArray(String codesJson)
    {
        try
        {
            CollectionType collType = jsonSerializer.getTypeFactory().constructCollectionType(List.class, String.class);

            return jsonSerializer.readValue(codesJson, collType);
        }
        catch(IOException ioe)
        {
            throw new BadRequestException("invalid json string array");
        }
    }

}
