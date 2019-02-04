#!/bin/sh
set -e -x

DIST="/home/ad_app_s.harris/alis-dist.tgz"
LIMS_HOME="/u01/LIMS_APi"
PROPS="$LIMS_HOME/backups/application.properties"
ALIS_HOME="$LIMS_HOME/alis"

systemctl stop alis

cd "$LIMS_HOME"
tar xzvf "$DIST"
cp "$PROPS" alis/
chown -R alis.alis alis/

systemctl start alis

tail -f "$LIMS_HOME/alis/logs/alis.log"
