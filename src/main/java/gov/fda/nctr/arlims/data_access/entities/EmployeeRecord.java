package gov.fda.nctr.arlims.data_access.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name="EMPLOYEE")
public class EmployeeRecord
{
    @Id
    private Long factsId;
    private String username;
    private String labGroupName;
    private String password;
    private String email;
    private String lastName;
    private String firstName;
    private String middleNameOrInitial;

    protected EmployeeRecord() {}

    public EmployeeRecord(Long factsId, String username, String labGroupName, String password, String email, String lastName, String firstName, String middleNameOrInitial)
    {
        this.factsId = factsId;
        this.username = username;
        this.labGroupName = labGroupName;
        this.password = password;
        this.email = email;
        this.lastName = lastName;
        this.firstName = firstName;
        this.middleNameOrInitial = middleNameOrInitial;
    }

    @Override
    public String toString() { return "EmployeeRecord[" + factsId + ", " + username + ",...]"; }

    public Long getFactsId() { return factsId; }

    public void setFactsId(Long factsId) { this.factsId = factsId; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getLabGroupName() { return labGroupName; }

    public void setLabGroupName(String labGroupName) { this.labGroupName = labGroupName; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getLastName() { return lastName; }

    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFirstName() { return firstName; }

    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getMiddleNameOrInitial() { return middleNameOrInitial; }

    public void setMiddleNameOrInitial(String middleNameOrInitial) { this.middleNameOrInitial = middleNameOrInitial; }
}
