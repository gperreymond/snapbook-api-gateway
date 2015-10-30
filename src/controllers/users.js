"use strict";

var Joi = require('joi');
var http_request = require('request');

var uri_data = process.env.SNAPBOOK_MICROSERVICE_DATA_URI || 'http://localhost:10102';

exports.auth_local = {
  auth: false,
  tags: ['api', 'users'],
  description: 'contrôle de l\'authentification.',
  notes: 'contrôle de l\'authentification.',
  validate: {
    payload: {
      email: Joi.string().email().required().description('Email de l\'utilisateur'),
      password: Joi.string().required().description('Mot de passe de l\'utilisateur')
    }
  },
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  handler: function(request, reply) {
    http_request.post( uri_data+'/auth/local', { form: request.payload }, function(error, response, body) {
      if (error && error.code==='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};