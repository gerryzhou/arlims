# Dev/Test Server Access
Login to Citrix via alt-PIV card at:

    https://citrixaccess.fda.gov/Citrix/PRIVUSERSWeb/default.htm

Navigate into WODC-MGMT and open WinSCP.
In options -> preferences -> Environment -> Interface, choose dual pane layout.
In local (left) pane, select the drive for the local workstation (running the
Citrix client), navigate to the dist file for the application as produced by 

    mvn clean package
    
and drag the dist file from the target directory onto the right (remote) pane
to transfer it to your home directory on the server.

# Install Java

    sudo su -
    yum install java-1.8.0-openjdk

# Create user alis.

    # sudo su -
    adduser alis --system -s /bin/false

# Setup application directory

    # sudo su -
    cp ~ad_app_<you>/alis-dist.tgz /u01/LIMS_APi 
    cd /u01/LIMS_APi
    # Stop the service if it's already deployed and running, maybe make a backup 
    # copy of the existing properties file.
    # systemctl stop alis.service
    # cp alis/application.properties backups/
    tar xzvf alis-dist.tgz
    chown -R alis.alis alis/

Edit application.properties to customize the app for its environment.
Specify database connection information, file paths etc.
    
    sudo -u alis bash
    vim application.properties

Or merge/copy property values from a backup copy of the properties (watch for
new properties in application.properties from the distribution package):

    cp backups/application.properties alis/
    

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


# Redeployment to dev server

Build via `mvn clean package`.

Start WinSCP in Citrix.

Choose local drive in left pane, navigate to dist file in project's `target/`
directory, drag to right pane to transfer to server.

Start Putty via Citrix, select server and login.

    # sudo su -
    cp ~ad_app_<you>/alis-dist.tgz /u01/LIMS_APi 
    cd /u01/LIMS_APi
    systemctl stop alis
    # rm alis/logs/*.log
    # cp alis/application.properties backups/
    tar xzvf alis-dist.tgz
    cp backups/application.properties alis/
    chown -R alis.alis alis/
    systemctl start alis
    # tail -f alis/alis.log
    
