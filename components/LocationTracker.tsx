import React, { useEffect, useState } from 'react';
import { useFirestoreActions } from '../hooks/useFirestoreActions';
import { useFirestoreData } from '../hooks/useFirestoreData';
import { Order, TeamMember } from '../types';
import { LocationService } from '../services/LocationService';

interface LocationTrackerProps {
    currentUser: TeamMember | null;
    orders: Order[];
}

export const LocationTracker: React.FC<LocationTrackerProps> = ({ currentUser, orders }) => {
    // const { orders } = useFirestoreData('washer'); // Removed redundant/incorrect hook usage
    const { updateOrderLocation } = useFirestoreActions();

    // Find if this washer has any active job that needs tracking
    const myActiveOrder = orders.find(o =>
        o.washerId === currentUser?.id &&
        (o.status === 'En Route' || o.status === 'In Progress')
    );

    useEffect(() => {
        // If no user, or not a washer, or no active order, stop tracking
        if (!currentUser || currentUser.role !== 'washer' || !myActiveOrder) {
            LocationService.stopTracking();
            return;
        }

        // Use centralized LocationService
        console.log("LocationTracker: Triggering tracking for Order:", myActiveOrder.id);
        LocationService.startTracking(currentUser.id, myActiveOrder.id)
            .catch(err => console.error("LocationTracker GPS Error:", err));

        return () => {
            // Cleanup is handled by LocationService.stopTracking if needed, 
            // but we usually want it to keep running if the component just re-renders.
            // However, for total safety on unmount:
            // LocationService.stopTracking(); 
        };
    }, [currentUser?.id, myActiveOrder?.id, myActiveOrder?.status]); // Re-run if order or status changes

    return null; // This component is invisible
};
