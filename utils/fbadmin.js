
var admin = require("firebase-admin");

var serviceAccount = require("../user-aadhar-images-firebase-adminsdk-a0x30-a61da580c9.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_BUCKET_NAME
});




module.exports = admin;