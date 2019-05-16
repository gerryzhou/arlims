Java 11+ and Maven 3.5+ should be installed on the developer's build machine.
If multiple Java runtimes/jdk's are installed, then for the sake of Maven it's
helpful to set JAVA_HOME to the Java 11 jdk directory.

File dev-config/env-props.zip should be unzipped in the same directory (requires
password). This will populate an env-props directory in dev-config/ with
subdirectories for various runtime scenarios, including property files with
database and FACTS api server connect information and credentials. A 
runConfigurations directory is also provided which Intellij IDEA users can copy
into the .idea/ directory to setup launchers for the application in IDEA which 
reference the property files in dev-config.

The dev-config/ directory also includes "...-container" directories allowing the 
app to be run in a Linux container.  A full package build on Linux is
necessary before running the app this way, to register the container image locally.
See the main README.md for build instructions.

[IntelliJ IDEA]
  Add ojdbc8.jar as library for the Arlims module in Project Structure -> Libraries.
  This is needed for the Oracle run configurations in IDEA.

Nodejs should be installed for running the app in development with live reload capability.

If building for Oracle database (mvn -P oracle-jdbc ...) , download and install
Oracle jdbc driver jar file in your local Maven repository:
```
# download ojdbc8.jar into some directory (/mydownloads for example here), then:
mvn install:install-file -Dfile=/mydownloads/ojdbc8.jar -Dpackaging=jar -DgroupId=com.oracle -DartifactId=ojdbc8 -Dversion=12.2.0.1
```
(A driver for PostgresSQL is already included in the project's dependencies.)

