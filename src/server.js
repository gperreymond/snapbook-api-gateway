"use strict";

var Hapi = require('hapi');
var Routes = require('./routes');

// !-- FOR TESTS
var options = {
  host: process.env.IP || '0.0.0.0',
  port: process.env.PORT || 8080,
  labels: ['api']
};
// --!

var server = new Hapi.Server({
  debug: false,
  connections: {
    routes: {
      cors: true
    }
  }
});

server.connection(options);

if (!process.env.ENABLE_NPM_TEST) {
  var async = require('async');
  async.mapSeries(['swagger', 'blipp', 'good'], function(item, callback) {
    require('./plugins/'+item)(server);
    callback(null, item);
  }, function(err, results) {
    if (!err && results) server.route(Routes.endpoints);
  });
} else {
  server.route(Routes.endpoints);
}
// !-- FOR TESTS
module.exports = server;
// --!

