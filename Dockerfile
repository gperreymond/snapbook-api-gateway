# Pull base image from stock node image.
FROM node:4.1.2

# Maintainer
MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

# Add the current working folder as a mapped folder at /app
COPY ./newrelic.js /app/newrelic.js
COPY ./package.json /app/package.json
COPY ./src /app

# Set the current working directory to the new mapped folder.
WORKDIR /app

# Install application's dependencies
RUN npm install --production
RUN npm install newrelic

# Running
CMD node .