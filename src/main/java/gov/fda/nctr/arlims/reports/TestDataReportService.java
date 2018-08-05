package gov.fda.nctr.arlims.reports;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.pdfbox.pdmodel.interactive.form.PDField;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;

import gov.fda.nctr.arlims.models.dto.LabTestMetadata;


@Service
public class TestDataReportService
{
    private final ObjectReader jsonReader;

    public TestDataReportService()
    {
        ObjectMapper jsonSerializer = Jackson2ObjectMapperBuilder.json().build();
        this.jsonReader = jsonSerializer.reader();
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
            return generateAcroformPdfReport(reportName, testDataJson, testMetadata);
        }
        else
            throw new RuntimeException("Report type not recognized from report name '" + reportName + "'.");
    }

    private Report generateAcroformPdfReport
        (
            String templateName,
            String testDataJson,
            LabTestMetadata testMetadata
        )
        throws IOException
    {
        Path reportFile = Files.createTempFile("arlims-report-" + testMetadata.getTestId(), ".someext");

        JsonNode testDataJsonNode = this.jsonReader.readTree(testDataJson);

        try ( InputStream template = getClass().getResourceAsStream("/report-templates/" + templateName);
              OutputStream os = Files.newOutputStream(reportFile) )
        {
            PDDocument templateDoc = PDDocument.load(template);

            PDDocumentCatalog docCatalog = templateDoc.getDocumentCatalog();
            PDAcroForm acroForm = docCatalog.getAcroForm();

            acroForm.getField("testmd.sampleNum").setValue(testMetadata.getSampleNum());
            acroForm.getField("testmd.productName").setValue(testMetadata.getProductName().orElse(""));

            // TODO: Set acroform field values from test data.

            templateDoc.save(os);
        }

        return new Report(
            reportFile,
            "application/pdf",
            testMetadata.getTestTypeCode() +"-" + testMetadata.getSampleNum() + ".pdf"
        );
    }

}
