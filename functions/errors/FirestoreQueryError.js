module.exports = class FirestoreQueryError extends require('./BaseError') {
    constructor (message) {
      // Providing default message and overriding status code.
      super(message || 'There was an error retrieving your data', 500);
    }
  };