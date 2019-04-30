FROM openjdk:11.0.3-jre-slim-stretch

RUN useradd --shell /bin/bash --user-group --create-home alis

ENV ALIS_HOME=/home/alis

COPY build-artifacts/alis.jar "$ALIS_HOME"
COPY logback-spring.xml "$ALIS_HOME"

RUN chown -R alis.alis "$ALIS_HOME"

ENV APP_IO_DIR=/var/alis
RUN mkdir -p "$APP_IO_DIR"
RUN chown -R alis.alis "${APP_IO_DIR}"

USER alis
WORKDIR "${ALIS_HOME}"

ENTRYPOINT ["java", "-jar", "alis.jar"]
