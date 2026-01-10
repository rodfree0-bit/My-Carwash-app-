import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { LocationService, Location } from '../services/LocationService';
import './LiveMap.css';

const containerStyle = {
    width: '100%',
    height: '100%'
};

const defaultCenter = {
    lat: 34.0522,
    lng: -118.2437
};

const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry")[] = ['places', 'geometry'];

interface LiveMapProps {
    orderId?: string;
    washerId?: string;
    washerLocation?: { lat: number; lng: number };
    clientLocation?: { lat: number; lng: number };
    status: string;
}

export const LiveMap: React.FC<LiveMapProps> = ({
    orderId,
    washerId,
    washerLocation: initialWasherLocation,
    clientLocation = defaultCenter,
    status
}) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries: GOOGLE_MAPS_LIBRARIES
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
    const [washerLocation, setWasherLocation] = useState<{ lat: number; lng: number } | null>(initialWasherLocation || null);
    const [distance, setDistance] = useState<number | null>(null);
    const [eta, setETA] = useState<number | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    // Subscribe to real-time washer location updates
    useEffect(() => {
        if (!orderId && !washerId) return;

        let unsubscribe: (() => void) | null = null;

        const subscribeToLocation = (location: Location | null) => {
            if (location) {
                setWasherLocation({
                    lat: location.latitude,
                    lng: location.longitude
                });
                setLastUpdate(new Date(location.timestamp));

                // Calculate distance and ETA
                if (clientLocation) {
                    const dist = LocationService.calculateDistance(
                        location.latitude,
                        location.longitude,
                        clientLocation.lat,
                        clientLocation.lng
                    );
                    setDistance(dist);

                    const estimatedETA = LocationService.calculateETA(
                        location.latitude,
                        location.longitude,
                        clientLocation.lat,
                        clientLocation.lng
                    );
                    setETA(estimatedETA);
                }
            }
        };

        // Subscribe to order location if orderId is provided
        if (orderId) {
            unsubscribe = LocationService.subscribeToOrderLocation(orderId, subscribeToLocation);
        }
        // Otherwise subscribe to washer location if washerId is provided
        else if (washerId) {
            unsubscribe = LocationService.subscribeToWasherLocation(washerId, subscribeToLocation);
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [orderId, washerId, clientLocation]);

    // Calculate route when washer is en route
    useEffect(() => {
        if (isLoaded && status === 'En Route' && washerLocation && clientLocation) {
            const directionsService = new google.maps.DirectionsService();
            directionsService.route({
                origin: washerLocation,
                destination: clientLocation,
                travelMode: google.maps.TravelMode.DRIVING
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setDirectionsResponse(result);
                }
            });
        }
    }, [isLoaded, status, washerLocation, clientLocation]);

    // Auto-center map to show both markers
    useEffect(() => {
        if (map && washerLocation && clientLocation) {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(washerLocation);
            bounds.extend(clientLocation);
            map.fitBounds(bounds);
        }
    }, [map, washerLocation, clientLocation]);

    if (!isLoaded) return <div className="w-full h-full bg-slate-800 animate-pulse rounded-xl"></div>;

    return (
        <div className="w-full h-64 rounded-xl overflow-hidden relative border border-white/10 shadow-inner">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={clientLocation || defaultCenter}
                zoom={13}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    disableDefaultUI: true,
                    zoomControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    styles: [
                        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                        {
                            featureType: "administrative.locality",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry",
                            stylers: [{ color: "#38414e" }],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#212a37" }],
                        },
                        {
                            featureType: "road",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#9ca5b3" }],
                        },
                        {
                            featureType: "water",
                            elementType: "geometry",
                            stylers: [{ color: "#17263c" }],
                        },
                    ]
                }}
            >
                {/* Client Marker */}
                <Marker
                    position={clientLocation}
                    icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeColor: "white",
                        strokeWeight: 2,
                    }}
                    label={{ text: "You", color: "white", className: "mt-[-40px] font-bold" }}
                />

                {/* Washer Marker */}
                {washerLocation && status !== 'Pending' && status !== 'Completed' && (
                    <Marker
                        position={washerLocation}
                        icon={{
                            path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
                            fillColor: "#136dec",
                            fillOpacity: 1,
                            strokeWeight: 1,
                            strokeColor: "white",
                            scale: 1.5,
                            anchor: new google.maps.Point(12, 12)
                        }}
                    />
                )}

                {/* Route */}
                {directionsResponse && (
                    <DirectionsRenderer
                        directions={directionsResponse}
                        options={{
                            suppressMarkers: true,
                            polylineOptions: {
                                strokeColor: "#136dec",
                                strokeWeight: 5
                            }
                        }}
                    />
                )}
            </GoogleMap>

            {/* Status Badge */}
            <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full text-xs text-white backdrop-blur-sm z-10">
                Status: <span className="text-primary font-bold uppercase">{status}</span>
            </div>

            {/* Live Tracking Info */}
            {washerLocation && distance !== null && eta !== null && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-xl p-3 z-10 border border-white/10">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-400 font-bold">Live Tracking</span>
                        </div>
                        <div className="flex gap-4 text-xs text-white">
                            <div>
                                <span className="text-slate-400">Distance: </span>
                                <span className="font-bold">{distance.toFixed(1)} km</span>
                            </div>
                            <div>
                                <span className="text-slate-400">ETA: </span>
                                <span className="font-bold text-primary">{eta} min</span>
                            </div>
                        </div>
                    </div>
                    {lastUpdate && (
                        <div className="text-[10px] text-slate-500 mt-1">
                            Last updated: {lastUpdate.toLocaleTimeString()}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
