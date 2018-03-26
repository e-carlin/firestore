const functions = require('firebase-functions');  
const express = require('express');
const camelcaseKeys = require('camelcase-keys');
const plaid = require('plaid');

const isAuthenticated = require('./middleware/authentication');

const PLAID_CLIENT_ID = functions.config().plaid.clientid;
var PLAID_SECRET = functions.config().plaid.secretkey;
var PLAID_PUBLIC_KEY = functions.config().plaid.publickey
var PLAID_ENV = functions.config().plaid.env

const app = express();
app.use(isAuthenticated);

app.post('/', (req, res) => {
    let data = camelcaseKeys(req.body); //Converts snake case to camelcase

    let client = new plaid.Client(
        PLAID_CLIENT_ID,
        PLAID_SECRET,
        PLAID_PUBLIC_KEY,
        plaid.environments[PLAID_ENV]
      );

      console.log("REQUEST: "+JSON.stringify(data));

    res.send("Hello from Add Account 2. User: "+res.locals.userId);
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