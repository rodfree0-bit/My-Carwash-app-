// Unified Push Notification Service using Capacitor
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { db, messaging } from '../firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';

class UnifiedNotificationService {
    private isNative = Capacitor.isNativePlatform();
    private userId: string | null = null;
    private initialized = false;
    private webInitAttempted = false; // Prevent retry spam

    // Set user ID for saving tokens
    setUserId(id: string) {
        this.userId = id;
    }

    async initialize(userId?: string) {
        if (userId) this.userId = userId;

        // Prevent multiple initializations for listeners
        if (this.initialized && !userId) return;

        if (!this.isNative) {
            // Web: Use FCM (only attempt once)
            if (this.webInitAttempted) {
                console.log('⏭️ Skipping FCM init (already attempted)');
                return null;
            }
            this.webInitAttempted = true;
            return this.initializeWeb();
        }

        // Native: Use Capacitor Push Notifications
        return this.initializeNative();
    }

    private async initializeNative() {
        console.log('🔔 Initializing native push notifications...');

        // Request permission
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
            console.log('❌ Push notification permission denied');
            return null;
        }

        // Register with Apple / Google to receive push via APNS/FCM
        await PushNotifications.register();

        if (!this.initialized) {
            // Listen for registration
            await PushNotifications.addListener('registration', (token: Token) => {
                console.log('✅ Native Push registration success, token:', token.value);
                this.saveToken(token.value);
            });

            // Listen for registration errors
            await PushNotifications.addListener('registrationError', (error: any) => {
                console.error('❌ Error on registration:', error);
            });

            // Show us the notification payload if the app is open on our device
            await PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
                console.log('📬 Push notification received:', notification);
                this.handleNotificationReceived(notification);
            });

            // Method called when tapping on a notification
            await PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
                console.log('👆 Push notification action performed:', notification);
                this.handleNotificationTapped(notification);
            });

            this.initialized = true;
        }

        return true;
    }

    private async initializeWeb() {
        // DISABLED: Web FCM causes 401 errors due to Firebase config issues
        // Push notifications only work on native mobile apps
        console.log('ℹ️ Web push notifications disabled (use native app for notifications)');
        return null;
    }

    private async saveToken(token: string) {
        if (!this.userId) {
            console.warn('⚠️ Cannot save FCM token: No User ID set');
            // Store temporarily?
            return;
        }

        // Save token to Firestore for the current user
        console.log('💾 Saving FCM token to Firestore for user:', this.userId);
        try {
            const userRef = doc(db, 'users', this.userId);
            await updateDoc(userRef, { fcmToken: token });
            console.log('✅ FCM token saved successfully');
        } catch (error) {
            console.error('❌ Error saving FCM token to Firestore:', error);
        }
    }

    // Clear FCM token on logout to prevent cross-account notifications
    async clearToken() {
        if (!this.userId) {
            console.warn('⚠️ Cannot clear FCM token: No User ID set');
            return;
        }

        console.log('🧹 Clearing FCM token for user:', this.userId);
        try {
            const userRef = doc(db, 'users', this.userId);
            await updateDoc(userRef, { fcmToken: null });
            console.log('✅ FCM token cleared successfully');
            this.userId = null;
        } catch (error) {
            console.error('❌ Error clearing FCM token:', error);
        }
    }

    private handleNotificationReceived(notification: PushNotificationSchema) {
        // Handle notification when app is in foreground
        console.log('Notification data:', notification.data);

        // Dispatch event for App.tsx to show Toast
        const event = new CustomEvent('fcm-message', {
            detail: {
                notification: {
                    title: notification.title,
                    body: notification.body
                },
                data: notification.data
            }
        });
        window.dispatchEvent(event);
    }

    private handleNotificationTapped(notification: ActionPerformed) {
        // Handle notification tap
        const data = notification.notification.data;
        console.log('Notification tapped with data:', data);

        // Navigate based on notification type
        if (data.type === 'new_message') {
            // Navigate to chat
            window.location.hash = `/chat/${data.orderId}`;
        } else if (data.type === 'order_update') {
            // Navigate to order details
            window.location.hash = `/order/${data.orderId}`;
        }
    }

    // Send notification (this should be called from backend mainly, but helper kept for ref)
    async sendNotification(userId: string, title: string, body: string, data?: any) {
        // Client-side simulation only
        if (!this.isNative && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body,
                icon: '/logo.png',
                data,
            });
        }
    }
}

export const pushNotificationService = new UnifiedNotificationService();

// Notification Templates
export const NotificationTemplates = {
    // For Washer
    NEW_ORDER: (orderNumber: string) => ({
        title: 'New Order Available',
        body: `Order #${orderNumber} is waiting for you`,
        data: { type: 'new_order', orderNumber }
    }),

    ORDER_ASSIGNED: (orderNumber: string) => ({
        title: 'Order Assigned',
        body: `You've been assigned to Order #${orderNumber}`,
        data: { type: 'order_assigned', orderNumber }
    }),

    // For Client
    WASHER_ASSIGNED: (washerName: string, orderNumber: string) => ({
        title: 'Washer Assigned',
        body: `${washerName} will handle your order`,
        data: { type: 'washer_assigned', orderNumber }
    }),

    WASHER_EN_ROUTE: (eta: string, orderNumber: string) => ({
        title: 'Washer On The Way',
        body: `Your washer will arrive in ${eta}`,
        data: { type: 'washer_en_route', orderNumber }
    }),

    WASHER_ARRIVED: (orderNumber: string) => ({
        title: 'Washer Has Arrived',
        body: 'Your washer is at your location',
        data: { type: 'washer_arrived', orderNumber }
    }),

    SERVICE_STARTED: (orderNumber: string) => ({
        title: 'Service Started',
        body: 'Your car wash is in progress',
        data: { type: 'service_started', orderNumber }
    }),

    SERVICE_COMPLETED: (orderNumber: string) => ({
        title: 'Service Complete',
        body: 'Your car is ready. Please review the service',
        data: { type: 'service_completed', orderNumber }
    }),

    // For Both
    NEW_MESSAGE: (senderName: string, orderId: string, preview: string) => ({
        title: senderName,
        body: preview,
        data: { type: 'new_message', orderId, senderName }
    }),

    // For Washer
    PAYMENT_RECEIVED: (amount: number, orderNumber: string) => ({
        title: 'Payment Received',
        body: `You earned $${amount.toFixed(2)} from Order #${orderNumber}`,
        data: { type: 'payment_received', amount, orderNumber }
    }),

    // For Admin
    NEW_ISSUE_REPORTED: (userName: string, issueId: string) => ({
        title: 'New Issue Reported',
        body: `${userName} reported a problem`,
        data: { type: 'new_issue', issueId }
    }),

    NEW_WASHER_APPLICATION: (washerName: string) => ({
        title: 'New Washer Application',
        body: `${washerName} applied to become a washer`,
        data: { type: 'new_application', washerName }
    }),
};

// Helper to trigger notification when message is sent
export const notifyNewMessage = async (
    recipientId: string,
    senderName: string,
    orderId: string,
    messagePreview: string
) => {
    const notification = NotificationTemplates.NEW_MESSAGE(senderName, orderId, messagePreview);
    await pushNotificationService.sendNotification(
        recipientId,
        notification.title,
        notification.body,
        notification.data
    );
};

// Helper to trigger notification when order status changes
export const notifyOrderStatusChange = async (
    userId: string,
    orderNumber: string,
    newStatus: string,
    extraData?: any
) => {
    let notification;

    switch (newStatus) {
        case 'Assigned':
            notification = NotificationTemplates.WASHER_ASSIGNED(extraData.washerName, orderNumber);
            break;
        case 'En Route':
            notification = NotificationTemplates.WASHER_EN_ROUTE(extraData.eta, orderNumber);
            break;
        case 'Arrived':
            notification = NotificationTemplates.WASHER_ARRIVED(orderNumber);
            break;
        case 'In Progress':
            notification = NotificationTemplates.SERVICE_STARTED(orderNumber);
            break;
        case 'Completed':
            notification = NotificationTemplates.SERVICE_COMPLETED(orderNumber);
            break;
        default:
            return;
    }

    await pushNotificationService.sendNotification(
        userId,
        notification.title,
        notification.body,
        notification.data
    );
};
