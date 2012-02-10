/**
 * Set node environment to test
 */

process.env['NODE_ENV'] = 'test';

/**
 * Module dependencies.
 */

global.should = require('should');
global.assert = require('assert');
global.inspect = require('eyes').inspector({});

var _ = require('underscore')._;
var sinon = require('sinon');
// var coreExt = require('../lib/helpers/core_ext');
var express = require('express');
var controllerTestHelper = require('./controller_test_helper');

/**
 * BDD Hooks.
 */

var bdd = module.exports = {

  describe: function(exports) {
    return function(subject, callback) {
      var testContext = { exports: exports };
      testContext.subject = subject;
      testContext.sandbox = sinon.sandbox.create();

      global.beforeEach = function(callback) {
        testContext.beforeEach = callback;
      };

      global.afterEach = function(callback) {
        testContext.afterEach = callback;
      };

      var it = bdd.it.apply(testContext);
      callback.apply(testContext, [it]);
    };
  },

  it: function() {
    var self = this;

    return function(statement, callback) {
      self.exports[self.subject + ' ' + statement] = function(done) {
        self.sandbox.controllers = controllerTestHelper;

        if (self.beforeEach) self.beforeEach(self.sandbox);

        self.sandbox.finish = function() {
          self.sandbox.restore();
          self.sandbox.controllers.finish();
          done();
        };

        callback.apply(self, [self.sandbox]);

        if (self.afterEach) self.afterEach(self.sandbox);
      };
    };
  },

  createTestServer: function() {
    var app = express.createServer(
      express.bodyParser(),
      express.methodOverride(),
      express.cookieParser(),
      express.session({ secret: 'tester' })
    );

    return app;
  }
};

var noop = function(){};

global.db = global.mongodb = {
  collection: function() {
    return {
      count: noop
    };
  },
  createCollection: function() {
    return {
      count: noop
    };
  },
  bind: noop
};

var mongo = require('mongodb');
var mdb = new mongo.Db('test', new mongo.Server("127.0.0.1", 27017, {}));
global._collection = new mongo.Collection(mdb, 'test');

/**
 * Terminate process on uncaught exception
 */

process.on('uncaughtException', function(err) {
  process.exit(1);
});