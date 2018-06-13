package gov.fda.nctr.arlims.data_access.config;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.datasource.lookup.JndiDataSourceLookup;


@Configuration
@Profile("prod")
public class ProdDatabaseConfig
{
    @Value("${db.primary.jndi-name}")
    private String primaryJndiName;

    @Bean @Primary
    public DataSource primaryDataSource()
    {
        JndiDataSourceLookup dsLookup = new JndiDataSourceLookup();
        return dsLookup.getDataSource(primaryJndiName);
    }
}
