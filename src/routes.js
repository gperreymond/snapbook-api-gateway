'use-strict';

var VolumesController = require('./controllers/volumes');
var DiscoveryController = require('./controllers/services-discovery');
var ApplicationsController = require('./controllers/applications');
var PatternsController = require('./controllers/patterns');

exports.endpoints = [
  // volumes
  { method: 'GET', path: '/media/{param*}', config: VolumesController.media},
  // microservices
  { method: 'GET', path: '/microservices/opencv/alive', config: DiscoveryController.opencv_alive},
  { method: 'GET', path: '/microservices/data/alive', config: DiscoveryController.data_alive},
  // applications
  { method: 'GET', path: '/applications', config: ApplicationsController.list},
  { method: 'GET', path: '/applications/{id}', config: ApplicationsController.read},
  // patterns
  { method: 'GET', path: '/patterns/{id}', config: PatternsController.read},
];