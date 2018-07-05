package gov.fda.nctr.arlims.models.dto;

public enum LabResourceType
{
    BAL("balance"),
    WAB("waterbath"),
    VID("Vidas"),
    INC("incubator"),
    MED("media")
    ;

    private final String name;

    LabResourceType(String name)
    {
        this.name = name;
    }

    public String getName() { return name; }
}
