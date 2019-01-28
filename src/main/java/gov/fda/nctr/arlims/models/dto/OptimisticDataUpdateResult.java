package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


/// Describes the final status of an attempted update operation, which may have
/// not been applied due to another concurrent update of the same data. The
/// concurrentDataModificationInfo property should be non-empty iff savedMd5
/// is empty. This class only represents failures to update due to other
/// concurrent updates, other modes of update failure such as network error
/// must be represented via other means.
public class OptimisticDataUpdateResult
{
    private Optional<String> savedMd5;
    // (xor)
    private Optional<DataModificationInfo> concurrentDataModificationInfo;

    public OptimisticDataUpdateResult
        (
            Optional<String> savedMd5,
            Optional<DataModificationInfo> concurrentDataModificationInfo
        )
    {
        this.savedMd5 = savedMd5;
        this.concurrentDataModificationInfo = concurrentDataModificationInfo;

        if ( savedMd5.isPresent() == concurrentDataModificationInfo.isPresent() )
            throw new RuntimeException("Invalid optimistic update result data.");
    }

    public Optional<String> getSavedMd5() { return savedMd5; }

    public Optional<DataModificationInfo> getConcurrentDataModificationInfo()
    {
        return concurrentDataModificationInfo;
    }
}
