# DOCKER IMAGE

FROM scratch
MAINTAINER Snapbook Labs <gperreymond@gmail.com>

# PREPARE

COPY src/ /app/
COPY package.json /app/
WORKDIR /app/
RUN npm install

# END

EXPOSE 8080
ENTRYPOINT ["/snapbook-api-gateway"]


