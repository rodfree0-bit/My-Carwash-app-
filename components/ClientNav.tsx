import React from 'react';
import { Screen } from '../types';
import { triggerNativeHaptic } from '../utils/native';

interface ClientNavProps {
    activeScreen: Screen;
    navigate: (screen: Screen) => void;
    unreadCount?: number;
}

export const ClientNav: React.FC<ClientNavProps> = ({ activeScreen, navigate, unreadCount = 0 }) => {
    const navItems = [
        {
            screen: Screen.CLIENT_HOME,
            icon: 'home',
            label: 'Home',
            activeIcon: 'home'
        },
        {
            screen: Screen.CLIENT_BOOKINGS,
            icon: 'history',
            label: 'History',
            activeIcon: 'history'
        },
        {
            screen: Screen.CLIENT_GARAGE,
            icon: 'garage',
            label: 'Garage',
            activeIcon: 'garage'
        },
        {
            screen: Screen.CLIENT_PROFILE,
            icon: 'person',
            label: 'Profile',
            activeIcon: 'person',
            badge: unreadCount
        }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface-dark/95 backdrop-blur-xl border-t border-white/10 z-30 safe-area-inset-bottom">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
                {navItems.map((item) => {
                    const isActive = activeScreen === item.screen;

                    return (
                        <button
                            key={item.screen}
                            onClick={() => {
                                triggerNativeHaptic(5);
                                navigate(item.screen);
                            }}
                            className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-200 ${isActive ? 'text-primary' : 'text-slate-400'
                                }`}
                        >
                            {/* Icon */}
                            <div className="relative">
                                <span
                                    className={`material-symbols-outlined text-2xl transition-all duration-200 ${isActive ? 'scale-110 font-bold' : ''
                                        }`}
                                    style={{ fontVariationSettings: isActive ? '"FILL" 1, "wght" 600' : '"FILL" 0, "wght" 400' }}
                                >
                                    {isActive ? item.activeIcon : item.icon}
                                </span>

                                {/* Badge for notifications */}
                                {item.badge && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
                            <span className={`text-[10px] mt-0.5 font-medium transition-all duration-200 ${isActive ? 'font-bold' : ''
                                }`}>
                                {item.label}
                            </span>

                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
