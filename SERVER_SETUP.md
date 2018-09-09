# Create user alis.

    sudo adduser alis --no-create-home
    
# Setup application directory
    sudo mkdir -p /u01/lims-api/
    # Copy alis-dist.tgz from somewhere into /u01/lims-api/.
    sudo chown alis.alis /u01/lims-api
    sudo -u alis bash
    cd /u01/lims-api/
    tar xzvf alis-dist.tgz
    chown -R alis.alis .

Edit application.properties to customize the app for its environment.
Specify database connection information, file paths etc.

The application should now be able to be started, as a trial run, via:

    java -jar alis.jar

or 

    java -jar <context>.jar

if it was built with a custom context name.

# Systemd setup
Review alis.service to verify paths are correct for the host system, then copy
into the systemd system directory:

    sudo cp alis.service /etc/systemd/system
    
    sudo systemctl daemon-reload
    sudo systemctl start alis
    # Start at boot time automatically.
    sudo systemctl enable alis

Check status:

    sudo systemctl status alis

