# Production Build and Deployment

Java 11+ and Maven 3.5+ should be installed.

To build with defaults:
```
mvn clean package
```
The defaults are: PostgreSQL database, Java 11 runtime environment, and
the app mounted at servlet context '/alis' under the server root.

To build instead for java 8 runtime, set environment variable
```java.release``` to ```8``` (Java 11+ jdk still required on developer's 
machine to build).

To build for Oracle database, activate Maven profile ```oracle-jdbc```.

To mount the app at another context, set environment variable
```CONTEXT_NAME``` to the desired context.
```
mvn -DCONTEXT_NAME=alis-test -Djava.release=8 -P oracle-jdbc clean package
```

The above commands produce a distribution for the server in
```target/alis-dist.tgz``` which includes a Systemd service definition,
publication script, a template ```application.properties``` file, etc.
Usually only the ```application.properties``` file needs to be customized
to adapt the app for the server's environment. Pay particular attention to items marked
\[CUSTOMIZE\]. Put the ```application.propperties``` next to the application
jar file ```alis.jar``` on the server. Contents of this distribution are
located at ```deployment/system-service``` under the project root directory.

Scripts to build for the app's usual environments can be found in
```deployment/build-scripts```.

## Running in a standalone/embedded Tomcat container
The  distribution produced above is intented to be run directly via java:
```
    java -jar alis.jar
```
    
and then accessed at ```http://<server>:8080/<context-name>``` with the
default context name being ```alis```.

The above application start command is incorporated into the provided
Systemd unit file. See ```SERVER_SETUP.md``` for details about installing 
the application.  If the servlet context at which the app is to be mounted
was customized in the build step, then set property
```server.servlet.contextpath``` in ```application.properties```
accordingly.

## Docker / Podman Build and Deployment
Additionally, after building as above, a Docker / Podman (OCI) image can
be built and run via scripts provided in ```deployment/containter```. The 
```application.properties``` in ```system-service/dist-contents``` also
contains notes marked \[DOCKER\] as guidance to adjust properties for
container deployment. The ```run-image.sh``` script expects such a
customized ```application.properties``` to be provided as a command line
argument.


# Running the app in development

Front end resources and backend services are served via separate servers for development.

## Start backend services, terminal 1
```
mvn spring-boot:run
```
for a Postgres database,
or
```
mvn -P oracle-jdbc spring-boot:run
```
if using an Oracle database. The above run with Spring profile ```dev```
active. Connection properties for either should be setup in file 
```~/.spring-boot-devtools.properties```, see ```DEV_SETUP.md``` for
details.

Runs with context name "/alis", http://localhost:8080/alis/api/...

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

# Updating Maven Dependencies
View updatable Maven plugins:
```
mvn versions:display-plugin-updates
```
View updatable dependencies:
```
mvn versions:display-dependency-updates
```

