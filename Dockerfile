# Pull base image from stock node image.
FROM node:0.12.6

# Maintainer
MAINTAINER Gilles Perreymond <gperreymond@gmail.com>

# Add the current working folder as a mapped folder at /usr/src/app
COPY ./package.json /usr/src/app/package.json
COPY ./src /usr/src/app

# Set the current working directory to the new mapped folder.
WORKDIR /usr/src/app

# Install application's dependencies
RUN npm install -g pm2
RUN npm install

# Expose port
EXPOSE  9000

# Run app using node
CMD ["pm2", "Dockerfile.pm2"]
