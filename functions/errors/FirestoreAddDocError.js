module.exports = class FirestoreAddDocError extends require('./BaseError') {
    constructor (message) {
      // Providing default message and overriding status code.
      super(message || 'There was an error saving your data', 500);
    }
  };