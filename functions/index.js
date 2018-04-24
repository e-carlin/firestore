const admin = require('firebase-admin');
const functions = require('firebase-functions');
const dialogflow = require('dialogflow');

//Firestore
admin.initializeApp(functions.config().firebase);
var FieldValue = admin.firestore.FieldValue;
var db = admin.firestore();
var firestoreChatReply = {
    userId: null,
    message: null,
    messageIsFromUser: null,
    botHasReplied: null,
    createdAt: null
};

//Dialogflow
const sessionClient = new dialogflow.SessionsClient();
const projectId = 'banter-81a54'; //https://dialogflow.com/docs/agents#settings
const languageCode = 'en-US';

// Define session path

exports.chatAdded = functions.firestore
    .document('chats/{chat}')
    .onCreate(event => {
        const chat = event.data.data();

        if (chat['messageIsFromUser'] && !chat['botHasReplied']) {
            const sessionId = chat['userId'];
            const sessionPath = sessionClient.sessionPath(projectId, sessionId);

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
                    if (!result.fulfillmentText) {
                        throw new Error("The fulfillment text was empty")
                    }


                    firestoreChatReply.userId = chat['userId'];
                    firestoreChatReply.message = result.fulfillmentText;
                    firestoreChatReply.messageIsFromUser = false;
                    firestoreChatReply.botHasReplied = false;
                    firestoreChatReply.createdAt = FieldValue.serverTimestamp();

                    console.log('Bot response is: ' + JSON.stringify(firestoreChatReply));
                    firestoreChatReplyPromise = db.collection('chats').add(firestoreChatReply)

                    userChatRefUpdatePromise = event.data.ref.update({ botHasReplied: true });

                    return Promise.all([firestoreChatReplyPromise, userChatRefUpdatePromise]);
                })
                .then(([chatReply, userChatUpdate]) => {
                    console.log('"************ DONE **************');
                    return "DONE";
                })
                .catch(err => {
                    console.error('ERROR:', err);
                    firestoreChatReply.userId = chat['userId'];
                    firestoreChatReply.message = 'Error' + JSON.stringify(err);
                    firestoreChatReply.createdAt = FieldValue.serverTimestamp();
                    firestoreChatReply.messageIsFromUser = false;
                    firestoreChatReply.botHasReplied = false;
                    db.collection('chats').add(firestoreChatReply)
                    return "Error processing chat";
                });
        }
        else {
            console.log('This message is not from user, no need to process');
            return 'This message is not from user, no need to process';
        }
    });