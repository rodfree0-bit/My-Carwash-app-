/**
 * Security Monitoring Service
 * Registra eventos de seguridad y detecta patrones sospechosos
 */

import { collection, addDoc, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

export type SecurityEventType =
    | 'login_attempt'
    | 'login_success'
    | 'login_failure'
    | 'order_created'
    | 'order_cancelled'
    | 'payment_created'
    | 'payment_completed'
    | 'payment_failed'
    | 'rate_limit_exceeded'
    | 'suspicious_activity'
    | 'unauthorized_access'
    | 'price_manipulation_attempt'
    | 'invalid_input';

interface SecurityEvent {
    type: SecurityEventType;
    userId?: string;
    email?: string;
    orderId?: string;
    paymentId?: string;
    details?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    ip?: string;
    userAgent?: string;
    timestamp: Timestamp;
}

class SecurityMonitoringService {
    /**
     * Registra un evento de seguridad
     */
    async logEvent(event: Omit<SecurityEvent, 'timestamp' | 'userAgent'>): Promise<void> {
        try {
            const securityEvent: SecurityEvent = {
                ...event,
                timestamp: Timestamp.now(),
                userAgent: navigator.userAgent
            };

            await addDoc(collection(db, 'security_logs'), securityEvent);

            // Si es crítico, mostrar alerta en consola
            if (event.severity === 'critical') {
                console.error('🚨 CRITICAL SECURITY EVENT:', securityEvent);
            } else if (event.severity === 'high') {
                console.warn('⚠️ HIGH SEVERITY SECURITY EVENT:', securityEvent);
            } else {
                console.log('🔒 Security event logged:', securityEvent);
            }
        } catch (error) {
            console.error('Error logging security event:', error);
        }
    }

    /**
     * Detecta intentos de login fallidos repetidos
     */
    async detectBruteForce(email: string): Promise<boolean> {
        try {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

            const q = query(
                collection(db, 'security_logs'),
                where('type', '==', 'login_failure'),
                where('email', '==', email),
                where('timestamp', '>=', Timestamp.fromDate(oneHourAgo))
            );

            const snapshot = await getDocs(q);
            const failedAttempts = snapshot.size;

            if (failedAttempts >= 5) {
                await this.logEvent({
                    type: 'suspicious_activity',
                    email,
                    details: `${failedAttempts} failed login attempts in the last hour`,
                    severity: 'high'
                });
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error detecting brute force:', error);
            return false;
        }
    }

    /**
     * Detecta patrones sospechosos de creación de órdenes
     */
    async detectSuspiciousOrders(userId: string): Promise<boolean> {
        try {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

            const q = query(
                collection(db, 'security_logs'),
                where('type', '==', 'order_created'),
                where('userId', '==', userId),
                where('timestamp', '>=', Timestamp.fromDate(fiveMinutesAgo))
            );

            const snapshot = await getDocs(q);
            const recentOrders = snapshot.size;

            // Más de 3 órdenes en 5 minutos es sospechoso
            if (recentOrders >= 3) {
                await this.logEvent({
                    type: 'suspicious_activity',
                    userId,
                    details: `${recentOrders} orders created in 5 minutes`,
                    severity: 'medium'
                });
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error detecting suspicious orders:', error);
            return false;
        }
    }

    /**
     * Obtiene eventos de seguridad recientes
     */
    async getRecentEvents(limitCount: number = 50): Promise<SecurityEvent[]> {
        try {
            const q = query(
                collection(db, 'security_logs'),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            const events = snapshot.docs.map(doc => doc.data() as SecurityEvent);
            return events.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
        } catch (error) {
            console.error('Error getting recent events:', error);
            return [];
        }
    }

    /**
     * Obtiene eventos de seguridad por usuario
     */
    async getUserEvents(userId: string, limitCount: number = 20): Promise<SecurityEvent[]> {
        try {
            const q = query(
                collection(db, 'security_logs'),
                where('userId', '==', userId),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            const events = snapshot.docs.map(doc => doc.data() as SecurityEvent);
            return events.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
        } catch (error) {
            console.error('Error getting user events:', error);
            return [];
        }
    }

    /**
     * Obtiene estadísticas de seguridad
     */
    async getSecurityStats(): Promise<{
        totalEvents: number;
        criticalEvents: number;
        highSeverityEvents: number;
        recentSuspiciousActivity: number;
    }> {
        try {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            // Total de eventos
            const allEventsQuery = query(
                collection(db, 'security_logs'),
                where('timestamp', '>=', Timestamp.fromDate(oneDayAgo))
            );
            const allEventsSnapshot = await getDocs(allEventsQuery);

            // Eventos críticos
            const criticalQuery = query(
                collection(db, 'security_logs'),
                where('severity', '==', 'critical'),
                where('timestamp', '>=', Timestamp.fromDate(oneDayAgo))
            );
            const criticalSnapshot = await getDocs(criticalQuery);

            // Eventos de alta severidad
            const highQuery = query(
                collection(db, 'security_logs'),
                where('severity', '==', 'high'),
                where('timestamp', '>=', Timestamp.fromDate(oneDayAgo))
            );
            const highSnapshot = await getDocs(highQuery);

            // Actividad sospechosa reciente
            const suspiciousQuery = query(
                collection(db, 'security_logs'),
                where('type', '==', 'suspicious_activity'),
                where('timestamp', '>=', Timestamp.fromDate(oneDayAgo))
            );
            const suspiciousSnapshot = await getDocs(suspiciousQuery);

            return {
                totalEvents: allEventsSnapshot.size,
                criticalEvents: criticalSnapshot.size,
                highSeverityEvents: highSnapshot.size,
                recentSuspiciousActivity: suspiciousSnapshot.size
            };
        } catch (error) {
            console.error('Error getting security stats:', error);
            return {
                totalEvents: 0,
                criticalEvents: 0,
                highSeverityEvents: 0,
                recentSuspiciousActivity: 0
            };
        }
    }
}

export const securityMonitoring = new SecurityMonitoringService();

// Hook para React
export const useSecurityMonitoring = () => {
    return {
        logEvent: (event: Omit<SecurityEvent, 'timestamp' | 'userAgent'>) =>
            securityMonitoring.logEvent(event),
        detectBruteForce: (email: string) =>
            securityMonitoring.detectBruteForce(email),
        detectSuspiciousOrders: (userId: string) =>
            securityMonitoring.detectSuspiciousOrders(userId),
        getRecentEvents: (limit?: number) =>
            securityMonitoring.getRecentEvents(limit),
        getUserEvents: (userId: string, limit?: number) =>
            securityMonitoring.getUserEvents(userId, limit),
        getStats: () =>
            securityMonitoring.getSecurityStats()
    };
};
