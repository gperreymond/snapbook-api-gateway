"use strict";

var http_request = require('request');

var Joi = require('joi');

var host = process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_ADDR || 'localhost';
var port = process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_PORT || 10102;
var uri = 'http://'+host+':'+port;

exports.read = {
  auth: false,
  tags: ['api', 'patterns'],
  description: 'Retourne les détails d\'un pattern.',
  notes: 'Retourne les détails d\'un pattern.',
  validate: {
    params: {
      id: Joi.string().required().description('ID du pattern')
    }
  },
  handler: function(request, reply) {
    http_request
    .get( uri+'/patterns/'+request.params.id, function(error, response, body) {
      if (error && error.code=='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};