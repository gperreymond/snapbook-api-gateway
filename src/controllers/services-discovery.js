"use strict";

var http_request = require('request');

var uri_data = process.env.SNAPBOOK_MICROSERVICE_DATA_URI || 'http://localhost:10102';
var uri_opencv = process.env.SNAPBOOK_MICROSERVICE_OPENCV_URI || 'http://localhost:10101';

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
