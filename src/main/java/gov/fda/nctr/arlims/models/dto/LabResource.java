package gov.fda.nctr.arlims.models.dto;


import java.util.Optional;

public class LabResource
{
    private String id;
    private LabResourceType resourceType;
    private Optional<String> description;

    public LabResource(String id, LabResourceType resourceType, Optional<String> description)
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

    public Optional<String> getDescription()
    {
        return description;
    }
}
