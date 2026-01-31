/**
 * Firebase Cloud Functions Index
 * 
 * Este archivo exporta todas las Cloud Functions para Stripe y SendGrid
 */
import * as admin from 'firebase-admin';

// Initialize Admin SDK once for all functions
if (!admin.apps.length) {
    admin.initializeApp();
}

// Notification Functions
// export { sendReceipt } from './sendReceipt';

// Notification Functions
export { notifyNewMessage } from './notifyNewMessage';
export { notifyWaitingTime } from './notifyWaitingTime';

// Order Notification Triggers (Automatic)
export { onOrderCreated } from './onOrderCreated';
export { onOrderUpdated } from './onOrderUpdated';

// Scheduled Notification Functions (DISABLED - Manual Control Only)
// // export { sendWeatherNotifications } from './scheduledWeatherNotifications';
export { sendInactivityRemindersManual as sendInactivityReminders } from './manualNotifications';

// Manual Notification Functions (Admin Panel)
export { sendWeatherNotificationsManual, sendInactivityRemindersManual } from './manualNotifications';

// Email Verification Functions (2FA)
export { sendVerificationCode } from './sendVerificationCode';
export { verifyCode } from './verifyCode';
