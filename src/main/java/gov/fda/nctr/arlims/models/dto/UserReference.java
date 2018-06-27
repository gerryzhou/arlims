package gov.fda.nctr.arlims.models.dto;


public class UserReference
{
    private long employeeId;
    private String fdaEmailAccountName;
    private String shortName;

    public UserReference
        (
            long employeeId,
            String fdaEmailAccountName,
            String shortName
        )
    {
        this.employeeId = employeeId;
        this.fdaEmailAccountName = fdaEmailAccountName;
        this.shortName = shortName;
    }

    public long getEmployeeId() { return employeeId; }

    public String getFdaEmailAccountName() { return fdaEmailAccountName; }

    public String getShortName() { return shortName; }
}
