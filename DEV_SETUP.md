Download bootstrap.min.css and copy into the "client" subdirectory.
  https://getbootstrap.com/docs/4.0/getting-started/download/
Bootstrap is not declared via npm to avoid potentially including its js files in the produced package, which would conflict with ng-bootstrap (and increase the package size).

Add development database connect information in ~/.spring-boot-devtools.properties:
```
arlims-dev.db.primary.driverClassName=oracle.jdbc.OracleDriver
arlims-dev.db.primary.jdbcUrl=jdbc:oracle:thin:@myhost.mydomain:1234:mysid
arlims-dev.db.primary.username=myschema
arlims-dev.db.primary.password=mypass
```
