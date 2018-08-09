package gov.fda.nctr.arlims.models.dto;


public class CreatedTestAttachedFile
{
    private long attachedFileId;
    private long testId;

    public CreatedTestAttachedFile(long attachedFileId, long testId)
    {
        this.attachedFileId = attachedFileId;
        this.testId = testId;
    }

    public long getAttachedFileId() { return attachedFileId; }

    public long getTestId() { return testId; }
}
