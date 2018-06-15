package gov.fda.nctr.arlims.security;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;


@Component
public class JwtReader
{
    private static final Logger log = LoggerFactory.getLogger(JwtReader.class);

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationMinutes}")
    private int jwtExpirationMinutes;


    public String generateToken(Authentication authentication)
    {
        UserPrincipal userPrincipal = (UserPrincipal)authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMinutes);

        return
            Jwts.builder()
            .setSubject(Long.toString(userPrincipal.getEmployeeId()))
            .setIssuedAt(new Date())
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    public Long getUserIdFromJWT(String token)
    {
        Claims claims =
            Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody();

        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken)
    {
        try
        {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        }
        catch (SignatureException e)
        {
            log.error("invalid JWT signature");
        }
        catch (MalformedJwtException e)
        {
            log.error("invalid JWT token");
        }
        catch (ExpiredJwtException e)
        {
            log.error("expired JWT token");
        }
        catch (UnsupportedJwtException e)
        {
            log.error("unsupported JWT token");
        }
        catch (IllegalArgumentException e)
        {
            log.error("empty JWT claims string");
        }

        return false;
    }
}
