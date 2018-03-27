var admin = require("firebase-admin");
var functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);


module.exports = admin;