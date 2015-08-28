FROM snapbook/nodejs
MAINTAINER Snapbook Labs <gperreymond@gmail.com>

ADD start.sh /tmp/
RUN chmod +x /tmp/start.sh
CMD ./tmp/start.sh
