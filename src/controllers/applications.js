"use strict";

var http_request = require('request');

var Joi = require('joi');

var host = process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_ADDR || 'localhost';
var port = process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_PORT || 10102;
var uri = 'http://'+host+':'+port;

exports.list = {
  auth: false,
  tags: ['api', 'applications'],
  description: 'Retourne la liste des applications.',
  notes: 'Retourne la liste des applications.',
  handler: function(request, reply) {
    http_request
    .get( uri+'/applications', function(error, response, body) {
      if (error && error.code=='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};

exports.read = {
  auth: false,
  tags: ['api', 'applications'],
  description: 'Retourne les détails d\'une application.',
  notes: 'Retourne les détails d\'une application.',
  validate: {
    params: {
      id: Joi.string().required().description('ID de l\'application')
    }
  },
  handler: function(request, reply) {
    http_request
    .get( uri+'/applications/'+request.params.id, function(error, response, body) {
      if (error && error.code=='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};