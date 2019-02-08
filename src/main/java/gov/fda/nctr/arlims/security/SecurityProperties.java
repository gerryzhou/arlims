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

    @NotNull
    private SecurityProperties.JWTHeader jwtHeader = JWTHeader.Cookie;

    @NotNull
    private String jwtCookieName = "jwtc";

    public String getJwtSignatureSecret() { return jwtSignatureSecret; }
    public void setJwtSignatureSecret(String jwtSignatureSecret) { this.jwtSignatureSecret = jwtSignatureSecret; }

    public long getJwtExpirationMillis() { return jwtExpirationMillis; }
    public void setJwtExpirationMillis(long jwtExpirationMillis) { this.jwtExpirationMillis = jwtExpirationMillis; }

    public JWTHeader getJwtHeader() { return jwtHeader; }
    public void setJwtHeader(JWTHeader jwtHeader) { this.jwtHeader = jwtHeader; }

    public String getJwtCookieName() { return jwtCookieName; }
    public void setJwtCookieName(String jwtCookieName) { this.jwtCookieName = jwtCookieName; }

    public enum JWTHeader { Cookie, Authorization }
}
