import React from 'react';
import { etaService } from '../../services/etaService';

interface ETADisplayProps {
    washerLocation: { lat: number; lng: number } | null;
    clientLocation: { lat: number; lng: number };
    washerName?: string;
    showRoute?: boolean;
}

export const ETADisplay: React.FC<ETADisplayProps> = ({
    washerLocation,
    clientLocation,
    washerName = 'Washer',
    showRoute = false
}) => {
    const [eta, setETA] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (!washerLocation) {
            setETA(null);
            setIsLoading(false);
            return;
        }

        const updateETA = async () => {
            try {
                const result = await etaService.calculateETA(washerLocation, clientLocation);
                if (result) {
                    setETA(result);
                } else {
                    // Fallback
                    const simpleETA = etaService.calculateSimpleETA(washerLocation, clientLocation);
                    setETA(simpleETA);
                }
            } catch (error) {
                console.error('Error calculating ETA:', error);
                const simpleETA = etaService.calculateSimpleETA(washerLocation, clientLocation);
                setETA(simpleETA);
            } finally {
                setIsLoading(false);
            }
        };

        updateETA();

        // Update every 10 seconds
        const interval = setInterval(updateETA, 10000);

        return () => clearInterval(interval);
    }, [washerLocation, clientLocation]);

    if (!washerLocation || !eta) {
        return null;
    }

    const minutes = Math.floor(eta.durationValue / 60);
    const color = etaService.getETAColor(minutes);

    return (
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-4 border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl">directions_car</span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Your washer</p>
                        <p className="font-bold text-lg">{washerName}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Arriving in</p>
                    <p
                        className="text-3xl font-bold animate-pulse"
                        style={{ color }}
                    >
                        {isLoading ? '...' : eta.duration}
                    </p>
                </div>
            </div>

            {/* Distance & Route Info */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">route</span>
                    <span className="text-sm font-medium">{eta.distance} away</span>
                </div>
                {showRoute && (
                    <button className="text-sm text-primary font-bold hover:underline">
                        View Route
                    </button>
                )}
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>Live tracking • Updates every 10s</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>On the way</span>
                    <span>{minutes < 5 ? 'Almost there!' : 'In progress'}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-1000 ease-out"
                        style={{
                            width: `${Math.min(100, (1 - minutes / 30) * 100)}%`,
                            backgroundColor: color
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
