import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ServiceAreaMapProps {
    center: [number, number];
    radius: number; // in meters
    washerLocation?: [number, number];
    clientLocation?: [number, number];
    showRadius?: boolean;
}

const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

export const ServiceAreaMap: React.FC<ServiceAreaMapProps> = ({
    center,
    radius,
    washerLocation,
    clientLocation,
    showRadius = true
}) => {
    const [mapCenter, setMapCenter] = useState(center);

    useEffect(() => {
        if (washerLocation) {
            setMapCenter(washerLocation);
        } else if (clientLocation) {
            setMapCenter(clientLocation);
        } else {
            setMapCenter(center);
        }
    }, [washerLocation, clientLocation, center]);

    // Custom icons
    const washerIcon = new L.Icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="#136dec" stroke="white" stroke-width="3"/>
                <text x="20" y="26" font-size="20" text-anchor="middle" fill="white">🚗</text>
            </svg>
        `),
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });

    const clientIcon = new L.Icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="#10b981" stroke="white" stroke-width="3"/>
                <text x="20" y="26" font-size="20" text-anchor="middle" fill="white">📍</text>
            </svg>
        `),
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden">
            <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <MapController center={mapCenter} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Service Area Circle */}
                {showRadius && (
                    <Circle
                        center={center}
                        radius={radius}
                        pathOptions={{
                            color: '#136dec',
                            fillColor: '#136dec',
                            fillOpacity: 0.1,
                            weight: 2,
                            dashArray: '10, 10'
                        }}
                    />
                )}

                {/* Washer Location */}
                {washerLocation && (
                    <Marker position={washerLocation} icon={washerIcon}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-bold">Washer Location</p>
                                <p className="text-xs text-slate-600">On the way to you!</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Client Location */}
                {clientLocation && (
                    <Marker position={clientLocation} icon={clientIcon}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-bold">Your Location</p>
                                <p className="text-xs text-slate-600">Service address</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Center Marker (Service Area Center) */}
                {!washerLocation && !clientLocation && (
                    <Marker position={center}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-bold">Service Area Center</p>
                                <p className="text-xs text-slate-600">
                                    Radius: {(radius / 1000).toFixed(1)} km
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white dark:bg-surface-dark rounded-xl shadow-lg p-3 z-[1000]">
                <div className="space-y-2 text-xs">
                    {showRadius && (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary/20"></div>
                            <span className="font-bold">Service Area</span>
                        </div>
                    )}
                    {washerLocation && (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-primary"></div>
                            <span>Washer</span>
                        </div>
                    )}
                    {clientLocation && (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <span>Client</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Distance Info */}
            {washerLocation && clientLocation && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-surface-dark rounded-full shadow-lg px-4 py-2 z-[1000]">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">near_me</span>
                        <span className="font-bold">
                            {calculateDistance(washerLocation, clientLocation)} km away
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper function to calculate distance
function calculateDistance(point1: [number, number], point2: [number, number]): string {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(point2[0] - point1[0]);
    const dLon = toRad(point2[1] - point1[1]);
    const lat1 = toRad(point1[0]);
    const lat2 = toRad(point2[0]);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d.toFixed(1);
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}
