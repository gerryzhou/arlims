package gov.fda.nctr.arlims.models.dto;


public class SamplePacAssignment
{
    long sampleNum;
    String pacCode;
    String productName;
    long empId;

    public SamplePacAssignment(long sampleNum, String pacCode, String productName, long empId)
    {
        this.sampleNum = sampleNum;
        this.pacCode = pacCode;
        this.productName = productName;
        this.empId = empId;
    }

    public long getSampleNumber()
    {
        return sampleNum;
    }

    public String getPacCode()
    {
        return pacCode;
    }

    public String getProductName()
    {
        return productName;
    }

    public long getEmployeeId()
    {
        return empId;
    }
}
