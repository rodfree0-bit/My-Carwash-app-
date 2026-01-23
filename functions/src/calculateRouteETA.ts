/**
 * Cloud Function: calculateRouteETA
 * 
 * Calcula el ETA usando Google Maps Directions API
 * Con CORS habilitado para evitar errores de preflight
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Inicializar Admin SDK si no está inicializado
if (!admin.apps.length) {
    admin.initializeApp();
}

interface ETARequest {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
}

interface ETAResponse {
    success: boolean;
    etaMinutes?: number;
    distance?: string;
    duration?: string;
    error?: string;
}

export const calculateRouteETA = functions.https.onCall(
    async (data: any, context) => {
        try {
            console.log('🗺️ calculateRouteETA called:', data);

            // Validar datos de entrada
            if (!data.origin || !data.destination) {
                throw new functions.https.HttpsError(
                    'invalid-argument',
                    'Origin and destination are required'
                );
            }

            const { origin, destination } = data as ETARequest;

            // Obtener Google Maps API Key desde configuración de Firebase
            const googleMapsApiKey = functions.config().google?.maps_api_key;

            if (!googleMapsApiKey) {
                console.error('❌ Google Maps API Key not configured');
                throw new functions.https.HttpsError(
                    'failed-precondition',
                    'Google Maps API Key not configured'
                );
            }

            // Construir URL de Directions API
            const url = `https://maps.googleapis.com/maps/api/directions/json?` +
                `origin=${origin.lat},${origin.lng}&` +
                `destination=${destination.lat},${destination.lng}&` +
                `mode=driving&` +
                `departure_time=now&` +
                `traffic_model=best_guess&` +
                `key=${googleMapsApiKey}`;

            console.log('📍 Calling Google Maps Directions API...');

            // Hacer request a Google Maps usando https module
            const https = await import('https');

            const apiResponse: any = await new Promise((resolve, reject) => {
                https.get(url, (res) => {
                    let data = '';
                    res.on('data', (chunk) => data += chunk);
                    res.on('end', () => {
                        try {
                            resolve(JSON.parse(data));
                        } catch (e) {
                            reject(e);
                        }
                    });
                }).on('error', reject);
            });

            const result = apiResponse;

            if (result.status !== 'OK') {
                console.error('❌ Google Maps API error:', result.status, result.error_message);
                throw new functions.https.HttpsError(
                    'internal',
                    `Google Maps API error: ${result.status}`
                );
            }

            // Extraer información de la ruta
            const route = result.routes[0];
            const leg = route.legs[0];

            const durationInTraffic = leg.duration_in_traffic || leg.duration;
            const etaMinutes = Math.ceil(durationInTraffic.value / 60);

            console.log(`✅ ETA calculated: ${etaMinutes} minutes`);

            return {
                success: true,
                etaMinutes,
                distance: leg.distance.text,
                duration: durationInTraffic.text
            };

        } catch (error: any) {
            console.error('❌ Error calculating ETA:', error);

            // Si es un HttpsError, re-lanzarlo
            if (error instanceof functions.https.HttpsError) {
                throw error;
            }

            // Para otros errores, devolver un error genérico
            throw new functions.https.HttpsError(
                'internal',
                'Failed to calculate ETA',
                error.message
            );
        }
    }
);
