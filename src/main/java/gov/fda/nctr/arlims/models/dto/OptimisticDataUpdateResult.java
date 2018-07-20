package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


/// Describes the final status of an attempted update operation, which may have not been applied due to another
/// concurrent update of the same data. The concurrentDataModificationInfo property should be non-empty iff
/// succeeded is false. This class only represents failures to update due to other concurrent updates, other modes of
/// update failure (such as connection failure) must be represented via other means.
public class OptimisticDataUpdateResult
{
    private boolean succeeded;
    private Optional<DataModificationInfo> concurrentDataModificationInfo;

    public OptimisticDataUpdateResult
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
