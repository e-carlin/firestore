var firebaseAdmin = require('../config/firebaseAdmin');
var dbConstants = require('../config/dbConstants');
var FirestoreQueryError = require('../errors/FirestoreQueryError');

const DB = firebaseAdmin.firestore();


function userHasInstitution(userId, institutionId, callback) {
    getMostRecentAccountsDocument(userId, (err, res ) => {
        if(err) {
            console.error('There was an error retrieving the most recent accounts document: '+err);
            return callback(err);
        }
        else {
            if(!res) { //The user doesn't have any accounts document's
                return callback(null, false);
            }
            else {
                result = res.institutions.some((institution, index, _arr) => {
                    return institution.institutionId === institutionId;
                });
                return callback(null, result);
            }
        }
    });

}

function getMostRecentAccountsDocument(userId, callback) {
    let accountCollection = DB.collection(dbConstants.ACCOUNT_COLLECTION_REF);
    let query = accountCollection.where(dbConstants.USER_ID_REF, '==', userId)
    .orderBy(dbConstants.CREATED_AT_REF, dbConstants.ORDER_DESC).limit(1);

    query.get()
    .then(snapshot => {
        if(snapshot.docs.length < 1) {
            console.log('The user has no accounts documents');
            return callback(null, null);
        }
        else {
            return callback(null, snapshot.docs[0].data());
        }
    })
    .catch(err => {
        return callback(new FirestoreQueryError(err));
    });
}

function addInstitution(data, userId, callback) {
    console.log('In addInstitution: ');
    console.log('Data is: '+JSON.stringify(data));
    console.log('UserId is: '+userId);

    callback(null);
}


module.exports = {
    getMostRecentAccountsDocument : getMostRecentAccountsDocument,
    userHasInstitution : userHasInstitution,
    addInstitution : addInstitution
}