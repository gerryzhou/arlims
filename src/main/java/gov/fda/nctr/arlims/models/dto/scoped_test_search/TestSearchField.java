package gov.fda.nctr.arlims.models.dto.scoped_test_search;

import java.util.List;


public class TestSearchField
{
    private List<String> keyPath;

    private TestSearchFieldType fieldType;

    protected TestSearchField() {}

    public TestSearchField(List<String> keyPath, TestSearchFieldType fieldType)
    {
        this.keyPath = keyPath;
        this.fieldType = fieldType;
    }

    public List<String> getKeyPath() { return keyPath; }

    public TestSearchFieldType getFieldType() { return fieldType; }
}

