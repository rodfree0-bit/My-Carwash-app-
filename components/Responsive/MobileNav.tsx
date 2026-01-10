import React from 'react';
import { Screen } from '../../types';

interface MobileNavProps {
    currentScreen: Screen;
    navigate: (screen: Screen) => void;
    role: 'client' | 'washer' | 'admin';
    unreadCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentScreen, navigate, role, unreadCount = 0 }) => {
    const getNavItems = () => {
        if (role === 'client') {
            return [
                { screen: Screen.CLIENT_HOME, icon: 'home', label: 'Home' },
                { screen: Screen.CLIENT_BOOKINGS, icon: 'event', label: 'Bookings' },
                { screen: Screen.CLIENT_GARAGE, icon: 'garage', label: 'Garage' },
                { screen: Screen.CLIENT_PROFILE, icon: 'person', label: 'Profile' },
            ];
        }

        if (role === 'washer') {
            return [
                { screen: Screen.WASHER_DASHBOARD, icon: 'dashboard', label: 'Dashboard' },
                { screen: Screen.WASHER_JOBS, icon: 'work', label: 'Jobs' },
                { screen: Screen.WASHER_EARNINGS, icon: 'payments', label: 'Earnings' },
                { screen: Screen.WASHER_SETTINGS, icon: 'settings', label: 'Settings' },
            ];
        }

        // Admin
        return [
            { screen: Screen.ADMIN_DASHBOARD, icon: 'dashboard', label: 'Dashboard' },
            { screen: Screen.ADMIN_TEAM, icon: 'group', label: 'Team' },
            { screen: Screen.ADMIN_CLIENTS, icon: 'people', label: 'Clients' },
            { screen: Screen.ADMIN_ISSUES, icon: 'support', label: 'Issues' },
        ];
    };

    const navItems = getNavItems();

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 bg-surface-dark/95 backdrop-blur-xl border-t border-white/10 z-40"
            style={{
                paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
            }}
        >
            <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
                {navItems.map((item) => {
                    const isActive = currentScreen === item.screen;
                    return (
                        <button
                            key={item.screen}
                            onClick={() => navigate(item.screen)}
                            className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all ${isActive ? 'text-primary' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <div className="relative">
                                <span
                                    className={`material-symbols-outlined text-2xl transition-all ${isActive ? 'scale-110' : ''
                                        }`}
                                    style={{ fontVariationSettings: isActive ? '"FILL" 1, "wght" 600' : '"FILL" 0, "wght" 400' }}
                                >
                                    {item.icon}
                                </span>
                                {item.screen === Screen.ADMIN_ISSUES && unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] font-medium transition-all ${isActive ? 'font-bold' : ''
                                }`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
