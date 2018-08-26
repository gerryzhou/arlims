package gov.fda.nctr.arlims.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.util.matcher.*;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled=true)
public class WebSecurityConfigurer extends WebSecurityConfigurerAdapter
{
    private final AppUserDetailsService userDetailsService;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    static final String LOGIN_URL = "/api/login";
    static final String JWT_HEADER_NAME = "Authorization";
    static final String JWT_HEADER_PREFIX = "Bearer ";

    private static final RequestMatcher UNMANAGED_URLS =
        new NegatedRequestMatcher(new AntPathRequestMatcher("/api/**"));

    public WebSecurityConfigurer
        (
            AppUserDetailsService userDetailsService
        )
    {
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception
    {
        http
        .csrf().disable()
        .authorizeRequests()
        .antMatchers(HttpMethod.POST, LOGIN_URL).permitAll()
        .anyRequest().authenticated()
        .and()
        .addFilter(new JWTAuthenticationFilter(authenticationManager()))
        .addFilter(new JWTRecognitionFilter(authenticationManager()))
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    @Override
    public void configure(WebSecurity web)
    {
        web.ignoring().requestMatchers(UNMANAGED_URLS);
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception
    {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }


    @Bean
    public BCryptPasswordEncoder passwordEncoder()
    {
        return new BCryptPasswordEncoder();
    }
}

