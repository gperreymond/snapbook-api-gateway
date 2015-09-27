'use strict';

var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('initialize test server', function () {
  before(function() {
    process.env.IP = 'localhost';
    process.env.PORT = 3000;
    process.env.NODE_ENV = 'test';
    require('../src');
  });
  it('should return ok when test server has started', function (done) {
    done();
  });
});

describe('endpoint /swagger', function () {
  it('should return ok when the gateway is running', function (done) {
    try {
      chai.request('http://localhost:3000')
      .get('/swagger')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
    } catch (e) {
      done(e);
    }
  });
});

describe('endpoint /slack/message', function () {
  it('should return 404 when the microservice is called with get', function (done) {
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
  it('should return 404 when the microservice is called with delete', function (done) {
    chai.request('http://localhost:3000')
    .delete('/slack/message')
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
  it('should return 404 when the microservice is called with patch', function (done) {
    chai.request('http://localhost:3000')
    .patch('/slack/message')
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
  it('should return 404 with an explicit message when microservice not running and called with post', function (done) {
    chai.request('http://localhost:3000')
    .post('/slack/message')
    .type('form')
    .send({
      username: 'USERNAME',
      state: 'STATE',
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
