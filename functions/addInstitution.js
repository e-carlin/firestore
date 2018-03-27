var functions = require('firebase-functions');  
var express = require('express');
var camelcaseKeys = require('camelcase-keys');
var plaid = require('plaid');

var isAuthenticated = require('./middleware/authentication');
var addInstitutionService = require('./service/addInstitutionService');
var FirestoreQueryError = require('./errors/FirestoreQueryError');
var AddDuplicateInstitutionError = require('./errors/AddDuplicateInstituionError');

const app = express();
// app.use(isAuthenticated);

app.post('/', (req, res) => {
    //*************************************** */
    res.locals.userId = "s9Wg8tCTApbRZpOTkqafFySA3uj2"; //TODO:Delete
    //************************************ */

    let data = camelcaseKeys(req.body); //Converts snake case to camelcase

    addInstitutionService(data, res.locals.userId, (err, result) => {
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

exports.addInstitution = functions.https.onRequest(app);
