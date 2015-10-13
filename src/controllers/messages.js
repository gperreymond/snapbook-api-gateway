'use-strict';

var Joi = require('joi');
var Boom = require('boom');

// seneca microservice framework
var seneca = require('seneca')({
  timeout: 3000
});
var client = seneca.client({
  type:'tcp', 
  host: process.env.SNAPBOOK_MICROSERVICE_SLACK_B94DAC70_PORT_10101_TCP_ADDR || '0.0.0.0', 
  port: process.env.SNAPBOOK_MICROSERVICE_SLACK_B94DAC70_PORT_10101_TCP_PORT || 10101
});

var SlackResponseModel = Joi.object({
  done: Joi.boolean().required(),
}).meta({
  className: 'SlackResponseModel'
});

exports.alive = {
  auth: false,
  tags: ['api', 'microservices'],
  description: 'Tester si le microservice /slack/ est en vie ou pas.',
  notes: 'Tester si le microservice /slack/ est en vie ou pas.',
  handler: function(request, reply) {
    client.act({
      role: 'controller', 
      cmd: 'slack/alive'
    }, function( error_seneca, result_seneca ) {
      if (error_seneca && error_seneca.timeout===true) return reply(Boom.notFound('[slack] microservice is not alive'));
      if (error_seneca) return reply(Boom.badImplementation(error_seneca));
      return reply(result_seneca);
    });
  }
};

exports.message = {
  auth: false,
  tags: ['api', 'messages'],
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
    client.act({
      role: 'controller', 
      cmd: 'slack/message',
      username: request.payload.username,
      state: request.payload.state,
      title: request.payload.title,
      message: request.payload.message
    }, function( error_seneca, result_seneca ) {
      if (error_seneca && error_seneca.timeout===true) return reply(Boom.notFound('[slack] microservice is not alive'));
      if (error_seneca) return reply(Boom.badImplementation(error_seneca));
      return reply(result_seneca);
    });
  }
};