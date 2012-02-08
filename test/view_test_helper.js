/**
 * Module dependencies.
 */

var jsdom = require('jsdom');
var fs = require('fs');
var jquery = fs.readFileSync(
  __dirname + '/fixtures/jquery-1.6.2.min.js').toString();

/**
 * view_test_helper
 */

var helper = exports;

helper.parseDom = function(body, callback) {
  jsdom.env({
    html: body,
    src: [jquery],
    done: function(err, window) {
      callback(err, window.$);
    }
  });
};
