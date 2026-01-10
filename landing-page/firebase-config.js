// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWxSvJMlPjZTGwWJdOCRjGRdmhCDXfQCo",
    authDomain: "my-carwashapp-e6aba.firebaseapp.com",
    projectId: "my-carwashapp-e6aba",
    storageBucket: "my-carwashapp-e6aba.firebasestorage.app",
    messagingSenderId: "645765438290",
    appId: "1:645765438290:web:419b8a_gclid=CjRKCQiA5pnKBhCBARIsAC9tYmzJN1YNIczN00JIlLWEYiZMODcyNGY0ZLYhI~es~419b8a"
};

// This will be populated by the module script
let db = null;
let unsubscribeMessages = null;

// Export for use in other scripts
window.chatFirebase = {
    db: null,
    initialized: false
};
