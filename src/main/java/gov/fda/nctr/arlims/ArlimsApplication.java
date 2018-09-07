package gov.fda.nctr.arlims;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
public class ArlimsApplication
{
    public static void main(String[] args)
    {
        SpringApplication.run(ArlimsApplication.class, args);
    }
}
