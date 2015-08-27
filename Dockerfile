# DOCKER IMAGE

FROM scratch
MAINTAINER Snapbook Labs <gperreymond@gmail.com>

# PREPARE

COPY src /

EXPOSE 8080
ENTRYPOINT ["/snapbook-api-gateway"]


