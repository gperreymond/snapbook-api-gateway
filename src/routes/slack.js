'use strict';

var Joi = require('joi');
var Boom = require('boom');

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
    require('seneca')({timeout:1500})
      .client({type:'tcp', port:10101})
      .act({
        role: 'slack', 
        cmd: 'message',
        username: request.payload.username,
        state: request.payload.state,
        title: request.payload.title,
        message: request.payload.message
      }, function( error_seneca, result_seneca ) {
        if (error_seneca && error_seneca.timeout===true) return reply(Boom.notFound('['+plugin+']'+' - Service not running'));
        if (error_seneca) return reply(Boom.badImplementation(error_seneca));
        return reply(result_seneca);
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