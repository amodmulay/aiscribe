import * as admin from 'firebase-admin';

// Ensure this path is correct and your service account key JSON file is present
// You can download this from your Firebase project settings -> Service accounts
// IMPORTANT: DO NOT commit serviceAccountKey.json to your repository.
// Use environment variables to store the service account key details.

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;


let app: admin.app.App;

export function initializeAdminApp() {
  if (admin.apps.length === 0 && serviceAccount) {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
     console.log('Firebase Admin SDK initialized');
  } else if (admin.apps.length > 0) {
    app = admin.app();
  } else {
    console.warn(
      'Firebase Admin SDK not initialized. Service account key might be missing or invalid in environment variables.'
    );
  }
  return app;
}

// Initialize on import if service account is available
if (serviceAccount && admin.apps.length === 0) {
  initializeAdminApp();
}


export const auth = admin.apps.length ? admin.auth() : undefined;
export const firestore = admin.apps.length ? admin.firestore() : undefined;
export { app };

// Helper to get the initialized app instance
export const getAdminApp = () => {
  if (!admin.apps.length) {
    if (serviceAccount) {
     return initializeAdminApp();
    } else {
      throw new Error("Firebase Admin SDK is not initialized. Ensure FIREBASE_SERVICE_ACCOUNT_KEY is set.");
    }
  }
  return admin.app();
};
