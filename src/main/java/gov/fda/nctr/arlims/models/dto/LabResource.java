package gov.fda.nctr.arlims.models.dto;


public class LabResource
{
    private String id;
    private LabResourceType resourceType;
    private String description;

    public LabResource(String id, LabResourceType resourceType, String description)
    {
        this.id = id;
        this.resourceType = resourceType;
        this.description = description;
    }

    public String getId()
    {
        return id;
    }

    public LabResourceType getResourceType()
    {
        return resourceType;
    }

    public String getDescription()
    {
        return description;
    }
}
