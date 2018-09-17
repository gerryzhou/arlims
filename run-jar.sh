#!/bin/sh
mvn clean package &&
cp ~/Programming/etc/test-configs/alis/* target/ &&
(cd target; java -jar alis.jar --APP_DIR=.)
