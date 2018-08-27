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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.util.matcher.*;
import org.springframework.web.filter.DelegatingFilterProxy;
import org.springframework.web.filter.GenericFilterBean;

import gov.fda.nctr.arlims.data_access.UserContextService;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled=true)
public class WebSecurityConfigurer extends WebSecurityConfigurerAdapter
{
    private final AppUserDetailsService userDetailsService;

    private final SecurityProperties securityProperties;

    private final UserContextService userContextService;

    private final PasswordEncoder passwordEncoder;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    private static final String LOGIN_URL = "/api/login";
    static final String JWT_HEADER_NAME = "Authorization";
    static final String JWT_HEADER_PREFIX = "Bearer ";

    private static final RequestMatcher UNMANAGED_URLS =
        new NegatedRequestMatcher(new AntPathRequestMatcher("/api/**"));

    public WebSecurityConfigurer
        (
            AppUserDetailsService userDetailsService,
            SecurityProperties securityProperties,
            UserContextService userContextService,
            PasswordEncoder passwordEncoder
        )
    {
        this.userDetailsService = userDetailsService;
        this.securityProperties = securityProperties;
        this.userContextService = userContextService;
        this.passwordEncoder = passwordEncoder;
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
        .addFilterAfter(jwtAuthenticationFilterProxy(), LogoutFilter.class)
        .addFilterAfter(jwtRecognitionFilterProxy(), LogoutFilter.class)
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
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }

    @Bean
    DelegatingFilterProxy jwtAuthenticationFilterProxy()
    {
        return new DelegatingFilterProxy("jwtAuthenticationFilter");
    }

    @Bean
    public GenericFilterBean jwtAuthenticationFilter() throws Exception
    {
        JWTAuthenticationFilter filter = new JWTAuthenticationFilter(securityProperties, authenticationManager());
        filter.setFilterProcessesUrl(LOGIN_URL);
        return filter;
    }

    @Bean
    DelegatingFilterProxy jwtRecognitionFilterProxy()
    {
        return new DelegatingFilterProxy("jwtRecognitionFilter");
    }

    @Bean
    public GenericFilterBean jwtRecognitionFilter() throws Exception
    {
        return new JWTRecognitionFilter(securityProperties, userContextService, authenticationManager());
    }
}

