"use strict";

var pmx = require('pmx'); 
pmx.init();

var Hapi = require('hapi');
var server = new Hapi.Server({
  	connections: {
    	routes: {
      		cors: true
    	}
  	}
});

// configure server

server.connection({ 
	host: process.env.IP,
	port: process.env.PORT,
	labels: ['api']
});

// configure plugin Blipp

var Blipp = require('blipp');
server.register(Blipp, function(err){
	
});

// configure plugin swagger

var hapiSwaggered = require('hapi-swaggered');
var hapiSwaggeredUi = require('hapi-swaggered-ui');

server.register({
	register: hapiSwaggered,
  	options: {
    	cors: true,
    	consumes: ['application/json'],
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
  	if (err) {
    	throw err;
  	}
});

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
  	if (err) {
    	throw err;
  	}
});

// configure routes

server.route( require("./routes/slack") );

// server start

server.start(function () { 
	console.log('Server running at:', server.info.uri);
});