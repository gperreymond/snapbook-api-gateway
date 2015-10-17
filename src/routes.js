'use-strict';

var DiscoveryController = require('./controllers/services-discovery');
var ApplicationsController = require('./controllers/applications');
var PatternsController = require('./controllers/patterns');

exports.endpoints = [
  // microservices
  { method: 'GET', path: '/microservices/slack/alive', config: DiscoveryController.slack_alive},
  { method: 'GET', path: '/microservices/data/alive', config: DiscoveryController.data_alive},
  // applications
  { method: 'GET', path: '/applications', config: ApplicationsController.list},
  { method: 'GET', path: '/applications/{id}', config: ApplicationsController.read},
  // patterns
  { method: 'GET', path: '/patterns/{id}', config: PatternsController.read},
];