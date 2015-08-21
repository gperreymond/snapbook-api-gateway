"use strict";

var hapiSwaggered = require('hapi-swaggered');
var hapiSwaggeredUi = require('hapi-swaggered-ui');

var SwaggerProvision = function(server) {
  // 1. hapiSwaggered
  server.register({
  	register: hapiSwaggered,
  	options: {
    	cors: true,
		  produces: ['application/json'],
    	info: {
    		title: 'Snapbook',
    		version: '2.5.0',
    		description: 'Documentation swagger pour les api de Snapbook.',
  			termsOfService: 'http://www.snapbook.io',
  			contact: {
			    name: 'Snapbook API team',
			    email: 'gperreymond@snapbook.io',
			    url: 'http://www.snapbook.io'
    		}
  		}
  	}
  }, {
	  select: 'api',
	  routes: {
  	  prefix: '/documentation'
	  }
  }, function (err) {
	  if (err) return console.log(err);
  });
  // 2. hapiSwaggeredUi
  server.register({
  	register: hapiSwaggeredUi,
  	options: {
    	title: 'API.SNAPBOOK.IO',
    	/**authorization: {
      		field: 'Authorization',
      		scope: 'header',
    		valuePrefix: 'Bearer '
    	}**/
  	}
  }, {
  	select: 'api',
  	routes: {
    	prefix: '/documentation'
  	}
  }, function (err) {
  	if (err) return console.log(err);
  });
};

module.exports = SwaggerProvision;