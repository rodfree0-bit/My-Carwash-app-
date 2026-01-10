import React, { useRef, useEffect, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

interface AddressAutocompleteProps {
    label: string;
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    onAddressSelect: (address: string, lat: number, lng: number) => void;
    placeholder?: string;
}

// Define libraries as static constant to prevent infinite re-renders
const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry")[] = ['places', 'geometry'];

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
    label,
    defaultValue = '',
    value,
    onChange,
    onAddressSelect,
    placeholder = 'Enter address'
}) => {
    // Use the SAME ID as App.tsx to share the script instance
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries: GOOGLE_MAPS_LIBRARIES // Must match App.tsx exactly
    });

    const [inputValue, setInputValue] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);
    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // Sync internal state with controlled value if provided
    useEffect(() => {
        if (value !== undefined) {
            setInputValue(value);
        }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        if (onChange) onChange(val);
    };

    useEffect(() => {
        if (isLoaded && inputRef.current && !autoCompleteRef.current) {
            const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
                types: ['address'],
                fields: ['formatted_address', 'geometry', 'name'],
            });

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();

                if (place.geometry && place.geometry.location) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    const address = place.formatted_address || place.name || '';

                    setInputValue(address);
                    if (onChange) onChange(address);

                    onAddressSelect(address, lat, lng);
                }
            });

            autoCompleteRef.current = autocomplete;
        }
    }, [isLoaded, onChange, onAddressSelect]);

    return (
        <div>
            <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">{label}</label>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={!isLoaded}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-slate-500 pr-12 focus:outline-none focus:border-primary transition-colors"
                />
                {!isLoaded && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <span className="material-symbols-outlined animate-spin text-slate-500 text-sm">refresh</span>
                    </div>
                )}
            </div>
        </div>
    );
};
