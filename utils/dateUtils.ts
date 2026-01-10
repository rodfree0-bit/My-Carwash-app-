
export interface FirestoreTimestamp {
    seconds: number;
    nanoseconds: number;
}

export const parseSafeDate = (date: any): Date => {
    if (!date) return new Date();

    // Firestore Timestamp
    if (typeof date === 'object' && 'seconds' in date) {
        return new Date(date.seconds * 1000);
    }

    // ISO String or other date string
    if (typeof date === 'string') {
        const lowerDate = date.toLowerCase().trim();
        const now = new Date();

        if (lowerDate === 'hoy' || lowerDate === 'today' || lowerDate === 'asap') {
            return now;
        }

        if (lowerDate === 'mañana' || lowerDate === 'tomorrow') {
            const tomorrow = new Date();
            tomorrow.setDate(now.getDate() + 1);
            return tomorrow;
        }

        const parsed = new Date(date);
        return isNaN(parsed.getTime()) ? now : parsed;
    }

    // Milliseconds or Date object
    const finalDate = new Date(date);
    return isNaN(finalDate.getTime()) ? new Date() : finalDate;
};

export const formatSafeDate = (date: any): string => {
    const d = parseSafeDate(date);
    return d.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
};

export const formatSafeTime = (date: any): string => {
    const d = parseSafeDate(date);
    return d.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
};
