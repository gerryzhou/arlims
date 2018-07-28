package gov.fda.nctr.arlims;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import gov.fda.nctr.arlims.data_access.TestDataService;
import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;
import gov.fda.nctr.arlims.models.dto.*;


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

    @PostMapping("new")
    public CreatedTestMetadata createTest
        (
            @RequestParam("sampleId") long sampleId,
            @RequestParam("testTypeCode") LabTestTypeCode testTypeCode,
            @RequestParam("testBeginDate") String testBeginDate
        )
    {
        long empId = 1; // TODO: Obtain employee id from headers and/or session, verify employee can create tests.

        long createdTestId = testDataService.createTest(empId, sampleId, testTypeCode, testBeginDate);

        return new CreatedTestMetadata(sampleId, createdTestId);
    }

    @GetMapping("data/{testId}")
    public VersionedTestData getTestDataJson
        (
            @PathVariable long testId,
            @RequestHeader HttpHeaders httpHeaders
        )
    {
        long empId = 1; // TODO: Obtain employee id from headers and/or session, verify employee can access this test data.

        return testDataService.getVersionedTestData(testId);
    }

    @PostMapping("data/{testId}")
    public OptimisticDataUpdateResult saveTestDataJson
        (
            @PathVariable("testId") long testId,
            @RequestPart("testDataJson") String testDataJson,
            @RequestPart("stageStatusesJson") String stageStatusesJson,
            @RequestPart("previousMd5") String previousMd5,
            @RequestHeader HttpHeaders httpHeaders
        )
    {
        long empId = 1; // TODO: Obtain employee id from headers and/or session, verify employee is allowed to save test data.

        boolean saved = testDataService.saveTestDataJson(testId, testDataJson, stageStatusesJson, empId, previousMd5);

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

