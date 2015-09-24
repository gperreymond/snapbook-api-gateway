'use strict';

var HapiSwagger = require('hapi-swaggered');
var HapiSwaggerUI = require('hapi-swaggered');

var SwaggerProvision = function(server) {
  // swagger
  var options = {
    info: {
      version: '2.5.1',
      title: 'API GATEWAY',
      description: 'API Gateway pour l\'application snapbook'
    },
    cors: true
  };
  server.register([
    {
      register: HapiSwagger,
      options: options
    }], function (err) {
  	if (err) return console.log(err);
  });
  // swaggerui
  var optionsui = {
    title: 'API GATEWAY',
    path: '/docs'
  };
  server.register([
    {
      register: require('hapi-swaggered-ui'),
      options: optionsui
  }], function (err) {
  	if (err) return console.log(err);
  });
};

module.exports = SwaggerProvision;