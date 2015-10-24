"use strict";

var http_request = require('request');
var dir = require('node-dir');
var async = require('async');

var Joi = require('joi');
var Boom = require('boom');

var host_data = process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_ADDR || 'localhost';
var port_data = process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_PORT || 10102;
var uri_data = 'http://'+host_data+':'+port_data;

var host_opencv = process.env.SNAPBOOK_MICROSERVICE_OPENCV_022F4E17_PORT_10101_TCP_ADDR || 'localhost';
var port_opencv = process.env.SNAPBOOK_MICROSERVICE_OPENCV_022F4E17_PORT_10101_TCP_PORT || 10101;
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

exports.batch = {
  auth: false,
  tags: ['api', 'applications'],
  description: 'Compute tous les patterns d\'une application pour extraire les keypoints et les descriptors.',
  notes: 'Compute tous les patterns d\'une application pour extraire les keypoints et les descriptors.',
  validate: {
    params: {
      id: Joi.string().required().description('ID du l\'application')
    }
  },
  handler: function(request, reply) {
    // list all directory patterns
    var volumes_applications = process.env.SNAPBOOK_API_GATEWAY_VOLUMES_APPLICATIONS || '/home/ubuntu/workspace/applications';
    dir.readFiles(volumes_applications+'/'+request.params.id+'/patterns', {
      match: /.jpg$/,
      exclude: /^\./
    }, function(err, content, next) {
      if (err) return reply(Boom.badImplementation());
      next();
    },
    function(err, files){
      if (err) return reply(Boom.badImplementation());
      // run all single computing processes
      async.mapLimit(files, 10, 
        function(item, cb) {
          var payload = {
            filepath: item
          };
          http_request.post( uri_opencv+'/compute', { form: payload }, function(error, response, body) {
            if (error) return cb(error, null);
            cb(null, body);
          });
        }, function(err, results) {
          if (err && err.code==='ECONNREFUSED') return reply({alive:false});
          if (err) return reply(Boom.badImplementation());
          reply(results);
        }
      );
    });
    
    /**http_request.post( uri_opencv+'/compute', { form: request.payload }, function(error, response, body) {
      if (error && error.code==='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });**/
  }
};