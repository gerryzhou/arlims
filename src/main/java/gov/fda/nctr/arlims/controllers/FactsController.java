package gov.fda.nctr.arlims.controllers;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import gov.fda.nctr.arlims.data_access.facts.FactsAccessService;
import gov.fda.nctr.arlims.models.dto.SampleOpTimeCharges;
import gov.fda.nctr.arlims.models.dto.SampleTransfer;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.CreatedSampleAnalysisMicrobiology;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysis;


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

    @GetMapping("/samples/{sampleTrackingNumber:\\d+}/transfers")
    public List<SampleTransfer> getSampleTransfers
        (
            @PathVariable("sampleTrackingNumber") long sampleTrackingNumber,
            @RequestParam(value = "to", required = false) Optional<Long> toPersonId
        )
        throws ExecutionException, InterruptedException
    {
        return factsService.getSampleTransfers(sampleTrackingNumber, toPersonId).get();
    }

    @PostMapping("/sample-analyses/micro")
    public List<CreatedSampleAnalysisMicrobiology> submitMicrobiologySampleAnalyses
        (
            @RequestBody List<MicrobiologySampleAnalysis> analyses,
            Authentication authentication
        )
        throws ExecutionException, InterruptedException
    {
        return factsService.submitMicrobiologySampleAnalyses(analyses).get();
    }

    @PostMapping("/sample-op/{opId:\\d+}/work-status/{personId:\\d+}")
    public void updateSampleOpStatus
        (
            @PathVariable("opId") long opId,
            @PathVariable("personId") long personId,
            @RequestBody String statusCode,
            Authentication authentication
        )
        throws ExecutionException, InterruptedException
    {
        factsService.updateWorkStatus(opId, personId, statusCode).get();
    }

    @PostMapping("/time-charges")
    public void submitSampleOpTimeCharges
        (
            @RequestBody SampleOpTimeCharges timeCharges,
            Authentication authentication
        )
        throws ExecutionException, InterruptedException
    {
        factsService.submitSampleOpTimeCharges(timeCharges).get();
    }
}


