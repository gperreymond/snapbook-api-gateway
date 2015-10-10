'use-strict';

var SlackController = require('./controllers/slack');

exports.endpoints = [
  // slack
  { method: 'GET', path: '/slack/alive', config: SlackController.alive},
  { method: 'POST', path: '/slack/message', config: SlackController.message}
];