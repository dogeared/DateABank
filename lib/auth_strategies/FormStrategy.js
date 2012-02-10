/**
 * Module dependencies.
 */

var _ = require('underscore')._;
var User = require('../models/user_model')
var messages = require('../../config/messages');

/**
 * auth strategies - form strategy.
 */

module.exports = function(options) {
  options = options || {};

  var that = {};
  var my = {};

  that.name = options.name || "form";
  
  function validate_credentials(executionScope, req, res, callback) {
    var token = req.body.token;
    User.login(token, function(err, user) {
      if (user) {
        req.currentUser = user;
        executionScope.success({ id: user._id }, callback);
      } else {
        console.error(err);
        if (err.message.match(/ECONNREFUSED/)) {
          err.message = messages.serverUnreachable;
        } else {
          err.message = messages.sessions.unsuccessfulLogin;
        }
        return callback(err);
      }
    });
  };

  that.authenticate = function(req, res, callback) {
    var form_valid = req.body && req.body.token;
    if (form_valid) {
      validate_credentials(this, req, res, callback);
    } else {
      res.send({ status: "FAILURE", message: "Invalid credentials." })
    }
  };
  return that;
};
