import React from 'react';
import { usePlatform } from '../../hooks/usePlatform';

interface ResponsiveLayoutProps {
    children: React.ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
    const { isMobile, isAndroid, isIOS } = usePlatform();

    return (
        <div className={`
            ${isMobile ? 'mobile-layout' : 'desktop-layout'}
            ${isAndroid ? 'android' : ''}
            ${isIOS ? 'ios' : ''}
        `}>
            {children}
        </div>
    );
};
