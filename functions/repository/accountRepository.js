var firebaseAdmin = require('../config/firebaseAdmin');

const ACCOUNT_COLLECTION_REF = "accounts";


function userHasInstitution(userId, institutionId) {
    console.log("in userHasInstitution()");
}


module.exports = {
    userHasInstitution: userHasInstitution
}