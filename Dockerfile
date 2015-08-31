# Pull base image from stock node image.
FROM node:0.12.6

# Maintainer
MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

# Add the current working folder as a mapped folder at /usr/src/app
ADD src /usr/src/app
ADD package.json /usr/src/app

# Set the current working directory to the new mapped folder.
WORKDIR /usr/src/app

# Install your application's dependencies
RUN npm install

# This is the stock express binary to start the app.
CMD ["/bin/bash"]
