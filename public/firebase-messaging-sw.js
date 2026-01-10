// Give the service worker access to Firebase Messaging.
// Note: We cannot import from ../firebase.ts here because SW runs in a different context.
// We must import via CDN or build process. For simplicity in Vite, we often use importScripts in public file if not building SW.

// However, standard Firebase SW setup:
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const firebaseConfig = {
    // We need to hardcode configs here or use a build step to inject them. 
    // Accessing 'process.env' or 'import.meta' is not directly possible in a static public SW without build step.
    // For the purpose of this task I will use placeholders that need to be replaced, 
    // OR I can read them from a URL param if I register the SW with params, but that's complex.
    // I will fallback to assuming the user can fill this or I will read the values from the existing firebase.ts content I saw earlier.
    apiKey: "AIzaSyCPPR8D8Jk1hMWR2IHBCxSG7u5S3XKnSsk",
    authDomain: "my-carwashapp-e6aba.firebaseapp.com",
    projectId: "my-carwashapp-e6aba",
    storageBucket: "my-carwashapp-e6aba.firebasestorage.app",
    messagingSenderId: "1095794498344",
    appId: "1:1095794498344:web:515d51f8f2561ad7a84e1d",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here if needed
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo.webp' // Ensure logo.webp exists in public
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
