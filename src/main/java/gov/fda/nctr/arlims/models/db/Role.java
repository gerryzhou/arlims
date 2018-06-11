package gov.fda.nctr.arlims.models.db;

import javax.persistence.*;
import javax.validation.constraints.Size;

import gov.fda.nctr.arlims.models.dto.RoleName;


@Entity
public class Role
{
    @Id @Enumerated(EnumType.STRING) @Column(length = 20)
    private RoleName name;

    @Size(max = 200)
    private String description;

    protected Role() {}

    public Role
        (
            RoleName name,
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
