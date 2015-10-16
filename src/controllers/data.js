'use-strict';

var Joi = require('joi');
var Boom = require('boom');

// seneca microservice framework
var seneca = require('seneca')({
  timeout: 3000
});
var client = seneca.client({
  type:'tcp', 
  host: process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_ADDR || '0.0.0.0', 
  port: process.env.SNAPBOOK_MICROSERVICE_DATA_C1BFAE68_PORT_10101_TCP_PORT || 10102
});

exports.alive = {
  auth: false,
  tags: ['api', 'microservices'],
  description: 'Tester si le microservice /data/ est en vie ou pas.',
  notes: 'Tester si le microservice /data/ est en vie ou pas.',
  handler: function(request, reply) {
    client.act({
      role: 'controller', 
      cmd: 'data/alive'
    }, function( error_seneca, result_seneca ) {
      if (error_seneca && error_seneca.timeout===true) return reply(Boom.notFound('[slack] microservice is not alive'));
      if (error_seneca) return reply(Boom.badImplementation(error_seneca));
      return reply(result_seneca);
    });
  }
};

exports.list = {
  auth: false,
  tags: ['api', 'applications'],
  description: 'Retourne la liste des applications.',
  notes: 'Retourne la liste des applications.',
  handler: function(request, reply) {
    client.act({
      role: 'controller',
      cmd: 'applications/list'
    }, function( error_seneca, result_seneca ) {
      if (error_seneca && error_seneca.timeout===true) return reply(Boom.notFound('[data] microservice is not alive'));
      if (error_seneca) return reply(Boom.badImplementation(error_seneca));
      return reply(result_seneca);
    });
  }
};