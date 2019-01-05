package gov.fda.nctr.arlims.controllers;

import java.util.concurrent.ExecutionException;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gov.fda.nctr.arlims.data_access.facts.FactsAccessService;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysisSubmission;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysisSubmissionResponse;


@RestController
@RequestMapping("/api/facts")
public class FactsController extends ControllerBase
{
    private FactsAccessService factsSvc;

    public FactsController
        (
            FactsAccessService factsSvc
        )
    {
        this.factsSvc = factsSvc;
    }


    @PostMapping("/sample-analysis/micro")
    public MicrobiologySampleAnalysisSubmissionResponse submitMicrobiologySampleAnalysis
        (
            @RequestBody MicrobiologySampleAnalysisSubmission subm
        )
        throws ExecutionException, InterruptedException
    {
        return factsSvc.submitMicrobiologySampleAnalysis(subm).get();
    }
}


