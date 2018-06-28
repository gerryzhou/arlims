package gov.fda.nctr.arlims.models.dto;

import java.time.LocalDate;
import java.util.Optional;


public class SampleAssignment
{
    private final long sampleId;
    private final String employeeShortName;
    private final Optional<LocalDate> assignedDate;
    private final Optional<Boolean> lead;

    public SampleAssignment
        (
            long sampleId,
            String employeeShortName,
            Optional<LocalDate> assignedDate,
            Optional<Boolean> lead
        )
    {
        this.sampleId = sampleId;
        this.employeeShortName = employeeShortName;
        this.assignedDate = assignedDate;
        this.lead = lead;
    }

    public long getSampleId() { return sampleId; }

    public String getEmployeeShortName() { return employeeShortName; }

    public Optional<LocalDate> getAssignedDate() { return assignedDate; }

    public Optional<Boolean> getLead() { return lead; }
}
