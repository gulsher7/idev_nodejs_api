const firebase = require("firebase-admin");

var serviceAccount = require('./serviceAccountKeys.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
})

module.exports = {firebase}