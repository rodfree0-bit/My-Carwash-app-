import React, { useState, useRef, useEffect } from 'react';
import { VehicleTypeConfig, SavedVehicle } from '../types';
import { vehicleLookupService } from '../services/vehicleLookupService';

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (vehicle: { make: string; model: string; year: string; color: string; type: string; plate?: string }, image: string | null) => void;
    onDelete?: () => void;
    vehicleTypes: VehicleTypeConfig[];
    initialVehicle?: SavedVehicle | null;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onSave, onDelete, vehicleTypes, initialVehicle }) => {
    // Form State
    const [newVehicle, setNewVehicle] = useState({ make: '', model: '', year: '', color: '', plate: '', type: '' });
    const [newVehicleImage, setNewVehicleImage] = useState<string | null>(null);
    const vehicleInputRef = useRef<HTMLInputElement>(null);

    // Search API State
    const [makes, setMakes] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    // Generate Years (1990 - Next Year)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1989 }, (_, i) => (currentYear + 1 - i).toString());

    useEffect(() => {
        if (isOpen) {
            loadMakes();

            if (initialVehicle) {
                // Pre-fill for editing
                setNewVehicle({
                    make: initialVehicle.make,
                    model: initialVehicle.model,
                    year: initialVehicle.year,
                    color: initialVehicle.color,
                    plate: initialVehicle.plate || '',
                    type: initialVehicle.type
                });
                setSelectedMake(initialVehicle.make);
                setSelectedModel(initialVehicle.model);
                setNewVehicleImage(initialVehicle.image || null);
                // Load models for the selected make
                handleMakeChange(initialVehicle.make, true);
            } else {
                // Reset state for new vehicle
                setNewVehicle({ make: '', model: '', year: '', color: '', plate: '', type: vehicleTypes?.[0]?.id || '' });
                setNewVehicleImage(null);
                setSelectedMake('');
                setSelectedModel('');
            }
        }
    }, [isOpen, initialVehicle]);

    const loadMakes = async () => {
        const data = await vehicleLookupService.getMakes();
        setMakes(data);
    };

    const handleMakeChange = async (make: string, keepModel = false) => {
        setSelectedMake(make);
        setIsLoadingModels(true);
        const data = await vehicleLookupService.getModels(make);
        setModels(data);
        setIsLoadingModels(false);

        if (!keepModel) {
            setSelectedModel(''); // Reset model
            setNewVehicle(prev => ({ ...prev, make: make, model: '' }));
        }
    };

    const handleModelChange = (model: string) => {
        setSelectedModel(model);
        const suggestedId = vehicleLookupService.suggestCategory(selectedMake, model);

        // Find if we have this category in our config
        const foundType = vehicleTypes.find(t => t.id === suggestedId);

        setNewVehicle(prev => ({
            ...prev,
            model: model, // Store just the model name, not concatenated
            type: foundType ? foundType.id : (vehicleTypes?.[0]?.id || 'sedan') // Default to first available if not found
        }));
    };

    const [isProcessingImage, setIsProcessingImage] = useState(false);

    const handleVehicleImageChange = async () => {
        try {
            setIsProcessingImage(true);
            const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');

            const image = await Camera.getPhoto({
                quality: 60,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Photos, // User Request: Gallery logic only for Clients
                width: 1024
            });

            if (image.dataUrl) {
                setNewVehicleImage(image.dataUrl);
            }
        } catch (error: any) {
            console.error("Error processing image", error);
            if (error.message !== 'User cancelled photos app') {
                // Handle error
            }
        } finally {
            setIsProcessingImage(false);
        }
    };

    const handleSave = () => {
        if (!newVehicle.model || !newVehicle.color || !newVehicle.year || !newVehicle.make) {
            // Form validation - required fields are also marked in UI
            return;
        }

        // Explicitly construct a clean object with only primitive values
        const cleanVehicleData = {
            make: String(newVehicle.make),
            model: String(newVehicle.model),
            year: String(newVehicle.year),
            color: String(newVehicle.color),
            plate: newVehicle.plate ? String(newVehicle.plate) : '',
            type: String(newVehicle.type)
        };

        onSave(cleanVehicleData, newVehicleImage);
        onClose();
    };

    const handleDelete = () => {
        if (onDelete && confirm('Are you sure you want to delete this vehicle?')) {
            onDelete();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-surface-dark w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="font-bold text-xl">{initialVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Image Upload */}
                    <div className="w-full h-32 rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors" onClick={handleVehicleImageChange}>
                        {newVehicleImage ? (
                            <img src={newVehicleImage} className="w-full h-full object-cover rounded-xl" alt="Vehicle" />
                        ) : isProcessingImage ? (
                            <div className="flex flex-col items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined animate-spin mb-2">progress_activity</span>
                                <span className="text-xs">Processing...</span>
                            </div>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">add_a_photo</span>
                                <span className="text-xs text-slate-400">Tap to {initialVehicle ? 'change' : 'add'} photo</span>
                            </>
                        )}
                    </div>

                    <div className="space-y-4 animate-fadeIn">
                        {/* MAKE Select */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Make</label>
                            <select
                                className="w-full h-12 bg-slate-900 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-primary transition-colors appearance-none"
                                value={selectedMake}
                                onChange={(e) => handleMakeChange(e.target.value)}
                            >
                                <option value="" className="bg-slate-900 text-white">Select Make</option>
                                {makes.map(make => (
                                    <option key={make} value={make} className="bg-slate-900 text-white">{make}</option>
                                ))}
                            </select>
                        </div>

                        {/* MODEL Select */}
                        {selectedMake && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Model</label>
                                <div className="relative">
                                    <select
                                        className="w-full h-12 bg-slate-900 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-primary transition-colors appearance-none"
                                        value={selectedModel}
                                        onChange={(e) => handleModelChange(e.target.value)}
                                        disabled={isLoadingModels}
                                    >
                                        <option value="" className="bg-slate-900 text-white">{isLoadingModels ? 'Loading...' : 'Select Model'}</option>
                                        {models.map(model => (
                                            <option key={model} value={model} className="bg-slate-900 text-white">{model}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* YEAR Select */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Year</label>
                            <select
                                className="w-full h-12 bg-slate-900 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-primary transition-colors appearance-none"
                                value={newVehicle.year}
                                onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                            >
                                <option value="" className="bg-slate-900 text-white">Select Year</option>
                                {years.map(year => (
                                    <option key={year} value={year} className="bg-slate-900 text-white">{year}</option>
                                ))}
                            </select>
                        </div>

                        {/* Common Fields */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Color</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Black"
                                    value={newVehicle.color}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-slate-500"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="p-4 border-t border-white/10 bg-surface-dark pb-8 sm:pb-4 rounded-b-3xl flex gap-3">
                    {initialVehicle && onDelete && (
                        <button
                            onClick={handleDelete}
                            className="h-14 w-14 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500/20 transition-colors"
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={!newVehicle.model || !newVehicle.year || !newVehicle.color}
                        className="flex-1 h-14 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-blue"
                    >
                        <span className="material-symbols-outlined">check</span>
                        {initialVehicle ? 'Update Vehicle' : 'Save Vehicle'}
                    </button>
                </div>
            </div>
        </div>
    );
};
