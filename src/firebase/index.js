const firebase = require("firebase-admin");

const serviceAccount = require('./serviceAccountKeys.json')

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
})

module.exports = {firebase}