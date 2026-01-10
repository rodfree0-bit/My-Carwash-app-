import React, { useEffect, useState } from 'react';
import { useFirestoreActions } from '../hooks/useFirestoreActions';
import { useFirestoreData } from '../hooks/useFirestoreData';
import { Order, TeamMember } from '../types';

interface LocationTrackerProps {
    currentUser: TeamMember | null;
    orders: Order[];
}

export const LocationTracker: React.FC<LocationTrackerProps> = ({ currentUser, orders }) => {
    // const { orders } = useFirestoreData('washer'); // Removed redundant/incorrect hook usage
    const { updateOrderLocation } = useFirestoreActions();
    const [activeWatchId, setActiveWatchId] = useState<number | null>(null);

    // Find if this washer has any active job that needs tracking
    const myActiveOrder = orders.find(o =>
        o.washerId === currentUser?.id &&
        (o.status === 'En Route' || o.status === 'In Progress')
    );

    useEffect(() => {
        // If no user, or not a washer, or no active order, stop tracking
        if (!currentUser || currentUser.role !== 'washer' || !myActiveOrder) {
            if (activeWatchId !== null) {
                console.log("Stopping GPS Tracker - No active order");
                navigator.geolocation.clearWatch(activeWatchId);
                setActiveWatchId(null);
            }
            return;
        }

        // Kickstart GPS permission and first position immediately
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                console.log("GPS Kickstart Success:", latitude, longitude);
                updateOrderLocation(myActiveOrder.id, { lat: latitude, lng: longitude });
            },
            (err) => console.warn("GPS Kickstart Error:", err),
            { enableHighAccuracy: true }
        );

        // Start tracking if not already tracking
        if (activeWatchId === null) {
            console.log("Starting GPS Tracker for Order:", myActiveOrder.id);

            const id = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // console.log("GPS Update:", latitude, longitude);

                    // Send update to Firestore (Debouncing could be added here if needed, but Firestore handles frequent writes okay for small scale)
                    updateOrderLocation(myActiveOrder.id, { lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error("GPS Tracking Error:", error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }
            );

            setActiveWatchId(id);
        }

        return () => {
            // Cleanup on unmount or if dependencies change significantly
            if (activeWatchId !== null) {
                navigator.geolocation.clearWatch(activeWatchId);
            }
        };
    }, [currentUser, myActiveOrder?.id, myActiveOrder?.status]); // Re-run if order changes

    return null; // This component is invisible
};
