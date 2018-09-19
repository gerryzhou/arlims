package gov.fda.nctr.arlims.data_access.facts;

import javax.validation.constraints.NotEmpty;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;


@Component
@Validated
@ConfigurationProperties("facts.api")
public class FactsApiConfig
{
    // Oracle Internet Directory credentials for this application as a client of the FACTS API (LABS-DS).
    @NotEmpty
    private String appOidUsername;

    @NotEmpty
    private String appOidPassword;

    @NotEmpty
    private String appId;

    @NotEmpty
    private String baseUrl;

    public String getAppOidUsername() { return appOidUsername; }
    public void setAppOidUsername(String appOidUsername) { this.appOidUsername = appOidUsername; }

    public String getAppOidPassword() { return appOidPassword; }
    public void setAppOidPassword(String appOidPassword) { this.appOidPassword = appOidPassword; }

    public String getAppId() { return appId; }
    public void setAppId(String appId) { this.appId = appId; }

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
}
