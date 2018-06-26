package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


public class LabTestType
{
    private long id;
    private LabTestTypeCode typeCode;
    private String name;
    private Optional<String> description;

    public LabTestType
        (
            long id,
            LabTestTypeCode typeCode,
            String name,
            Optional<String> description
        )
    {
        this.id = id;
        this.typeCode = typeCode;
        this.name = name;
        this.description = description;
    }

    public long getId() { return id; }

    public LabTestTypeCode getCode() { return typeCode; }

    public String getName() { return name; }

    public Optional<String> getDescription() { return description; }
}
