'use strict';

var Blipp = require('blipp');

var BlippProvision = function(server) {
  server.register(Blipp, function(err) {
    if (err) return console.log(err);
  });
};

module.exports = BlippProvision;