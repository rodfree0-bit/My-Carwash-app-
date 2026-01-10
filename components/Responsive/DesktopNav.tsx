import React from 'react';
import { Screen } from '../../types';

interface DesktopNavProps {
    currentScreen: Screen;
    navigate: (screen: Screen) => void;
    role: 'client' | 'washer' | 'admin';
    userName: string;
    unreadCount?: number;
    onLogout: () => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
    currentScreen,
    navigate,
    role,
    userName,
    unreadCount = 0,
    onLogout
}) => {
    const getNavItems = () => {
        if (role === 'client') {
            return [
                { screen: Screen.CLIENT_HOME, icon: 'home', label: 'Home' },
                { screen: Screen.CLIENT_BOOKINGS, icon: 'event', label: 'My Bookings' },
                { screen: Screen.CLIENT_GARAGE, icon: 'garage', label: 'My Garage' },
                { screen: Screen.CLIENT_PROFILE, icon: 'person', label: 'Profile' },
            ];
        }

        if (role === 'washer') {
            return [
                { screen: Screen.WASHER_DASHBOARD, icon: 'dashboard', label: 'Dashboard' },
                { screen: Screen.WASHER_JOBS, icon: 'work', label: 'My Jobs' },
                { screen: Screen.WASHER_EARNINGS, icon: 'payments', label: 'Earnings' },
                { screen: Screen.WASHER_SETTINGS, icon: 'settings', label: 'Settings' },
            ];
        }

        // Admin
        return [
            { screen: Screen.ADMIN_DASHBOARD, icon: 'dashboard', label: 'Dashboard' },
            { screen: Screen.ADMIN_TEAM, icon: 'group', label: 'Team' },
            { screen: Screen.ADMIN_CLIENTS, icon: 'people', label: 'Clients' },
            { screen: Screen.ADMIN_PRICING, icon: 'sell', label: 'Pricing' },
            { screen: Screen.ADMIN_DISCOUNTS, icon: 'discount', label: 'Discount Codes' },
            { screen: Screen.ADMIN_ISSUES, icon: 'support', label: 'Support' },
            { screen: Screen.ADMIN_ANALYTICS, icon: 'analytics', label: 'Analytics' },
            { screen: Screen.ADMIN_SETTINGS, icon: 'settings', label: 'Configuration' },
        ];
    };

    const navItems = getNavItems();

    return (
        <nav className="fixed left-0 top-0 bottom-0 w-64 bg-surface-dark border-r border-white/10 flex flex-col z-40">
            {/* Logo/Brand */}
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold text-primary">CarWash Pro</h1>
                <p className="text-sm text-slate-400 mt-1 capitalize">{role} Panel</p>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = currentScreen === item.screen;
                    return (
                        <button
                            key={item.screen}
                            onClick={() => navigate(item.screen)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-primary text-black font-bold'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.screen === Screen.ADMIN_ISSUES && unreadCount > 0 && (
                                <span className="px-2 py-1 bg-red-500 rounded-full text-xs font-bold">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-sm">{userName}</p>
                        <p className="text-xs text-slate-400 capitalize">{role}</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <span className="material-symbols-outlined">logout</span>
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};
