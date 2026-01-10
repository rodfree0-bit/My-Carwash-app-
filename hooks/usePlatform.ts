import { useState, useEffect } from 'react';
import { platformDetection } from '../utils/platformDetection';

export const usePlatform = () => {
    const [platform, setPlatform] = useState(platformDetection.getPlatform());
    const [isMobile, setIsMobile] = useState(platformDetection.isMobile());
    const [hasNotch, setHasNotch] = useState(platformDetection.hasNotch());

    useEffect(() => {
        const updatePlatform = () => {
            setPlatform(platformDetection.getPlatform());
            setIsMobile(platformDetection.isMobile());
            setHasNotch(platformDetection.hasNotch());
        };

        window.addEventListener('resize', updatePlatform);
        updatePlatform();

        return () => window.removeEventListener('resize', updatePlatform);
    }, []);

    return {
        platform,
        isMobile,
        hasNotch,
        isIOS: platform === 'ios',
        isAndroid: platform === 'android'
    };
};
