package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.util.Optional;


public class TestAttachedFileMetadata
{
    private final long attachedFileId;
    private final long testId;
    private final Optional<String> label;
    private final int ordering;
    private final Optional<String> testDataPart;
    private final String fileName;
    private final long size;
    private final Instant uploadedInstant;

    public TestAttachedFileMetadata
        (
            long testId,
            long attachedFileId,
            Optional<String> label,
            int ordering,
            Optional<String> testDataPart,
            String fileName,
            long size,
            Instant uploadedInstant
        )
    {
        this.attachedFileId = attachedFileId;
        this.testId = testId;
        this.label = label;
        this.ordering = ordering;
        this.testDataPart = testDataPart;
        this.fileName = fileName;
        this.size = size;
        this.uploadedInstant = uploadedInstant;
    }

    public long getAttachedFileId() { return attachedFileId; }

    public long getTestId() { return testId; }

    public Optional<String> getLabel() { return label; }

    public int getOrdering() { return ordering; }

    public Optional<String> getTestDataPart() { return testDataPart; }

    public String getFileName() { return fileName; }

    public long getSize() { return size; }

    public Instant getUploadedInstant() { return uploadedInstant; }
}
