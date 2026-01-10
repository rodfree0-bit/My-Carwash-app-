/**
 * Firebase Cloud Functions Index
 * 
 * Este archivo exporta todas las Cloud Functions para Square y SendGrid
 */

// Square Payment Functions
export { createSquarePayment } from './createSquarePayment';
export { completeSquarePayment } from './completeSquarePayment';
export { cancelSquareOrder } from './cancelSquareOrder';

// Email Functions (cuando se configure SendGrid)
// export { sendReceipt } from './sendReceipt';

// Notification Functions
export { notifyNewMessage } from './notifyNewMessage';
export { notifyWaitingTime } from './notifyWaitingTime';

// Order Notification Triggers (Automatic)
export { onOrderCreated } from './onOrderCreated';
export { onOrderUpdated } from './onOrderUpdated';

// Scheduled Notification Functions (DISABLED - Manual Control Only)
// // export { sendWeatherNotifications } from './scheduledWeatherNotifications';
// export { sendInactivityReminders } from './scheduledInactivityReminders';

// Manual Notification Functions (Admin Panel)
export { sendWeatherNotificationsManual, sendInactivityRemindersManual } from './manualNotifications';

// Email Verification Functions (2FA)
export { sendVerificationCode } from './sendVerificationCode';
export { verifyCode } from './verifyCode';
