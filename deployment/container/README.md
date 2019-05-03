# Build the container image with given application jar file (post-build).
```
./build-image.sh ../../target/alis.jar
```

# Run the image with given application properties.
These are the usual Spring application properties for the target environment.
```
./run-image.sh /home/sharris/Programming/envs/alis/test.application.properties
```

# Inspect the container.
```
podman inspect alis-web
```

# Inspect I/O volume area holding logs etc which survive container shutdown.
This will show the host's path to the volume data.
```
podman volume inspect alis-web-io
```

# Stop the container.
```
podman container stop alis-web
```

# Remove the container.
```
podman container rm alis-web
```

# Remove all stopped containers.
```
podman rm $(podman ps -a -q)
```

