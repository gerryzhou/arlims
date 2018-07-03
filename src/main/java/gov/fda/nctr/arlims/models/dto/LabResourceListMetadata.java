package gov.fda.nctr.arlims.models.dto;


public class LabResourceListMetadata
{
    private String listName;
    private String employeeShortName;
    private int resourcesCount;

    public LabResourceListMetadata
        (
            String listName,
            String employeeShortName,
            int resourcesCount
        )
    {
        this.listName = listName;
        this.employeeShortName = employeeShortName;
        this.resourcesCount = resourcesCount;
    }

    public String getListName() { return listName; }

    public String getEmployeeShortName() { return employeeShortName; }

    public int getResourcesCount() { return resourcesCount; }
}
