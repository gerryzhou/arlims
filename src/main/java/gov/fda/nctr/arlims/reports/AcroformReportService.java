package gov.fda.nctr.arlims.reports;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.pdfbox.pdmodel.interactive.form.PDField;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;

import gov.fda.nctr.arlims.exceptions.BadRequestException;
import gov.fda.nctr.arlims.models.dto.LabTestMetadata;


@Service
class AcroformReportService
{
    private final ObjectReader jsonReader;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    private static final String APPENDICES_KEY = "_appendices";

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
            if ( sampleNumField != null) sampleNumField.setValue(sampleNum(testMetadata));

            PDField productNameField = acroForm.getField("testmd_productName");
            if ( productNameField != null) productNameField.setValue(testMetadata.getProductName());

            setTestDataFields(acroForm, testDataJsonNode, "");

            if ( testDataJsonNode.hasNonNull(APPENDICES_KEY) )
                appendAppendices(templateDoc, testDataJsonNode.get(APPENDICES_KEY));

            templateDoc.save(os);
        }

        return new Report(
            reportFile,
            "application/pdf",
        testMetadata.getTestTypeCode() + "_" + sampleNum(testMetadata) + ".pdf"
        );
    }

    private void appendAppendices(PDDocument doc, JsonNode appendicesJson) throws IOException
    {
        if ( !appendicesJson.isArray() )
            throw new BadRequestException("Expected appendices to be an array.");

        for ( JsonNode appendix: appendicesJson )
        {
            if ( !appendix.hasNonNull("title") || !appendix.hasNonNull("text") )
                throw new BadRequestException("Expected appendices to have title and text values.");

            String title = appendix.get("title").asText();

            List<String> appendixLines = getAppendixLines(appendix.get("text").asText());

            PDPage page = new PDPage();
            doc.addPage(page);
            PDRectangle mediaBox = page.getMediaBox();
            PDPageContentStream pageContentStream = new PDPageContentStream(doc, page);
            pageContentStream.beginText();
            PDType1Font contentFont = PDType1Font.COURIER;

            float margin = 30;
            float pageStartX = mediaBox.getLowerLeftX() + margin;
            float pageStartY = mediaBox.getUpperRightY() - margin;
            float titleFontSize = 12;

            float contentFontSize = 8;
            float contentLeading = 1.5f * contentFontSize;

            // appendix title
            pageContentStream.setFont(PDType1Font.HELVETICA_BOLD, titleFontSize);
            pageContentStream.newLineAtOffset(pageStartX, pageStartY);
            pageContentStream.showText(title + "  ");
            pageContentStream.setFont(PDType1Font.HELVETICA_BOLD, 6f);
            pageContentStream.newLineAtOffset(0, -2f * titleFontSize);
            pageContentStream.setFont(contentFont, contentFontSize);

            float remainingHeight = mediaBox.getHeight() - 2*margin - 2*titleFontSize;

            for ( String line: appendixLines )
            {
                if ( remainingHeight < contentLeading )
                {
                    pageContentStream.endText();
                    pageContentStream.close();
                    page = new PDPage();
                    doc.addPage(page);
                    pageContentStream = new PDPageContentStream(doc, page);
                    pageContentStream.beginText();
                    pageContentStream.newLineAtOffset(pageStartX, pageStartY);
                    pageContentStream.setFont(contentFont, contentFontSize);
                    remainingHeight = mediaBox.getHeight() - 2*margin;
                }

                pageContentStream.showText(line);
                pageContentStream.newLineAtOffset(0, -contentLeading);
                remainingHeight -= contentLeading;
            }

            pageContentStream.endText();
            pageContentStream.close();
        }
    }

    private List<String> getAppendixLines(String text) throws IOException
    {
        List<String> lines = new ArrayList<>();

        BufferedReader br = new BufferedReader(new StringReader(text));

        String line;

        while ( (line = br.readLine()) != null )
        {
            lines.add(line);
        }

        return lines;
    }

    private void setTestDataFields(PDAcroForm acroForm, JsonNode testDataJsonNode, String fieldName) throws IOException
    {
        if ( fieldName.startsWith("_")  )
            return;

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

    private String sampleNum(LabTestMetadata testMetadata)
    {
        return testMetadata.getSampleTrackingNumber() + "-" + testMetadata.getSampleTrackingSubNumber();
    }
}

