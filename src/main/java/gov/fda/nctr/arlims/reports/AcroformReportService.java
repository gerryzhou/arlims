package gov.fda.nctr.arlims.reports;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Iterator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.pdfbox.pdmodel.interactive.form.PDField;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;

import gov.fda.nctr.arlims.models.dto.LabTestMetadata;


@Service
class AcroformReportService
{
    private final ObjectReader jsonReader;

    private final Logger log = LoggerFactory.getLogger(this.getClass());


    public AcroformReportService(ReportsConfig config)
    {
        ObjectMapper jsonSerializer = Jackson2ObjectMapperBuilder.json().build();
        this.jsonReader = jsonSerializer.reader();

        if ( config.getPdfboxCacheDir() != null )
        {
            System.setProperty("pdfbox.fontcache", config.getPdfboxCacheDir());
            log.info("Set pdfbox cache directory to " + config.getPdfboxCacheDir() + ".");
        }
    }

    Report generateReport
        (
            String templateName,
            String testDataJson,
            LabTestMetadata testMetadata
        )
        throws IOException
    {
        Path reportFile = Files.createTempFile("alis-report-" + testMetadata.getTestId(), ".pdf");

        JsonNode testDataJsonNode = this.jsonReader.readTree(testDataJson);

        try ( InputStream template = getClass().getResourceAsStream("/reports/" + templateName);
              OutputStream os = Files.newOutputStream(reportFile);
              PDDocument templateDoc = PDDocument.load(template) )
        {

            PDDocumentCatalog docCatalog = templateDoc.getDocumentCatalog();
            PDAcroForm acroForm = docCatalog.getAcroForm();

            PDField sampleNumField = acroForm.getField("testmd_sampleNum");
            if ( sampleNumField != null) sampleNumField.setValue(testMetadata.getSampleNum());

            PDField productNameField = acroForm.getField("testmd_productName");
            if ( productNameField != null) productNameField.setValue(testMetadata.getProductName().orElse(""));

            setTestDataFields(acroForm, testDataJsonNode, "");

            templateDoc.save(os);
        }

        return new Report(
            reportFile,
            "application/pdf",
            testMetadata.getTestTypeCode() +"-" + testMetadata.getSampleNum() + ".pdf"
        );
    }

    private void setTestDataFields(PDAcroForm acroForm, JsonNode testDataJsonNode, String fieldName) throws IOException
    {
        switch(testDataJsonNode.getNodeType())
        {
            case STRING:
            {
                PDField acroField = acroForm.getField(fieldName);
                if ( acroField != null ) acroField.setValue(testDataJsonNode.textValue());
                break;
            }
            case NUMBER:
            case ARRAY:
            {
                PDField acroField = acroForm.getField(fieldName);
                if ( acroField != null ) acroField.setValue(testDataJsonNode.toString());
                break;
            }
            case BOOLEAN:
            {
                PDField acroField = acroForm.getField(fieldName);
                if ( acroField != null )
                {
                    if ( "Tx".equals(acroField.getFieldType()) )
                        acroField.setValue(testDataJsonNode.booleanValue() ? "Y" : "N");
                    else
                        acroField.setValue(testDataJsonNode.booleanValue() ? "Yes" : "Off");
                }
                break;
            }
            case OBJECT:
            {
                Iterator<String> jsonFieldsIter = testDataJsonNode.fieldNames();
                while ( jsonFieldsIter.hasNext() )
                {
                    String jsonFieldName = jsonFieldsIter.next();
                    JsonNode jsonFieldValue = testDataJsonNode.get(jsonFieldName);
                    setTestDataFields(acroForm, jsonFieldValue, appendFieldNameComponent(fieldName, jsonFieldName));
                }
                break;
            }
            case NULL:
            case MISSING:
                // Nothing to do.
                break;
            default: // BINARY, POJO
                throw new RuntimeException("unsupported type in test data for field " + fieldName);
        }
    }

    private String appendFieldNameComponent(String fieldName, String component)
    {
        if ( fieldName.isEmpty() ) return component;
        else return fieldName + "_" + component;
    }

}

