package gov.fda.nctr.arlims;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import gov.fda.nctr.arlims.data_access.TestDataService;
import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;
import gov.fda.nctr.arlims.models.dto.DataModificationInfo;
import gov.fda.nctr.arlims.models.dto.OptimisticDataUpdateResult;
import gov.fda.nctr.arlims.models.dto.VersionedTestData;


@RestController
@RequestMapping("/api/test")
public class TestController
{
    private final TestDataService testDataService;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public TestController(TestDataService testDataService)
    {
        this.testDataService = testDataService;
    }

    @GetMapping("{testId}/data")
    public VersionedTestData getTestDataJson
        (
            @PathVariable long testId,
            @RequestHeader HttpHeaders httpHeaders
        )
    {
        String fdaEmailAccountName = "stephen.harris"; // TODO: Verify user can access to this test.

        return testDataService.getVersionedTestData(testId);
    }

    @PostMapping("{testId}/data")
    public OptimisticDataUpdateResult saveTestDataJson
        (
            @PathVariable("testId") long testId,
            @RequestPart("testDataJson") String testDataJson,
            @RequestPart("stageStatusesJson") String stageStatusesJson,
            @RequestPart("previousMd5") String previousMd5,
            @RequestHeader HttpHeaders httpHeaders
        )
    {
        String fdaEmailAccountName = "stephen.harris"; // TODO: Verify user can access this test.

        boolean saved = testDataService.saveTestDataJson(testId, testDataJson, stageStatusesJson, previousMd5);

        if ( saved )
            return new OptimisticDataUpdateResult(true, Optional.empty());
        else
        {
            Optional<DataModificationInfo> maybeMod = testDataService.getTestDataModificationInfo(testId);

            if ( !maybeMod.isPresent() )
                throw new ResourceNotFoundException("test not found");

            return new OptimisticDataUpdateResult(false, maybeMod);
        }
    }

}

