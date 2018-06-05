package gov.fda.nctr.arlims.models.dto;

public class LabTestType
{
    private String name;
    private String description;

    public LabTestType(String name, String description)
    {
        this.name = name;
        this.description = description;
    }

    public String getName()
    {
        return name;
    }

    public String getDescription()
    {
        return description;
    }
}
