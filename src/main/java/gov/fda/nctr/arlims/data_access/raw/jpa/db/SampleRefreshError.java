package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(
    indexes = {
        @Index(name = "IX_SMPRFRERR_TIMESTAMP", columnList = "TIMESTAMP"),
        @Index(name = "IX_SMPRFRERR_SMPPORG", columnList = "SAMPLE_PARENT_ORG"),
        @Index(name = "IX_SMPRFRERR_ITEMPORG", columnList = "INBOX_ITEM_ACCOMPLISHING_ORG"),
    }
)
public class SampleRefreshError
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "TIMESTAMP") @NotNull
    private Instant timestamp;

    @Column(name = "ACTION") @Size(max = 50) @NotNull
    private String action;

    @Column(name = "ERROR") @Size(max = 4000)
    private String error;

    @Column(name = "SAMPLE_PARENT_ORG") @Size(max = 50)
    private String sampleParentOrg;

    @Column(name = "INBOX_ITEM_ACCOMPLISHING_ORG") @Size(max = 50)
    private String inboxItemAccomplishingOrg;

    @Lob @Column(name = "SAMPLE_JSON")
    private String sampleJson;

    @Lob @Column(name = "INBOX_ITEM_JSON")
    private String inboxItemJson;


    protected SampleRefreshError() {}

    public SampleRefreshError
        (
            @NotNull Instant timestamp,
            @Size(max = 50) @NotNull String action,
            @Size(max = 4000) String error,
            @Size(max = 50) String sampleParentOrg,
            @Size(max = 50) String inboxItemAccomplishingOrg,
            String sampleJson,
            String inboxItemJson
        )
    {
        this.timestamp = timestamp;
        this.action = action;
        this.error = error;
        this.sampleParentOrg = sampleParentOrg;
        this.inboxItemAccomplishingOrg = inboxItemAccomplishingOrg;
        this.sampleJson = sampleJson;
        this.inboxItemJson = inboxItemJson;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public String getSampleParentOrg() { return sampleParentOrg; }
    public void setSampleParentOrg(String sampleParentOrg) { this.sampleParentOrg = sampleParentOrg; }

    public String getInboxItemAccomplishingOrg() { return inboxItemAccomplishingOrg; }
    public void setInboxItemAccomplishingOrg(String inboxItemAccomplishingOrg) { this.inboxItemAccomplishingOrg = inboxItemAccomplishingOrg; }

    public String getSampleJson() { return sampleJson; }
    public void setSampleJson(String sampleJson) { this.sampleJson = sampleJson; }

    public String getInboxItemJson() { return inboxItemJson; }
    public void setInboxItemJson(String inboxItemJson) { this.inboxItemJson = inboxItemJson; }
}
