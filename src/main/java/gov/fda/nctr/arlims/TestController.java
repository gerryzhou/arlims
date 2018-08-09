package gov.fda.nctr.arlims;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import gov.fda.nctr.arlims.data_access.TestDataService;
import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;
import gov.fda.nctr.arlims.models.dto.*;
import gov.fda.nctr.arlims.reports.Report;
import gov.fda.nctr.arlims.reports.TestDataReportService;


@RestController
@RequestMapping("/api/tests")
public class TestController
{
    private final TestDataService testDataService;
    private final TestDataReportService reportService;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public TestController
        (
            TestDataService testDataService,
            TestDataReportService reportService
        )
    {
        this.testDataService = testDataService;
        this.reportService = reportService;
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

    @GetMapping("{testId:\\d+}/data")
    public VersionedTestData getTestDataJson
        (
            @PathVariable long testId,
            @RequestHeader HttpHeaders httpHeaders
        )
    {
        long empId = 1; // TODO: Obtain employee id from headers and/or session, verify employee can access this test data.

        return testDataService.getVersionedTestData(testId);
    }

    @PostMapping("{testId:\\d+}/data")
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

    @GetMapping("{testId:\\d+}/attached-file-metadatas")
    public List<TestAttachedFileMetadata> getTestAttachedFileMetadatas
        (
            @PathVariable long testId,
            @RequestHeader HttpHeaders httpHeaders
        )
    {
        long empId = 1; // TODO: Obtain employee id from headers and/or session, verify employee can access this test data.

        return testDataService.getTestAttachedFileMetadatas(testId);
    }

    @PostMapping("{testId:\\d+}/attached-files/new")
    public CreatedTestAttachedFile createTestAttachedFile
        (
            @PathVariable long testId,
            @RequestPart("role") Optional<String> role,
            @RequestPart("name") String name,
            @RequestPart("file") MultipartFile file,
            @RequestHeader HttpHeaders httpHeaders
        )
    {
        long empId = 1; // TODO: Obtain employee id from headers and/or session, verify employee can access this test data.

        long attachedFileId = testDataService.createTestAttachedFile(testId, role, name, file);

        return new CreatedTestAttachedFile(attachedFileId, testId);
    }

    @PostMapping("{testId:\\d+}/attached-files/{attachedFileId:\\d+}")
    public void updateTestAttachedFile
        (
            @PathVariable long attachedFileId,
            @PathVariable long testId,
            @RequestPart("role") Optional<String> role,
            @RequestPart("name") String name,
            @RequestPart("file") MultipartFile file,
            @RequestHeader HttpHeaders httpHeaders
        )
    {
        long empId = 1; // TODO: Obtain employee id from headers and/or session, verify employee can access this test data.

        testDataService.updateTestAttachedFile(attachedFileId, testId, role, name, file);
    }

    @DeleteMapping("{testId:\\d+}/attached-files/{attachedFileId:\\d+}")
    public void deleteTestAttachedFile
        (
            @PathVariable long attachedFileId,
            @PathVariable long testId,
            @RequestHeader HttpHeaders httpHeaders
        )
    {
        long empId = 1; // TODO: Obtain employee id from headers and/or session, verify employee can access this test data.

        testDataService.deleteTestAttachedFile(attachedFileId, testId);
    }

    @GetMapping("{testId}/report/{reportName}")
    public ResponseEntity<InputStreamResource>  getTestDataReport
        (
            @PathVariable long testId,
            @PathVariable String reportName,
            @RequestHeader HttpHeaders httpHeaders
        )
        throws IOException
    {
        long empId = 1; // TODO: Obtain employee id from headers and/or session, verify employee can access this test data.

        VersionedTestData testData = testDataService.getVersionedTestData(testId);

        String testDataJson = testData.getTestDataJson().orElseThrow(() ->
            new ResourceNotFoundException("no test data exists for test " + testId)
        );

        LabTestMetadata testMetadata = testDataService.getTestMetadata(testId);

        Report report = reportService.makeReport(reportName, testDataJson, testMetadata);

        return
            ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment;filename=" + report.getSuggestedFileName())
            .contentLength(report.getReportFile().toFile().length())
            .body(new InputStreamResource(Files.newInputStream(report.getReportFile())));
    }

}

