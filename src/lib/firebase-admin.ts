
import * as admin from 'firebase-admin';

// Parse and potentially correct the service account JSON from environment variable
let serviceAccount: admin.ServiceAccount | undefined;
const serviceAccountJsonString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (serviceAccountJsonString) {
  try {
    const parsedFromJson = JSON.parse(serviceAccountJsonString) as admin.ServiceAccount;
    // Correct common issue with escaped newlines in private_key from environment variables
    if (parsedFromJson.private_key && typeof parsedFromJson.private_key === 'string') {
      parsedFromJson.private_key = parsedFromJson.private_key.replace(/\\n/g, '\n');
    }
    serviceAccount = parsedFromJson;
  } catch (e) {
    console.error(
      "Error parsing FIREBASE_SERVICE_ACCOUNT_KEY. Ensure it's a valid JSON string. Error:",
      e
    );
    // serviceAccount remains undefined
  }
}

let app: admin.app.App;

export function initializeAdminApp() {
  if (admin.apps.length === 0 && serviceAccount) {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
     console.log('Firebase Admin SDK initialized');
  } else if (admin.apps.length > 0) {
    app = admin.app(); // Use existing app if already initialized
  } else {
    // This case implies serviceAccount was not valid or not present
    console.warn(
      'Firebase Admin SDK not initialized. Service account key might be missing, invalid in environment variables, or failed to parse.'
    );
    // To prevent errors if `app` is used later without being initialized:
    // Option 1: Throw an error if initialization is critical
    // throw new Error("Firebase Admin SDK cannot be initialized: Service Account key is missing or invalid.");
    // Option 2: Allow `app` to remain undefined, and let consuming code handle it (current behavior)
  }
  return app; // Returns the app instance, or undefined if initialization failed and wasn't already initialized
}

// Initialize on import if service account is available and no apps are initialized yet
if (serviceAccount && admin.apps.length === 0) {
  try {
    initializeAdminApp();
  } catch(initError) {
    console.error("Auto-initialization of Firebase Admin SDK failed:", initError);
    // app might remain undefined
  }
} else if (admin.apps.length > 0 && !app) {
  // If apps exist but global `app` isn't set (e.g. due to module execution order)
  app = admin.app();
}


export const auth = app ? admin.auth(app) : undefined;
export const firestore = app ? admin.firestore(app) : undefined;
export { app }; // Export the app instance, which might be undefined

// Helper to get the initialized app instance or try to initialize
export const getAdminApp = (): admin.app.App => {
  if (app) {
    return app;
  }
  // If app is not set, try to initialize.
  // initializeAdminApp() should be idempotent or handle existing admin.apps.
  const initializedApp = initializeAdminApp();
  if (!initializedApp) {
    throw new Error("Firebase Admin SDK could not be initialized and no app instance is available.");
  }
  return initializedApp;
};
