package gov.fda.nctr.arlims.reports;

import javax.validation.constraints.NotEmpty;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;


@Component
@Validated
@ConfigurationProperties("reports")
public class ReportsConfig
{
    @NotEmpty
    private String pdfboxCacheDir;

    public String getPdfboxCacheDir() { return pdfboxCacheDir; }
    public void setPdfboxCacheDir(String pdfboxCacheDir) { this.pdfboxCacheDir = pdfboxCacheDir; }
}
