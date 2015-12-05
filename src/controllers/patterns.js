"use strict";

var http_request = require('request');

var Joi = require('joi');

var uri_data = process.env.SNAPBOOK_MICROSERVICE_DATA_URL || 'http://localhost:10102';
var uri_opencv = process.env.SNAPBOOK_MICROSERVICE_OPENCV_URL || 'http://localhost:10101';

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

exports.create = {
  auth: false,
  tags: ['api', 'patterns'],
  description: 'Crée un nouveau pattern.',
  notes: 'Crée un nouveau pattern.',
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  validate: {
    payload: {
      name: Joi.string().required().description('Nom du pattern'),
      description: Joi.string().description('Description du pattern')
    }
  },
  handler: function(request, reply) {
    http_request.post( uri_data+'/patterns', { form: request.payload }, function(error, response, body) {
      if (error && error.code==='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};

exports.update = {
  auth: false,
  tags: ['api', 'patterns'],
  description: 'Compute un pattern pour extraire les keypoints et les descriptors.',
  notes: 'Compute un pattern pour extraire les keypoints et les descriptors.',
  validate: {
    params: {
      id: Joi.string().required().description('ID du pattern')
    },
    payload: Joi.object().keys({ file: Joi.object().meta({ swaggerType: 'file' }).required().description('Pattern file to compute') })
  },
  payload: {
    allow: 'multipart/form-data',
    output: 'stream'
  },
  handler: function(request, reply) {
    http_request.post( uri_opencv+'/compute', { form: request.payload }, function(error, response, body) {
      if (error && error.code==='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};