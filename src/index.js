"use strict";

var async = require("async");

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
	host: process.env.IP || '0.0.0.0',
	port: process.env.PORT || 80,
	labels: ['api']
});

// configure routes

server.route( require("./routes/slack") );

// configure provisionning

async.mapSeries(['blipp', 'swagger', 'good'], function(item, callback) {
	var Provision = require("./provisions/"+item);
	var plugin = new Provision(server);
	callback(null, plugin);
}, function(err, results) {
	console.log(err, results);
	// server start
	server.start(function () { 
		console.log('Server running at:', server.info.uri);
	});
});