'use-strict';

var Joi = require('joi');
var Boom = require('boom');

var SlackResponseModel = Joi.object({
  done: Joi.boolean().required(),
}).meta({
  className: 'SlackResponseModel'
});

exports.alive = {
  auth: false,
  tags: ['api', 'slack'],
  description: 'Tester si le microservice slack est en vie ou pas.',
  notes: 'Tester si le microservice slack est en vie ou pas.',
  handler: function(request, reply) {
    return reply(Boom.notFound('Not yet implemented'));
  }
};

exports.message = {
  auth: false,
  tags: ['api', 'slack'],
  description: 'Poster un message sur snapbook/slack #console.',
  notes: 'Poster un message sur snapbook/slack #console.',
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
  response: {schema: SlackResponseModel},
  handler: function(request, reply) {
    require('seneca')({timeout:1500})
    .client({type:'tcp', host: process.env.SNAPBOOK_MICROSERVICE_SLACK_B94DAC70_PORT_10101_TCP_ADDR || '0.0.0.0', port: process.env.SNAPBOOK_MICROSERVICE_SLACK_B94DAC70_PORT_10101_TCP_PORT || 10101})
    .act({
      role: 'slack', 
      cmd: 'message',
      username: request.payload.username,
      state: request.payload.state,
      title: request.payload.title,
      message: request.payload.message
    }, function( error_seneca, result_seneca ) {
      if (error_seneca && error_seneca.timeout===true) return reply(Boom.notFound('[slack]'+' microservice is not alive'));
      if (error_seneca) return reply(Boom.badImplementation(error_seneca));
      return reply(result_seneca);
    });
  }
};