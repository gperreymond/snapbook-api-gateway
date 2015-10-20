"use strict";

if (process.env.SNAPBOOK_API_GATEWAY_REQUIRE_NEWRELIC) require('newrelic');

var server = require('./server');
server.start(function() {
  console.log('Server started ', server.info.uri);
});