package gov.fda.nctr.arlims.security;

import javax.validation.constraints.NotNull;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;


@Component
@Validated
@ConfigurationProperties("app.security")
public class SecurityProperties
{
    @NotNull
    private String jwtSignatureSecret;

    @NotNull
    private long jwtExpirationMillis;

    public String getJwtSignatureSecret() { return jwtSignatureSecret; }
    public void setJwtSignatureSecret(String jwtSignatureSecret) { this.jwtSignatureSecret = jwtSignatureSecret; }

    public long getJwtExpirationMillis() { return jwtExpirationMillis; }
    public void setJwtExpirationMillis(long jwtExpirationMillis) { this.jwtExpirationMillis = jwtExpirationMillis; }
}
