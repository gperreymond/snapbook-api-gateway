'use strict';

var Blipp = require('blipp');

var GoodProvision = function(server) {
  var options = {
    opsInterval: 1000,
    reporters: [{
      reporter: require('good-console'),
      events: { log: '*', response: '*' }
    }]
  };
  server.register({
    register: require('good'),
    options: options
  }, function (err) {
    if (err) return console.log(err);
  });
};

module.exports = GoodProvision;