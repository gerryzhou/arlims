package gov.fda.nctr.arlims.models.dto;

import java.util.List;


public class CreatedTestAttachedFiles
{
    private long testId;
    private List<Long> attachedFileIds;

    public CreatedTestAttachedFiles(long testId, List<Long> attachedFileIds)
    {
        this.testId = testId;
        this.attachedFileIds = attachedFileIds;
    }

    public long getTestId() { return testId; }

    public List<Long> getAttachedFileIds() { return attachedFileIds; }
}
