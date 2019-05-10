package gov.fda.nctr.arlims.data_access.test_data;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import gov.fda.nctr.arlims.models.dto.LabTestTypeCode;
import gov.fda.nctr.arlims.models.dto.SampleOpTest;
import gov.fda.nctr.arlims.models.dto.scoped_test_search.TestTypeSearchScope;


public interface TestSearchService
{
    List<SampleOpTest> findTestsByFullTextSearch
        (
            Optional<String> searchText,
            Optional<Instant> fromTimestamp,
            Optional<Instant> toTimestamp,
            Optional<String> timestampProperty,
            Optional<List<String>> labTestTypeCodes
        );

    /// Get search capabilities by test type for the given lab group.
    List<TestTypeSearchScope> getLabGroupTestTypeSearchScopes(long labGroupId);

    List<SampleOpTest> findTestsByTypeSpecificScopedSearch
        (
            LabTestTypeCode testTypeCode,
            String scopeName,
            String searchValue,
            Optional<Instant> fromTimestamp,
            Optional<Instant> toTimestamp,
            Optional<String>  timestampProperty
        );
}
