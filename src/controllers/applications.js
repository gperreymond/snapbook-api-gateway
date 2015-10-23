"use strict";

var http_request = require('request');

var Joi = require('joi');

var host_data = process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_ADDR || 'localhost';
var port_data = process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_PORT || 10102;
var uri_data = 'http://'+host_data+':'+port_data;

var host_opencv = process.env.SNAPBOOK_MICROSERVICE_OPENCV_XXX_PORT_10101_TCP_ADDR || 'localhost';
var port_opencv = process.env.SNAPBOOK_MICROSERVICE_OPENCV_XXX_PORT_10101_TCP_PORT || 10101;
var uri_opencv = 'http://'+host_opencv+':'+port_opencv;

exports.list = {
  auth: false,
  tags: ['api', 'applications'],
  description: 'Retourne la liste des applications.',
  notes: 'Retourne la liste des applications.',
  handler: function(request, reply) {
    http_request.get( uri_data+'/applications', function(error, response, body) {
      if (error && error.code==='ECONNREFUSED') return reply({alive:false});
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
    http_request.get( uri_data+'/applications/'+request.params.id, function(error, response, body) {
      if (error && error.code==='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};

exports.compare = {
  auth: false,
  tags: ['api', 'applications'],
  description: 'Lance la recherche d\'un pattern via un compare opencv sur le snap.',
  notes: 'Lance la recherche d\'un pattern via un compare opencv sur le snap.',
  validate: {
    params: {
      id: Joi.string().required().description('ID de l\'application')
    }
  },
  handler: function(request, reply) {
    http_request.get( uri_opencv+'/compare/'+request.params.id, function(error, response, body) {
      if (error && error.code==='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};