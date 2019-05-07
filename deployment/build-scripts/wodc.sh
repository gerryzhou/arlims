#!/bin/bash

SCRIPT_DIR="$(dirname "$(realpath "$0")")"
PROJECT_DIR=$(realpath "$SCRIPT_DIR"/../..)

cd "$PROJECT_DIR"

# White Oak servers use Oracle database and have Java 8 runtime environments.
mvn -P oracle-jdbc -Djava.release=8 clean package
