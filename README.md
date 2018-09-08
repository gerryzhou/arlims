# Building a complete production package

Build production jar file with default context name of "alis".

    mvn package

This produces target/alis.jar.

# Build jar file with custom context name.

    mvn -DCONTEXT_NAME=alis-proto clean package

The above produces file `target/alis-proto.jar` with a bundled client expecting
to find resources and the application api under that context name from the
server root.

# Running in a standalone/embedded Tomcat container

Make a prod application properties file using 
`src/main/resources/application-prod.properties.template` as a template. Items
that need adjustment are marked `ADJUST-THIS` in the template file. Store the
file in the same directory as the production jar file.

Example run:

    cd target
    # Get the prod config file from somewhere, put it next to the jar file.
    cp ~/Programming/etc/test-configs/alis/application.properties ./application.properties
    java -jar alis.jar

Access at
 
    http://localhost:8080/alis

To run under a different context in an embedded Tomcat container,  build with
the custom context specified:
    
    mvn -DCONTEXT_NAME=alis-proto clean package

Then run with the server.servlet.contextpath property specified:
    
    java -jar alis-proto.jar --server.servlet.contextpath=//alis-proto
    
(The extra extra '/' in "//alis-proto" is to prevent some Bash environments on Windows from mangling the path.)

In this case the application would be accessed at
    
    http://localhost:8080/alis-proto


# Development

Front end resources and backend services are served via separate servers for development.

## Start backend services, terminal 1
```
mvn spring-boot:run
```

Runs with context name "alis", http://localhost:8080/alis/api/...

## Start frontend app, terminal 2
```
cd client
npm start
```
The above executes `ng serve` with extra configuration to forward /api/* requests
to the backend started in terminal 1. Hotloading is enabled. The app can be
accessed in the browser at `localhost:4200`.

