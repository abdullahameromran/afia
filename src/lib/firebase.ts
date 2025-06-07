
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // Uncomment if you plan to use Firebase Auth

// Your web app's Firebase configuration
// IMPORTANT: Replace placeholder values in .env with your actual Firebase project config
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
let app;
if (!getApps().length) {
  if (
    !firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_FIREBASE_API_KEY" ||
    !firebaseConfig.projectId || firebaseConfig.projectId === "YOUR_FIREBASE_PROJECT_ID"
  ) {
    console.warn(
      "Firebase configuration is missing or uses placeholder values. " +
      "Please update .env with your actual Firebase project credentials. " +
      "Firestore integration will not work correctly until this is resolved."
    );
    // Fallback to prevent app crash, but Firestore will not be functional
    app = ({}); // Empty object to prevent errors, but not a functional app
  } else {
     app = initializeApp(firebaseConfig);
  }
} else {
  app = getApp();
}

let db;
// Check if app is a valid FirebaseApp instance before calling getFirestore
// This primarily checks if initializeApp was successful with valid config
if (app && typeof app.options === 'object' && app.options.projectId) {
  db = getFirestore(app);
} else {
  // Provide a non-functional fallback if Firebase couldn't initialize
  db = {
    // Mock methods or leave empty if preferred, to prevent runtime errors on db usage
    // This ensures that if Firebase isn't configured, calls to db won't immediately crash
    // but features relying on it won't work.
    collection: () => ({
      addDoc: async () => { console.warn("Firestore not initialized. Skipping addDoc."); },
      getDocs: async () => { console.warn("Firestore not initialized. Skipping getDocs."); return { docs: [], forEach: () => {} }; },
      // Add other methods as needed for type compatibility or to prevent errors
    }),
    // Add other Firestore top-level methods your app might use here if needed
  } as any; // Cast to any to satisfy type expectations, acknowledge it's a fallback
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "YOUR_FIREBASE_PROJECT_ID") {
     // This warning is already covered, but keeping it for db-specific context
     console.warn("Firestore is not initialized due to missing or placeholder Firebase config.");
  }
}


// const auth = getAuth(app); // Uncomment if you plan to use Firebase Auth

export { app, db /*, auth */ };
