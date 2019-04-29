#!/bin/sh
# sudo ./build-image.sh

set -e

die () {
    echo >&2 "$@"
    exit 1
}

[[ "$#" -eq 1 ]] || die "expected version argument>"
VER="$1"

SCRIPT_DIR="$(dirname "$(realpath "$0")")"
PROJECT_DIR="$SCRIPT_DIR"/../..


cd "$PROJECT_DIR"

mvn clean package

cp target/alis.jar prod-deployment/dist-contents/logback-spring.xml \
  prod-deployment/docker/context/build-artifacts/

cd "$SCRIPT_DIR"

docker build -t "alis-web:$VER" -t alis-web:latest context
