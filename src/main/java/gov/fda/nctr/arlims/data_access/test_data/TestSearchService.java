package gov.fda.nctr.arlims.data_access.test_data;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import gov.fda.nctr.arlims.models.dto.SampleOpTest;


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
}
