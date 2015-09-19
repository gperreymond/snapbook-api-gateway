"use strict";

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
 
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

var superagent = require('superagent');
var assert = require("assert");
var expect = require('expect.js');
var should = require('should');

describe('API GATEWAY', function () {

  describe('[get]/swagger', function () {
    it('should return an error when the gateway is not running', function (done) {
      superagent
      .get('http://localhost:3000/swagger')
      .end(function(err, res) {
        assert.ifError(err);
        done();
      });
    });
  });
  
  describe('[post]/slack/message', function () {
    it('should return an error when the microservice is not running', function (done) {
      superagent
      .post('http://localhost:3000/slack/message')
      .type('form')
      .send({
        state: 'STATE', 
        source: 'SOURCE',
        title: 'TITLE',
        message: 'MESSAGE'
      })
      .end(function(err, res) {
        expect(res.body.statusCode).equal(404);
        expect(res.body.message).to.contain('Service not registered');
        done();
      });
    });
  });

});