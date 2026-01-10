// Analytics Service for tracking user behavior and app performance
import { getAnalytics, logEvent, setUserId, setUserProperties, isSupported } from 'firebase/analytics';
import { app } from '../firebase';

class AnalyticsService {
    private analytics: any = null;
    private isEnabled: boolean = false;

    constructor() {
        this.initializeAnalytics();
    }

    private async initializeAnalytics() {
        try {
            // Check if analytics is supported in this environment
            const supported = await isSupported();
            if (supported) {
                this.analytics = getAnalytics(app);
                this.isEnabled = true;
                console.log('✅ Firebase Analytics initialized successfully');
            } else {
                console.warn('⚠️ Firebase Analytics not supported in this environment');
            }
        } catch (error) {
            console.warn('⚠️ Analytics not available:', error);
            this.isEnabled = false;
        }
    }

    // User tracking
    setUser(userId: string, properties?: Record<string, any>) {
        if (!this.isEnabled) return;

        try {
            setUserId(this.analytics, userId);
            if (properties) {
                setUserProperties(this.analytics, properties);
            }
        } catch (error) {
            console.error('Error setting user:', error);
        }
    }

    // Order events
    trackOrderCreated(orderId: string, value: number, packageName: string) {
        this.logEvent('order_created', {
            order_id: orderId,
            value,
            currency: 'USD',
            package_name: packageName
        });
    }

    trackOrderCompleted(orderId: string, value: number, washerId: string, rating?: number) {
        this.logEvent('order_completed', {
            order_id: orderId,
            value,
            currency: 'USD',
            washer_id: washerId,
            rating
        });
    }

    trackOrderCancelled(orderId: string, reason?: string) {
        this.logEvent('order_cancelled', {
            order_id: orderId,
            reason
        });
    }

    // Payment events
    trackPaymentSuccess(orderId: string, value: number, method: string) {
        this.logEvent('payment_success', {
            order_id: orderId,
            value,
            currency: 'USD',
            payment_method: method
        });
    }

    trackPaymentFailed(orderId: string, error: string) {
        this.logEvent('payment_failed', {
            order_id: orderId,
            error
        });
    }

    // Coupon events
    trackCouponApplied(couponCode: string, discount: number) {
        this.logEvent('coupon_applied', {
            coupon_code: couponCode,
            discount_value: discount
        });
    }

    // User engagement
    trackScreenView(screenName: string) {
        this.logEvent('screen_view', {
            screen_name: screenName
        });
    }

    trackButtonClick(buttonName: string, location: string) {
        this.logEvent('button_click', {
            button_name: buttonName,
            location
        });
    }

    trackSearch(searchTerm: string) {
        this.logEvent('search', {
            search_term: searchTerm
        });
    }

    // Washer events
    trackWasherApplication(washerId: string) {
        this.logEvent('washer_application_submitted', {
            washer_id: washerId
        });
    }

    trackWasherApproved(washerId: string) {
        this.logEvent('washer_approved', {
            washer_id: washerId
        });
    }

    // Loyalty events
    trackLoyaltyPointsEarned(userId: string, points: number, source: string) {
        this.logEvent('loyalty_points_earned', {
            user_id: userId,
            points,
            source
        });
    }

    trackLoyaltyTierUpgrade(userId: string, newTier: string) {
        this.logEvent('loyalty_tier_upgrade', {
            user_id: userId,
            new_tier: newTier
        });
    }

    // Error tracking
    trackError(errorName: string, errorMessage: string, location: string) {
        this.logEvent('error_occurred', {
            error_name: errorName,
            error_message: errorMessage,
            location
        });
    }

    // Performance tracking
    trackLoadTime(pageName: string, loadTime: number) {
        this.logEvent('page_load_time', {
            page_name: pageName,
            load_time_ms: loadTime
        });
    }

    // Conversion tracking
    trackSignUp(method: string) {
        this.logEvent('sign_up', {
            method
        });
    }

    trackLogin(method: string) {
        this.logEvent('login', {
            method
        });
    }

    // Custom events
    logEvent(eventName: string, params?: Record<string, any>) {
        if (!this.isEnabled) return;

        try {
            logEvent(this.analytics, eventName, params);

            // Also log to console in development
            if (process.env.NODE_ENV === 'development') {
                console.log(`[Analytics] ${eventName}`, params);
            }
        } catch (error) {
            console.error('Error logging event:', error);
        }
    }

    // E-commerce tracking
    trackPurchase(orderId: string, value: number, items: any[]) {
        this.logEvent('purchase', {
            transaction_id: orderId,
            value,
            currency: 'USD',
            items
        });
    }

    trackAddToCart(itemId: string, itemName: string, price: number) {
        this.logEvent('add_to_cart', {
            item_id: itemId,
            item_name: itemName,
            price,
            currency: 'USD'
        });
    }

    // User retention
    trackDailyActive() {
        this.logEvent('daily_active_user', {
            timestamp: new Date().toISOString()
        });
    }

    trackWeeklyActive() {
        this.logEvent('weekly_active_user', {
            timestamp: new Date().toISOString()
        });
    }

    // Feature usage
    trackFeatureUsed(featureName: string) {
        this.logEvent('feature_used', {
            feature_name: featureName
        });
    }

    // Notification tracking
    trackNotificationReceived(notificationType: string) {
        this.logEvent('notification_received', {
            notification_type: notificationType
        });
    }

    trackNotificationClicked(notificationType: string) {
        this.logEvent('notification_clicked', {
            notification_type: notificationType
        });
    }

    // Share tracking
    trackShare(contentType: string, method: string) {
        this.logEvent('share', {
            content_type: contentType,
            method
        });
    }

    // Rating tracking
    trackRatingGiven(rating: number, orderId: string) {
        this.logEvent('rating_given', {
            rating,
            order_id: orderId
        });
    }
}

export const analytics = new AnalyticsService();

// React hook for easy analytics tracking
export const useAnalytics = () => {
    return analytics;
};
