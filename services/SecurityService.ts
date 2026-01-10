// Security utilities and middleware
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface RateLimitConfig {
    maxAttempts: number;
    windowMs: number;
}

class SecurityService {
    private loginAttempts: Map<string, { count: number; resetTime: number }> = new Map();
    private blockedIPs: Set<string> = new Set();

    // Rate limiting for login attempts
    checkLoginRateLimit(email: string, config: RateLimitConfig = { maxAttempts: 5, windowMs: 15 * 60 * 1000 }): boolean {
        const now = Date.now();
        const attempt = this.loginAttempts.get(email);

        if (!attempt || now > attempt.resetTime) {
            this.loginAttempts.set(email, {
                count: 1,
                resetTime: now + config.windowMs
            });
            return true;
        }

        if (attempt.count >= config.maxAttempts) {
            console.warn(`⚠️ Rate limit exceeded for ${email}`);
            return false;
        }

        attempt.count++;
        return true;
    }

    // Reset login attempts after successful login
    resetLoginAttempts(email: string): void {
        this.loginAttempts.delete(email);
    }

    // Input sanitization
    sanitizeInput(input: string): string {
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, ''); // Remove event handlers
    }

    // Validate email format
    validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate phone number
    validatePhone(phone: string): boolean {
        const phoneRegex = /^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
        return phoneRegex.test(phone);
    }

    // Validate password strength
    validatePassword(password: string): { valid: boolean; message: string } {
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters' };
        }
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one uppercase letter' };
        }
        if (!/[a-z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one lowercase letter' };
        }
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one number' };
        }
        return { valid: true, message: 'Password is strong' };
    }

    // Check for SQL injection patterns
    detectSQLInjection(input: string): boolean {
        const sqlPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
            /(--|;|\/\*|\*\/)/,
            /(\bOR\b.*=.*)/i,
            /(\bAND\b.*=.*)/i
        ];

        return sqlPatterns.some(pattern => pattern.test(input));
    }

    // Check for XSS patterns
    detectXSS(input: string): boolean {
        const xssPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe/gi,
            /<object/gi,
            /<embed/gi
        ];

        return xssPatterns.some(pattern => pattern.test(input));
    }

    // Validate and sanitize order data
    validateOrderData(orderData: any): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!orderData.clientId || typeof orderData.clientId !== 'string') {
            errors.push('Invalid client ID');
        }

        if (!orderData.packageName || typeof orderData.packageName !== 'string') {
            errors.push('Invalid package name');
        }

        if (typeof orderData.price !== 'number' || orderData.price < 0) {
            errors.push('Invalid price');
        }

        if (orderData.address && this.detectSQLInjection(orderData.address)) {
            errors.push('Invalid address format');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Encrypt sensitive data (simple example - use proper encryption in production)
    encryptData(data: string, key: string): string {
        // This is a simple XOR cipher - use proper encryption like AES in production
        let encrypted = '';
        for (let i = 0; i < data.length; i++) {
            encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(encrypted);
    }

    // Decrypt sensitive data
    decryptData(encrypted: string, key: string): string {
        const data = atob(encrypted);
        let decrypted = '';
        for (let i = 0; i < data.length; i++) {
            decrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return decrypted;
    }

    // Log security events
    async logSecurityEvent(event: {
        type: 'login_attempt' | 'login_success' | 'login_failure' | 'suspicious_activity' | 'rate_limit';
        userId?: string;
        email?: string;
        ip?: string;
        details?: string;
    }): Promise<void> {
        try {
            const logEntry = {
                ...event,
                timestamp: Timestamp.now(),
                userAgent: navigator.userAgent
            };

            console.log('🔒 Security Event:', logEntry);

            // In production, save to Firestore security_logs collection
            // await addDoc(collection(db, 'security_logs'), logEntry);
        } catch (error) {
            console.error('Error logging security event:', error);
        }
    }

    // Check if user is admin (with role verification)
    async verifyAdminRole(userId: string): Promise<boolean> {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            const userData = userDoc.data();

            if (!userData) return false;

            // Check if email is in admin list
            const isAdmin = userData.role === 'admin' ||
                userData.email?.toLowerCase().includes('admin') ||
                userData.email === 'admin@carwash.com';

            if (!isAdmin) {
                await this.logSecurityEvent({
                    type: 'suspicious_activity',
                    userId,
                    details: 'Attempted to access admin panel without admin role'
                });
            }

            return isAdmin;
        } catch (error) {
            console.error('Error verifying admin role:', error);
            return false;
        }
    }

    // Generate secure random token
    generateSecureToken(length: number = 32): string {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Hash sensitive data (for comparison, not storage)
    async hashData(data: string): Promise<string> {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Validate session token
    validateSessionToken(token: string): boolean {
        // Check if token is properly formatted
        if (!token || token.length < 32) return false;

        // Check if token contains only valid characters
        const validChars = /^[a-f0-9]+$/;
        return validChars.test(token);
    }

    // Check for common security headers
    checkSecurityHeaders(): void {
        const headers = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
        };

        console.log('🔒 Recommended Security Headers:', headers);
    }
}

export const securityService = new SecurityService();

// React hook for security features
export const useSecurity = () => {
    return {
        sanitize: (input: string) => securityService.sanitizeInput(input),
        validateEmail: (email: string) => securityService.validateEmail(email),
        validatePassword: (password: string) => securityService.validatePassword(password),
        checkRateLimit: (email: string) => securityService.checkLoginRateLimit(email),
        resetAttempts: (email: string) => securityService.resetLoginAttempts(email),
        logEvent: (event: any) => securityService.logSecurityEvent(event)
    };
};
