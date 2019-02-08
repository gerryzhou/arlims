package gov.fda.nctr.arlims.security;

import java.io.IOException;
import java.util.Optional;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.util.WebUtils;

import gov.fda.nctr.arlims.data_access.user_context.UserContextService;
import gov.fda.nctr.arlims.models.dto.AppUser;
import static gov.fda.nctr.arlims.security.WebSecurityConfigurer.AUTH_HEADER_NAME;
import static gov.fda.nctr.arlims.security.WebSecurityConfigurer.AUTH_TOKEN_PREFIX;


public class JWTRecognitionFilter extends BasicAuthenticationFilter
{
    private SecurityProperties securityProperties;
    private UserContextService userContextService;

    private final Logger log = LoggerFactory.getLogger(this.getClass());


    public JWTRecognitionFilter
        (
            SecurityProperties securityProperties,
            UserContextService userContextService,
            AuthenticationManager authManager
        )
    {
        super(authManager);
        this.securityProperties = securityProperties;
        this.userContextService = userContextService;
    }

    @Override
    protected void doFilterInternal
        (
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain
        )
        throws IOException, ServletException
    {
        Optional<String> jwt = getJWT(req);

        jwt.ifPresent(tok -> SecurityContextHolder.getContext().setAuthentication(makeAuthentication(tok)));

        chain.doFilter(req, res);
    }

    private Optional<String> getJWT(HttpServletRequest req)
    {
        switch ( securityProperties.getJwtHeader() )
        {
            case Authorization:
            {
                String authHeaderValue = req.getHeader(AUTH_HEADER_NAME);

                if ( authHeaderValue != null && authHeaderValue.length() > AUTH_TOKEN_PREFIX.length() )
                    return Optional.of(authHeaderValue.substring(AUTH_TOKEN_PREFIX.length()));
                else
                    return Optional.empty();
            }
            case Cookie:
            {
                String cookieName = securityProperties.getJwtCookieName();
                if ( cookieName == null )
                    throw new RuntimeException("No cookie name is configured in security settings for JWT.");

                Cookie jwtCookie = WebUtils.getCookie(req, cookieName);

                if ( jwtCookie == null )
                    return Optional.empty();

                return Optional.ofNullable(jwtCookie.getValue());
            }
            default:
                throw new RuntimeException("Unrecognized jwt header type in security properties.");
        }
    }

    private Authentication makeAuthentication(String jwt)
    {
        String username =
            JWT.require(Algorithm.HMAC512(securityProperties.getJwtSignatureSecret().getBytes()))
            .build()
            .verify(jwt)
            .getSubject();

        if ( username == null )
            return null;

        try
        {
            AppUser appUser = userContextService.getUser(username);

            return new AppUserAuthentication(appUser);
        }
        catch(Exception e)
        {
            log.info("Failed to set user details for username '" + username + "' extracted from JWT token: " + e);
            return null;
        }
    }
}