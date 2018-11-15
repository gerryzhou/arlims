package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.util.Optional;


public class TestAttachedFileMetadata
{
    private final long attachedFileId;
    private final long testId;
    private final Optional<String> role;
    private final Optional<String> testDataPart;
    private final String fileName;
    private final long size;
    private final Instant uploadedInstant;

    public TestAttachedFileMetadata
        (
            long testId,
            long attachedFileId,
            Optional<String> role,
            Optional<String> testDataPart,
            String fileName,
            long size,
            Instant uploadedInstant
        )
    {
        this.attachedFileId = attachedFileId;
        this.testId = testId;
        this.role = role;
        this.testDataPart = testDataPart;
        this.fileName = fileName;
        this.size = size;
        this.uploadedInstant = uploadedInstant;
    }

    public long getAttachedFileId() { return attachedFileId; }

    public long getTestId() { return testId; }

    public Optional<String> getRole() { return role; }

    public Optional<String> getTestDataPart() { return testDataPart; }

    public String getFileName() { return fileName; }

    public long getSize() { return size; }

    public Instant getUploadedInstant() { return uploadedInstant; }
}
