var accountRepository = require('../repository/accountRepository');
var FirestoreQueryError = require('../errors/FirestoreQueryError');
var AddDuplicateInstitutionError = require('../errors/AddDuplicateInstituionError');

function addAccount(data, userId, callback) {
    console.log('Trying to add a new institution id '+ data.institutionId);
    result = accountRepository.userHasInstitution(userId, data.institutionId, (err, res) => {
        if(err) {
            console.error('There was an error checking if the userHasInstituion(): '+err);
            return callback(err);
        }
        else {
            if(res) {
                console.log('User already has institution '+data.institutionId+'. No need to add it again.');
                return callback(new AddDuplicateInstitutionError());
            }
            else {
                console.log('User does NOT have institution. Adding it...');
                return callback(null, "added"); //TODO: Implement
            }
        }
    });
}

module.exports = addAccount;