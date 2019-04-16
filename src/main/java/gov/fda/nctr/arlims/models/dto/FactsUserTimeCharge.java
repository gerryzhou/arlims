package gov.fda.nctr.arlims.models.dto;

import java.math.BigDecimal;
import java.util.Optional;


public class FactsUserTimeCharge
{
    private long assignedToPersonId;

    private AnalystTypeCode analystTypeCode;

    private YesNoCode leadIndicator;

    private Optional<String> remarks;

    private TimeChargeStatusCode statusCode;

    private BigDecimal hoursSpentNumber;

    private String hoursCreditedOrgName;


    protected FactsUserTimeCharge() {}

    public FactsUserTimeCharge
        (
            long assignedToPersonId,
            AnalystTypeCode analystTypeCode,
            YesNoCode leadIndicator,
            Optional<String> remarks,
            TimeChargeStatusCode statusCode,
            BigDecimal hoursSpentNumber,
            String hoursCreditedOrgName
        )
    {
        this.assignedToPersonId = assignedToPersonId;
        this.analystTypeCode = analystTypeCode;
        this.leadIndicator = leadIndicator;
        this.remarks = remarks;
        this.statusCode = statusCode;
        this.hoursSpentNumber = hoursSpentNumber;
        this.hoursCreditedOrgName = hoursCreditedOrgName;
    }

    public long getAssignedToPersonId() { return assignedToPersonId; }

    public AnalystTypeCode getAnalystTypeCode() { return analystTypeCode; }

    public YesNoCode getLeadIndicator() { return leadIndicator; }

    public Optional<String> getRemarks() { return remarks; }

    public TimeChargeStatusCode getStatusCode() { return statusCode; }

    public BigDecimal getHoursSpentNumber() { return hoursSpentNumber; }

    public String getHoursCreditedOrgName() { return hoursCreditedOrgName; }
}
