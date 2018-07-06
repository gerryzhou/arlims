package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


/// Represents a lab test type as configured for a particular lab group (contextual).
public class LabTestType
{
    private long id;
    private LabTestTypeCode typeCode;
    private String name;
    private String shortName;
    private Optional<String> description;
    private Optional<String> configJson;

    public LabTestType
        (
            long id,
            LabTestTypeCode typeCode,
            String name,
            String shortName,
            Optional<String> description,
            Optional<String> configurationJson
        )
    {
        this.id = id;
        this.typeCode = typeCode;
        this.name = name;
        this.shortName = shortName;
        this.description = description;
        this.configJson = configurationJson;
    }

    public long getId() { return id; }

    public LabTestTypeCode getCode() { return typeCode; }

    public String getName() { return name; }

    public String getShortName() { return shortName; }

    public Optional<String> getDescription() { return description; }

    public Optional<String> getConfigurationJson() { return configJson; }
}
