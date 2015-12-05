"use strict";

var http_request = require('request');
var _ = require('lodash');
var dir = require('node-dir');
var async = require('async');
var uuid = require('uuid');
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');

var Joi = require('joi');
var Boom = require('boom');
var Q = require('q');

var uri_data = process.env.SNAPBOOK_MICROSERVICE_DATA_URL || 'http://localhost:10102';
var uri_opencv = process.env.SNAPBOOK_MICROSERVICE_OPENCV_URL || 'http://localhost:10101';

exports.create = {
  auth: false,
  tags: ['api', 'applications'],
  description: 'Créer une application.',
  notes: 'Créer une application.',
  validate: {
    payload: {
      name: Joi.string().required().description('Nom de l\'application'),
      description: Joi.string().description('Description de l\'application')
    }
  },
  payload: {
    allow: 'application/x-www-form-urlencoded',
  },
  handler: function(request, reply) {
    http_request.post( uri_data+'/applications', {form: request.payload}, function(error, response, body) {
      if (error && error.code==='ECONNREFUSED') return reply({alive:false});
      return reply(JSON.parse(body)).code(response.statusCode);
    });
  }
};

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
    },
    payload: Joi.object().required().keys({ 
      file: Joi.object().meta({ swaggerType: 'file' }).required().description('Snapfile à comparer'),
      mode: Joi.string().description('Déterminer le retour du compare, pattern par défaut')
    })
  },
  payload: {
    allow: 'multipart/form-data',
    output: 'stream'
  },
  handler: function (request, reply) {
    var onFail = false;
    prepareCompareHandler(request)
    .progress(function(progress) {
      console.log('Promise Progress', progress);
    })
    .fail(function(error) {
      console.log('Promise Fail', error);
      onFail = true;
    })
    .done(function(r) {
      console.log('Promise Done');
      if (onFail===true) {
        return reply(Boom.badImplementation());
      }
      request.payload.snap_filepath = r.snap_filepath;
      // run compare
      http_request.post( uri_opencv+'/compare/'+request.params.id, {form: request.payload}, function(error, response, body) {
        if (error && error.code==='ECONNREFUSED') return reply({alive:false});
        var compare_results = JSON.parse(body);
        var resmode;
        if ( _.isNull(request.payload.mode) || _.isUndefined(request.payload.mode) ) {
          resmode = 'pattern';
        } else {
          resmode = request.payload.mode;
          delete request.payload.mode;
        }
        var final_results;
        switch (resmode) {
          case 'pattern':
            final_results = _.pluck(_.sortByOrder(compare_results, 'good_matches', 'desc'), 'pattern');
            if ( _.isArray(final_results) && final_results.length>0 ) {
              http_request.get( uri_data+'/patterns/'+final_results[0], {form: request.payload}, function(error, response, body) {
                if (error && error.code==='ECONNREFUSED') return reply({alive:false});
                var final_results = JSON.parse(body);
                if (final_results._id) {
                  final_results = {
                    id: final_results._id,
                    name: final_results.name
                  };
                }
                return reply(final_results).code(response.statusCode);
              });
            } else {
              final_results = {};
              return reply(final_results);
            }
            break;
          case 'debug':
            reply(compare_results);
            break;
          default:
            reply(compare_results);
            break;
        }
      });
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
      id: Joi.string().required().description('ID de l\'application')
    }
  },
  handler: function(request, reply) {
    // list all directory patterns
    var volumes_applications = process.env.SNAPBOOK_VOLUMES_APPLICATIONS;
    var dir_path = path.normalize(volumes_applications+'/'+request.params.id+'/uploads'); 
    dir.readFiles( dir_path, {
      match: /.jpg$/,
      exclude: /^\./
    }, function(err, content, next) {
      next(err);
    },
    function(err, files) {
      if (err) {
        console.log(err);
        var boomError = Boom.create(400, err);
        return reply(boomError);
      }
      // run all single computing processes
      async.mapLimit(files, 5, 
        function(item, cb) {
          var payload = {
            filepath: item
          };
          http_request.post( uri_data+'/applications/'+request.params.id+'/batch/pattern', {form:payload}, function(error, response, body) {
            if (error) return cb(null, {item: item, compute: false});
            var r = JSON.parse(body);
            r.item = item;
            cb(null, r);
          });
        }, function(err, results) {
          if (err && err.code==='ECONNREFUSED') return reply({alive:false});
          if (err) return reply(Boom.badImplementation());
          reply(results);
        }
      );
    });
  }
};

function prepareCompareHandler(request) {
  return promisedCopyFileUpload(request)
  .then(function(filepath) {
    return filepath;
  });
}

function promisedCopyFileUpload(request) {
  
  return Q.Promise(function(resolve, reject, notify) {
    // prepare
    var name = uuid.v4()+'.jpg';
    var date = new Date();
    var year = date.getUTCFullYear();
    var month = ('0' + (date.getUTCMonth()+1)).slice(-2);
    var day = ('0' + (date.getUTCDate())).slice(-2);
    var volumes_applications = process.env.SNAPBOOK_VOLUMES_APPLICATIONS;
    var dir_path = path.normalize(volumes_applications+'/uploads/'+year+'/'+month+'/'+day); 
    fse.ensureDirSync(dir_path);
    // filecopy
    var data = request.payload;
    if (data.file) {
      var snap_filepath = path.normalize(dir_path+'/'+name);
      var file = fs.createWriteStream(snap_filepath);
      file.on('error', function (err) { 
        reject(err);
      });
      data.file.pipe(file);
      data.file.on('end', function (err) { 
        notify({ step:'Copy File Upload', filepath: snap_filepath });
        if (err) {
          reject(err);
        } else {
          var ret = {
            snap_filepath: snap_filepath
          };
          resolve(ret); 
        }
      });
    } else {
      reject('File is needed');
    }
  });
  
}