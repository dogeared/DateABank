var helpers = require('../support/helpers');
var request = require('request');
var User = require('../../lib/models/user_model');

Given(/^I have cleaned up$/, function(step) {
  var self = this;
  var mongo = helpers.connectMongo();

  mongo.open(function(err, db) {
    db.dropCollection('transactions', function(err) {
      db.dropCollection('users', function(err) {
        db.close();
        step.done();
      })
    })
  });
});

Given(/^I have logged out$/, function(step) {
  var self = this;
  var endpoint = "http://localhost:3000/api/v1/logout";
  
  request({
    method: 'GET',
    uri: endpoint
  }, function(err, res, body) {
    body = JSON.parse(body);
    if (err) throw err;
    assert.equal(res.statusCode, 200);
    assert.equal(body.status, 'SUCCESS');
    step.done();
  })});

Given(/^a user exists with auth token "([^"]*?)"$/, function(step, token) {
  var self = this;
  var mongo = helpers.connectMongo();

  mongo.open(function(err, db) {
    global.mongodb = db;
    User.insert({token: token}, function(err, result) {
      if (err) throw err;
      step.done();
    })
  });
});

When(/^I authenticate with "([^"]*?)"$/, function(step, token) {
  var self = this;
  var endpoint = "http://localhost:3000/api/v1/authenticate";
  
  request({
    method: 'POST',
    uri: endpoint,
    json: {token: token}
  }, function(err, res, body) {
    if (err) throw err;
    assert.equal(res.statusCode, 200);
    self.resBody = res.body;
    step.done();
  })
});

Then(/^I should get a failure response$/, function(step) {
  assert.equal(this.resBody.status, 'FAILURE');
  step.done();
});