'use-strict';

var MessagesController = require('./controllers/messages');
var DataController = require('./controllers/data');

exports.endpoints = [
  // slack
  { method: 'GET', path: '/microservices/slack/alive', config: MessagesController.alive},
  { method: 'POST', path: '/messages/post', config: MessagesController.message},
  // applications
  { method: 'GET', path: '/microservices/data/alive', config: DataController.alive},
  { method: 'GET', path: '/applications', config: DataController.list}
];