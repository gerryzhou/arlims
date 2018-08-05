package gov.fda.nctr.arlims.reports;

import java.nio.file.Path;


public class Report
{
    private final Path reportFile;
    private final String mimeType;
    private final String suggestedFileName;

    public Report(Path reportFile, String mimeType, String suggestedFileName)
    {
        this.reportFile = reportFile;
        this.mimeType = mimeType;
        this.suggestedFileName = suggestedFileName;
    }

    public Path getReportFile() { return reportFile; }

    public String getMimeType() { return mimeType; }

    public String getSuggestedFileName() { return suggestedFileName; }
}
