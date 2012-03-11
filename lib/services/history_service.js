var Transaction = require('../models/transaction_model.js')

module.exports = {
  getAllHistory: function(callback) {
    Transaction.find({$query: {}, $orderby: {date:1}}, {}, callback);
  },
  process: function(transactions, callback) {
    var self = this;
    Transaction.remove(transactions, function(err, result) {
      self.getAllHistory(callback);
    })
  }
}
