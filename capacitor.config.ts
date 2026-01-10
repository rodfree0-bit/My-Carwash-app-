import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.carwash.app',
  appName: 'My Carwash App',
  webDir: 'dist',

  server: {
    androidScheme: 'https',
    allowNavigation: [
      'https://www.google.com/*',
      'https://maps.google.com/*',
      'https://maps.apple.com/*'
    ]
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a0a0a', // Dark background matching your app
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#3b82f6', // Blue color matching your primary
      splashFullScreen: true,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
