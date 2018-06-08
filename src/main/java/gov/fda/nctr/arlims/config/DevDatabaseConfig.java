package gov.fda.nctr.arlims.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;


@Configuration
@Profile("dev")
public class DevDatabaseConfig
{
    @Value("${arlims-dev.db.primary.driverClassName}")
    private String driverClassName;

    @Value("${arlims-dev.db.primary.jdbcUrl}")
    private String url;

    @Value("${arlims-dev.db.primary.username}")
    private String username;

    @Value("${arlims-dev.db.primary.password}")
    private String password;


    @Bean @Primary
    public DataSource primaryDataSource() {
        return
            DataSourceBuilder.create()
            .driverClassName(driverClassName)
            .url(url)
            .username(username)
            .password(password)
            .build();
    }
}
