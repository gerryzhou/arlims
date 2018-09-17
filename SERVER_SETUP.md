# Install Java

    sudo su -
    yum install java-1.8.0-openjdk

# Create user alis.

    # sudo su -
    adduser alis --system -s /bin/false

# Setup application directory

    # sudo su -
    # Copy alis-dist.tgz from somewhere into /u01/LIMS_APi/.
    cd /u01/LIMS_APi
    tar xzvf alis-dist.tgz
    chown -R alis.alis alis/

Edit application.properties to customize the app for its environment.
Specify database connection information, file paths etc.
    
    sudo -u alis bash
    vim application.properties

The application should now be able to be started, as a trial run, via:

    # sudo -u alis bash
    java -jar alis.jar

or 

    java -jar <context>.jar

if it was built with a custom context name.

# Systemd setup
Review alis.service to verify paths are correct for the host system, then copy
into the systemd system directory:

    sudo su -
    cp alis.service /etc/systemd/system
    
    systemctl daemon-reload
    systemctl start alis
    # Start at boot time automatically.
    systemctl enable alis

Check status:

    systemctl status alis

