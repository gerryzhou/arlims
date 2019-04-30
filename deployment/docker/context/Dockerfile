FROM 11.0.3-jre-slim-stretch

RUN useradd --shell /bin/bash --user-group alis

USER alis

ENV ALIS_HOME=/home/alis

COPY --chown=alis:alis build-artifacts/alis.jar "$ALIS_HOME"
COPY --chown=alis:alis build-artifacts/logback-spring.xml "$ALIS_HOME"

ENV APP_IO_DIR=/var/alis
ENV LOG_PATH="${APP_IO_DIR}"/logs

RUN mkdir -p "${LOG_PATH}"
RUN chown -R alis.alis "${APP_IO_DIR}"

USER alis
WORKDIR "${ALIS_HOME}"

# TODO: CMD to start app via java -jar.
CMD=/bin/bash
