import React, { useEffect, useState, useRef } from 'react';

interface TrackingMapProps {
    washerLocation?: { lat: number; lng: number };
    clientLocation?: { lat: number; lng: number };
    status: string;
    serviceRadius?: number; // in miles
    washerName?: string;
    eta?: number | string; // in minutes
}

// Dark theme Google Maps style (Very clean)
const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
    { elementType: "labels.text.stroke", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ visibility: "off" }] },
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c2c54" }] },
    { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#474787" }] },
    { featureType: "road.highway", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1419" }] },
    { featureType: "water", elementType: "labels", stylers: [{ visibility: "off" }] }
];

const carIconSvg = `
<svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="20" width="40" height="60" rx="10" fill="#3b82f6" />
    <rect x="35" y="35" width="30" height="15" rx="2" fill="#1a1a2e" />
    <rect x="35" y="65" width="30" height="10" rx="2" fill="#1a1a2e" />
    <rect x="40" y="25" width="20" height="5" rx="1" fill="white" opacity="0.3" />
    <rect x="25" y="30" width="5" height="15" rx="2" fill="#333" />
    <rect x="70" y="30" width="5" height="15" rx="2" fill="#333" />
    <rect x="25" y="65" width="5" height="15" rx="2" fill="#333" />
    <rect x="70" y="65" width="5" height="15" rx="2" fill="#333" />
</svg>
`;

export const TrackingMap: React.FC<TrackingMapProps> = ({
    washerLocation,
    clientLocation,
    status,
    washerName = 'Washer',
    eta
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [washerMarker, setWasherMarker] = useState<google.maps.Marker | null>(null);
    const [routeLine, setRouteLine] = useState<google.maps.Polyline | null>(null);
    const [directionsService] = useState(() => new google.maps.DirectionsService());

    useEffect(() => {
        if (!mapRef.current || !clientLocation) return;
        const googleMap = new google.maps.Map(mapRef.current, {
            center: clientLocation,
            zoom: 15,
            styles: darkMapStyle,
            disableDefaultUI: true,
        });
        setMap(googleMap);

        new google.maps.Marker({
            position: clientLocation,
            map: googleMap,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#10b981',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
            },
            title: 'Customer'
        });
    }, [clientLocation]);

    const lastRouteUpdateRef = useRef<number>(0);
    const lastWasherPosRef = useRef<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (!map || !washerLocation || !clientLocation) return;

        // Skip if coordinates are invalid (0,0)
        if (washerLocation.lat === 0 && washerLocation.lng === 0) return;
        if (clientLocation.lat === 0 && clientLocation.lng === 0) return;

        const distanceMoved = lastWasherPosRef.current ?
            google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(washerLocation.lat, washerLocation.lng),
                new google.maps.LatLng(lastWasherPosRef.current.lat, lastWasherPosRef.current.lng)
            ) : Infinity;

        const timeSinceLastUpdate = Date.now() - lastRouteUpdateRef.current;
        const needsRouteUpdate = !routeLine || distanceMoved > 200 || timeSinceLastUpdate > 120000;

        const handleMarkersOnly = (heading: number = 0) => {
            const rotatedSvg = carIconSvg.replace('<svg', `<svg style="transform: rotate(${heading}deg); transition: transform 0.5s ease-out;"`);

            if (!washerMarker) {
                const marker = new google.maps.Marker({
                    position: washerLocation,
                    map: map,
                    icon: {
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(rotatedSvg),
                        scaledSize: new google.maps.Size(45, 45),
                        anchor: new google.maps.Point(22.5, 22.5),
                    },
                    title: washerName
                });
                setWasherMarker(marker);
            } else {
                // Use custom animation for smooth movement
                const startPos = washerMarker.getPosition();
                if (startPos) {
                    let frames = 0;
                    const totalFrames = 60; // 1 second animation at 60fps
                    const animate = () => {
                        frames++;
                        const fraction = frames / totalFrames;
                        if (fraction <= 1) {
                            const lat = startPos.lat() + (washerLocation.lat - startPos.lat()) * fraction;
                            const lng = startPos.lng() + (washerLocation.lng - startPos.lng()) * fraction;
                            washerMarker.setPosition({ lat, lng });
                            requestAnimationFrame(animate);
                        }
                    };
                    animate();
                } else {
                    washerMarker.setPosition(washerLocation);
                }

                washerMarker.setIcon({
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(rotatedSvg),
                    scaledSize: new google.maps.Size(45, 45),
                    anchor: new google.maps.Point(22.5, 22.5),
                });
            }

            if (!routeLine) {
                const line = new google.maps.Polyline({
                    path: [washerLocation, clientLocation],
                    strokeColor: '#3b82f6',
                    strokeOpacity: 0,
                    strokeWeight: 3,
                    map: map,
                    visible: false
                });
                setRouteLine(line);
            } else {
                // If we don't need a full route update, just update the direct line if that's what we're using
                if (!needsRouteUpdate && routeLine.getPath().getLength() === 2) {
                    routeLine.setPath([washerLocation, clientLocation]);
                }
            }

            const bounds = new google.maps.LatLngBounds();
            bounds.extend(washerLocation);
            bounds.extend(clientLocation);
            map.fitBounds(bounds, { top: 150, bottom: 200, left: 50, right: 50 });
        };

        if (needsRouteUpdate) {
            directionsService.route(
                { origin: washerLocation, destination: clientLocation, travelMode: google.maps.TravelMode.DRIVING },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK && result) {
                        lastRouteUpdateRef.current = Date.now();
                        lastWasherPosRef.current = washerLocation;

                        const path = result.routes[0].overview_path;
                        let heading = 0;
                        if (path.length > 1) {
                            heading = google.maps.geometry.spherical.computeHeading(path[0], path[1]);
                        }

                        if (!routeLine) {
                            const line = new google.maps.Polyline({
                                path,
                                strokeColor: '#3b82f6',
                                strokeOpacity: 0.8,
                                strokeWeight: 5,
                                map: map,
                            });
                            setRouteLine(line);
                        } else {
                            routeLine.setPath(path);
                            routeLine.setVisible(true);
                            routeLine.setOptions({ strokeOpacity: 0.8, strokeWeight: 5 });
                        }

                        // Update marker with heading
                        handleMarkersOnly(heading);

                        const bounds = new google.maps.LatLngBounds();
                        path.forEach(p => bounds.extend(p));
                        map.fitBounds(bounds, { top: 150, bottom: 200, left: 50, right: 50 });
                    } else {
                        handleMarkersOnly();
                    }
                }
            );
        } else {
            // Just updated marker position smoothly
            handleMarkersOnly();
        }
    }, [map, washerLocation, clientLocation, washerMarker, routeLine, washerName, directionsService]);

    return (
        <div className="absolute inset-0 z-0">
            <div ref={mapRef} className="w-full h-full" />

            {/* Map Overlay Info */}
            <div className="absolute top-20 right-4 flex flex-col items-end gap-3 z-10">
                {/* ETA Badge */}
                {eta && (
                    <div className="bg-primary/90 backdrop-blur-xl px-5 py-3 rounded-3xl border border-white/20 shadow-blue-lg animate-fade-in flex flex-col items-center min-w-[100px]">
                        <span className="text-[10px] font-black text-black/60 uppercase tracking-widest mb-0.5">Arriving In</span>
                        <span className="text-2xl font-black text-white">{typeof eta === 'number' ? `${eta} min` : eta}</span>
                    </div>
                )}
            </div>

            <div className="absolute bottom-32 right-4 flex flex-col items-end gap-2 z-10">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">LIVE GPS v3.0</span>
                </div>
                {(!washerLocation || (washerLocation.lat === 0 && washerLocation.lng === 0)) && (
                    <div className="bg-orange-500/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-orange-400/50 shadow-lg animate-bounce">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Waiting for GPS Signal...</span>
                    </div>
                )}
            </div>
        </div>
    );
};
