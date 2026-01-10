import React, { useState } from 'react';
import { useFirestoreActions } from '../hooks/useFirestoreActions';
import { Screen } from '../types';

interface WasherRegistrationProps {
    navigate: (screen: Screen) => void;
    onBack?: () => void;
    initialData?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
    };
}

export const WasherRegistration = ({ navigate, onBack, initialData }: WasherRegistrationProps) => {
    const { submitWasherApplication } = useFirestoreActions();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Parse address if provided (simple heuristic)
    const initialAddress = initialData?.address || '';
    // This is a rough split, ideally address components are stored separately if possible
    // For now we just put the whole string in street or leave components empty if complexity is high

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        ssn: '', // Fixed duplicate key in original
        street: initialAddress, // Pre-fill full address in street for editing
        city: '',
        state: '',
        zip: '',
        address: '', // Kept for backward compat
        experience: '',
        vehicleType: '',
        vehicleModel: '',
        vehiclePlate: '',
        licenseNumber: '',
        licenseImage: null as string | null,
        carImage: null as string | null,
        equipmentImage: null as string | null
    });

    const formatPhoneNumber = (value: string) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        }
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    };

    const formatSSN = (value: string) => {
        if (!value) return value;
        const ssn = value.replace(/[^\d]/g, '');
        const ssnLength = ssn.length;
        if (ssnLength < 4) return ssn;
        if (ssnLength < 6) {
            return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
        }
        return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
    };

    const handleImageUpload = async (field: 'licenseImage' | 'carImage' | 'equipmentImage') => {
        try {
            const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');

            const image = await Camera.getPhoto({
                quality: 60,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera, // Force Camera Only
                width: 1024
            });

            if (image.dataUrl) {
                setFormData(prev => ({ ...prev, [field]: image.dataUrl as string }));
            }
        } catch (error: any) {
            console.error('Camera error:', error);
            if (error.message !== 'User cancelled photos app') {
                // Silent fail or alert
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`;
            await submitWasherApplication({
                ...formData,
                address: fullAddress, // Combine for backend
                role: 'washer',
                status: 'Applicant',
                submittedAt: Date.now()
            });
            setStep(3);
        } catch (error) {
            console.error('Failed to submit application:', error);
            // User will see loading state end, can retry
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 relative">
            <button
                onClick={() => onBack ? onBack() : navigate(Screen.LOGIN)}
                className="absolute top-4 left-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
            >
                <span className="material-symbols-outlined text-slate-400">arrow_back</span>
            </button>

            <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-white/10 max-h-[95vh] overflow-y-auto custom-scrollbar relative">
                <div className="text-center mb-8">
                    <div className="w-40 h-40 flex items-center justify-center mx-auto mb-6">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold">Join Our Team</h1>
                    <p className="text-slate-400">Become a Washer and earn on your schedule.</p>
                </div>

                {step === 1 && (
                    <form onSubmit={() => setStep(2)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-slate-400">PERSONAL DETAILS</label>
                            <input required type="text" placeholder="Full Name" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mb-3 text-white focus:border-primary focus:outline-none"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />

                            <input required type="email" placeholder="Email Address" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mb-3 text-white focus:border-primary focus:outline-none"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />

                            <input required type="tel" placeholder="Phone (555) 000-0000" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mb-3 text-white focus:border-primary focus:outline-none"
                                value={formData.phone} onChange={e => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })} maxLength={14} />

                            <input required type="text" placeholder="SSN (XXX-XX-XXXX)" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mb-3 text-white focus:border-primary focus:outline-none"
                                value={formData.ssn} onChange={e => setFormData({ ...formData, ssn: formatSSN(e.target.value) })} maxLength={11} />

                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 mt-4">Home Address</label>
                            <input required type="text" placeholder="Street Address (e.g. 123 Main St)" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mb-3 text-white focus:border-primary focus:outline-none"
                                value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} />

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <input required type="text" placeholder="City" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
                                    value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                <input required type="text" placeholder="State (TX)" maxLength={2} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none uppercase"
                                    value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value.toUpperCase() })} />
                            </div>
                            <input required type="text" placeholder="ZIP Code" maxLength={5} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
                                value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value.replace(/\D/g, '') })} />
                        </div>
                        <button className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20">Next: Requirements</button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-right max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">

                        {/* Driver's License */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Driver's License</label>
                            <input required type="text" placeholder="License Number" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mb-3 text-white"
                                value={formData.licenseNumber} onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })} />

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleImageUpload('licenseImage')}
                                    className="flex-1 cursor-pointer bg-black/30 border border-dashed border-white/20 rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-slate-400">id_card</span>
                                    <span className="text-xs text-slate-300">{formData.licenseImage ? 'License Uploaded' : 'Upload Photo'}</span>
                                </button>
                                {formData.licenseImage && <span className="material-symbols-outlined text-green-500">check_circle</span>}
                            </div>
                        </div>

                        {/* Vehicle Info */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Vehicle Details</label>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <input required type="text" placeholder="Make & Model" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white"
                                    value={formData.vehicleModel} onChange={e => setFormData({ ...formData, vehicleModel: e.target.value })} />
                                <input required type="text" placeholder="Plate Number" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white"
                                    value={formData.vehiclePlate} onChange={e => setFormData({ ...formData, vehiclePlate: e.target.value })} />
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleImageUpload('carImage')}
                                    className="flex-1 cursor-pointer bg-black/30 border border-dashed border-white/20 rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-slate-400">directions_car</span>
                                    <span className="text-xs text-slate-300">{formData.carImage ? 'Photo Uploaded' : 'Upload Car Photo'}</span>
                                </button>
                                {formData.carImage && <span className="material-symbols-outlined text-green-500">check_circle</span>}
                            </div>
                        </div>

                        {/* Equipment */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Equipment & Experience</label>
                            <select className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mb-3 text-white"
                                value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })}>
                                <option value="">Years of Experience...</option>
                                <option value="0-1">0-1 Years</option>
                                <option value="2-5">2-5 Years</option>
                                <option value="5+">5+ Years</option>
                            </select>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleImageUpload('equipmentImage')}
                                    className="flex-1 cursor-pointer bg-black/30 border border-dashed border-white/20 rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-slate-400">home_repair_service</span>
                                    <span className="text-xs text-slate-300">{formData.equipmentImage ? 'Photo Uploaded' : 'Upload Equipment'}</span>
                                </button>
                                {formData.equipmentImage && <span className="material-symbols-outlined text-green-500">check_circle</span>}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setStep(1)} className="flex-1 bg-white/5 py-3 rounded-xl font-bold hover:bg-white/10">Back</button>
                            <button type="submit" disabled={isLoading} className="flex-[2] bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary-dark disabled:opacity-50 shadow-lg shadow-primary/20">
                                {isLoading ? 'Submitting Application...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div className="text-center py-10 animate-in zoom-in">
                        <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
                        <h2 className="text-xl font-bold mb-2">Application Sent!</h2>
                        <p className="text-slate-400 mb-6">Our admin team will review your details.</p>
                        <button
                            onClick={() => onBack ? onBack() : navigate(Screen.LOGIN)}
                            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
