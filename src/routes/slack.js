"use strict";

var Joi = require("joi");

var routes = [];

routes.push({
  method: 'POST',
  path: '/slack/message',
  handler: function (request, reply) {
    var seneca = require('seneca')()
      .client({type:'tcp'})
      .ready(function(err) {
        if (err) {
          return reply(err).code(500);
        } else {
          seneca.act({
            role: 'slack', 
            cmd: 'message',
            source: request.payload.source,
            state: request.payload.state,
            title: request.payload.title,
            message: request.payload.message
          }, function( err_seneca, result_seneca ) {
            if (err_seneca) {
              console.log(err_seneca,result_seneca);
              reply(err_seneca).code(500);
              return seneca.close();
            } else {
              reply(result_seneca);
              return seneca.close();
            }
          });
        }
      });
  },
  config: {
    tags: ['api', 'slack'],
    description: "Poster un message sur Slack #console en mode ERROR",
    notes: "Poster un message sur Slack #console en mode ERROR",
    validate: {
      payload: Joi.object().keys({ 
        state: Joi.string().required().description('Etat du message').valid('a', 'b'),
        source: Joi.string().required().description('Source du message'),
        title: Joi.string().required().description('Titre du message'),
        message: Joi.string().required().description('Le message')
      })
    },
    payload: {
      allow: 'multipart/form-data'
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