package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


public class LabTestType
{
    private String name;
    private Optional<String> description;

    public LabTestType(String name, Optional<String> description)
    {
        this.name = name;
        this.description = description;
    }

    public String getName()
    {
        return name;
    }

    public Optional<String> getDescription()
    {
        return description;
    }
}
