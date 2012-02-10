var logMessages = require('../../config/log_messages');
var MongoHelper = require('./mongo_helper');

var User = exports;

var collectionName = 'users';

User.insert = function(user, callback) {
  mongodb.collection(collectionName, function(err, collection) {
    collection.insert(user, function(err, user) {
      if (err) {
        callback(new Error(logMessages.default.mongoFailure));
      } else {
        callback(null, user);
      }
    });
  });
}

User.find = function(selector, fieldList, callback) {
  MongoHelper.find(selector, fieldList, collectionName, callback);
}

User.findOne = function(selector, callback) {
  MongoHelper.findOne(selector, collectionName, callback);
}

User.login = function(token, callback) {
  mongodb.collection(collectionName, function(err, collection) {
    collection.findOne({token: token}, function(err, user) {
      if (err) {
        return callback(new Error(logMessages.default.mongoFailure));
      }
      
      if (!user) {
        return callback(new Error(logMessages.default.notFound('User')));
      } else {
        return callback(null, user);
      }
    })
  })
}