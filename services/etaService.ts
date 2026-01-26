// Real-time ETA calculation using Google Maps Directions API
import { Loader } from '@googlemaps/js-api-loader';

interface RouteInfo {
    distance: string; // "2.5 km"
    duration: string; // "15 mins"
    durationValue: number; // seconds
    polyline: string; // encoded polyline for map
}

class ETAService {
    private directionsService: google.maps.DirectionsService | null = null;
    private isInitialized = false;
    private apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyApkyQssD6hO2Ff3s9CENYEmOhNyGo24DE';

    async initialize() {
        if (this.isInitialized) return;

        try {
            const loader = new Loader({
                apiKey: this.apiKey,
                version: 'weekly',
                libraries: ['places', 'geometry']
            });

            await loader.load();
            this.directionsService = new google.maps.DirectionsService();
            this.isInitialized = true;
            console.log('✅ ETA Service initialized');
        } catch (error) {
            console.error('❌ Error initializing ETA Service:', error);
        }
    }

    async calculateETA(
        origin: { lat: number; lng: number },
        destination: { lat: number; lng: number }
    ): Promise<RouteInfo | null> {
        if (!this.directionsService) {
            await this.initialize();
        }

        if (!this.directionsService) {
            console.error('❌ Directions service not available');
            return null;
        }

        try {
            const request: google.maps.DirectionsRequest = {
                origin: new google.maps.LatLng(origin.lat, origin.lng),
                destination: new google.maps.LatLng(destination.lat, destination.lng),
                travelMode: google.maps.TravelMode.DRIVING,
                drivingOptions: {
                    departureTime: new Date(),
                    trafficModel: google.maps.TrafficModel.BEST_GUESS
                }
            };

            const result = await this.directionsService.route(request);

            if (result.routes && result.routes.length > 0) {
                const route = result.routes[0];
                const leg = route.legs[0];

                return {
                    distance: leg.distance?.text || 'Unknown',
                    duration: leg.duration_in_traffic?.text || leg.duration?.text || 'Unknown',
                    durationValue: leg.duration_in_traffic?.value || leg.duration?.value || 0,
                    polyline: route.overview_polyline || ''
                };
            }

            return null;
        } catch (error) {
            console.error('❌ Error calculating ETA:', error);
            return null;
        }
    }

    // Fallback: Calculate ETA using straight-line distance
    calculateSimpleETA(
        origin: { lat: number; lng: number },
        destination: { lat: number; lng: number }
    ): RouteInfo {
        const distance = this.calculateDistance(origin, destination);
        const avgSpeed = 40; // km/h average city speed
        const durationHours = distance / avgSpeed;
        const durationMinutes = Math.ceil(durationHours * 60);

        return {
            distance: `${distance.toFixed(1)} km`,
            duration: `${durationMinutes} min`,
            durationValue: durationMinutes * 60,
            polyline: ''
        };
    }

    private calculateDistance(
        point1: { lat: number; lng: number },
        point2: { lat: number; lng: number }
    ): number {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(point2.lat - point1.lat);
        const dLon = this.toRad(point2.lng - point1.lng);
        const lat1 = this.toRad(point1.lat);
        const lat2 = this.toRad(point2.lat);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private toRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    // Format duration for display
    formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }

    // Get color based on ETA (for UI)
    getETAColor(minutes: number): string {
        if (minutes <= 10) return '#10b981'; // green
        if (minutes <= 20) return '#f59e0b'; // amber
        return '#ef4444'; // red
    }
}

export const etaService = new ETAService();

// Hook for real-time ETA updates
export const useRealTimeETA = (
    washerLocation: { lat: number; lng: number } | null,
    clientLocation: { lat: number; lng: number } | null,
    updateInterval = 15000 // 15 seconds (matching LocationService)
) => {
    const [eta, setETA] = React.useState<RouteInfo | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (!washerLocation || !clientLocation) {
            setETA(null);
            return;
        }

        const updateETA = async () => {
            setIsLoading(true);
            try {
                const result = await etaService.calculateETA(washerLocation, clientLocation);
                if (result) {
                    setETA(result);
                } else {
                    // Fallback to simple calculation
                    const simpleETA = etaService.calculateSimpleETA(washerLocation, clientLocation);
                    setETA(simpleETA);
                }
            } catch (error) {
                console.error('Error updating ETA:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Initial calculation
        updateETA();

        // Update every X seconds
        const interval = setInterval(updateETA, updateInterval);

        return () => clearInterval(interval);
    }, [washerLocation, clientLocation, updateInterval]);

    return { eta, isLoading };
};

// React import (add at top of file where used)
import React from 'react';
