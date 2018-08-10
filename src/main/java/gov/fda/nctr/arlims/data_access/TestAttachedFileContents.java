package gov.fda.nctr.arlims.data_access;

import java.io.InputStream;

public class TestAttachedFileContents
{
    private final String name;
    private final long length;
    private InputStream contentsStream;

    public TestAttachedFileContents(String name, long length, InputStream contentsStream)
    {
        this.name = name;
        this.length = length;
        this.contentsStream = contentsStream;
    }

    public String getFileName() { return name; }

    public long getContentsLength() { return length; }

    public InputStream getContentsStream() { return contentsStream; }
}
