var logMessages = require('../../config/log_messages');
var MongoHelper = require('./mongo_helper');
var ObjectID = require('mongodb').ObjectID;
var _ = require('underscore');

var Transaction = exports;
 
var collectionName = 'transactions';

Transaction.insert = function(transaction, callback) {
  // convert date string to long date
  transaction.date = new Date(transaction.date).getTime();
  mongodb.collection(collectionName, function(err, collection) {
    collection.insert(transaction, function(err, transaction) {
      if (err) {
        callback(new Error(logMessages.default.mongoFailure));
      } else {
        callback(null, transaction);
      }
    });
  });
}

Transaction.remove = function(transactions, callback) {
  mongodb.collection(collectionName, function(err, collection) {
    var ids = _.map(transactions.ids, function(transaction) {
      return new ObjectID(transaction);
    })
    collection.remove({"_id": {"$in": ids}}, function(err, result) {
      if (err) {
        callback(new Error(logMessages.default.mongoFailure));
      } else {
        callback(null, result);
      }
    })
  });
}

Transaction.find = function(selector, fieldList, callback) {
  MongoHelper.find(selector, fieldList, collectionName, function(err, results) {
    if (err) {
      return callback(err);
    } else {
      _.each(results, function(result) {
        if (result.date) {
          var date = new Date(result.date);
          result.date = "" + (date.getMonth()+1) + "/" +
            date.getDate() + "/" + date.getFullYear();
        }
      });
      return callback(null, results);
    }
  });
}
