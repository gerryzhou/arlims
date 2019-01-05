package gov.fda.nctr.arlims.models.dto;

import java.util.List;


public class LabGroupContents
{
    private final long labGroupId;
    private final String name;
    private final List<LabTestType> supportedTestTypes;
    private final List<UserReference> memberUsers;
    private final List<SampleOp> userActiveSampleOps;
    private final List<LabResource> managedResources;

    public LabGroupContents
        (
            long labGroupId,
            String name,
            List<LabTestType> testTypes,
            List<UserReference> memberUsers,
            List<SampleOp> userActiveSampleOps,
            List<LabResource> managedResources
        )
    {
        this.labGroupId = labGroupId;
        this.name = name;
        this.supportedTestTypes = testTypes;
        this.memberUsers = memberUsers;
        this.userActiveSampleOps = userActiveSampleOps;
        this.managedResources = managedResources;
    }

    public long getLabGroupId() { return labGroupId; }

    public String getName() { return name; }

    public List<LabTestType> getSupportedTestTypes() { return supportedTestTypes; }

    public List<UserReference> getMemberUsers() { return memberUsers; }

    public List<SampleOp> getActiveSamples() { return userActiveSampleOps; }

    public List<LabResource> getManagedResources() { return managedResources; }
}
