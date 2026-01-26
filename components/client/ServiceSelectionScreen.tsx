import React, { useState } from 'react';
import { Screen, ServicePackage, ServiceAddon, SavedVehicle, VehicleType, ToastType } from '../../types';

interface ServiceSelectionScreenProps {
    packages: ServicePackage[];
    packagesError: string | null;
    addons: ServiceAddon[];
    vehicles: SavedVehicle[];
    selectedVehicleIds: string[];
    currentVehicleIndex: number;
    vehicleConfigs: any[];
    setVehicleConfigs: (configs: any[]) => void;
    setCurrentVehicleIndex: (index: number) => void;
    navigate: (screen: Screen) => void;
    showToast: (message: string, type: ToastType) => void;
}

export const ServiceSelectionScreen: React.FC<ServiceSelectionScreenProps> = ({
    packages: propPackages,
    packagesError,
    addons: propAddons,
    vehicles: propVehicles,
    selectedVehicleIds: propSelectedVehicleIds,
    currentVehicleIndex,
    vehicleConfigs: propVehicleConfigs,
    setVehicleConfigs,
    setCurrentVehicleIndex,
    navigate,
    showToast
}) => {
    // Stability Normalization
    const packages = Array.isArray(propPackages) ? propPackages : [];
    const addons = Array.isArray(propAddons) ? propAddons : [];
    const vehicles = Array.isArray(propVehicles) ? propVehicles : [];
    const selectedVehicleIds = Array.isArray(propSelectedVehicleIds) ? propSelectedVehicleIds : [];
    const vehicleConfigs = Array.isArray(propVehicleConfigs) ? propVehicleConfigs : [];

    const currentVehicleId = selectedVehicleIds[currentVehicleIndex];
    const currentVehicle = vehicles.find(v => v.id === currentVehicleId);
    const currentConfig = vehicleConfigs[currentVehicleIndex];
    const currentVehicleType = currentVehicle?.type || 'sedan';
    const isLastVehicle = currentVehicleIndex === (selectedVehicleIds.length - 1);

    const handlePackageSelect = (packageId: string) => {
        const newConfigs = [...vehicleConfigs];
        newConfigs[currentVehicleIndex] = {
            ...newConfigs[currentVehicleIndex],
            packageId,
            addonIds: [] // Clear addons on package change to be safe
        };
        setVehicleConfigs(newConfigs);
    };

    const handleAddonToggle = (addonId: string) => {
        const newConfigs = [...vehicleConfigs];
        const currentAddonIds = newConfigs[currentVehicleIndex]?.addonIds || [];

        if (currentAddonIds.includes(addonId)) {
            newConfigs[currentVehicleIndex].addonIds = currentAddonIds.filter((id: string) => id !== addonId);
        } else {
            newConfigs[currentVehicleIndex].addonIds = [...currentAddonIds, addonId];
        }

        setVehicleConfigs(newConfigs);
    };

    const handleNext = () => {
        if (!currentConfig?.packageId) {
            showToast('Please select a package', 'error');
            return;
        }

        if (isLastVehicle) {
            navigate(Screen.CLIENT_DATE_TIME);
        } else {
            setCurrentVehicleIndex(currentVehicleIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentVehicleIndex > 0) {
            setCurrentVehicleIndex(currentVehicleIndex - 1);
        } else {
            navigate(Screen.CLIENT_VEHICLE);
        }
    };

    const canProceed = !!currentConfig?.packageId;

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            <header className="flex items-center px-4 py-4 border-b border-white/5">
                <button onClick={handlePrevious} className="p-2 -ml-2">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h1 className="flex-1 text-center font-bold text-lg mr-8">Select Services</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 pb-32">
                {/* Vehicle Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                            Vehicle {currentVehicleIndex + 1} of {selectedVehicleIds.length}
                        </p>
                        <p className="text-sm font-black text-primary">{currentVehicle?.model || 'Unknown'}</p>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 shadow-blue"
                            style={{ width: `${((currentVehicleIndex + 1) / (selectedVehicleIds.length || 1)) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Packages Section */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-xs text-slate-500 uppercase font-black tracking-widest px-1">Select Wash Package</h2>

                    {packagesError ? (
                        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center animate-shake">
                            <span className="material-symbols-outlined text-4xl text-red-500 mb-2">error</span>
                            <p className="text-sm text-red-400">{packagesError}</p>
                        </div>
                    ) : packages.length === 0 ? (
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">inventory_2</span>
                            <p className="text-slate-500 text-sm">Loading service packages...</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {packages.map((pkg) => {
                                const isSelected = currentConfig?.packageId === pkg.id;
                                const price = pkg.price?.[currentVehicleType as VehicleType] || 0;

                                return (
                                    <button
                                        key={pkg.id}
                                        onClick={() => handlePackageSelect(pkg.id)}
                                        className={`w-full text-left p-5 rounded-[2rem] border-2 transition-all active:scale-[0.98] ${isSelected ? 'bg-primary border-primary shadow-blue-lg' : 'bg-surface-dark border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-white bg-white/10' : 'border-slate-500'}`}>
                                                    {isSelected && <span className="material-symbols-outlined text-sm font-black">check</span>}
                                                </div>
                                                <h3 className={`font-black text-lg ${isSelected ? 'text-white' : 'text-slate-200'}`}>{pkg.name}</h3>
                                            </div>
                                            <p className={`font-black text-xl ${isSelected ? 'text-white' : 'text-primary'}`}>${price}</p>
                                        </div>
                                        <p className={`text-sm mb-4 line-clamp-2 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                                            {pkg.description}
                                        </p>

                                        {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {pkg.features.slice(0, 3).map((f, i) => (
                                                    <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${isSelected ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-500'}`}>
                                                        {f}
                                                    </span>
                                                ))}
                                                {pkg.features.length > 3 && (
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${isSelected ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-500'}`}>
                                                        +{pkg.features.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Add-ons Section */}
                <div className="space-y-4">
                    <h2 className="text-xs text-slate-500 uppercase font-black tracking-widest px-1">Extra Enhancements</h2>

                    {!currentConfig?.packageId ? (
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center opacity-50">
                            <p className="text-xs text-slate-600 italic">Please select a wash package first to enable add-ons.</p>
                        </div>
                    ) : addons.length === 0 ? (
                        <div className="p-4 rounded-xl text-center">
                            <p className="text-slate-500 text-xs italic">No additional enhancements available.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {addons.map((addon) => {
                                const isSelected = (currentConfig?.addonIds || []).includes(addon.id);
                                const price = addon.price?.[currentVehicleType as VehicleType] || 0;

                                return (
                                    <button
                                        key={addon.id}
                                        onClick={() => handleAddonToggle(addon.id)}
                                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${isSelected ? 'bg-primary/10 border-primary shadow-blue' : 'bg-surface-dark border-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-slate-500'}`}>
                                                {isSelected && <span className="material-symbols-outlined text-xs font-black">check</span>}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-200">{addon.name}</h4>
                                                <p className="text-[10px] text-slate-500 line-clamp-1">{addon.description}</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-primary text-sm">+${price}</p>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Button Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent backdrop-blur-sm">
                <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className={`w-full h-14 rounded-2xl font-black text-lg transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 ${canProceed ? 'bg-primary text-white shadow-blue-lg hover:brightness-110' : 'bg-white/5 text-slate-600 grayscale cursor-not-allowed'
                        }`}
                >
                    {isLastVehicle ? 'Schedule Wash' : 'Next: Service next vehicle'}
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};
