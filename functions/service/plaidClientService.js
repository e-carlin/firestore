var functions = require('firebase-functions');
var plaid = require('plaid');

var PlaidClientError = require('../errors/PlaidClientError');

const PLAID_CLIENT_ID = functions.config().plaid.clientid;
const PLAID_SECRET = functions.config().plaid.secretkey;
const PLAID_PUBLIC_KEY = functions.config().plaid.publickey
const PLAID_ENV = functions.config().plaid.env
// Initialize the Plaid client
var client = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments[PLAID_ENV]
);

function exchangePublicToken(publicToken, callback) {
    console.log('Exchanging public token: ' + publicToken);
    client.exchangePublicToken(publicToken, (err, res) => {
        if (err) {
            console.error('There was an error exchanging the public token with Plaid: ' + JSON.stringify(err));
            return callback(new PlaidClientError('There was an error exchanging the public token'));
        }
        else {
            let accessToken = res['access_token'];
            let itemId = res['item_id'];
            console.log('Token: ' + accessToken);
            if (!accessToken || !itemId) {
                return callback(new PlaidClientError('Error, accessToken and/or itemId were null. accessToken: ' + accessToken + ' itemId: ' + itemId));
            }
            return callback(null, accessToken, itemId);
        }
    });
}

function getAccountsBalances(accessToken, callback) {
    return client.getBalance(accessToken, (err, result) => {
        // Handle err
        if (err) {
            console.error('Error retrieving balances from Plaid: ' + JSON.stringify(err));
            return(err);
        }
        else {
            return callback(null, result.accounts);
        }
    });
}

module.exports = {
    exchangePublicToken: exchangePublicToken,
    getAccountsBalances: getAccountsBalances
}