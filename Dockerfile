# DOCKER IMAGE

FROM scratch
MAINTAINER Snapbook Labs <gperreymond@gmail.com>

# PREPARE

COPY snapbook-api-gateway /
COPY dist /

EXPOSE 8080
ENTRYPOINT ["/snapbook-api-gateway"]


