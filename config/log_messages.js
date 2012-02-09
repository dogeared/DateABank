module.exports = {
  default: {
    mongoFailure: 'Error retrieving data from Mongo',
    notFound: function(obj) {
      return obj + ' not found';
    }
  }
}