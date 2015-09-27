'use strict';

var async = require('async');
var _ =  require('lodash');
var Hapi = require('hapi');

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

// hapijs provisionning

var provisions = require('./provisions');
async.mapSeries(provisions, function(item, callback) {
  // hapijs plugins provision
  if (item.type=='plugin') {
  	var Provision = require('./plugins/'+item.name);
		new Provision(server);
		callback(null, item);
  }
  // hapijs routes provision
  if (item.type=='route') {
  	server.route( require('./routes/'+item.name) );
    callback(null, item);
  }
}, function(err, results) {
  if (err) console.log(err, results);
	// server start
	server.start(function () { 
		if ( process.env.NODE_ENV=='test' ) return;
		console.log('Server running at:', server.info.uri);
	});
});

