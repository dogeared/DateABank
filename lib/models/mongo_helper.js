var BSON = require('mongodb').BSONPure;
var logMessages = require('../../config/log_messages');

MongoHelper = exports;

MongoHelper.findOne = function(selector, collectionName, callback) {
  mongodb.collection(collectionName, function(err, collection) {
    collection.findOne(selector, function(err, doc) {
      if (err) {
        return callback(new Error(logMessages.default.mongoFailure));
      }

      if (!doc) {
        return callback(new Error(logMessages.default.notFound(collectionName)));
      } else {
        callback(null,doc);
      }
    })
  })
}

MongoHelper.find = function(selector, fieldList, collectionName, callback) {
  mongodb.collection(collectionName, function(err, collection) {
    collection.find(selector, fieldList, function(err, cursor) {
      if (err) {
        return callback(new Error(logMessages.default.mongoFailure));
      }
      cursor.toArray(function(err, docs) {
        if (docs.length === 0) {
          return callback(new Error(logMessages.default.notFound(collectionName)));
        } else {
          callback(null,docs);
        }
      })
    })
  })
}

MongoHelper.bsonify = function(id) {
  var id = id.toString();
  return new BSON.ObjectID(id);
}

MongoHelper.idSelector = function(id) {
  return { _id: MongoHelper.bsonify(id) };
}