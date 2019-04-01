package gov.fda.nctr.arlims.models.dto;


public class UserReference
{
    private long employeeId;
    private long factsPersonId;
    private String username;
    private String shortName;

    public UserReference
        (
            long employeeId,
            long factsPersonId,
            String username,
            String shortName
        )
    {
        this.employeeId = employeeId;
        this.factsPersonId = factsPersonId;
        this.username = username;
        this.shortName = shortName;
    }

    public long getEmployeeId() { return employeeId; }

    public long getFactsPersonId() { return factsPersonId; }

    public String getUsername() { return username; }

    public String getShortName() { return shortName; }
}
