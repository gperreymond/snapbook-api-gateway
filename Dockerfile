# DOCKER IMAGE

FROM snapbook/node:onbuild
MAINTAINER Snapbook Labs <gperreymond@gmail.com>

# PREPARE

RUN npm install

USER app

EXPOSE 8080
