package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;


/// Information about the a modification of some data.
public class DataModificationInfo
{
    private String savedByUserShortName;
    private Instant savedInstant;
    private String dataMd5;

    public DataModificationInfo
        (
            String savedByUserShortName,
            Instant savedInstant,
            String dataMd5
        )
    {
        this.savedByUserShortName = savedByUserShortName;
        this.savedInstant = savedInstant;
        this.dataMd5 = dataMd5;
    }

    public String getSavedByUserShortName() { return savedByUserShortName; }

    public Instant getSavedInstant() { return savedInstant; }

    public String getDataMd5() { return dataMd5; }
}


