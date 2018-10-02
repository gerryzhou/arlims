package gov.fda.nctr.arlims.data_access.facts.sample_ops_refresh;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.SampleOp;
import static java.util.stream.Collectors.joining;


public class ReportingUtils
{
    public static String toJsonString(ObjectMapper jsonSerializer, Object o)
    {
        try
        {
            return jsonSerializer.writeValueAsString(o);
        }
        catch(Exception e)
        {
            throw new RuntimeException(e);
        }
    }

    /// Describe a group of lab inbox items for the same operation (work id), with one assigned employee per item.
    public static String describeLabInboxItemGroup(List<LabInboxItem> labInboxItems)
    {
        return
            "[" + labInboxItems.get(0).getSampleTrackingNum() + "-" + labInboxItems.get(0).getSampleTrackingSubNum() +
            " " + labInboxItems.get(0).getCfsanProductDesc() + "" +
            ", assigned-to=" + describeAssignedEmployees(labInboxItems) +
            ", org=\"" + labInboxItems.get(0).getAccomplishingOrg() + "\"" +
            ", work-id=" + labInboxItems.get(0).getWorkId() + "]";
    }

    public static String describeAssignedEmployees(List<LabInboxItem> labInboxItems)
    {
        return
            labInboxItems.stream()
            .map(item ->
                "{" + item.getAssignedToFirstName() + " " + item.getAssignedToLastName() +
                ", id=" + item.getAssignedToPersonId() + "}"
            )
            .collect(joining(", ", "[", "]"));
    }

    public static String describeSampleOp(SampleOp sampleOp)
    {
        return
            "[" + sampleOp.getSampleTrackingNumber() + "-" + sampleOp.getSampleTrackingSubNumber() +
            " \"" + sampleOp.getProductName() + "\"" +
            ", lab-group=\"" + sampleOp.getLabGroup().getName() + "\"" +
            ", parent-org=\"" + sampleOp.getLabGroup().getFactsParentOrgName() + "\"" +
            ", work-id=" + sampleOp.getWorkId() + "]";
    }
}
