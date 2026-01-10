// Platform Detection Utility
import React from 'react';

export const platformDetection = {
    // Detect if running on iOS
    isIOS: (): boolean => {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    },

    // Detect if running on Android
    isAndroid: (): boolean => {
        return /Android/.test(navigator.userAgent);
    },

    // Detect if running on mobile (iOS or Android)
    isMobile: (): boolean => {
        return platformDetection.isIOS() || platformDetection.isAndroid();
    },

    // Detect if running in standalone mode (PWA)
    isStandalone: (): boolean => {
        return window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;
    },

    // Get platform name
    getPlatform: (): 'ios' | 'android' | 'web' => {
        if (platformDetection.isIOS()) return 'ios';
        if (platformDetection.isAndroid()) return 'android';
        return 'web';
    },

    // Check if device has notch (iPhone X and newer)
    hasNotch: (): boolean => {
        if (!platformDetection.isIOS()) return false;

        const ratio = window.devicePixelRatio || 1;
        const screen = {
            width: window.screen.width * ratio,
            height: window.screen.height * ratio
        };

        // iPhone X, XS, 11 Pro, 12 Mini, 13 Mini
        if (screen.width === 1125 && screen.height === 2436) return true;
        // iPhone XR, 11, 12, 13
        if (screen.width === 828 && screen.height === 1792) return true;
        // iPhone XS Max, 11 Pro Max, 12 Pro Max, 13 Pro Max
        if (screen.width === 1242 && screen.height === 2688) return true;
        // iPhone 12 Pro, 13 Pro
        if (screen.width === 1170 && screen.height === 2532) return true;
        // iPhone 14, 14 Pro
        if (screen.width === 1179 && screen.height === 2556) return true;
        // iPhone 14 Plus
        if (screen.width === 1284 && screen.height === 2778) return true;
        // iPhone 14 Pro Max, 15 Pro Max
        if (screen.width === 1290 && screen.height === 2796) return true;

        return false;
    },

    // Get safe area insets for notched devices
    getSafeAreaInsets: () => {
        if (typeof window === 'undefined') return { top: 0, bottom: 0, left: 0, right: 0 };

        const style = getComputedStyle(document.documentElement);
        return {
            top: parseInt(style.getPropertyValue('--sat') || '0'),
            bottom: parseInt(style.getPropertyValue('--sab') || '0'),
            left: parseInt(style.getPropertyValue('--sal') || '0'),
            right: parseInt(style.getPropertyValue('--sar') || '0')
        };
    },

    // Optimize for mobile performance
    optimizeForMobile: () => {
        if (!platformDetection.isMobile()) return;

        // Disable hover effects on mobile
        document.body.classList.add('mobile-device');

        // Prevent zoom on double tap (iOS)
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
};

// React hook for platform detection
export const usePlatform = () => {
    const [platform, setPlatform] = React.useState<'ios' | 'android' | 'web'>('web');
    const [isMobile, setIsMobile] = React.useState(false);
    const [hasNotch, setHasNotch] = React.useState(false);

    React.useEffect(() => {
        setPlatform(platformDetection.getPlatform());
        setIsMobile(platformDetection.isMobile());
        setHasNotch(platformDetection.hasNotch());
        platformDetection.optimizeForMobile();
    }, []);

    return { platform, isMobile, hasNotch, isIOS: platform === 'ios', isAndroid: platform === 'android' };
};
