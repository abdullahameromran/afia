
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
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
let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (!getApps().length) {
  const isConfigValid = 
    firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY" && // Check against actual placeholder
    firebaseConfig.authDomain && firebaseConfig.authDomain !== "YOUR_FIREBASE_AUTH_DOMAIN" &&
    firebaseConfig.projectId && firebaseConfig.projectId !== "YOUR_FIREBASE_PROJECT_ID" &&
    firebaseConfig.storageBucket && firebaseConfig.storageBucket !== "YOUR_FIREBASE_STORAGE_BUCKET" &&
    firebaseConfig.messagingSenderId && firebaseConfig.messagingSenderId !== "YOUR_FIREBASE_MESSAGING_SENDER_ID" &&
    firebaseConfig.appId && firebaseConfig.appId !== "YOUR_FIREBASE_APP_ID";

  if (isConfigValid) {
    try {
      app = initializeApp(firebaseConfig);
      console.log("Firebase App initialized successfully.");
      try {
        db = getFirestore(app);
        console.log("Firestore initialized successfully.");
      } catch (firestoreError) {
        console.error("Error initializing Firestore from newly initialized app:", firestoreError);
        db = null; // Ensure db is null on Firestore init error
      }
    } catch (initError) {
      console.error("Error initializing Firebase App:", initError);
      app = null; // Ensure app is null on init error
      db = null;  // And db is also null
    }
  } else {
    console.warn(
      "Firebase configuration in .env is missing, uses placeholder values, or is incomplete. " +
      "Firebase App and Firestore will not be initialized. " +
      "Please update .env with your actual Firebase project credentials. " +
      "Required fields: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, NEXT_PUBLIC_FIREBASE_APP_ID."
    );
    // app and db remain null
  }
} else {
  app = getApp(); // If apps already exist, assume it was initialized correctly.
  console.log("Retrieved existing Firebase App instance.");
  try {
    db = getFirestore(app); // Attempt to get Firestore instance.
    console.log("Firestore initialized from existing app.");
  } catch (firestoreError) {
     console.error("Error getting Firestore from existing app:", firestoreError);
     db = null; // db remains null if getFirestore fails
  }
}

// const auth = app ? getAuth(app) : null; // Uncomment if you plan to use Firebase Auth, ensure app is not null

export { app, db /*, auth */ };
