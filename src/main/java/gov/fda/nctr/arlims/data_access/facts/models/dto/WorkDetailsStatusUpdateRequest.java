package gov.fda.nctr.arlims.data_access.facts.models.dto;


public class WorkDetailsStatusUpdateRequest
{
    private long operationId;
    private long assignedToPersonId;
    private String statusCode;

    public WorkDetailsStatusUpdateRequest(long operationId, long assignedToPersonId, String statusCode)
    {
        this.operationId = operationId;
        this.assignedToPersonId = assignedToPersonId;
        this.statusCode = statusCode;
    }

    public long getOperationId() { return operationId; }

    public long getAssignedToPersonId() { return assignedToPersonId; }

    public String getStatusCode() { return statusCode; }
}
