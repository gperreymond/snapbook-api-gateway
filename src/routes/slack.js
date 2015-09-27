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
    var seneca = require('seneca')({timeout:1500})
      .client({type:'tcp'})
      .act({
        role: 'slack', 
        cmd: 'message',
        username: request.payload.username,
        state: request.payload.state,
        title: request.payload.title,
        message: request.payload.message
      }, function( err_seneca, result_seneca ) {
        if (err_seneca) {
          reply({
            'statusCode': 404,
            'error': 'Not Found',
            'message': '['+plugin+']'+' - Service not registered'
          }).code(404);
        } else {
          reply({done:(result_seneca.result=='ok')});
          return seneca.close();
        }
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