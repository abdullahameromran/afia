// This file is no longer used for Q&A history as we've migrated to Supabase.
// It's kept here in case other Firebase services (like Auth, if you decide to use Firebase Auth later)
// are added to the project. If no other Firebase services are planned, this file can be deleted.

// import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
// import { getFirestore, type Firestore } from 'firebase/firestore';

// const firebaseConfig: FirebaseOptions = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

// let app: FirebaseApp | null = null;
// let db: Firestore | null = null;

// if (typeof window !== 'undefined') { // Ensure this only runs on the client-side if needed, or handle server appropriately
//   if (!getApps().length) {
//     const isConfigValid = 
//       firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY_PLACEHOLDER" &&
//       firebaseConfig.authDomain && firebaseConfig.authDomain !== "YOUR_FIREBASE_AUTH_DOMAIN_PLACEHOLDER" &&
//       firebaseConfig.projectId && firebaseConfig.projectId !== "YOUR_FIREBASE_PROJECT_ID_PLACEHOLDER";
      // Add other necessary checks if those fields are critical for your Firebase setup

//     if (isConfigValid) {
//       try {
//         app = initializeApp(firebaseConfig);
//         console.log("Firebase App initialized (placeholder - Q&A history uses Supabase).");
//         // db = getFirestore(app); // Uncomment if you need Firestore for other features
//         // console.log("Firestore initialized (placeholder - Q&A history uses Supabase).");
//       } catch (initError) {
//         console.error("Error initializing Firebase App (placeholder config):", initError);
//         app = null;
//         db = null;
//       }
//     } else {
//       console.warn(
//         "Firebase configuration in .env for general Firebase services (not Q&A history) " +
//         "is missing, uses placeholder values, or is incomplete. Firebase App may not be initialized. " +
//         "Q&A history is handled by Supabase."
//       );
//     }
//   } else {
//     app = getApp();
//     console.log("Retrieved existing Firebase App instance (placeholder - Q&A history uses Supabase).");
//     // db = getFirestore(app); // Uncomment if you need Firestore for other features
//   }
// }

// export { app, db }; // db will be null if Firestore is not initialized here.
console.log("Firebase module (src/lib/firebase.ts) loaded. Q&A history now uses Supabase.");
export const app = null; // Mock export
export const db = null; // Mock export, as Q&A history is on Supabase
