#!/bin/sh
# sudo ./build-image.sh

set -e

die () {
    echo >&2 "$@"
    exit 1
}

[[ "$#" -eq 0 ]] || die "expected no arguments>"

SCRIPT_DIR="$(dirname "$(realpath "$0")")"
PROJECT_DIR="$SCRIPT_DIR"/../..


cd "$PROJECT_DIR"
echo project directory: "$PROJECT_DIR"

echo TODO RE-ENABLE mvn clean package

cp target/alis.jar deployment/dist-contents/logback-spring.xml \
  deployment/docker/context/build-artifacts/

cd "$SCRIPT_DIR"

docker build -t alis-web:latest context
