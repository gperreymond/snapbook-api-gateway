"use strict";

var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('/swagger', function () {
  it('should return ok when the gateway is running', function (done) {
    chai.request('http://localhost:3000')
    .get('/swagger')
    .end(function(err, res) {
      try {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});

describe('/slack/message', function () {
  it('should return 404 when the microservice slack is not in post', function (done) {
    chai.request('http://localhost:3000')
    .get('/slack/message')
    .end(function(err, res) {
      try {
        expect(res.body.statusCode).to.equal(404);
        expect(res.body.error).to.have.string('Not Found');
        done();
      } catch (e) {
        done(e);
      }
    });
  });
  describe('when microservice not running', function() {
    it('should return a 404 with an explicit message', function (done) {
    chai.request('http://localhost:3000')
    .post('/slack/message')
    .type('form')
    .send({
      state: 'STATE', 
      source: 'SOURCE',
      title: 'TITLE',
      message: 'MESSAGE'
    })
    .end(function(err, res) {
      try {
        expect(res.body.statusCode).to.equal(404);
        expect(res.body.message).to.have.string('Service not registered');
        done();
      } catch (e) {
        done(e);
      }
    });
  });
  });
  describe('when microservice is running', function() {
    it('should return a 200 with data', function (done) {
    chai.request('http://localhost:3000')
    .post('/slack/message')
    .type('form')
    .send({
      state: 'STATE', 
      source: 'SOURCE',
      title: 'TITLE',
      message: 'MESSAGE'
    })
    .end(function(err, res) {
      try {
        expect(res.body.statusCode).to.equal(404);
        expect(res.body.message).to.have.string('Service not registered');
        done();
      } catch (e) {
        done(e);
      }
    });
  });
  });
  
});
