# DOCKER IMAGE

FROM scratch
MAINTAINER Snapbook Labs <gperreymond@gmail.com>

# PREPARE

COPY . /
RUN cd /; npm install

USER app

EXPOSE 3000


