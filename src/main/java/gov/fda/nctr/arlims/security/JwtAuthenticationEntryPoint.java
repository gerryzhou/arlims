package gov.fda.nctr.arlims.security;


import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;



@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint
{
    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationEntryPoint.class);

    @Override
    public void commence
        (
            HttpServletRequest httpServletRequest,
            HttpServletResponse resp,
            AuthenticationException e
        )
        throws IOException, ServletException
    {
        log.error("Request failed authorization : {}", e.getMessage());
        resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "You're not authorized to access this resource.");
    }
}
