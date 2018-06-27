package gov.fda.nctr.arlims.models.dto;


public class Signature
{
    private long employeeId;
    private String employeeShortName;
    private long signedEpochTimeMillis;

    public Signature
        (
            long employeeId,
            String employeeShortName,
            long signedEpochTimeMillis
        )
    {
        this.employeeId = employeeId;
        this.employeeShortName = employeeShortName;
        this.signedEpochTimeMillis = signedEpochTimeMillis;
    }

    public long getEmployeeId() { return employeeId; }

    public String getEmployeeShortName() { return employeeShortName; }

    public long getSignedEpochTimeMillis() { return signedEpochTimeMillis; }
}
