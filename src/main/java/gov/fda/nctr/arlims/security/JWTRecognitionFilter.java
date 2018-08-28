package gov.fda.nctr.arlims.security;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
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

import gov.fda.nctr.arlims.data_access.user_context.UserContextService;
import gov.fda.nctr.arlims.models.dto.AppUser;
import static gov.fda.nctr.arlims.security.WebSecurityConfigurer.JWT_HEADER_NAME;
import static gov.fda.nctr.arlims.security.WebSecurityConfigurer.JWT_HEADER_PREFIX;


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
        String header = req.getHeader(JWT_HEADER_NAME);

        if ( header == null || !header.startsWith(JWT_HEADER_PREFIX) )
        {
            chain.doFilter(req, res);
            return;
        }

        SecurityContextHolder.getContext().setAuthentication(makeAuthentication(req));

        chain.doFilter(req, res);
    }

    private Authentication makeAuthentication(HttpServletRequest req)
    {
        String authHeaderValue = req.getHeader(JWT_HEADER_NAME);

        if ( authHeaderValue == null )
            return null;

        String username =
            JWT.require(Algorithm.HMAC512(securityProperties.getJwtSignatureSecret().getBytes()))
            .build()
            .verify(authHeaderValue.substring(JWT_HEADER_PREFIX.length()))
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