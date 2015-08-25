# DOCKER IMAGE

FROM snapbook/node:onbuild
MAINTAINER Snapbook Labs <gperreymond@gmail.com>

# PREPARE

COPY . /
RUN cd /; npm install

USER app

EXPOSE 3000


