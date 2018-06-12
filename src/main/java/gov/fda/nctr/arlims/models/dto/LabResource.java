package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


public class LabResource
{
    private String code;
    private LabResourceType typeName;
    private Optional<String> description;

    public LabResource(String code, LabResourceType typeName, Optional<String> description)
    {
        this.code = code;
        this.typeName = typeName;
        this.description = description;
    }

    public String getCode()
    {
        return code;
    }

    public LabResourceType getResourceType()
    {
        return typeName;
    }

    public Optional<String> getDescription()
    {
        return description;
    }
}
