var accountRepository = require('../repository/accountRepository')


function addAccount(data, userId, callback) {
    //TODO: Implement
    if(accountRepository.userHasInstitution(userId, data.institutionId)) {
        console.log("User has institution");
        //TODO: implement true error handling
    }
    else {

        return callback();
    }
}

module.exports = addAccount;