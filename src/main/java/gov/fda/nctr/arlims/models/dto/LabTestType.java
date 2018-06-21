package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


public class LabTestType
{
    private LabTestTypeCode typeCode;
    private String name;
    private Optional<String> description;

    public LabTestType
        (
            LabTestTypeCode typeCode,
            String name,
            Optional<String> description
        )
    {
        this.typeCode = typeCode;
        this.name = name;
        this.description = description;
    }

    public LabTestTypeCode getCode() { return typeCode; }

    public String getName() { return name; }

    public Optional<String> getDescription() { return description; }
}
