# Running the app in development

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

## Running from jar in development

    mvn clean package
    # Get the application properties from somewhere, to provide db connect info etc.
    cp ~/Programming/etc/test-configs/alis/application-dev.properties target/application.properties
    cd target
    java -jar alis.jar


# Building and deploying for production

## Building a complete production package

Build production jar file with default context name of "alis":

    mvn clean package
    
This will produces a package target/alis-dist.tgz with everything
needed for transfer to a server.

## Running in a standalone/embedded Tomcat container

After the tgz package produced above is unzipped, the `application.properties`
file in the `alis` directory from the package should be customized for the server
environment. The entries marked ADJUST at least should be customized. The app
can then be run from the `alis` directory via

    java -jar alis.jar
    
and accessed at
 
    http://localhost:8080/alis

The above command can be incorporated into a Systemd config file to start the
application automatically as a service on system boot.

To run under a different context in an embedded Tomcat container, the app must
be built with the custom context specified:
    
    mvn -DCONTEXT_NAME=alis-proto clean package

and then run with the server.servlet.contextpath property specified:
    
    java -jar alis-proto.jar --server.servlet.contextpath=//alis-proto
    
(The extra extra '/' in "//alis-proto" is to prevent some Bash environments on
Windows from mangling the path.)

In this case the application would be accessed at
    
    http://localhost:8080/alis-proto

