var firebaseAdmin = require('../config/firebaseAdmin');
var dbConstants = require('../config/dbConstants');
var FirestoreAddDocError = require('../errors/FirestoreAddDocError');


const DB = firebaseAdmin.firestore();

function addDocument(doc, callback) {
    var addDoc = DB.collection(dbConstants.INSTITUTION_TOKEN_COLLECTION_REF).add(
        //TODO: Fix this, if I just try to add the doc I get Error: Argument "data" is not a valid Document. Input is not a plain JavaScript object.
        {
            itemId : doc.itemId,
            accessToken : doc.accessToken,
            userId : doc.userId,
            createdAt : doc.createdAt,
        }
    ).then(ref => {
        console.log('Added new institutionTokenDocument. Ref: ', ref);
        return callback();
    }).catch( (error) => {
        callback(new FirestoreAddDocError('There was an error saving the institutionTokenDocument.'));
    });
}

module.exports = {
    addDocument: addDocument
}