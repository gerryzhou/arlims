package gov.fda.nctr.arlims.data_access.test_data;


public class AttachedFileBasicMetadata
{
    private final String name;
    private final long length;

    public AttachedFileBasicMetadata(String name, long length)
    {
        this.name = name;
        this.length = length;
    }

    public String getFileName() { return name; }

    public long getContentsLength() { return length; }
}
