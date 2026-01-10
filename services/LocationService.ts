import { doc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface Location {
    latitude: number;
    longitude: number;
    timestamp: number;
    accuracy?: number;
    heading?: number;
    speed?: number;
}

export class LocationService {
    private static watchId: number | null = null;
    private static isTracking = false;

    /**
     * Start tracking washer location and update Firestore in real-time
     */
    static startTracking(washerId: string, orderId?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            if (this.isTracking) {
                console.log('Location tracking already active');
                resolve();
                return;
            }

            this.isTracking = true;

            // Request high-accuracy location updates
            this.watchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const location: Location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        timestamp: position.timestamp,
                        accuracy: position.coords.accuracy,
                        heading: position.coords.heading || undefined,
                        speed: position.coords.speed || undefined,
                    };

                    try {
                        // Update washer's current location in Firestore
                        const washerRef = doc(db, 'team', washerId);
                        await updateDoc(washerRef, {
                            currentLocation: location,
                            lastLocationUpdate: Timestamp.now(),
                        });

                        // If tracking for a specific order, update order location too
                        if (orderId) {
                            const orderRef = doc(db, 'orders', orderId);
                            await updateDoc(orderRef, {
                                washerLocation: location,
                                lastLocationUpdate: Timestamp.now(),
                            });
                        }

                        console.log('Location updated:', location);
                    } catch (error) {
                        console.error('Error updating location:', error);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.isTracking = false;
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 5000, // Accept cached position up to 5 seconds old
                }
            );

            resolve();
        });
    }

    /**
     * Stop tracking location
     */
    static stopTracking(): void {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
            this.isTracking = false;
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
                        heading: position.coords.heading || undefined,
                        speed: position.coords.speed || undefined,
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
    static async getRouteETA(
        originLat: number,
        originLon: number,
        destLat: number,
        destLon: number
    ): Promise<{ duration: number; distance: number }> {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.warn('Google Maps API Key not found, falling back to simple calculation');
            const distance = this.calculateDistance(originLat, originLon, destLat, destLon);
            return {
                duration: Math.round((distance / 40) * 60),
                distance
            };
        }

        try {
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLon}&destination=${destLat},${destLon}&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'OK' && data.routes.length > 0) {
                const leg = data.routes[0].legs[0];
                return {
                    duration: Math.ceil(leg.duration.value / 60), // minutes
                    distance: leg.distance.value / 1000 // km
                };
            }
            throw new Error(data.status || 'Failed to get directions');
        } catch (error) {
            console.error('Error fetching Google Maps ETA:', error);
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
