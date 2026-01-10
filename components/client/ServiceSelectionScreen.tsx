import React from 'react';
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
    packages,
    packagesError,
    addons,
    vehicles,
    selectedVehicleIds,
    currentVehicleIndex,
    vehicleConfigs,
    setVehicleConfigs,
    setCurrentVehicleIndex,
    navigate,
    showToast
}) => {
    const currentVehicleId = selectedVehicleIds[currentVehicleIndex];
    const currentVehicle = vehicles.find(v => v.id === currentVehicleId);
    const currentConfig = vehicleConfigs[currentVehicleIndex];
    const currentVehicleType = currentVehicle?.type || 'sedan';
    const isLastVehicle = currentVehicleIndex === selectedVehicleIds.length - 1;

    // DEBUG: Log packages data
    console.log('📦 ServiceSelectionScreen DEBUG:', {
        packagesCount: packages.length,
        packages: packages,
        addonsCount: addons.length,
        currentVehicleType: currentVehicleType,
        vehiclesCount: vehicles.length
    });

    const handlePackageSelect = (packageId: string) => {
        const newConfigs = [...vehicleConfigs];
        newConfigs[currentVehicleIndex] = {
            ...newConfigs[currentVehicleIndex],
            packageId
        };
        setVehicleConfigs(newConfigs);
    };

    const handleAddonToggle = (addonId: string) => {
        const newConfigs = [...vehicleConfigs];
        const currentAddonIds = newConfigs[currentVehicleIndex].addonIds || [];

        if (currentAddonIds.includes(addonId)) {
            newConfigs[currentVehicleIndex].addonIds = currentAddonIds.filter((id: string) => id !== addonId);
        } else {
            newConfigs[currentVehicleIndex].addonIds = [...currentAddonIds, addonId];
        }

        setVehicleConfigs(newConfigs);
    };

    const handleNext = () => {
        console.log('🎯 ServiceSelectionScreen handleNext called');
        console.log('   currentConfig:', currentConfig);
        console.log('   isLastVehicle:', isLastVehicle);

        if (!currentConfig?.packageId) {
            console.log('❌ No package selected');
            showToast('Please select a package', 'error');
            return;
        }

        console.log('✅ Package selected, navigating...');
        if (isLastVehicle) {
            console.log('📅 Navigating to CLIENT_DATE_TIME');
            navigate(Screen.CLIENT_DATE_TIME);
        } else {
            console.log('➡️ Moving to next vehicle');
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
                <button onClick={handlePrevious}>
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h1 className="flex-1 text-center font-bold text-lg mr-6">Select Services</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 pb-32">
                {/* Vehicle Progress */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-400">
                            Vehicle {currentVehicleIndex + 1} of {selectedVehicleIds.length}
                        </p>
                        <p className="text-sm font-bold">{currentVehicle?.model}</p>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${((currentVehicleIndex + 1) / selectedVehicleIds.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Packages Section */}
                <div className="space-y-4 mb-6">
                    <h2 className="text-sm text-slate-400 uppercase font-bold">Select Package (Required)</h2>

                    {/* Validación: Mostrar mensaje si hay error o no hay paquetes */}
                    {packagesError || packages.length === 0 ? (
                        <div className="p-6 rounded-xl bg-red-500/10 border-2 border-red-500/30 text-center">
                            <span className="material-symbols-outlined text-5xl text-red-400 mb-3">error</span>
                            <h3 className="font-bold text-lg text-red-400 mb-2">No Packages Available</h3>
                            <p className="text-sm text-slate-400 mb-4">
                                {packagesError || 'There are no service packages configured. Please contact support.'}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold hover:brightness-110"
                            >
                                Retry Connection
                            </button>
                            {/* DEBUG INFO FOR ANDROID */}
                            <div className="mt-4 p-2 bg-gray-900 rounded text-xs text-left overflow-hidden">
                                <p className="text-gray-400 font-bold">Debug Info:</p>
                                <pre className="whitespace-pre-wrap text-gray-500">
                                    {JSON.stringify({
                                        pkgCount: packages.length,
                                        hasError: !!packagesError,
                                        errorMsg: packagesError,
                                        loading: packages.length === 0 && !packagesError ? 'Possibly' : 'No',
                                        // timestamp: new Date().toISOString()
                                    }, null, 2)}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        packages.map(pkg => {
                            const isSelected = currentConfig?.packageId === pkg.id;
                            const price = pkg.price?.[currentVehicleType as VehicleType] || 0;

                            return (
                                <button
                                    key={pkg.id}
                                    onClick={() => handlePackageSelect(pkg.id)}
                                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${isSelected
                                        ? 'border-primary bg-primary/10'
                                        : 'border-white/10 bg-surface-dark hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-slate-500'
                                                }`}>
                                                {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{pkg.name}</h3>
                                                <p className="text-sm text-slate-400">{pkg.description}</p>
                                            </div>
                                        </div>
                                        <p className="text-xl font-bold text-primary">${price}</p>
                                    </div>
                                    {pkg.features && (
                                        <div className="flex flex-wrap gap-2 mt-2 ml-8">
                                            {pkg.features.map((feature, i) => (
                                                <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded-full">{feature}</span>
                                            ))}
                                        </div>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Add-ons Section */}
                <div className="space-y-4">
                    <h2 className="text-sm text-slate-400 uppercase font-bold">Add-ons (Optional)</h2>
                    {addons.length === 0 ? (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <p className="text-slate-400 text-sm">No add-ons available at this time</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-xs text-slate-500">Note: Add-ons require a package selection</p>
                            {addons.map(addon => {
                                const isSelected = currentConfig?.addonIds?.includes(addon.id);
                                const price = addon.price[currentVehicleType as VehicleType];
                                const isDisabled = !currentConfig?.packageId;

                                return (
                                    <button
                                        key={addon.id}
                                        onClick={() => !isDisabled && handleAddonToggle(addon.id)}
                                        disabled={isDisabled}
                                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${isDisabled
                                            ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
                                            : isSelected
                                                ? 'border-primary bg-primary/10'
                                                : 'border-white/10 bg-surface-dark hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-slate-500'
                                                    }`}>
                                                    {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">{addon.name}</h3>
                                                    <p className="text-sm text-slate-400">{addon.description}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-primary">+${price}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-background-dark via-background-dark to-transparent z-10">
                <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    style={canProceed ? { backgroundColor: '#3b82f6' } : {}}
                    className={`w-full h-14 rounded-xl font-bold text-lg transition-all ${canProceed
                        ? 'hover:brightness-90 text-white shadow-blue'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    {isLastVehicle ? 'Continue to Date & Time' : `Next: ${vehicles.find(v => v.id === selectedVehicleIds[currentVehicleIndex + 1])?.model || 'Next Vehicle'}`}
                </button>
                {/* Spacer for iPhone Home Indicator if needed extra */}
                <div className="h-[env(safe-area-inset-bottom)]"></div>
            </div>
        </div>
    );
};
