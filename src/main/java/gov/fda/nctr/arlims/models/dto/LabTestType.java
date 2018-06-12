package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


public class LabTestType
{
    private LabTestTypeCode typeCode;
    private Optional<String> description;

    public LabTestType(LabTestTypeCode typeCode, Optional<String> description)
    {
        this.typeCode = typeCode;
        this.description = description;
    }

    public LabTestTypeCode getCode() { return typeCode; }

    public Optional<String> getDescription() { return description; }
}
