package gov.fda.nctr.arlims.models.dto;


public class Signature
{
    private long employeeFactsId;
    private long signedEpochTimeMillis;

    public Signature
    (
        long employeeFactsId,
        long signedEpochTimeMillis
    )
    {
        this.employeeFactsId = employeeFactsId;
        this.signedEpochTimeMillis = signedEpochTimeMillis;
    }

    public long getEmployeeFactsId()
    {
        return employeeFactsId;
    }

    public long getSignedEpochTimeMillis()
    {
        return signedEpochTimeMillis;
    }
}
