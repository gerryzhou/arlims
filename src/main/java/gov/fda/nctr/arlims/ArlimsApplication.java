package gov.fda.nctr.arlims;

import java.util.Collections;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.ModelAndView;


@SpringBootApplication
@EnableScheduling
public class ArlimsApplication
{
    public static void main(String[] args)
    {
        SpringApplication.run(ArlimsApplication.class, args);
    }

    // We assume resources that are not found are caused by deep links into the client app making it here to the server,
    // either because the app isn't running yet (from the use of a stashed url for example) or the browser page is being
    // force refreshed. So we send index.html for resources that aren't found, to start the client app and let it try to
    // interpret the link once it's started.
    @Bean
    ErrorViewResolver serveAppHtmlMissingResources()
    {
        return (request, status, model) -> status == HttpStatus.NOT_FOUND
            ? new ModelAndView("index.html", Collections.emptyMap(), HttpStatus.OK)
            : null;
    }
}
