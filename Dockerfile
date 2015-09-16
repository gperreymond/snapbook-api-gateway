# Pull base image from stock node image.
FROM node:0.12.7-slim

# Maintainer
MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

# Add the current working folder as a mapped folder at /usr/src/app
COPY ./package.json /usr/src/app/package.json
COPY ./src /usr/src/app

# Set the current working directory to the new mapped folder.
WORKDIR /usr/src/app

# Install application's dependencies
RUN npm install

# Expose port
EXPOSE  80

# Running

CMD node .
