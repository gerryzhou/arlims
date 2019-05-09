package gov.fda.nctr.arlims.data_access;

import javax.sql.DataSource;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.support.lob.DefaultLobHandler;
import org.springframework.jdbc.support.lob.LobHandler;


@Configuration
public class DatabaseConfig
{
    protected final Logger log = LoggerFactory.getLogger(this.getClass());

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

    public enum DatabaseType {
        POSTGRESQL,
        ORACLE,
        OTHER
    }

    @Bean @Primary
    public DataSource primaryDataSource()
    {
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

    public DatabaseType getPrimaryDatabaseType()
    {
        if ( driverClassName.startsWith("org.postgresql.") )
            return DatabaseType.POSTGRESQL;
        else if ( driverClassName.startsWith("oracle.") )
            return DatabaseType.ORACLE;
        else
            return DatabaseType.OTHER;
    }

    public DatabaseUnqoatedIdentifierStorage getPrimaryDatabaseUnquotedIdentifierStorage()
    {
        switch ( getPrimaryDatabaseType() )
        {
            case POSTGRESQL: return DatabaseUnqoatedIdentifierStorage.LOWERCASE;
            case ORACLE:     return DatabaseUnqoatedIdentifierStorage.UPPERCASE;
            default: throw new RuntimeException("Database unquoted identifier setting needs to be configured.");
        }
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

    public LobHandler makePrimaryDatabaseLobHandler()
    {
        DefaultLobHandler lobHandler = new DefaultLobHandler();

        switch ( getPrimaryDatabaseType() )
        {
            case POSTGRESQL:
                lobHandler.setWrapAsLob(true);
                break;
            case ORACLE:
                lobHandler.setStreamAsLob(true);
                break;
        }

        return lobHandler;
    }
}
