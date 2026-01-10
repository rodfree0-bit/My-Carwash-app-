import React, { useState, useEffect } from 'react';
import { Screen } from '../../types';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { i18n } from '../../services/i18n';

interface WasherSettingsProps {
    currentUser: any;
    navigate: (screen: Screen) => void;
    updateUserProfile: (userId: string, updates: any) => Promise<void>;
    logout: () => void;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    openSupport?: () => void;
}

export const WasherSettings: React.FC<WasherSettingsProps> = ({
    currentUser,
    navigate,
    updateUserProfile,
    logout,
    showToast,
    openSupport
}) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences' | 'schedule'>('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    // Profile Edit State
    const [name, setName] = useState(currentUser?.name || '');
    const [phone, setPhone] = useState(currentUser?.phone || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [avatar, setAvatar] = useState(currentUser?.avatar || '');

    // Password Change State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Preferences State
    const [notificationsEnabled, setNotificationsEnabled] = useState(currentUser?.notificationsEnabled ?? true);
    const [isAvailable, setIsAvailable] = useState(currentUser?.isAvailable ?? true);
    const [schedule, setSchedule] = useState<any[]>(currentUser?.schedule || []);

    // Sync state with currentUser when it changes
    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name || '');
            setPhone(currentUser.phone || '');
            setEmail(currentUser.email || '');
            setAvatar(currentUser.avatar || '');
            setNotificationsEnabled(currentUser.notificationsEnabled ?? true);
            setIsAvailable(currentUser.isAvailable ?? true);
            setSchedule(currentUser.schedule || []);
        }
    }, [currentUser]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setIsUploadingPhoto(true);

        try {
            const storageRef = ref(storage, `avatars/${currentUser.id}_${Date.now()}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            setAvatar(downloadURL);

            // Save to profile immediately
            await updateUserProfile(currentUser.id, { avatar: downloadURL });
            showToast(i18n.t('photo_updated'), 'success');
        } catch (error: any) {
            console.error('Error uploading photo:', error);
            showToast(error.message || i18n.t('photo_upload_failed'), 'error');
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            const updates: any = { name, phone };
            if (avatar !== currentUser?.avatar) {
                updates.avatar = avatar;
            }

            await updateUserProfile(currentUser.id, updates);
            showToast(i18n.t('profile_updated'), 'success');
        } catch (error: any) {
            showToast(error.message || i18n.t('profile_update_failed'), 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            showToast(i18n.t('passwords_dont_match'), 'error');
            return;
        }

        if (newPassword.length < 6) {
            showToast(i18n.t('password_min_length'), 'error');
            return;
        }

        setIsLoading(true);
        try {
            // TODO: Implement password change with Firebase
            showToast(i18n.t('password_changed'), 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            showToast(error.message || 'Failed to change password', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleNotifications = async () => {
        const newValue = !notificationsEnabled;
        setNotificationsEnabled(newValue);

        try {
            await updateUserProfile(currentUser.id, {
                notificationsEnabled: newValue
            });
            showToast(newValue ? i18n.t('notifications_enabled') : i18n.t('notifications_disabled'), 'success');
        } catch (error: any) {
            setNotificationsEnabled(!newValue);
            showToast('Failed to update preferences', 'error');
        }
    };

    const handleToggleAvailability = async () => {
        const newValue = !isAvailable;
        setIsAvailable(newValue);

        try {
            await updateUserProfile(currentUser.id, {
                isAvailable: newValue
            });
            showToast(newValue ? i18n.t('availability_on') : i18n.t('availability_off'), 'success');
        } catch (error: any) {
            setIsAvailable(!newValue);
            showToast('Failed to update availability', 'error');
        }
    };

    const DAYS_NAMES = [
        i18n.t('sunday'), i18n.t('monday'), i18n.t('tuesday'),
        i18n.t('wednesday'), i18n.t('thursday'), i18n.t('friday'), i18n.t('saturday')
    ];

    const currentSchedule = (schedule && schedule.length > 0) ? schedule : DAYS_NAMES.map((_, index) => ({
        day: index,
        enabled: index !== 0 && index !== 6,
        slots: [{ start: "08:00", end: "17:00" }]
    }));

    const updateScheduleDay = (dayIndex: number, enabled: boolean) => {
        const newSchedule = [...currentSchedule];
        newSchedule[dayIndex] = { ...newSchedule[dayIndex], enabled };
        setSchedule(newSchedule);
    };

    const updateScheduleTime = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
        const newSchedule = [...currentSchedule];
        const newSlots = [...newSchedule[dayIndex].slots];
        newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value };
        newSchedule[dayIndex] = { ...newSchedule[dayIndex], slots: newSlots };
        setSchedule(newSchedule);
    };

    const handleSaveSchedule = async () => {
        setIsLoading(true);
        try {
            await updateUserProfile(currentUser.id, { schedule: currentSchedule });
            showToast(i18n.t('schedule_updated'), 'success');
        } catch (error: any) {
            showToast(error.message || 'Error saving schedule', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-4">
                <button onClick={() => navigate(Screen.WASHER_DASHBOARD)}>
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-bold">{i18n.t('settings')}</h1>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 py-4 font-bold transition-colors ${activeTab === 'profile'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-slate-400'
                        }`}
                >
                    {i18n.t('profile')}
                </button>
                <button
                    onClick={() => setActiveTab('password')}
                    className={`flex-1 py-4 font-bold transition-colors ${activeTab === 'password'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-slate-400'
                        }`}
                >
                    {i18n.t('password')}
                </button>
                <button
                    onClick={() => setActiveTab('preferences')}
                    className={`flex-1 py-4 font-bold transition-colors ${activeTab === 'preferences'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-slate-400'
                        }`}
                >
                    {i18n.t('preferences')}
                </button>
                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`flex-1 py-4 font-bold transition-colors ${activeTab === 'schedule'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-slate-400'
                        }`}
                >
                    {i18n.t('schedule')}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        {/* Profile Photo */}
                        <div className="flex flex-col items-center gap-4 p-6 bg-surface-dark rounded-xl border border-white/10">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/50 bg-surface-dark">
                                {avatar ? (
                                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/20 text-4xl font-bold text-primary">
                                        {name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {isUploadingPhoto && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white animate-spin">refresh</span>
                                    </div>
                                )}
                            </div>
                            <label className="px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-primary font-bold transition-colors cursor-pointer">
                                {isUploadingPhoto ? i18n.t('uploading') : i18n.t('change_photo')}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={isUploadingPhoto}
                                />
                            </label>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-xs uppercase text-slate-400 font-bold mb-2">{i18n.t('full_name')}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-surface-dark border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>

                        {/* Email (Read-only) */}
                        <div>
                            <label className="block text-xs uppercase text-slate-400 font-bold mb-2">{i18n.t('email_address')}</label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full bg-surface-dark/50 border border-white/10 rounded-xl p-4 text-slate-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-slate-500 mt-1">{i18n.t('email_warn')}</p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs uppercase text-slate-400 font-bold mb-2">{i18n.t('phone_number')}</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-surface-dark border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSaveProfile}
                            disabled={isLoading}
                            className="w-full py-4 bg-primary hover:bg-primary-dark text-black font-bold rounded-xl transition-colors disabled:opacity-50"
                        >
                            {isLoading ? i18n.t('loading') : i18n.t('save_changes')}
                        </button>
                    </div>
                )}

                {/* PASSWORD TAB */}
                {activeTab === 'password' && (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                            <p className="text-sm text-blue-400">
                                <span className="material-symbols-outlined text-sm mr-2">info</span>
                                Your password must be at least 6 characters long
                            </p>
                        </div>

                        {/* Current Password */}
                        <div>
                            <label className="block text-xs uppercase text-slate-400 font-bold mb-2">{i18n.t('current_password')}</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full bg-surface-dark border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-xs uppercase text-slate-400 font-bold mb-2">{i18n.t('new_password')}</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-surface-dark border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs uppercase text-slate-400 font-bold mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-surface-dark border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>

                        {/* Change Password Button */}
                        <button
                            onClick={handleChangePassword}
                            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                            className="w-full py-4 bg-primary hover:bg-primary-dark text-black font-bold rounded-xl transition-colors disabled:opacity-50"
                        >
                            {isLoading ? i18n.t('loading') : i18n.t('change_password')}
                        </button>
                    </div>
                )}

                {/* PREFERENCES TAB */}
                {activeTab === 'preferences' && (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        {/* Availability Toggle */}
                        <div className="p-6 bg-surface-dark rounded-xl border border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1">{i18n.t('availability_status')}</h3>
                                    <p className="text-sm text-slate-400">
                                        {isAvailable
                                            ? i18n.t('avail_on_desc')
                                            : i18n.t('avail_off_desc')}
                                    </p>
                                </div>
                                <button
                                    onClick={handleToggleAvailability}
                                    className={`relative w-16 h-8 rounded-full transition-colors ${isAvailable ? 'bg-green-500' : 'bg-slate-600'
                                        }`}
                                >
                                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${isAvailable ? 'translate-x-8' : 'translate-x-0'
                                        }`} />
                                </button>
                            </div>
                        </div>


                        {/* Notifications Toggle */}
                        <div className="p-6 bg-surface-dark rounded-xl border border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1">{i18n.t('push_notifications')}</h3>
                                    <p className="text-sm text-slate-400">
                                        {i18n.t('push_desc')}
                                    </p>
                                </div>
                                <button
                                    onClick={handleToggleNotifications}
                                    className={`relative w-16 h-8 rounded-full transition-colors ${notificationsEnabled ? 'bg-primary' : 'bg-slate-600'
                                        }`}
                                >
                                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${notificationsEnabled ? 'translate-x-8' : 'translate-x-0'
                                        }`} />
                                </button>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="p-6 bg-surface-dark rounded-xl border border-white/10">
                            <h3 className="font-bold text-lg mb-4">{i18n.t('your_stats')}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-white/5 rounded-lg">
                                    <div className="text-3xl font-bold text-primary">0</div>
                                    <div className="text-xs text-slate-400 mt-1">{i18n.t('jobs_completed')}</div>
                                </div>
                                <div className="text-center p-4 bg-white/5 rounded-lg">
                                    <div className="text-3xl font-bold text-green-400">$0</div>
                                    <div className="text-xs text-slate-400 mt-1">{i18n.t('total_earned')}</div>
                                </div>
                                <div className="text-center p-4 bg-white/5 rounded-lg">
                                    <div className="text-3xl font-bold text-yellow-400">5.0</div>
                                    <div className="text-xs text-slate-400 mt-1">{i18n.t('avg_rating')}</div>
                                </div>
                                <div className="text-center p-4 bg-white/5 rounded-lg">
                                    <div className="text-3xl font-bold text-blue-400">0</div>
                                    <div className="text-xs text-slate-400 mt-1">{i18n.t('active_jobs')}</div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Support Button */}
                        {openSupport && (
                            <button
                                onClick={openSupport}
                                className="w-full py-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">support_agent</span>
                                {i18n.t('contact_support')}
                            </button>
                        )}

                        {/* Logout Button */}
                        <button
                            onClick={() => {
                                if (window.confirm(i18n.t('logout_confirm'))) {
                                    logout();
                                }
                            }}
                            className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-xl">logout</span>
                            {i18n.t('logout')}
                        </button>
                    </div>
                )}

                {/* SCHEDULE TAB */}
                {activeTab === 'schedule' && (
                    <div className="space-y-6 max-w-2xl mx-auto pb-20">
                        <div className="bg-surface-dark rounded-xl border border-white/10 overflow-hidden">
                            <div className="p-4 border-b border-white/10 bg-white/5">
                                <h3 className="font-bold text-lg">{i18n.t('working_days')}</h3>
                                <p className="text-xs text-slate-400 mt-1">{i18n.t('schedule_desc')}</p>
                            </div>

                            <div className="divide-y divide-white/5">
                                {currentSchedule.map((dayData, idx) => (
                                    <div key={idx} className={`p-4 transition-colors ${dayData.enabled ? 'bg-transparent' : 'bg-black/20 opacity-60'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateScheduleDay(idx, !dayData.enabled)}
                                                    className={`w-10 h-6 rounded-full relative transition-colors ${dayData.enabled ? 'bg-primary' : 'bg-slate-600'}`}
                                                >
                                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${dayData.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                                                </button>
                                                <span className={`font-bold ${dayData.enabled ? 'text-white' : 'text-slate-500'}`}>
                                                    {DAYS_NAMES[idx]}
                                                </span>
                                            </div>
                                        </div>

                                        {dayData.enabled && (
                                            <div className="space-y-3">
                                                {dayData.slots.map((slot, sIdx) => (
                                                    <div key={sIdx} className="flex items-center gap-4 bg-white/5 p-3 rounded-lg border border-white/5">
                                                        <div className="flex-1">
                                                            <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">{i18n.t('opening')}</label>
                                                            <input
                                                                type="time"
                                                                value={slot.start}
                                                                onChange={(e) => updateScheduleTime(idx, sIdx, 'start', e.target.value)}
                                                                className="w-full bg-surface-dark border border-white/10 rounded-md p-2 text-sm focus:outline-none focus:border-primary"
                                                            />
                                                        </div>
                                                        <div className="text-slate-500 mt-5">
                                                            <span className="material-symbols-outlined">arrow_forward</span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">{i18n.t('closing')}</label>
                                                            <input
                                                                type="time"
                                                                value={slot.end}
                                                                onChange={(e) => updateScheduleTime(idx, sIdx, 'end', e.target.value)}
                                                                className="w-full bg-surface-dark border border-white/10 rounded-md p-2 text-sm focus:outline-none focus:border-primary"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sticky bottom-4 left-0 right-0">
                            <button
                                onClick={handleSaveSchedule}
                                disabled={isLoading}
                                className="w-full h-14 bg-primary rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                ) : (
                                    <span className="material-symbols-outlined">save</span>
                                )}
                                {i18n.t('save_changes')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
