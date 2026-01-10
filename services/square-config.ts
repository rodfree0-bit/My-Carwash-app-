/**
 * Configuración de Square para el frontend
 */

// IMPORTANT: Replace with your actual Square Application ID
// Get this from: https://developer.squareup.com/apps
const SQUARE_APPLICATION_ID = process.env.REACT_APP_SQUARE_APPLICATION_ID || 'sandbox-sq0idb-YOUR_APP_ID';
const SQUARE_LOCATION_ID = process.env.REACT_APP_SQUARE_LOCATION_ID || 'YOUR_LOCATION_ID';

// Use sandbox for development, production for live
const SQUARE_ENVIRONMENT = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';

export const squareConfig = {
    applicationId: SQUARE_APPLICATION_ID,
    locationId: SQUARE_LOCATION_ID,
    environment: SQUARE_ENVIRONMENT,
};

export const COMPANY_INFO = {
    name: 'Premium Car Wash',
    logo: '/logo.png',
    address: 'Los Angeles, CA',
    phone: '(555) 123-4567',
};

/**
 * Loads Square Web Payments SDK
 */
export const loadSquareSDK = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        if ((window as any).Square) {
            resolve((window as any).Square);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://sandbox.web.squarecdn.com/v1/square.js'; // Use production URL for live
        script.async = true;
        script.onload = () => {
            if ((window as any).Square) {
                resolve((window as any).Square);
            } else {
                reject(new Error('Square SDK failed to load'));
            }
        };
        script.onerror = () => reject(new Error('Failed to load Square SDK'));
        document.head.appendChild(script);
    });
};
