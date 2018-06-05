package gov.fda.nctr.arlims.models.dto;


public class SamplePacAssignment
{
    long sampleNum;
    String pacCode;
    String productName;
    long employeeFactsId;

    public SamplePacAssignment(long sampleNum, String pacCode, String productName, long empFactsId)
    {
        this.sampleNum = sampleNum;
        this.pacCode = pacCode;
        this.productName = productName;
        this.employeeFactsId = empFactsId;
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

    public long getEmployeeFactsId()
    {
        return employeeFactsId;
    }
}
