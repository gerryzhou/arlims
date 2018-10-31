package gov.fda.nctr.arlims.data_access.facts.sample_ops_refresh;


import gov.fda.nctr.arlims.models.dto.sample_ops_refresh.SampleOpsRefreshResults;

public interface SampleOpRefreshService
{
    void refreshSampleOpsFromFacts();

    SampleOpsRefreshResults refreshOrganizationSampleOpsFromFacts(String accomplishingOrg);
}
