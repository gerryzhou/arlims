package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import gov.fda.nctr.arlims.models.dto.RoleName;


@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(name="UN_ROLE_NAME", columnNames = {"NAME"}),
    }
)
public class Role
{
    @Id @Column(length = 20) @Enumerated(EnumType.STRING)
    private RoleName name;

    @Size(max = 200)
    private String description;

    protected Role() {}

    public Role
        (
            @NotNull RoleName name,
            @Size(max = 200) String description
        )
    {
        this.name = name;
        this.description = description;
    }

    public RoleName getName() { return name; }
    public void setName(RoleName name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
