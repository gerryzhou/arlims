#!/bin/sh
mvn clean package &&
cp ~/Programming/etc/test-configs/alis/application-dev.properties target/application.properties &&
(cd target; java -jar alis.jar)