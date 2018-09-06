package gov.fda.nctr.arlims.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MultipartFile;

import gov.fda.nctr.arlims.data_access.test_data.TestAttachedFileContents;
import gov.fda.nctr.arlims.data_access.test_data.TestDataService;
import gov.fda.nctr.arlims.exceptions.BadRequestException;
import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;
import gov.fda.nctr.arlims.models.dto.*;
import gov.fda.nctr.arlims.reports.Report;
import gov.fda.nctr.arlims.reports.TestDataReportService;
import gov.fda.nctr.arlims.security.AppUserAuthentication;


@RestController
@RequestMapping("/api/tests")
public class TestController extends ControllerBase
{
    private final TestDataService testDataService;
    private final TestDataReportService reportService;

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
            @RequestParam("testBeginDate") String testBeginDate,
            Authentication authentication
        )
    {
        AppUser currentUser = ((AppUserAuthentication)authentication).getAppUser();

        long createdTestId = testDataService.createTest(sampleId, testTypeCode, testBeginDate, currentUser);

        return new CreatedTestMetadata(sampleId, createdTestId);
    }

    @DeleteMapping("{testId:\\d+}")
    public void deleteTest
        (
            @PathVariable("testId") long testId,
            Authentication authentication
        )
    {
        AppUser currentUser = ((AppUserAuthentication)authentication).getAppUser();

        testDataService.deleteTest(testId, currentUser);
    }

    @GetMapping("{testId:\\d+}/data")
    public VersionedTestData getTestDataJson
        (
            @PathVariable long testId
        )
    {
        return testDataService.getVersionedTestData(testId);
    }

    @PostMapping("{testId:\\d+}/data")
    public OptimisticDataUpdateResult saveTestDataJson
        (
            @PathVariable("testId") long testId,
            @RequestPart("testDataJson") String testDataJson,
            @RequestPart("stageStatusesJson") String stageStatusesJson,
            @RequestPart("previousMd5") String previousMd5,
            Authentication authentication
        )
    {
        AppUser user = ((AppUserAuthentication)authentication).getAppUser();

        boolean saved = testDataService.saveTestData(testId, testDataJson, stageStatusesJson, previousMd5, user);

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

    @GetMapping("{testId:\\d+}/attached-files/metadatas")
    public List<TestAttachedFileMetadata> getTestAttachedFileMetadatas
        (
            @PathVariable long testId
        )
    {
        return testDataService.getTestAttachedFileMetadatas(testId);
    }

    @PostMapping("{testId:\\d+}/attached-files/{attachedFileId:\\d+}/metadata")
    public void updateTestAttachedFileMetadata
        (
            @PathVariable long attachedFileId,
            @PathVariable long testId,
            @RequestPart("role") Optional<String> role,
            @RequestPart("name") String name,
            Authentication authentication
        )
    {
        AppUser currentUser = ((AppUserAuthentication)authentication).getAppUser();

        testDataService.updateTestAttachedFileMetadata(testId, attachedFileId, role, name, currentUser);
    }


    @PostMapping("{testId:\\d+}/attached-files/new")
    public CreatedTestAttachedFiles createTestAttachedFiles
        (
            @PathVariable long testId,
            @RequestPart("files") MultipartFile[] files,
            @RequestPart("role") Optional<String> role,
            Authentication authentication
        )
    {
        AppUser currentUser = ((AppUserAuthentication)authentication).getAppUser();

        List<Long> attachedFileIds = testDataService.attachFilesToTest(testId, Arrays.asList(files), role, currentUser);

        return new CreatedTestAttachedFiles(testId, attachedFileIds);
    }

    @GetMapping("{testId:\\d+}/attached-files/{attachedFileId:\\d+}")
    public ResponseEntity<InputStreamResource>  getTestAttachedFileContents
        (
            @PathVariable long attachedFileId,
            @PathVariable long testId
        )
    {
        TestAttachedFileContents tafc = testDataService.getTestAttachedFileContents(attachedFileId, testId);

        return
            ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
            "attachment;filename=" + tafc.getFileName())
            .contentLength(tafc.getContentsLength())
            .body(new InputStreamResource(tafc.getContentsStream()));
    }

    @DeleteMapping("{testId:\\d+}/attached-files/{attachedFileId:\\d+}")
    public void deleteTestAttachedFile
        (
            @PathVariable long attachedFileId,
            @PathVariable long testId,
            Authentication authentication
        )
    {
        AppUser currentUser = ((AppUserAuthentication)authentication).getAppUser();

        testDataService.deleteTestAttachedFile(testId, attachedFileId, currentUser);
    }

    @GetMapping("{testId}/report/{reportName}")
    public ResponseEntity<InputStreamResource> getTestDataReport
        (
            @PathVariable long testId,
            @PathVariable String reportName
        )
        throws IOException
    {
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


    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public String handleBadRequestException
    (
        BadRequestException e,
        WebRequest request,
        HttpServletResponse response
    )
    {
        return e.getMessage();
    }
}

