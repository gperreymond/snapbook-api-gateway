var async = require('async');
var _ =  require('lodash');
var Hapi = require('hapi');
var ServicesDiscovery = require('./services-discovery');

// declare hapi plugin services discovery

Hapi.Server.prototype.services_discovery = new ServicesDiscovery();

// configure server

var server = new Hapi.Server({
  	connections: {
    	routes: {
      		cors: true
    	}
  	}
});

server.connection({ 
	host: process.env.IP || '0.0.0.0',
	port: process.env.PORT || 8080,
	labels: ['api']
});

// configure services discovery

var io = require('socket.io')(server.listener);
server.services_discovery.initialize(io);

// configure routes

async.mapSeries([
  'slack'], function(item, callback) {
    server.route( require('./routes/'+item) );
    callback(null, item);
}, function(err, results) {
  console.log(err, results);
});

// configure plugins

async.mapSeries([
  'blipp', 
  'good',
  'swagger'], function(item, callback) {
	var Provision = require('./plugins/'+item);
	var plugin = new Provision(server);
	callback(null, item);
}, function(err, results) {
	console.log(err, results);
	// server start
	server.start(function () { 
		console.log('Server running at:', server.info.uri);
	});
});

