// config/firebaseAdmin.js
const admin = require("firebase-admin");

const config = {
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
  }),
};

// Comprueba si process está definido antes de intentar acceder a él
if (typeof process !== 'undefined') {
  admin.initializeApp(config);
}

const auth = admin.auth();

const disableFirebaseUser = async (uid) => {
  await admin.auth().updateUser(uid, { disabled: true });
};

const enableFirebaseUser = async (uid) => {
  await admin.auth().updateUser(uid, { disabled: false });
};

module.exports = { auth, disableFirebaseUser, enableFirebaseUser };
