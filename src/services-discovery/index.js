'use strict';

var _ =  require('lodash');

// Declare internals

var internals = {};

////////////////////////
// @constructor
////////////////////////

exports = module.exports = internals.ServicesDiscovery = function() {
  var self = this;
  
  self.dictionnary = [];
};

////////////////////////
// @methods
////////////////////////

internals.ServicesDiscovery.prototype.initialize = function(io) {
  var self = this;
  
  self.io = io;
  self.io.on('connection', function (socket) {
    socket.on('disconnect', function() {
      console.log('Service disconnected', socket.id);
      self.unregister(socket);
    });
    socket.on('service-register', function(service) {
      console.log('Service connected', service.id, service.name);
      self.register(service);
    });
  });
};

internals.ServicesDiscovery.prototype.isRegistered = function(service, callback) {
  var self = this;
  var index = _.findIndex(self.dictionnary, function(item) {
    return item.name==service;
  });
  callback(index!=-1);
};

internals.ServicesDiscovery.prototype.register = function(service) {
  var self = this;
  self.dictionnary.push(service);
};

internals.ServicesDiscovery.prototype.unregister = function(service) {
  var self = this;
  var index = _.findIndex(self.dictionnary, function(item) {
    return item.id==service.id;
  });
  if (index!=-1) {
    _.pullAt(self.dictionnary, index);
  }
};