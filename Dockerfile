FROM node:onbuild
MAINTAINER Snapbook Labs <gperreymond@gmail.com>

RUN npm install -g pm2 
RUN useradd -m app && chown app:app . -R

RUN  mkdir /dsi && chown app:app /dsi
RUN  mkdir /dsi/logs && chown app:app /dsi/logs

VOLUME [ "/dsi/logs" ]

USER app

RUN npm install

EXPOSE  8080
