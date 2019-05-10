package gov.fda.nctr.arlims.models.dto.scoped_test_search;

import java.util.List;

import gov.fda.nctr.arlims.models.dto.LabTestTypeCode;


public class TestTypeSearchScope
{
    private LabTestTypeCode testTypeCode;
    private String testTypeShortName;
    private String scopeName;
    private String scopeDescription;
    private List<TestSearchField> searchFields;

    protected TestTypeSearchScope() {}

    public TestTypeSearchScope
        (
            LabTestTypeCode testTypeCode,
            String testTypeShortName,
            String scopeName,
            String scopeDescription,
            List<TestSearchField> searchFields
        )
    {
        this.testTypeCode = testTypeCode;
        this.testTypeShortName = testTypeShortName;
        this.scopeName = scopeName;
        this.scopeDescription = scopeDescription;
        this.searchFields = searchFields;
    }

    public LabTestTypeCode getTestTypeCode() { return testTypeCode; }

    public String getTestTypeShortName() { return testTypeShortName; }

    public String getScopeName() { return scopeName; }

    public String getScopeDescription() { return scopeDescription; }

    public List<TestSearchField> getSearchFields() { return searchFields; }
}
