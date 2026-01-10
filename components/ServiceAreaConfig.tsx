import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ServiceArea } from '../types';
import { GoogleMap, useJsApiLoader, Circle, Marker, InfoWindow } from '@react-google-maps/api';
import { getDistance } from '../utils/location';

interface ServiceAreaConfigProps {
    serviceArea: ServiceArea | null;
    onSave: (area: ServiceArea) => void;
}

const LA_CITIES = [
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    { name: 'Santa Monica', lat: 34.0195, lng: -118.4912 },
    { name: 'Beverly Hills', lat: 34.0736, lng: -118.4004 },
    { name: 'West Hollywood', lat: 34.0900, lng: -118.3617 },
    { name: 'Pasadena', lat: 34.1478, lng: -118.1445 },
    { name: 'Long Beach', lat: 33.7701, lng: -118.1937 },
    { name: 'Glendale', lat: 34.1425, lng: -118.2474 },
    { name: 'Burbank', lat: 34.1808, lng: -118.3090 },
    { name: 'Inglewood', lat: 33.9617, lng: -118.3531 },
    { name: 'Culver City', lat: 34.0211, lng: -118.3965 },
    { name: 'Torrance', lat: 33.8358, lng: -118.3406 },
    { name: 'Compton', lat: 33.8958, lng: -118.2201 },
    { name: 'Downey', lat: 33.9401, lng: -118.1332 },
    { name: 'Norwalk', lat: 33.9022, lng: -118.0817 },
    { name: 'Anaheim', lat: 33.8366, lng: -117.9143 },
    { name: 'Santa Ana', lat: 33.7455, lng: -117.8677 },
    { name: 'Irvine', lat: 33.6846, lng: -117.8265 },
    { name: 'Huntington Beach', lat: 33.6603, lng: -117.9992 },
    { name: 'Newport Beach', lat: 33.6189, lng: -117.9289 },
    { name: 'Malibu', lat: 34.0259, lng: -118.7798 }
];

const containerStyle = {
    width: '100%',
    height: '100%'
};

// Define libraries as static constant to prevent infinite re-renders
const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry")[] = ['places', 'geometry'];

export const ServiceAreaConfig: React.FC<ServiceAreaConfigProps> = ({ serviceArea, onSave }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries: GOOGLE_MAPS_LIBRARIES
    });

    const [centerLat, setCenterLat] = useState(serviceArea?.centerLat || 34.0522);
    const [centerLng, setCenterLng] = useState(serviceArea?.centerLng || -118.2437);
    const [radiusMiles, setRadiusMiles] = useState(serviceArea?.radiusMiles || 15);
    const [cityName, setCityName] = useState(serviceArea?.cityName || 'Los Angeles');
    const [map, setMap] = useState<google.maps.Map | null>(null);

    useEffect(() => {
        if (serviceArea) {
            setCenterLat(serviceArea.centerLat);
            setCenterLng(serviceArea.centerLng);
            setRadiusMiles(serviceArea.radiusMiles);
            setCityName(serviceArea.cityName || '');
        }
    }, [serviceArea]);

    const handleSave = () => {
        onSave({
            centerLat,
            centerLng,
            radiusMiles,
            cityName
        });
    };

    const coveredCities = useMemo(() => {
        return LA_CITIES.filter(city => {
            const dist = getDistance(city.lat, city.lng, centerLat, centerLng);
            return dist <= radiusMiles;
        });
    }, [centerLat, centerLng, radiusMiles]);

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback((map: google.maps.Map) => {
        setMap(null);
    }, []);

    // Update map view when center changes
    useEffect(() => {
        if (map) {
            map.panTo({ lat: centerLat, lng: centerLng });
        }
    }, [centerLat, centerLng, map]);

    if (!isLoaded) return <div className="w-full h-[800px] bg-slate-800 animate-pulse rounded-xl flex items-center justify-center text-slate-500">Loading Maps...</div>;

    return (
        <div className="bg-surface-dark rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row gap-6 h-[800px]">
            {/* Controls Side */}
            <div className="w-full md:w-1/3 flex flex-col h-full">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    Service Area
                </h3>

                <div className="mb-6 space-y-4">
                    <div>
                        <label className="block text-xs uppercase text-slate-400 font-bold mb-2">City Name</label>
                        <input
                            type="text"
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-slate-400 font-bold mb-2">
                            Radius: <span className="text-primary text-lg ml-1">{radiusMiles} miles</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="80"
                            value={radiusMiles}
                            onChange={(e) => setRadiusMiles(Number(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col bg-black/20 rounded-xl border border-white/5">
                    <div className="p-3 border-b border-white/5 bg-white/5">
                        <h4 className="font-bold text-sm">Covered Cities ({coveredCities.length})</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {coveredCities.map(city => (
                            <div key={city.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                <span className="text-sm font-bold">{city.name}</span>
                            </div>
                        ))}
                        {coveredCities.length === 0 && (
                            <p className="text-slate-500 text-sm text-center py-4">No cities in range</p>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full py-4 bg-primary rounded-xl font-bold text-black hover:bg-primary/90 transition-colors mt-4 flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">save</span>
                    Save Configuration
                </button>
            </div>

            {/* Map Side */}
            <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 relative z-0">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{ lat: centerLat, lng: centerLng }}
                    zoom={10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
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
                                featureType: "water",
                                elementType: "geometry",
                                stylers: [{ color: "#17263c" }],
                            },
                        ],
                        disableDefaultUI: true,
                        zoomControl: true,
                    }}
                >
                    {/* Radius Circle */}
                    <Circle
                        center={{ lat: centerLat, lng: centerLng }}
                        radius={radiusMiles * 1609.34} // miles to meters
                        options={{
                            fillColor: "#136dec",
                            fillOpacity: 0.2,
                            strokeColor: "#136dec",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            clickable: false,
                            draggable: false,
                            editable: false
                        }}
                    />

                    {/* Center Marker */}
                    <Marker
                        position={{ lat: centerLat, lng: centerLng }}
                        draggable={true}
                        onDragEnd={(e: google.maps.MapMouseEvent) => {
                            if (e.latLng) {
                                setCenterLat(e.latLng.lat());
                                setCenterLng(e.latLng.lng());
                            }
                        }}
                    />

                    {/* City Markers */}
                    {LA_CITIES.map(city => {
                        const isCovered = coveredCities.some(c => c.name === city.name);
                        return (
                            <Marker
                                key={city.name}
                                position={{ lat: city.lat, lng: city.lng }}
                                opacity={isCovered ? 1 : 0.5}
                                icon={{
                                    path: google.maps.SymbolPath.CIRCLE,
                                    scale: 5,
                                    fillColor: isCovered ? "#22c55e" : "#ef4444",
                                    fillOpacity: 1,
                                    strokeWeight: 0
                                }}
                                title={city.name}
                            />
                        );
                    })}

                </GoogleMap>

                {/* Legend Overlay */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm p-3 rounded-xl border border-white/10 z-10 w-fit">
                    <div className="flex items-center gap-2 text-xs mb-1">
                        <span className="w-3 h-3 rounded-full bg-primary/20 border border-primary"></span>
                        <span className="text-white">Service Area</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-400">
                        <span className="material-symbols-outlined text-sm">circle</span>
                        <span className="text-white">Covered City</span>
                    </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-xs text-white border border-white/20 z-10">
                    Drag the center marker to move service area
                </div>
            </div>
        </div>
    );
};
