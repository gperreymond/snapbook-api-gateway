"use strict";

var http_request = require('request');

var host_data = process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_ADDR || 'localhost';
var port_data = process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_PORT || 10102;
var uri_data = 'http://'+host_data+':'+port_data;

var host_opencv = process.env.SNAPBOOK_MICROSERVICE_OPENCV_022F4E17_PORT_10101_TCP_ADDR || 'localhost';
var port_opencv = process.env.SNAPBOOK_MICROSERVICE_OPENCV_022F4E17_PORT_10101_TCP_PORT || 10101;
var uri_opencv = 'http://'+host_opencv+':'+port_opencv;

exports.data_alive = {
  auth: false,
  tags: ['api', 'microservices'],
  description: 'Tester si le microservice /data/ est en vie ou pas.',
  notes: 'Tester si le microservice /data/ est en vie ou pas.',
  handler: function(request, reply) {
    http_request.get( uri_data+'/alive', function(error, response, body) {
      if (error && error.code==='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};

exports.opencv_alive = {
  auth: false,
  tags: ['api', 'microservices'],
  description: 'Tester si le microservice /opencv/ est en vie ou pas.',
  notes: 'Tester si le microservice /opencv/ est en vie ou pas.',
  handler: function(request, reply) {
    http_request.get( uri_opencv+'/alive', function(error, response, body) {
      if (error && error.code==='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};
