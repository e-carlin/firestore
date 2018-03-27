var accountRepository = require('../repository/accountRepository');
var institutionTokenRepository = require('../repository/institutionTokenRepository')
var plaidClientService = require('../service/plaidClientService');
var InstitutionTokenDocument = require('../model/InstitutionTokenDocument');
var FirestoreQueryError = require('../errors/FirestoreQueryError');
var AddDuplicateInstitutionError = require('../errors/AddDuplicateInstituionError');
var PlaidClientError = require('../errors/PlaidClientError');
var BaseError = require('../errors/BaseError');

function addInstitution(data, userId, callback) {
    let institutionId = data.institutionId;
    let publicToken = data.publicToken;
    let institutionName = data.institutionName;

    if(!institutionId || !publicToken || !institutionName) {
        console.error("An input was undefined")
        console.error('institutionId: '+institutionId+' publicToken: '+publicToken+' institutionName: '+institutionName);
        return callback(new BaseError('Parameter validation failed'));
    }

    console.log('Trying to add a new institution with id '+ institutionId);
    return accountRepository.userHasInstitution(userId, institutionId, (err, res) => {
        if(err) {
            console.error('There was an error checking if the userHasInstituion(): '+err);
            return callback(err);
        }
        else {
            if(res) {
                console.log('User already has institution '+institutionId+'. No need to add it again.');
                return callback(new AddDuplicateInstitutionError());
            }
            else {
                console.log('User does NOT have institution. Adding it...');
                return plaidClientService.exchangePublicToken(publicToken, (err, accessToken, itemId) => {
                    if(err) {
                        console.error('There was an error exchanging the public token: '+err);
                        return callback(err);
                    }

                    let institutionTokenDoc = new InstitutionTokenDocument(userId, itemId, accessToken);
                    console.log('Created new InstitutionTokenDoc: '+JSON.stringify(institutionTokenDoc));

                    return plaidClientService.getAccountsBalances(institutionTokenDoc.accessToken, (err, accountBalances) => {
                        if(err) {
                            console.error('There was an error getting accounts balances: '+err);
                            return callback(err);
                        }
                        else {
                            console.log('RESULT is: '+JSON.stringify(accountBalances));
                            return accountRepository.getMostRecentAccountsDocument(userId, (err, res) => {
                                if(err) {
                                    console.error('There was an error with getMostRecentAccountsDocument: '+err);
                                    return callback(err);
                                }
                                else {
                                    if(res) { //there is an accounts document
                                        res.institutions.append()
                                    }
                                    return callback();
                                }
                            })


                        }
                    });
                    //****** KEEP THIS */
                    // return institutionTokenRepository.addDocument(institutionTokenDoc, (err, res) => {
                    //     if(err) {
                    //         console.error('There was an error saving the institutionTokenDocument: '+err);
                    //         return callback(err);
                    //     }
                    //         return callback();
                    // });  
                });
            }
        }
    });
}

module.exports = addInstitution;