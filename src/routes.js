"use strict";

var StaticDirectoryController = require('./controllers/static-directory');
var DiscoveryController = require('./controllers/services-discovery');
var ApplicationsController = require('./controllers/applications');
var PatternsController = require('./controllers/patterns');
var UsersController = require('./controllers/users');

exports.endpoints = [
  // volumes
  { method: 'GET', path: '/media/{param*}', config: StaticDirectoryController.media},
  // microservices
  { method: 'GET', path: '/microservices/opencv/alive', config: DiscoveryController.opencv_alive},
  { method: 'GET', path: '/microservices/data/alive', config: DiscoveryController.data_alive},
  // auth
  { method: 'POST', path: '/auth/local', config: UsersController.auth_local},
  // applications
  { method: 'POST', path: '/applications', config: ApplicationsController.create},
  { method: 'GET', path: '/applications', config: ApplicationsController.list},
  { method: 'GET', path: '/applications/{id}', config: ApplicationsController.read},
  { method: 'POST', path: '/applications/{id}/compare', config: ApplicationsController.compare},
  { method: 'POST', path: '/applications/{id}/batch/patterns', config: ApplicationsController.batch},
  // patterns
  { method: 'POST', path: '/patterns', config: PatternsController.create},
  { method: 'GET', path: '/patterns/{id}', config: PatternsController.read},
  { method: 'PATCH', path: '/patterns/{id}', config: PatternsController.update}
];