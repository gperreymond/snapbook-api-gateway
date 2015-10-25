"use strict";

var http_request = require('request');

var Joi = require('joi');

var host_data = process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_ADDR || 'localhost';
var port_data = process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_PORT || 10102;
var uri_data = 'http://'+host_data+':'+port_data;

var host_opencv = process.env.SNAPBOOK_MICROSERVICE_OPENCV_022F4E17_PORT_10101_TCP_ADDR || 'localhost';
var port_opencv = process.env.SNAPBOOK_MICROSERVICE_OPENCV_022F4E17_PORT_10101_TCP_PORT || 10101;
var uri_opencv = 'http://'+host_opencv+':'+port_opencv;

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
    http_request.get( uri_data+'/patterns/'+request.params.id, function(error, response, body) {
      if (error && error.code==='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};

exports.compute = {
  auth: false,
  tags: ['api', 'patterns'],
  description: 'Compute un pattern pour extraire les keypoints et les descriptors.',
  notes: 'Compute un pattern pour extraire les keypoints et les descriptors.',
  validate: {
    params: {
      id: Joi.string().required().description('ID du pattern')
    },
    payload: {
      filepath: Joi.string().required().description('chemin du fichier à compute')
    }
  },
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  handler: function(request, reply) {
    http_request.post( uri_opencv+'/compute', { form: request.payload }, function(error, response, body) {
      if (error && error.code==='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};