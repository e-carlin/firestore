var functions = require('firebase-functions');  
var express = require('express');
var camelcaseKeys = require('camelcase-keys');
var plaid = require('plaid');

var isAuthenticated = require('./middleware/authentication');
var addAccountService = require('./service/addAccountService');
var FirestoreQueryError = require('./errors/FirestoreQueryError');
var AddDuplicateInstitutionError = require('./errors/AddDuplicateInstituionError');

const PLAID_CLIENT_ID = functions.config().plaid.clientid;
const PLAID_SECRET = functions.config().plaid.secretkey;
const PLAID_PUBLIC_KEY = functions.config().plaid.publickey
const PLAID_ENV = functions.config().plaid.env

const app = express();
// app.use(isAuthenticated);

app.post('/', (req, res) => {
    //*************************************** */
    res.locals.userId = "s9Wg8tCTApbRZpOTkqafFySA3uj2"; //TODO:Delete
    //************************************ */

    let data = camelcaseKeys(req.body); //Converts snake case to camelcase

    addAccountService(data, res.locals.userId, (err, result) => {
        if(err) {
            if(err instanceof FirestoreQueryError) {
                res.status(500).send({error : "There was an error retrieving your data. Please try again."});
            }
            else if(err instanceof AddDuplicateInstitutionError) {
                res.status(400).send({error : 'This is a duplicate institution'});
            }
            else {
                res.status(500).send({error : 'Our system encountered an error. Please try again.'});
            }
        }
        else{  //Institution added
            res.sendStatus(201);
        }
    })
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