package gov.fda.nctr.arlims.controllers;

import java.util.concurrent.ExecutionException;

import org.springframework.web.bind.annotation.*;

import gov.fda.nctr.arlims.data_access.facts.FactsAccessService;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysisSubmission;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysisSubmissionResponse;


@RestController
@RequestMapping("/api/facts")
public class FactsController extends ControllerBase
{
    private FactsAccessService factsService;

    public FactsController
        (
            FactsAccessService factsService
        )
    {
        this.factsService = factsService;
    }

    @PostMapping("/sample-analysis/micro")
    public MicrobiologySampleAnalysisSubmissionResponse submitMicrobiologySampleAnalysis
        (
            @RequestBody MicrobiologySampleAnalysisSubmission subm
        )
        throws ExecutionException, InterruptedException
    {
        return factsService.submitMicrobiologySampleAnalysis(subm).get();
    }

    @PostMapping("/sample-op/{opId:\\d+}/status")
    public void updateSampleOpStatus
        (
            @PathVariable("opId") long opId,
            @RequestBody String statusCode
        )
        throws ExecutionException, InterruptedException
    {
        factsService.updateSampleOpStatus(opId, statusCode).get();
    }

}


