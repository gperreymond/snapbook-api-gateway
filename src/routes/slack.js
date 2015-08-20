"use strict";

var Joi = require("joi");

var routes = [];

routes.push({
  method: 'POST',
  path: '/slack/error',
  handler: function (request, reply) {
    var seneca = require('seneca')()
      .client({type:'tcp'})
      .ready(function(err) {
        if (err) return seneca.close(); 
        seneca.act({
          role: 'slack', 
          cmd: 'error',
          source: request.payload.source,
          title: request.payload.title,
          message: request.payload.message
        }, function( err, result_seneca ) {
          reply(result_seneca);
        });
      });
  },
  config: {
    tags: ['api', 'slack'],
    description: "Poster un message sur Slack #console en mode ERROR",
    notes: "Poster un message sur Slack #console en mode ERROR",
    validate: {
      payload: {
        source: Joi.string().required().description('Source du message'),
        title: Joi.string().required().description('Titre du message'),
        message: Joi.string().required().description('Le message')
      }
    },
  	response: {
		  // schema: PatternSchema.Joi.description("Pattern"),
			status: {
  			// 500: ErrorSchema.Joi.description('Error').meta({ className: 'Error500' })
  		}
  	}
  }
});

module.exports = routes;