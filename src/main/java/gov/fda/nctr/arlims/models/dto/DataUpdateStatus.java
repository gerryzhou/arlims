package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


public class DataUpdateStatus
{
    private boolean succeeded;
    private Optional<DataModificationInfo> concurrentDataModificationInfo;

    public DataUpdateStatus
        (
            boolean succeeded,
            Optional<DataModificationInfo> concurrentDataModificationInfo
        )
    {
        this.succeeded = succeeded;
        this.concurrentDataModificationInfo = concurrentDataModificationInfo;
        if ( succeeded && concurrentDataModificationInfo.isPresent() )
            throw new RuntimeException("Successful data update status cannot have concurrent modification information.");
    }

    public boolean getSucceeded() { return succeeded; }

    public Optional<DataModificationInfo> getConcurrentDataModificationInfo()
    {
        return concurrentDataModificationInfo;
    }
}
