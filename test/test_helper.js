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
var viewTestHelper = require('./view_test_helper');

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
        self.sandbox.views = viewTestHelper;

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

    app.set('views', __dirname + '/../lib/views');
    app.set('view engine', 'jade');

    app.dynamicHelpers({
      // messages: require(__dirname + '/../lib/helpers/flash_helper')
    });

    controllerTestHelper.setDefaultLocals();

    return app;
  }
};

/**
 * Terminate process on uncaught exception
 */

process.on('uncaughtException', function(err) {
  process.exit(1);
});