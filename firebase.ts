import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, isSupported } from 'firebase/messaging';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({})
});

export const analytics = getAnalytics(app);

// Initialize messaging safely for WebView
let msg: any = null;
isSupported().then(supported => {
  if (supported) {
    msg = getMessaging(app);
    console.log("📨 Firebase Messaging initialized");
  } else {
    console.warn("⚠️ Firebase Messaging not supported in this environment");
  }
}).catch(err => console.warn("⚠️ Error checking Messaging support:", err));

export const messaging = msg;
export const auth = getAuth(app);

// Enforce local persistence so the session survives app restarts
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.error('❌ Error setting Auth persistence:', err);
});

export const storage = getStorage(app);
console.log("🔥 Initializing Firebase Functions in region: us-central1");
export const functions = getFunctions(app, 'us-central1');
