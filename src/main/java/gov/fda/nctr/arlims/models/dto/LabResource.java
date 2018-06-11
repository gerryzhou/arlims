package gov.fda.nctr.arlims.models.dto;


import java.util.Optional;

public class LabResource
{
    private String code;
    private LabResourceType resourceType;
    private Optional<String> description;

    public LabResource(String code, LabResourceType resourceType, Optional<String> description)
    {
        this.code = code;
        this.resourceType = resourceType;
        this.description = description;
    }

    public String getCode()
    {
        return code;
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
