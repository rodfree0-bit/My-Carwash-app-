import { doc, updateDoc, setDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface Location {
    latitude: number;
    longitude: number;
    timestamp: number;
    accuracy?: number;
    heading?: number | null;
    speed?: number | null;
}

export class LocationService {
    private static watchId: number | null = null;
    private static isTracking = false;
    private static washerId: string | null = null;
    private static orderId: string | null = null;
    private static lastUpdateTimestamp = 0;
    private static readonly UPDATE_INTERVAL = 15000; // 15 seconds in ms (improved from 2min)

    /**
     * Start tracking washer location and update Firestore in real-time
     */
    static startTracking(washerId: string, orderId?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            // Update IDs if already tracking
            this.washerId = washerId;
            this.orderId = orderId || null;

            if (this.isTracking) {
                console.log('Location tracking already active, updated IDs');
                resolve();
                return;
            }

            this.isTracking = true;

            // Request location updates with robust options
            this.watchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const now = Date.now();

                    // Throttle updates based on UPDATE_INTERVAL
                    if (this.lastUpdateTimestamp > 0 && (now - this.lastUpdateTimestamp < this.UPDATE_INTERVAL)) {
                        return;
                    }

                    const location: Location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        timestamp: position.timestamp,
                        accuracy: position.coords.accuracy,
                        heading: position.coords.heading || null,
                        speed: position.coords.speed || null,
                    };

                    try {
                        this.lastUpdateTimestamp = now;

                        // Update washer's current location in Firestore
                        if (this.washerId) {
                            const washerRef = doc(db, 'team', this.washerId);
                            await setDoc(washerRef, {
                                currentLocation: location,
                                lastLocationUpdate: Timestamp.now(),
                            }, { merge: true });
                        }

                        // If tracking for a specific order, update order location too
                        if (this.orderId) {
                            const orderRef = doc(db, 'orders', this.orderId);
                            await updateDoc(orderRef, {
                                washerLocation: {
                                    lat: location.latitude,
                                    lng: location.longitude,
                                    timestamp: Timestamp.now()
                                },
                                lastLocationUpdate: Timestamp.now(),
                            });
                        }

                        console.log('Location updated (Internal 15s throttled):', location);
                    } catch (error) {
                        console.error('Error updating location Firestore:', error);
                    }
                },
                (error) => {
                    console.error('Geolocation tracking error:', error.code, error.message);

                    // If we get a timeout, it might be due to high accuracy being too strict
                    if (error.code === 3 && this.watchId !== null) {
                        console.warn('Geolocation timeout - Retrying with reduced accuracy');
                        // No need to clearWatch here as it keeps trying, but we could re-init if it persists
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 30000,     // Increased to 30s
                    maximumAge: 30000,   // Accept slightly older cached position to avoid timeouts
                }
            );

            resolve();
        });
    }

    /**
     * Force update tracking IDs without starting a new watch
     */
    static updateTrackingIds(washerId: string, orderId?: string): void {
        this.washerId = washerId;
        this.orderId = orderId || null;
        console.log('Updated tracking IDs:', { washerId, orderId });
    }

    /**
     * Stop tracking location
     */
    static stopTracking(): void {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
            this.isTracking = false;
            this.washerId = null;
            this.orderId = null;
            this.lastUpdateTimestamp = 0;
            console.log('Location tracking stopped');
        }
    }

    /**
     * Get current location once (no continuous tracking)
     */
    static getCurrentLocation(): Promise<Location> {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        timestamp: position.timestamp,
                        accuracy: position.coords.accuracy,
                        heading: position.coords.heading || null,
                        speed: position.coords.speed || null,
                    });
                },
                (error) => reject(error),
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 5000,
                }
            );
        });
    }

    /**
     * Subscribe to washer location updates from Firestore
     */
    static subscribeToWasherLocation(
        washerId: string,
        callback: (location: Location | null) => void
    ): () => void {
        const washerRef = doc(db, 'team', washerId);

        const unsubscribe = onSnapshot(washerRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                callback(data.currentLocation || null);
            } else {
                callback(null);
            }
        });

        return unsubscribe;
    }

    /**
     * Subscribe to order's washer location updates
     */
    static subscribeToOrderLocation(
        orderId: string,
        callback: (location: Location | null) => void
    ): () => void {
        const orderRef = doc(db, 'orders', orderId);

        const unsubscribe = onSnapshot(orderRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                callback(data.washerLocation || null);
            } else {
                callback(null);
            }
        });

        return unsubscribe;
    }

    /**
     * Calculate distance between two coordinates (in kilometers)
     */
    static calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
            Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Calculate estimated time of arrival (in minutes)
     */
    static calculateETA(
        currentLat: number,
        currentLon: number,
        destLat: number,
        destLon: number,
        averageSpeed: number = 40 // km/h
    ): number {
        const distance = this.calculateDistance(currentLat, currentLon, destLat, destLon);
        return Math.round((distance / averageSpeed) * 60); // Convert to minutes
    }

    /**
     * Calculate ETA using Google Maps Directions API (Real-time traffic)
     */
    /**
     * Calculate ETA using Google Maps Directions API (via Cloud Function Proxy)
     */
    static async getRouteETA(
        originLat: number,
        originLon: number,
        destLat: number,
        destLon: number
    ): Promise<{ duration: number; distance: number }> {
        try {
            const { functions } = await import('../firebase');
            const { httpsCallable } = await import('firebase/functions');

            const calculateRouteETA = httpsCallable(functions, 'calculateRouteETA');
            const result = await calculateRouteETA({
                originLat,
                originLon,
                destLat,
                destLon
            });

            const data = result.data as any;

            if (data.status === 'OK') {
                return {
                    duration: data.duration,
                    distance: data.distance
                };
            } else {
                console.warn('Route calculation returned non-OK status:', data);
                // Fallback
                const distance = this.calculateDistance(originLat, originLon, destLat, destLon);
                return {
                    duration: Math.round((distance / 40) * 60),
                    distance
                };
            }
        } catch (error) {
            console.error('Error fetching Google Maps ETA via proxy:', error);
            // Fallback
            const distance = this.calculateDistance(originLat, originLon, destLat, destLon);
            return {
                duration: Math.round((distance / 40) * 60),
                distance
            };
        }
    }

    private static toRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    /**
     * Check if location permissions are granted
     */
    static async checkPermissions(): Promise<boolean> {
        if (!navigator.permissions) {
            return false;
        }

        try {
            const result = await navigator.permissions.query({ name: 'geolocation' });
            return result.state === 'granted';
        } catch {
            return false;
        }
    }

    /**
     * Request location permissions
     */
    static async requestPermissions(): Promise<boolean> {
        try {
            const location = await this.getCurrentLocation();
            return !!location;
        } catch {
            return false;
        }
    }
}
