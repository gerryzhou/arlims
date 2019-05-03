#!/bin/sh

# Build alis-web Docker image for given application jar file.
# Example:
# sudo ./build-image.sh ../../target/alis.jar

set -e

die () {
    echo >&2 "$@"
    exit 1
}

[[ "$#" -eq 1 ]] || die "Expected argument: <application jar file>."
[[ -f  "$1" ]] || die "Application jar file not found."
APP_JAR="$1"

SCRIPT_DIR="$(dirname "$(realpath "$0")")"
PROJECT_DIR=$(realpath "$SCRIPT_DIR"/../..)

echo Building Docker image with project directory: "$PROJECT_DIR"

cp "$APP_JAR" "$PROJECT_DIR"/deployment/container/context/build-artifacts/alis.jar

podman build -t alis-web:latest "$SCRIPT_DIR"/context

