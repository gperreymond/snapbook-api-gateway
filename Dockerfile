# Pull base image from stock node image.
FROM node:0.12.6

# Maintainer
MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

# Add the current working folder as a mapped folder at /usr/src/app
COPY . /usr/src/app

# Set the current working directory to the new mapped folder.
WORKDIR /usr/src/app

# Install application's dependencies
RUN npm install

# This is the end.
CMD ["node", "index.js"]
