var FieldValue = require('firebase-admin').firestore.FieldValue;

module.exports = class InstitutionTokenDocument {
    constructor(userId, itemId, accessToken) {
      this.userId = userId;
      this.itemId = itemId;
      this.accessToken = accessToken;
      this.createdAt = FieldValue.serverTimestamp()
    }
  }