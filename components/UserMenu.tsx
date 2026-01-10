import React, { useState, useRef, useEffect } from 'react';
import { authService } from '../services/authService';
import { i18n, useLanguage } from '../services/i18n';

interface UserMenuProps {
    user: {
        name: string;
        email: string;
        avatar?: string;
        role?: string;
    };
    onLogout: () => void;
    onContactSupport?: () => void; // NEW: Optional callback for contact support
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, onContactSupport }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { t, setLanguage, language } = useLanguage();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-black font-bold text-sm shadow-lg hover:scale-105 transition-transform"
            >
                {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                    getInitials(user.name)
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50">
                    {/* User Info */}
                    <div className="p-4 border-b border-white/10">
                        <p className="font-bold text-white">{user.name}</p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                        {user.role && (
                            <span className="inline-block mt-2 px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded-lg uppercase">
                                {user.role}
                            </span>
                        )}
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">

                        {/* Contact Support Button - Only show for clients */}
                        {onContactSupport && user.role === 'client' && (
                            <button
                                onClick={() => {
                                    onContactSupport();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left text-primary hover:bg-primary/10 rounded-lg transition-colors mb-1"
                            >
                                <span className="material-symbols-outlined text-xl">support_agent</span>
                                <span className="font-medium">{i18n.t('contact_support')}</span>
                            </button>
                        )}

                        <button
                            onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">logout</span>
                            <span className="font-medium">{i18n.t('logout')}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
