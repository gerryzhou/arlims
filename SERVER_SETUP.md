Tomcat/Centos Setup
-------------------
Need to control Tomcat's temp directory location, e.g. for file uploads and temp work files.
```
CATALINA_TMPDIR="/u01/lims-api/tmp"
sudo mkdir "$CATALINA_TMPDIR"
sudo chown tomcat.tomcat "$CATALINA_TMPDIR"
sudo chmod 755 "$CATALINA_TMPDIR"
```

In /etc/tomcat/tomcat.conf, edit CATALINA_TMPDIR line to be:
```
    CATALINA_TMPDIR="/u01/lims-api/tmp"
```
