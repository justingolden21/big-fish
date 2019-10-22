// https://firebase.google.com/docs/functions/get-started

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// https://us-central1-big-fish-game.cloudfunctions.net/helloWorld?name=joe

exports.helloWorld = functions.https.onRequest( (request, response) => {
	response.send('Hello ' + request.query.name + '!');
});
