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

    private BigDecimal hoursSpentNum;

    private String hoursCreditedOrgName;


    protected FactsUserTimeCharge() {}

    public FactsUserTimeCharge
        (
            long assignedToPersonId,
            AnalystTypeCode analystTypeCode,
            YesNoCode leadIndicator,
            Optional<String> remarks,
            TimeChargeStatusCode statusCode,
            BigDecimal hoursSpentNum,
            String hoursCreditedOrgName
        )
    {
        this.assignedToPersonId = assignedToPersonId;
        this.analystTypeCode = analystTypeCode;
        this.leadIndicator = leadIndicator;
        this.remarks = remarks;
        this.statusCode = statusCode;
        this.hoursSpentNum = hoursSpentNum;
        this.hoursCreditedOrgName = hoursCreditedOrgName;
    }

    public long getAssignedToPersonId() { return assignedToPersonId; }

    public AnalystTypeCode getAnalystTypeCode() { return analystTypeCode; }

    public YesNoCode getLeadIndicator() { return leadIndicator; }

    public Optional<String> getRemarks() { return remarks; }

    public TimeChargeStatusCode getStatusCode() { return statusCode; }

    public BigDecimal getHoursSpentNum() { return hoursSpentNum; }

    public String getHoursCreditedOrgName() { return hoursCreditedOrgName; }
}
