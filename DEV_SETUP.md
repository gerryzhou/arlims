Add development database and api information in ~/.spring-boot-devtools.properties:
```
arlims.db.primary.driverClassName=oracle.jdbc.OracleDriver
arlims.db.primary.jdbcUrl=jdbc:oracle:thin:@myhost.mydomain:1234:mysid
arlims.db.primary.username=myschema
arlims.db.primary.password=mypass

# facts api credentials for the app
facts.api.app-oid-username=...
facts.api.app-oid-password=...
facts.api.base-url=http://myapihost/LabsDataService/api/
```

If using Oracle database, install Oracle jdbc driver jar file in your local Maven repository:
```
# download ojdbc8.jar into some directory (/mydownloads for example here), then:
mvn install:install-file -Dfile=/mydownloads/ojdbc8.jar -Dpackaging=jar -DgroupId=com.oracle -DartifactId=ojdbc8 -Dversion=12.2.0.1
```
(A driver for PostgresSQL is already included in the project's dependencies.)

