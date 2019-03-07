package gov.fda.nctr.arlims.data_access.version_info;

import java.util.Optional;

import gov.fda.nctr.arlims.models.dto.AppVersion;


public interface AppVersionService
{
    Optional<AppVersion> getAppVersion();
}
