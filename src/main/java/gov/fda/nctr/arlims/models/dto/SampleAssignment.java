package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.util.Optional;


public class SampleAssignment
{
    private final long sampleId;
    private final String employeeShortName;
    private final Optional<Instant> assignedInstant;
    private final Optional<Boolean> lead;

    public SampleAssignment
        (
            long sampleId,
            String employeeShortName,
            Optional<Instant> assignedInstant,
            Optional<Boolean> lead
        )
    {
        this.sampleId = sampleId;
        this.employeeShortName = employeeShortName;
        this.assignedInstant = assignedInstant;
        this.lead = lead;
    }

    public long getSampleId() { return sampleId; }

    public String getEmployeeShortName() { return employeeShortName; }

    public Optional<Instant> getAssignedInstant() { return assignedInstant; }

    public Optional<Boolean> getLead() { return lead; }
}
