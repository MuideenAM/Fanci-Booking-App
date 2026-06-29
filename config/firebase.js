const { initializeApp, cert, getApps } =
    require("firebase-admin/app");

const {
    getFirestore
} = require("firebase-admin/firestore");

if (getApps().length === 0) {

    const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT
    );

    initializeApp({
        credential: cert(serviceAccount)
    });

}

const db = getFirestore();

module.exports = db;