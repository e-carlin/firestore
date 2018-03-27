var functions = require('firebase-functions');  
var express = require('express');
var camelcaseKeys = require('camelcase-keys');
var plaid = require('plaid');

var isAuthenticated = require('./middleware/authentication');
 var addAccountService = require('./service/add-account-service');

const PLAID_CLIENT_ID = functions.config().plaid.clientid;
const PLAID_SECRET = functions.config().plaid.secretkey;
const PLAID_PUBLIC_KEY = functions.config().plaid.publickey
const PLAID_ENV = functions.config().plaid.env

const app = express();
app.use(isAuthenticated);

app.post('/', (req, res) => {
    let data = camelcaseKeys(req.body); //Converts snake case to camelcase

    if(userHaInstitution(userId, institutionId)) {
        res.status(200).send({message : 'User already has institution '+data.institutionName});
    }
    else {
        res.send("Hello from Add Account 2. User: "+res.locals.userId);
    }
});

exports.addAccount = functions.https.onRequest(app);

// exports.addAccount = functions.https.onRequest((request, response) => {

//     let data = camelcaseKeys(request.body); //Converts snake case to camelcase

    // let client = new plaid.Client(
    //     PLAID_CLIENT_ID,
    //     PLAID_SECRET,
    //     PLAID_PUBLIC_KEY,
    //     plaid.environments[PLAID_ENV]
    //   );

//     console.log("REQUEST: "+JSON.stringify(data));
//     // console.log('CLIENT ID: '+PLAID_CLIENT_ID);
//     console.log('CONFIG: '+JSON.stringify(functions.config().plaid.clientid));

//     response.send("Hello from Firebase! Add account");
//    });