package gov.fda.nctr.arlims.reports;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.models.dto.LabTestMetadata;


@Service
public class TestDataReportService
{
    private final AcroformReportService acroformReportService;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public TestDataReportService(AcroformReportService acroformReportService)
    {
        this.acroformReportService = acroformReportService;
    }

    public Report makeReport
        (
            String reportName,
            String testDataJson,
            LabTestMetadata testMetadata
        )
        throws IOException
    {
        if ( reportName.endsWith(".pdf") )
        {
            return acroformReportService.generateReport(reportName, testDataJson, testMetadata);
        }
        else
            throw new RuntimeException("Report type not recognized from report name '" + reportName + "'.");
    }

}
