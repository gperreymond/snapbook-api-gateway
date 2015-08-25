# DOCKER IMAGE

FROM snapbook/node:onbuild
MAINTAINER Snapbook Labs <gperreymond@gmail.com>

# PREPARE

USER app
COPY . /src
RUN cd /src; npm install

EXPOSE 8080
