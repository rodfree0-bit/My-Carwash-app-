
// Simple Logger Service
// In production, you would replace this with Sentry, LogRocket, or Firebase Crashlytics

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    details?: any;
}

const LOG_STORAGE_KEY = 'app_error_logs';

export const Logger = {
    log: (level: LogLevel, message: string, details?: any) => {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            details: details ? JSON.stringify(details) : undefined
        };

        console.log(`[${level.toUpperCase()}] ${message}`, details || '');

        // Persist to localStorage for "Black Box" retrieval
        try {
            const existingLogs = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || '[]');
            existingLogs.unshift(entry); // Add newest first
            // Keep only last 50 logs to save space
            localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(existingLogs.slice(0, 50)));
        } catch (e) {
            console.error('Failed to save log', e);
        }
    },

    info: (message: string, details?: any) => Logger.log('info', message, details),
    warn: (message: string, details?: any) => Logger.log('warn', message, details),
    error: (message: string, details?: any) => Logger.log('error', message, details),

    getLogs: () => {
        try {
            return JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || '[]');
        } catch {
            return [];
        }
    },

    clearLogs: () => {
        localStorage.removeItem(LOG_STORAGE_KEY);
    }
};
