# Build the docker image with given application jar file (post-build).
```
sudo ./build-image.sh ../../target/alis.jar
```

# Run the image with given application properties.
These are the usual Spring application properties for the target environment.
```
sudo ./run-image.sh /home/sharris/Programming/envs/alis/test.application.properties
```

# Inspect the container.
```
sudo docker inspect alis-web
```

# Inspect I/O volume area holding logs etc which survive container shutdown.
This will show the host's path to the volume data.
```
sudo docker volume inspect alis-web-io
```

# Stop the container.
```
sudo docker container stop alis-web
```

# Remove the container.
```
sudo docker container rm alis-web
```

# Remove all stopped containers.
```
sudo docker rm $(sudo docker ps -a -q)
```

