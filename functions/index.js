const admin = require('firebase-admin');
const functions = require('firebase-functions');
const dialogflow = require('dialogflow');

//Firestore
admin.initializeApp(functions.config().firebase);
var FieldValue = admin.firestore.FieldValue;
var db = admin.firestore();
var firestoreChatReply = {
    userId : "",
    message : "",
    createdAt : ""
};

//Dialogflow
const sessionClient = new dialogflow.SessionsClient();
const projectId = 'banter-81a54'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id';
const languageCode = 'en-US';

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

exports.chatAdded = functions.firestore
    .document('chats/{chat}')
    .onCreate(event => {
        const chat = event.data.data();

        if(chat['messageIsFromUser']) {
            console.log('messageIsFromUser');
        console.log('CHAT IS: ' + JSON.stringify(chat));
        console.log('Message is: ' + chat['message']);

        // The text query request.
        var request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: chat['message'],
                    languageCode: languageCode,
                },
            },
        };

        // Send request and log result
        return sessionClient
            .detectIntent(request)
            .then(responses => {
                console.log('RESPONSES: ' + JSON.stringify(responses));
                console.log('Detected intent');
                const result = responses[0].queryResult;
                console.log(`  Query: ${result.queryText}`);
                console.log(`  Response: ${result.fulfillmentText}`);


                return result.fulfillmentText;
            })
            .then((fulfillmentText) => {
                firestoreChatReply.userId = chat['userId'];
                firestoreChatReply.message = fulfillmentText;
                firestoreChatReply.createdAt = FieldValue.serverTimestamp();

                console.log('Bot response is: '+JSON.stringify(firestoreChatReply));
                return db.collection('chats').add(firestoreChatReply)
            })
            .then((addedChat) => {
                console.log('ADDED Chat: '+JSON.stringify(addedChat));
                return "processed chat";
            })
            .catch(err => {
                console.error('ERROR:', err);
                firestoreChatReply.userId = chat['userId'];
                firestoreChatReply.message = 'Error'+JSON.stringify(err);
                firestoreChatReply.createdAt = FieldValue.serverTimestamp();
                db.collection('chats').add(firestoreChatReply)
                return "Error processing chat";
            });
        }
        else {
            console.log('!messageIsFromUser');
            return 'This message is not from user, no need to process';
        }
    });