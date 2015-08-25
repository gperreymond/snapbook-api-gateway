# DOCKER IMAGE

FROM snapbook/node:onbuild
MAINTAINER Snapbook Labs <gperreymond@gmail.com>

# PREPARE

COPY . /src
RUN cd /src; npm install

USER app

EXPOSE 8080
