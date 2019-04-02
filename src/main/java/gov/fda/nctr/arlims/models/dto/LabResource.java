package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


public class LabResource
{
    private String resourceGroup;
    private String code;
    private LabResourceType type;
    private Optional<String> description;

    public LabResource
        (
            String resourceGroup,
            String code,
            LabResourceType type,
            Optional<String> description
        )
    {
        this.resourceGroup = resourceGroup;
        this.code = code;
        this.type = type;
        this.description = description;
    }

    public String getResourceGroup() { return resourceGroup; }

    public String getCode() { return code; }

    public LabResourceType getResourceType() { return type; }

    public Optional<String> getDescription() { return description; }
}
