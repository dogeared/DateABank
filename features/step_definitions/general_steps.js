var helpers = require('../support/helpers');
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

When(/^I authenticate$/, function(step) {
  step.pending();
});
