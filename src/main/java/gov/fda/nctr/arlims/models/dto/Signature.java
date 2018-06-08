package gov.fda.nctr.arlims.models.dto;


public class Signature
{
    private long empId;
    private long signedEpochTimeMillis;

    public Signature
    (
        long empId,
        long signedEpochTimeMillis
    )
    {
        this.empId = empId;
        this.signedEpochTimeMillis = signedEpochTimeMillis;
    }

    public long getEmployeeId()
    {
        return empId;
    }

    public long getSignedEpochTimeMillis()
    {
        return signedEpochTimeMillis;
    }
}
