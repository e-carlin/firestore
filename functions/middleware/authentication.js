
var admin = require("firebase-admin");
const functions = require('firebase-functions');
var serviceAccount = require("./service-account-credentials.json");

const authorizationHeader = 'Authorization'

admin.initializeApp(functions.config().firebase);

function isAuthenticated(req, res, next) {

  if (req.header(authorizationHeader) === undefined) {
    res.status(400).send({ error: 'Authorization header was missing' })
  }
  else {

    admin.auth().verifyIdToken(req.header(authorizationHeader))
      .then((decodedToken) => {
        res.locals.userId = decodedToken.uid; //Set the userId var so it can be used further down the chain
        return next();
      }).catch((error) => {
        console.log('Error verifying IdToken: ' + error);
        res.sendStatus(403);
      });
  }
}

module.exports = isAuthenticated;