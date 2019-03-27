package gov.fda.nctr.arlims.models.dto;

import java.time.LocalDate;
import java.util.Optional;


public class SampleOpAssignment
{
    private long factsPersonId;
    private String firstName;
    private String lastName;
    private Optional<String> middleInitial;
    private Optional<String> leadInd;
    private LocalDate workAssignmentDate;

    protected SampleOpAssignment() {}

    public SampleOpAssignment
        (
            long factsPersonId,
            String firstName,
            String lastName,
            Optional<String> middleInitial,
            Optional<String> leadInd,
            LocalDate workAssignmentDate
        )
    {
        this.factsPersonId = factsPersonId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleInitial = middleInitial;
        this.leadInd = leadInd;
        this.workAssignmentDate = workAssignmentDate;
    }

    public long getFactsPersonId() { return factsPersonId; }

    public String getFirstName() { return firstName; }

    public String getLastName() { return lastName; }

    public Optional<String> getMiddleInitial() { return middleInitial; }

    public Optional<String> getLeadInd() { return leadInd; }

    public LocalDate getWorkAssignmentDate() { return workAssignmentDate; }
}
