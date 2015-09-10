# Pull base image from stock node image.
FROM node:0.12.7-slim

# Maintainer
MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

# Add the current working folder as a mapped folder at /usr/src/app
COPY ./package.json /usr/src/app/package.json
COPY ./app-docker.json /usr/src/app/app-docker.json
COPY ./src /usr/src/app

# Set the current working directory to the new mapped folder.
WORKDIR /usr/src/app

# Install global's dependencies
RUN npm install -g pm2

# Install application's dependencies
RUN npm install

# Expose port
EXPOSE  9000
