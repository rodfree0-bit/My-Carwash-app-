import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.rodrigo.mycarwash.app',
    appName: 'My Carwash',
    webDir: 'dist',
    server: {
        // URL de producción de Firebase para actualizaciones instantáneas
        url: 'https://my-carwashapp-e6aba.web.app/',
        cleartext: true,
        allowNavigation: [
            'my-carwashapp-e6aba.web.app',
            '*.firebaseapp.com',
            '*.googleapis.com',
            '*.gstatic.com'
        ]
    },
    plugins: {
        PushNotifications: {
            presentationOptions: ["badge", "sound", "alert"],
        },
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: "#0F172A",
            showSpinner: true,
            androidSpinnerStyle: "large",
            spinnerColor: "#3B82F6"
        }
    },
    android: {
        allowMixedContent: true,
        captureInput: true,
        webContentsDebuggingEnabled: true
    }
};

export default config;
