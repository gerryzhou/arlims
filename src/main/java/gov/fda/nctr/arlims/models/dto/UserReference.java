package gov.fda.nctr.arlims.models.dto;


public class UserReference
{
    private long employeeId;
    private String username;
    private String shortName;

    public UserReference
        (
            long employeeId,
            String username,
            String shortName
        )
    {
        this.employeeId = employeeId;
        this.username = username;
        this.shortName = shortName;
    }

    public long getEmployeeId() { return employeeId; }

    public String getUsername() { return username; }

    public String getShortName() { return shortName; }
}
