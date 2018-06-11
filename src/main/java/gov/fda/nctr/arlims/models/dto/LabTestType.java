package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


public class LabTestType
{
    private LabTestTypeName typeName;
    private Optional<String> description;

    public LabTestType(LabTestTypeName typeName, Optional<String> description)
    {
        this.typeName = typeName;
        this.description = description;
    }

    public LabTestTypeName getName() { return typeName; }

    public Optional<String> getDescription() { return description; }
}
