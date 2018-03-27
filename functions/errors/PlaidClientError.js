module.exports = class PlaidClientError extends require('./BaseError') {
    constructor (message) {
      // Providing default message and overriding status code.
      super(message || 'Plaid encountered an error', 500);
    }
  };