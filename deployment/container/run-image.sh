#!/bin/bash

# Example:
# sudo ./run-image.sh ~/Programming/envs/alis/test.application.properties

set -e

die () {
    echo >&2 "$@"
    exit 1
}

[[ "$#" -eq 1 ]] || die "Expected argument: <application properties environment file>."
ENVFILE="$1"
[[ -f  "$ENVFILE" ]] || die "Application properties environment file not found."

# The Oracle jdbc driver needs timezone to be defined.
export TZ=UTC

# sudo docker run \
podman run \
  --name alis-web \
  -v alis-web-io:/var/alis \
  -e TZ \
  --env-file "$ENVFILE" \
  -p 8080:8080 \
  localhost/alis-web:latest
