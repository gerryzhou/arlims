package gov.fda.nctr.arlims.models.dto;

import java.util.List;

public class SampleOpTimeCharges
{
    private long operationId;

    private List<FactsUserTimeCharge> labHoursList;


    protected SampleOpTimeCharges() {}

    public SampleOpTimeCharges(long operationId, List<FactsUserTimeCharge> labHoursList)
    {
        this.operationId = operationId;
        this.labHoursList = labHoursList;
    }

    public long getOperationId() { return operationId; }

    public List<FactsUserTimeCharge> getLabHoursList() { return labHoursList; }
}
