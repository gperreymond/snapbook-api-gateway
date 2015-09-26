'use strict';

var Joi = require('joi');

var routes = [];
var plugin = 'slack';

var SlackResponseModel = Joi.object({
  done: Joi.boolean().required(),
}).meta({
  className: 'SlackResponseModel'
});

routes.push({
  method: 'POST',
  path: '/slack/message',
  handler: function (request, reply) {
    request.server.services_discovery.isRegistered(plugin, function(registered) {
      if (registered===false) {
        reply({
          'statusCode': 404,
          'error': 'Not Found',
          'message': '['+plugin+']'+' - Service not registered'
        }).code(404);
        return;
      }
      var seneca = require('seneca')()
        .client({type:'tcp'})
        .ready(function(err) {
          if (err) {
            return reply(err).code(500);
          } else {
            seneca.act({
              role: 'slack', 
              cmd: 'message',
              username: request.payload.username,
              state: request.payload.state,
              title: request.payload.title,
              message: request.payload.message
            }, function( err_seneca, result_seneca ) {
              if (err_seneca) {
                console.log(err_seneca, result_seneca);
                reply(err_seneca).code(500);
                return seneca.close();
              } else {
                reply({done:(result_seneca.result=='ok')});
                return seneca.close();
              }
            });
          }
        });
    });
  },
  config: {
    tags: ['api'],
    description: 'Poster un message sur Slack #console',
    notes: 'Poster un message sur Slack #console',
    validate: {
      payload: {
        username: Joi.string().required().description('Utilisateur postant le message'),
        state: Joi.string().required().allow(['DEBUG', 'WARNING', 'INFO', 'ERROR']).description('Etat/couleur du message'),
        title: Joi.string().required().description('Titre du message'),
        message: Joi.string().required().description('Le corps message')
      }
    },
    payload: {
      allow: 'application/x-www-form-urlencoded',
    },
    response: {schema: SlackResponseModel}
  }
});

module.exports = routes;