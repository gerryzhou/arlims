package gov.fda.nctr.arlims.data_access.auditing;

import java.util.Optional;

public class AttachedFileDescription
{
    private final long testAttachedFileId;
    private final String fileName;
    private final long size;
    private final Optional<String> label;
    private final int ordering;
    private final Optional<String> testDataPart;

    public AttachedFileDescription
        (
            long testAttachedFileId,
            String fileName,
            long size,
            Optional<String> label,
            int ordering,
            Optional<String> testDataPart
        )
    {
        this.testAttachedFileId = testAttachedFileId;
        this.fileName = fileName;
        this.size = size;
        this.label = label;
        this.ordering = ordering;
        this.testDataPart = testDataPart;
    }

    public long getTestAttachedFileId() { return testAttachedFileId; }

    public String getFileName() { return fileName; }

    public long getSize() { return size; }

    public Optional<String> getLabel() { return label; }

    public int getOrdering() { return ordering; }

    public Optional<String> getTestDataPart() { return testDataPart; }
}
