"use strict";

var path = require('path');

exports.media = {
  handler: {
    directory: {
      path: process.env.SNAPBOOK_API_GATEWAY_VOLUME_APPLICATIONS,
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
