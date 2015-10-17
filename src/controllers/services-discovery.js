'use-strict';

var http_request = require('request');

var host_data = process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_ADDR || 'localhost';
var port_data = process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_PORT || 10102;
var uri_data = 'http://'+host_data+':'+port_data;

var host_slack = process.env.SNAPBOOK_MICROSERVICE_SLACK_B94DAC70_PORT_10101_TCP_ADDR || 'localhost';
var port_slack = process.env.SNAPBOOK_MICROSERVICE_SLACK_B94DAC70_PORT_10101_TCP_PORT || 10101;
var uri_slack = 'http://'+host_slack+':'+port_slack;

exports.data_alive = {
  auth: false,
  tags: ['api', 'microservices'],
  description: 'Tester si le microservice /data/ est en vie ou pas.',
  notes: 'Tester si le microservice /data/ est en vie ou pas.',
  handler: function(request, reply) {
    http_request
    .get( uri_data+'/alive', function(error, response, body) {
      if (error && error.code=='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};

exports.slack_alive = {
  auth: false,
  tags: ['api', 'microservices'],
  description: 'Tester si le microservice /slack/ est en vie ou pas.',
  notes: 'Tester si le microservice /slack/ est en vie ou pas.',
  handler: function(request, reply) {
    http_request
    .get( uri_slack+'/alive', function(error, response, body) {
      if (error && error.code=='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};
