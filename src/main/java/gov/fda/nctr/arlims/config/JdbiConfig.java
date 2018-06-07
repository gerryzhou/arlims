package gov.fda.nctr.arlims.config;

import org.jdbi.v3.core.Jdbi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;


@Configuration
public class JdbiConfig
{
    @Bean
    Jdbi jdbi(DataSource ds)
    {
        return Jdbi.create(ds);
    }
}
