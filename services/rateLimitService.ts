/**
 * Rate Limiting Service
 * Protege contra abuso sin afectar usuarios legítimos
 */

import { doc, getDoc, setDoc, updateDoc, Timestamp, deleteField } from 'firebase/firestore';
import { db } from '../firebase';

interface RateLimitRecord {
    count: number;
    windowStart: Timestamp;
    lastAttempt: Timestamp;
}

interface RateLimitConfig {
    maxAttempts: number;
    windowMs: number;
    action: string;
}

class RateLimitService {
    // Configuraciones por defecto (generosas para no afectar uso normal)
    private configs = {
        orderCreation: {
            maxAttempts: 5, // 5 órdenes por hora (muy generoso)
            windowMs: 60 * 60 * 1000, // 1 hora
            action: 'create_order'
        },
        supportTicket: {
            maxAttempts: 10, // 10 tickets por día
            windowMs: 24 * 60 * 60 * 1000, // 24 horas
            action: 'create_ticket'
        },
        payment: {
            maxAttempts: 15, // 15 intentos de pago por hora
            windowMs: 60 * 60 * 1000, // 1 hora
            action: 'payment_attempt'
        }
    };

    /**
     * Verifica si el usuario puede realizar la acción
     * @returns { allowed: boolean, remainingAttempts: number, resetTime: Date }
     */
    async checkRateLimit(
        userId: string,
        action: 'orderCreation' | 'supportTicket' | 'payment'
    ): Promise<{ allowed: boolean; remainingAttempts: number; resetTime: Date; message?: string }> {
        try {
            const config = this.configs[action];
            const rateLimitRef = doc(db, 'rate_limits', `${userId}_${action}`);
            const rateLimitDoc = await getDoc(rateLimitRef);

            const now = Timestamp.now();
            const nowMs = now.toMillis();

            // Si no existe registro, permitir y crear uno nuevo
            if (!rateLimitDoc.exists()) {
                await setDoc(rateLimitRef, {
                    count: 1,
                    windowStart: now,
                    lastAttempt: now,
                    action: config.action,
                    userId
                });

                return {
                    allowed: true,
                    remainingAttempts: config.maxAttempts - 1,
                    resetTime: new Date(nowMs + config.windowMs)
                };
            }

            const data = rateLimitDoc.data() as RateLimitRecord;
            const windowStartMs = data.windowStart.toMillis();
            const windowEndMs = windowStartMs + config.windowMs;

            // Si la ventana expiró, resetear contador
            if (nowMs > windowEndMs) {
                await setDoc(rateLimitRef, {
                    count: 1,
                    windowStart: now,
                    lastAttempt: now,
                    action: config.action,
                    userId
                });

                return {
                    allowed: true,
                    remainingAttempts: config.maxAttempts - 1,
                    resetTime: new Date(nowMs + config.windowMs)
                };
            }

            // Verificar si se excedió el límite
            if (data.count >= config.maxAttempts) {
                const resetTime = new Date(windowEndMs);
                const minutesUntilReset = Math.ceil((windowEndMs - nowMs) / (60 * 1000));

                return {
                    allowed: false,
                    remainingAttempts: 0,
                    resetTime,
                    message: `You have reached the limit of ${config.maxAttempts} ${this.getActionName(action)} per ${this.getWindowName(config.windowMs)}. Try again in ${minutesUntilReset} minutes.`
                };
            }

            // Incrementar contador
            await updateDoc(rateLimitRef, {
                count: data.count + 1,
                lastAttempt: now
            });

            return {
                allowed: true,
                remainingAttempts: config.maxAttempts - (data.count + 1),
                resetTime: new Date(windowEndMs)
            };

        } catch (error) {
            console.error('Error checking rate limit:', error);
            // En caso de error, permitir la acción (fail-open para no bloquear usuarios)
            return {
                allowed: true,
                remainingAttempts: 999,
                resetTime: new Date(Date.now() + 3600000)
            };
        }
    }

    /**
     * Resetea el rate limit para un usuario (solo para admins)
     */
    async resetRateLimit(userId: string, action: 'orderCreation' | 'supportTicket' | 'payment'): Promise<void> {
        try {
            const rateLimitRef = doc(db, 'rate_limits', `${userId}_${action}`);
            await setDoc(rateLimitRef, {
                count: 0,
                windowStart: Timestamp.now(),
                lastAttempt: Timestamp.now(),
                action: this.configs[action].action,
                userId
            });
            console.log(`✅ Rate limit reset for user ${userId}, action ${action}`);
        } catch (error) {
            console.error('Error resetting rate limit:', error);
        }
    }

    /**
     * Obtiene el estado actual del rate limit sin incrementar
     */
    async getRateLimitStatus(
        userId: string,
        action: 'orderCreation' | 'supportTicket' | 'payment'
    ): Promise<{ count: number; maxAttempts: number; resetTime: Date }> {
        try {
            const config = this.configs[action];
            const rateLimitRef = doc(db, 'rate_limits', `${userId}_${action}`);
            const rateLimitDoc = await getDoc(rateLimitRef);

            if (!rateLimitDoc.exists()) {
                return {
                    count: 0,
                    maxAttempts: config.maxAttempts,
                    resetTime: new Date(Date.now() + config.windowMs)
                };
            }

            const data = rateLimitDoc.data() as RateLimitRecord;
            const windowEndMs = data.windowStart.toMillis() + config.windowMs;

            return {
                count: data.count,
                maxAttempts: config.maxAttempts,
                resetTime: new Date(windowEndMs)
            };
        } catch (error) {
            console.error('Error getting rate limit status:', error);
            return {
                count: 0,
                maxAttempts: 999,
                resetTime: new Date(Date.now() + 3600000)
            };
        }
    }

    /**
     * Limpia registros antiguos (ejecutar periódicamente)
     */
    async cleanupOldRecords(): Promise<void> {
        // This function can be executed as a scheduled Cloud Function
        console.log('Rate limit cleanup - implement as Cloud Function if needed');
    }

    private getActionName(action: string): string {
        const names: Record<string, string> = {
            orderCreation: 'orders',
            supportTicket: 'support tickets',
            payment: 'payment attempts'
        };
        return names[action] || action;
    }

    private getWindowName(windowMs: number): string {
        const hours = windowMs / (60 * 60 * 1000);
        if (hours >= 24) {
            return `${hours / 24} day${hours / 24 > 1 ? 's' : ''}`;
        }
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
}

export const rateLimitService = new RateLimitService();

// Hook for React
export const useRateLimit = () => {
    return {
        checkLimit: (userId: string, action: 'orderCreation' | 'supportTicket' | 'payment') =>
            rateLimitService.checkRateLimit(userId, action),
        getStatus: (userId: string, action: 'orderCreation' | 'supportTicket' | 'payment') =>
            rateLimitService.getRateLimitStatus(userId, action),
        resetLimit: (userId: string, action: 'orderCreation' | 'supportTicket' | 'payment') =>
            rateLimitService.resetRateLimit(userId, action)
    };
};
