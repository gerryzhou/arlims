package gov.fda.nctr.arlims.security;

import javax.inject.Inject;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;


public class JwtAuthenticationFilter extends OncePerRequestFilter
{
    private static final String BEARER_TOK_PREFIX = "Bearer ";

    @Inject
    private JwtReader jwtReader;

    @Inject
    private AppUserDetailsService userDetailsService;

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal
        (
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
        )
        throws ServletException, IOException
    {
        try
        {
            String jwt = getJwt(request);

            if ( StringUtils.hasText(jwt) && jwtReader.validateToken(jwt) )
            {
                Long userId = jwtReader.getUserIdFromJWT(jwt);

                // TODO: Maybe try to just cram what's needed about the user in the JWT to prevent multiple db lookups here per req?
                UserDetails userDetails = userDetailsService.loadUserById(userId);

                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        catch (Exception e)
        {
            log.error("Could not set user authentication in security context", e);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwt(HttpServletRequest request)
    {
        String authHeader = request.getHeader("Authorization");

        if ( StringUtils.hasText(authHeader) && authHeader.startsWith(BEARER_TOK_PREFIX) )
        {
            return authHeader.substring(BEARER_TOK_PREFIX.length(), authHeader.length());
        }
        return null;
    }
}
