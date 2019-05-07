package gov.fda.nctr.arlims.data_access;

import javax.sql.DataSource;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.datasource.lookup.JndiDataSourceLookup;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Configuration
@Profile({"!test"})
public class DatabaseConfig
{
    protected final Logger log = LoggerFactory.getLogger(this.getClass());

    @Value("${db.primary.jndi-name:#{null}}")
    private String primaryJndiName;

    @Value("${arlims.db.primary.driverClassName:#{null}}")
    private String driverClassName;

    @Value("${arlims.db.primary.jdbcUrl:#{null}}")
    private String url;

    @Value("${arlims.db.primary.username:#{null}}")
    private String username;

    @Value("${arlims.db.primary.password:#{null}}")
    private String password;

    public enum DatabaseUnqoatedIdentifierStorage {
        UPPERCASE,
        LOWERCASE,
        MIXED
    }

    @Bean @Primary
    public DataSource primaryDataSource()
    {
        if ( primaryJndiName != null )
        {
            log.info("Using JNDI name " + primaryJndiName + " for primary data source.");

            JndiDataSourceLookup dsLookup = new JndiDataSourceLookup();
            return dsLookup.getDataSource(primaryJndiName);
        }
        else
        {
            log.info("No JNDI name configured for primary data source, using individual connection properties instead.");

            if ( driverClassName == null || url == null || username == null || password == null )
                throw new RuntimeException("One or more of the required prod database connection properties were not found.");

            return
                DataSourceBuilder.create()
                .driverClassName(driverClassName)
                .url(url)
                .username(username)
                .password(password)
                .build();
        }
    }

    public DatabaseUnqoatedIdentifierStorage getPrimaryDatabaseUnquotedIdentifierStorage()
    {
        if ( driverClassName.startsWith("org.postgresql.") )
            return DatabaseUnqoatedIdentifierStorage.LOWERCASE;
        else if ( driverClassName.startsWith("oracle.") )
            return DatabaseUnqoatedIdentifierStorage.UPPERCASE;
        else
            throw new RuntimeException("TODO: Database unquoted identifier setting needs to be configured.");
    }

    public String normalizePrimaryDatabaseIdentifier(String ident)
    {
        switch ( getPrimaryDatabaseUnquotedIdentifierStorage() )
        {
            case LOWERCASE: return ident.toLowerCase();
            case UPPERCASE: return ident.toUpperCase();
            default: return ident;
        }
    }


}
