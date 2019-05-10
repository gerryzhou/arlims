package gov.fda.nctr.arlims.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static java.util.stream.Collectors.toList;
import javax.annotation.security.RolesAllowed;
import javax.servlet.http.HttpServletResponse;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;
import gov.fda.nctr.arlims.models.dto.*;
import gov.fda.nctr.arlims.data_access.test_data.AttachedFileBasicMetadata;
import gov.fda.nctr.arlims.data_access.test_data.TestDataService;
import gov.fda.nctr.arlims.reports.TestDataReportService;
import gov.fda.nctr.arlims.security.AppUserAuthentication;
import gov.fda.nctr.arlims.reports.Report;


@RestController
@RequestMapping("/api/tests")
public class TestController extends ControllerBase
{
    private final TestDataService testDataService;
    private final TestDataReportService reportService;

    private final ObjectMapper jsonSerializer;

    public TestController
        (
            TestDataService testDataService,
            TestDataReportService reportService
        )
    {
        this.testDataService = testDataService;
        this.reportService = reportService;

        this.jsonSerializer = Jackson2ObjectMapperBuilder.json().build();
    }

    @PostMapping("new")
    public CreatedTestMetadata createTest
        (
            @RequestParam("op") long opId,
            @RequestParam("tc") LabTestTypeCode testTypeCode,
            @RequestParam("bd") String testBeginDate,
            @RequestParam("stn") long sampleTrackingNumber,
            @RequestParam("stsn") long sampleTrackingSubNumber,
            @RequestParam("pac") String pac,
            @RequestParam("pn") String productName,
            @RequestParam("lid") Optional<String> lid,
            @RequestParam("paf") Optional<String> paf,
            @RequestParam("s") Optional<String> subject,
            Authentication authentication
        )
    {
        AppUser currentUser = ((AppUserAuthentication)authentication).getAppUser();

        long createdTestId =
            testDataService.createTest(
                opId,
                testTypeCode,
                testBeginDate,
                sampleTrackingNumber,
                sampleTrackingSubNumber,
                pac,
                productName,
                lid,
                paf,
                subject,
                currentUser
            );

        return new CreatedTestMetadata(opId, createdTestId);
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

        Optional<String> savedMd5 =
            testDataService.saveTestData(
                testId,
                testDataJson,
                stageStatusesJson,
                previousMd5,
                user
            );

        if ( savedMd5.isPresent() )
            return new OptimisticDataUpdateResult(savedMd5, Optional.empty());
        else
        {
            Optional<DataModificationInfo> maybeMod = testDataService.getTestDataModificationInfo(testId);

            if ( !maybeMod.isPresent() )
                throw new ResourceNotFoundException("test not found");

            return new OptimisticDataUpdateResult(Optional.empty(), maybeMod);
        }
    }

    @PostMapping("restore-save-datas")
    @RolesAllowed("ROLE_ADMIN")
    public void restoreTestSaveDatas
        (
            @RequestPart("saveDataFiles") MultipartFile[] saveDataFiles,
            Authentication authentication
        )
    {
        AppUser user = ((AppUserAuthentication)authentication).getAppUser();

        List<TestSaveData> saveDatas =
            Arrays.stream(saveDataFiles)
            .map(saveDataFile -> {
                try { return jsonSerializer.readValue(saveDataFile.getBytes(), TestSaveData.class); }
                catch(Exception e) { throw new RuntimeException(e); }
            })
            .collect(toList());

        testDataService.restoreTestDatas(saveDatas, user);
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
            @RequestParam("label") Optional<String> label,
            @RequestParam("ordering") Optional<Integer> ordering,
            @RequestParam("testDataPart") Optional<String> testDataPart,
            @RequestParam("name") String name,
            Authentication authentication
        )
    {
        AppUser currentUser = ((AppUserAuthentication)authentication).getAppUser();

        int ord = ordering.orElse(0);

        testDataService.updateTestAttachedFileMetadata(testId, attachedFileId, label, ord, testDataPart, name, currentUser);
    }

    @PostMapping("{testId:\\d+}/attached-files/new")
    public CreatedTestAttachedFiles createTestAttachedFiles
        (
            @PathVariable long testId,
            @RequestPart("files") MultipartFile[] files,
            @RequestPart("label") Optional<String> label,
            @RequestPart("ordering") Optional<String> orderingStr,
            @RequestPart("testDataPart") Optional<String> testDataPart,
            Authentication authentication
        )
    {
        AppUser currentUser = ((AppUserAuthentication)authentication).getAppUser();

        int ord = orderingStr.map(Integer::parseInt).orElse(0);

        List<Long> attachedFileIds =
            testDataService.attachFilesToTest(testId, Arrays.asList(files), label, ord, testDataPart, currentUser);

        return new CreatedTestAttachedFiles(testId, attachedFileIds);
    }

    @GetMapping("{testId:\\d+}/attached-files/{attachedFileId:\\d+}")
    public void getTestAttachedFileContents
        (
            @PathVariable long attachedFileId,
            @PathVariable long testId,
            HttpServletResponse response
        )
    {
        AttachedFileBasicMetadata fmd = testDataService.getTestAttachedFileBasicMetadata(attachedFileId, testId);

        response.setStatus(200);
        response.addHeader(HttpHeaders.CONTENT_DISPOSITION, fmd.getFileName());
        response.setContentLengthLong(fmd.getContentsLength());

        try
        {
            testDataService.writeTestAttachedFileContentsToStream(attachedFileId, testId, response.getOutputStream());
        }
        catch (IOException e)
        {
            throw new RuntimeException(e.getMessage(), e);
        }
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

    @GetMapping("{testId:\\d+}/sample-op-test-md")
    public SampleOpTest getSampleOpTest(@PathVariable long testId)
    {
        return testDataService.getSampleOpTestMetadata(testId);
    }

    @GetMapping("{testId:\\d+}/report/{reportName}")
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

        return getTestDataReportForProvidedTestData(testId, reportName, testDataJson);
    }

    @PostMapping("{testId:\\d+}/report/{reportName}")
    public ResponseEntity<InputStreamResource> getTestDataReportForProvidedTestData
        (
            @PathVariable long testId,
            @PathVariable String reportName,
            @RequestBody String testDataJson
        )
        throws IOException
    {
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

