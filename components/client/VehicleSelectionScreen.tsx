import React from 'react';
import { Screen, SavedVehicle, ToastType } from '../../types';

interface VehicleSelectionScreenProps {
    vehicles: SavedVehicle[];
    tempSelectedVehicles: string[];
    setTempSelectedVehicles: (ids: string[]) => void;
    setVehicleConfigs: (configs: any[]) => void;
    setSelectedVehicleIds: (ids: string[]) => void;
    setCurrentVehicleIndex: (index: number) => void;
    navigate: (screen: Screen) => void;
    setShowAddVehicleModal: (show: boolean) => void;
    showToast: (message: string, type: ToastType) => void;
    onEdit?: (vehicle: SavedVehicle) => void;
}

export const VehicleSelectionScreen: React.FC<VehicleSelectionScreenProps> = ({
    vehicles,
    tempSelectedVehicles,
    setTempSelectedVehicles,
    setVehicleConfigs,
    setSelectedVehicleIds,
    setCurrentVehicleIndex,
    navigate,
    setShowAddVehicleModal,
    showToast,
    onEdit
}) => {
    const handleVehicleToggle = (vehicleId: string) => {
        if (tempSelectedVehicles.includes(vehicleId)) {
            setTempSelectedVehicles(tempSelectedVehicles.filter(id => id !== vehicleId));
        } else {
            setTempSelectedVehicles([...tempSelectedVehicles, vehicleId]);
        }
    };

    const handleContinue = () => {
        if (tempSelectedVehicles.length === 0) {
            showToast('Please select at least one vehicle', 'error');
            return;
        }

        // Initialize vehicle configs
        const configs = (tempSelectedVehicles || []).map(vehicleId => {
            const vehicle = (vehicles || []).find(v => v.id === vehicleId);
            return {
                vehicleId,
                vehicleModel: vehicle?.model || '',
                vehicleType: vehicle?.type || 'sedan',
                packageId: '',
                addonIds: []
            };
        });

        setVehicleConfigs(configs);
        setSelectedVehicleIds(tempSelectedVehicles);
        setCurrentVehicleIndex(0);
        navigate(Screen.CLIENT_SERVICE_SELECT);
    };

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            <header className="flex items-center px-4 py-4 border-b border-white/5">
                <button onClick={() => navigate(Screen.CLIENT_HOME)}>
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h1 className="flex-1 text-center font-bold text-lg mr-6">Select Vehicles</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 pb-32">
                <p className="text-slate-400 text-sm mb-6">Choose one or more vehicles to wash</p>

                {(vehicles || []).length === 0 ? (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">directions_car</span>
                        <p className="text-slate-400 mb-6">No vehicles saved yet</p>
                        <button
                            onClick={() => setShowAddVehicleModal(true)}
                            className="px-6 py-3 bg-primary rounded-xl font-bold hover:bg-primary-dark transition-colors"
                        >
                            Add Your First Vehicle
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {(vehicles || []).map(vehicle => {
                            const isSelected = tempSelectedVehicles.includes(vehicle.id);
                            return (
                                <div key={vehicle.id} className="relative group">
                                    <button
                                        onClick={() => handleVehicleToggle(vehicle.id)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all text-left pr-14 ${isSelected
                                            ? 'border-primary bg-primary/10'
                                            : 'border-white/10 bg-surface-dark hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-slate-500'
                                                }`}>
                                                {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-lg">{vehicle.model}</p>
                                                <p className="text-sm text-slate-400">{vehicle.color} • {vehicle.plate}</p>
                                            </div>
                                            {vehicle.image ? (
                                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                                                    <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <span className="material-symbols-outlined text-slate-400">directions_car</span>
                                            )}
                                        </div>
                                    </button>

                                    {/* Edit Button */}
                                    {onEdit && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(vehicle);
                                            }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-slate-400 hover:text-white transition-colors z-10"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                        <button
                            onClick={() => setShowAddVehicleModal(true)}
                            className="w-full p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-primary/50 transition-colors flex items-center justify-center gap-2 text-slate-400 hover:text-primary"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Add Another Vehicle
                        </button>
                    </div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-background-dark via-background-dark to-transparent z-10">
                <button
                    onClick={handleContinue}
                    disabled={(tempSelectedVehicles || []).length === 0}
                    style={{ backgroundColor: '#3b82f6' }}
                    className="w-full h-14 rounded-xl font-bold text-lg hover:brightness-90 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-blue"
                >
                    Continue ({(tempSelectedVehicles || []).length} vehicle{(tempSelectedVehicles || []).length !== 1 ? 's' : ''})
                </button>
            </div>
        </div>
    );
};
