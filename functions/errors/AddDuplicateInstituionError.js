module.exports = class AddDuplicateInstitutionError extends require('./BaseError') {
    constructor (message) {
      // Providing default message and overriding status code.
      super(message || 'Institution already added. No need to add again.', 400);
    }
  };