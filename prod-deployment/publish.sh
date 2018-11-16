#!/bin/sh
set -e -x

DIST="/home/ad_app_s.harris/alis-dist.tgz"
PROPS="/home/ad_app_s.harris/application.properties"
LIMS_HOME="/u01/LIMS_APi"
ALIS_HOME="$LIMS_HOME/alis"

systemctl stop alis

cd "$LIMS_HOME"
tar xzvf "$DIST"
cp "$PROPS" alis/
chown -R alis.alis alis/

systemctl start alis

echo "To monitor app startup: tail -f $LIMS_HOME/alis/logs/alis.log"