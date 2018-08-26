package gov.fda.nctr.arlims.security;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.fda.nctr.arlims.data_access.UserContextService;
import gov.fda.nctr.arlims.models.dto.AppUser;
import static gov.fda.nctr.arlims.security.WebSecurityConfigurer.JWT_HEADER_NAME;
import static gov.fda.nctr.arlims.security.WebSecurityConfigurer.JWT_HEADER_PREFIX;
import static org.springframework.web.context.support.WebApplicationContextUtils.getRequiredWebApplicationContext;


public class JWTRecognitionFilter extends BasicAuthenticationFilter
{
    // These are late-initialized (need request object), use accessor methods.
    private SecurityConfig _securityConfig;
    private UserContextService _userContextService;

    private final Logger log = LoggerFactory.getLogger(this.getClass());


    public JWTRecognitionFilter(AuthenticationManager authManager)
    {
        super(authManager);
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

        Authentication auth = getAuthentication(req);

        SecurityContextHolder.getContext().setAuthentication(auth);
        chain.doFilter(req, res);
    }

    private Authentication getAuthentication(HttpServletRequest req)
    {
        String authHeaderValue = req.getHeader(JWT_HEADER_NAME);

        if ( authHeaderValue == null )
            return null;

        String username =
            JWT.require(Algorithm.HMAC512(getSecurityConfig(req).getJwtSignatureSecret().getBytes()))
            .build()
            .verify(authHeaderValue.substring(JWT_HEADER_PREFIX.length()))
            .getSubject();

        if ( username == null )
            return null;

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null, null);

        try
        {
            AppUser appUser = getUserContextService(req).getUser(username);
            auth.setDetails(appUser);

            return auth;
        }
        catch(Exception e)
        {
            log.info("Failed to set user details for username '" + username +
                     "' extracted from JWT token: " + e);
            return null;
        }
    }

    private final SecurityConfig getSecurityConfig(HttpServletRequest req)
    {
        if ( _securityConfig == null )
            _securityConfig = getRequiredWebApplicationContext(req.getServletContext()).getBean(SecurityConfig.class);
        return _securityConfig;
    }

    private final UserContextService getUserContextService(HttpServletRequest req)
    {
        if ( _userContextService == null )
            _userContextService = getRequiredWebApplicationContext(req.getServletContext()).getBean(UserContextService.class);
        return _userContextService;
    }
}