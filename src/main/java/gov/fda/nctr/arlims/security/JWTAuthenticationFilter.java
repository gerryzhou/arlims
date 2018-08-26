package gov.fda.nctr.arlims.security;

import java.util.ArrayList;
import java.util.Date;
import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import static org.springframework.web.context.support.WebApplicationContextUtils.getRequiredWebApplicationContext;
import com.auth0.jwt.JWT;
import static com.auth0.jwt.algorithms.Algorithm.HMAC512;

import static gov.fda.nctr.arlims.security.WebSecurityConfigurer.JWT_HEADER_NAME;
import static gov.fda.nctr.arlims.security.WebSecurityConfigurer.JWT_HEADER_PREFIX;
import static gov.fda.nctr.arlims.security.WebSecurityConfigurer.LOGIN_URL;


public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter
{
    private final AuthenticationManager authenticationManager;

    private SecurityConfig _securityConfig; // late initialized (from request), use accessor method

    private final Logger log = LoggerFactory.getLogger(this.getClass());


    public JWTAuthenticationFilter(AuthenticationManager authenticationManager)
    {
        this.authenticationManager = authenticationManager;
        setFilterProcessesUrl(LOGIN_URL);
    }

    @Override
    public Authentication attemptAuthentication
        (
            HttpServletRequest req,
            HttpServletResponse res
        )
        throws AuthenticationException
    {
        String username = req.getParameter("username");
        String password = req.getParameter("password");

        if ( username == null || password == null )
            throw new BadCredentialsException("username or password was not supplied");

        return authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, password, new ArrayList<>())
        );
    }

    @Override
    protected void successfulAuthentication
        (
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain,
            Authentication auth
        )
    {
        String username = ((User)auth.getPrincipal()).getUsername();

        SecurityConfig secCfg = getSecurityConfig(req);

        String token =
            JWT.create()
            .withSubject(username)
            .withExpiresAt(new Date(System.currentTimeMillis() + secCfg.getJwtExpirationMillis()))
            .sign(HMAC512(secCfg.getJwtSignatureSecret().getBytes()));

        res.addHeader(JWT_HEADER_NAME, JWT_HEADER_PREFIX + token);
    }

    private final SecurityConfig getSecurityConfig(HttpServletRequest req)
    {
        if ( _securityConfig == null )
            _securityConfig = getRequiredWebApplicationContext(req.getServletContext()).getBean(SecurityConfig.class);
        return _securityConfig;
    }
}
