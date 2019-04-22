package gov.fda.nctr.arlims.models.dto;

import java.util.List;


public class LabGroupContents
{
    private final long labGroupId;
    private final String labGroupName;
    private final LabGroupContentsScope contentsScope;
    private final List<LabTestType> supportedTestTypes;
    private final List<UserReference> memberUsers;
    private final List<SampleOp> activeSampleOps;
    private final List<LabResource> managedResources;

    public LabGroupContents
        (
            long labGroupId,
            String labGroupName,
            LabGroupContentsScope contentsScope,
            List<LabTestType> testTypes,
            List<UserReference> memberUsers,
            List<SampleOp> activeSampleOps,
            List<LabResource> managedResources
        )
    {
        this.labGroupId = labGroupId;
        this.labGroupName = labGroupName;
        this.contentsScope = contentsScope;
        this.supportedTestTypes = testTypes;
        this.memberUsers = memberUsers;
        this.activeSampleOps = activeSampleOps;
        this.managedResources = managedResources;
    }

    public long getLabGroupId() { return labGroupId; }

    public String getLabGroupName() { return labGroupName; }

    public LabGroupContentsScope getContentsScope() { return contentsScope; }

    public List<LabTestType> getSupportedTestTypes() { return supportedTestTypes; }

    public List<UserReference> getMemberUsers() { return memberUsers; }

    public List<SampleOp> getActiveSamples() { return activeSampleOps; }

    public List<LabResource> getManagedResources() { return managedResources; }
}
