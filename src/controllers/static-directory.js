"use strict";

var path = require('path');

exports.media = {
  handler: {
    directory: {
      path: process.env.SNAPBOOK_API_GATEWAY_VOLUMES_APPLICATIONS || '/home/ubuntu/workspace/applications',
      listing: true
    }
  }
};

exports.reports = {
  handler: {
    directory: {
      path: path.resolve('reports'),
      listing: true
    }
  }
};
