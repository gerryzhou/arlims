package gov.fda.nctr.arlims.data_access.facts.models.dto;

import java.time.Instant;
import java.time.LocalDate;


public interface InboxItem {

    Long getOperationId();

    Long getSampleTrackingNumber();

    Long getSampleTrackingSubNumber();

    String getCfsanProductDesc();

    String getLidCode();

    String getProblemAreaFlag();

    String getPacCode();

    String getStatusCode();

    Instant getStatusDate();

    String getSubjectText();

    String getRemarks();

    long getPersonId();

    String getAssignedToFirstName();

    String getAssignedToLastName();

    String getAssignedToMiddleName();

    String getLeadIndicator();

    LocalDate getWorkAssignmentDate();
}
