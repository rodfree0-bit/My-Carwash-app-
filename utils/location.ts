
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 0.621371; // Convert to miles
};

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
};

// Utility function to check if a location is within service area
export const isWithinServiceArea = (
    clientLat: number,
    clientLng: number,
    serviceArea: any
): boolean => {
    if (!serviceArea || !serviceArea.centerLat || !serviceArea.centerLng || !serviceArea.radiusMiles) return true; // Default to allow if no config
    const distance = getDistance(clientLat, clientLng, serviceArea.centerLat, serviceArea.centerLng);
    return distance <= serviceArea.radiusMiles;
};

export const mockGeocodeZip = (address: string): { lat: number, lng: number } | null => {
    if (!address) return null;
    // Mock database of ZIP codes for Houston area
    const zipDb: { [key: string]: { lat: number, lng: number } } = {
        '77002': { lat: 29.7604, lng: -95.3698 }, // Downtown Houston
        '77005': { lat: 29.7174, lng: -95.4235 }, // West University
        '77019': { lat: 29.7547, lng: -95.4093 }, // River Oaks
        '77024': { lat: 29.7716, lng: -95.5132 }, // Memorial
        '77056': { lat: 29.7397, lng: -95.4624 }, // Galleria
        // Add a far away ZIP for testing failure
        '10001': { lat: 40.7128, lng: -74.0060 }, // NYC
    };

    // Extract ZIP from address string
    const zipMatch = address.match(/\b\d{5}\b/);
    if (zipMatch) {
        return zipDb[zipMatch[0]] || null;
    }

    // Fallback: If "Houston" is in address, return center (valid)
    if (address.toLowerCase().includes('houston')) {
        return { lat: 29.7604, lng: -95.3698 };
    }

    return null; // Cannot geocode
};
