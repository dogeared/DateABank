var Transaction = require('../models/transaction_model');

module.exports = {
  submit: function(transaction, callback) {
    Transaction.insert(transaction, callback);
  }
}