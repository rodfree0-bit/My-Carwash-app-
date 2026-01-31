import React, { useState } from 'react';
import { pushNotificationService } from '../services/pushNotificationService';
import { Capacitor } from '@capacitor/core';

interface NotificationTestProps {
    onClose: () => void;
}

export const NotificationTest: React.FC<NotificationTestProps> = ({ onClose }) => {
    const [permissionStatus, setPermissionStatus] = useState<{
        granted: boolean;
        canRequest: boolean;
    } | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const checkPermissions = async () => {
        setIsChecking(true);
        try {
            const status = await pushNotificationService.checkPermissionStatus();
            setPermissionStatus(status);
            console.log('📱 Permission Status:', status);
        } catch (error) {
            console.error('❌ Error checking permissions:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const requestPermissions = async () => {
        setIsChecking(true);
        try {
            const granted = await pushNotificationService.requestPermissionsIfNeeded();
            console.log('📱 Permission Request Result:', granted);
            // Refresh status
            await checkPermissions();
        } catch (error) {
            console.error('❌ Error requesting permissions:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const sendTestNotification = async () => {
        try {
            await pushNotificationService.sendTestNotification();
        } catch (error) {
            console.error('❌ Error sending test notification:', error);
        }
    };

    const isNative = Capacitor.isNativePlatform();

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
            <div className="bg-surface-dark border border-white/10 rounded-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">🔔 Notification Test</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>

                {!isNative ? (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                        <p className="text-yellow-400 text-sm">
                            ⚠️ Push notifications only work on native mobile apps (Android/iOS).
                            Please test on a physical device or emulator.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {/* Permission Status */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <h3 className="font-bold mb-2">Permission Status</h3>
                                {permissionStatus ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-white/60">Granted:</span>
                                            <span className={permissionStatus.granted ? 'text-green-400' : 'text-red-400'}>
                                                {permissionStatus.granted ? '✅ Yes' : '❌ No'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-white/60">Can Request:</span>
                                            <span className={permissionStatus.canRequest ? 'text-blue-400' : 'text-white/40'}>
                                                {permissionStatus.canRequest ? '📱 Yes' : '⛔ No'}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-white/40">Click "Check Permissions" to view status</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={checkPermissions}
                                    disabled={isChecking}
                                    className="w-full bg-blue-500/20 border border-blue-500/50 text-blue-400 h-12 rounded-xl font-bold hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                                >
                                    {isChecking ? 'Checking...' : '🔍 Check Permissions'}
                                </button>

                                {permissionStatus && !permissionStatus.granted && permissionStatus.canRequest && (
                                    <button
                                        onClick={requestPermissions}
                                        disabled={isChecking}
                                        className="w-full bg-green-500/20 border border-green-500/50 text-green-400 h-12 rounded-xl font-bold hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                    >
                                        {isChecking ? 'Requesting...' : '📱 Request Permissions'}
                                    </button>
                                )}

                                <button
                                    onClick={sendTestNotification}
                                    className="w-full bg-purple-500/20 border border-purple-500/50 text-purple-400 h-12 rounded-xl font-bold hover:bg-purple-500/30 transition-colors"
                                >
                                    🧪 Send Test Notification
                                </button>
                            </div>

                            {/* Instructions */}
                            <div className="bg-white/5 rounded-lg p-4 mt-4">
                                <h3 className="font-bold mb-2 text-sm">📋 Instructions</h3>
                                <ol className="text-xs text-white/60 space-y-1 list-decimal list-inside">
                                    <li>Check permissions status</li>
                                    <li>Request permissions if needed</li>
                                    <li>Click "Send Test Notification" to log token info</li>
                                    <li>Use Firebase Console to send actual notification</li>
                                </ol>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
