package gov.fda.nctr.arlims.models.db;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import gov.fda.nctr.arlims.models.dto.LabResourceType;


@Entity
public class LabResource
{
    @Id
    private String code;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 60)
    private LabResourceType resourceType;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "LAB_GROUP_NAME")
    private LabGroup labGroup;

    @Column(name = "LAB_GROUP_NAME", insertable = false, updatable = false)
    private String labGroupName;

    private String description;

    public LabResource
        (
            @NotNull String code,
            @NotNull LabResourceType resourceType,
            @NotNull LabGroup labGroup,
            String description
        )
    {
        this.code = code;
        this.resourceType = resourceType;
        this.labGroup = labGroup;
        this.labGroupName = labGroup.getName();
        this.description = description;
    }
}
