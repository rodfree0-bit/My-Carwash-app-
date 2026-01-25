import React, { useState, useEffect, Suspense } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from './firebase';
import { authService } from './services/authService';
import { useJsApiLoader } from '@react-google-maps/api';
import { Screen, Order, TeamMember, ClientUser, Notification, NotificationType, Message, ServicePackage, ServiceAddon, IssueReport } from './types';
import { AuthScreens } from './components/Auth';
import { onSnapshot, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { useFirestoreData } from './hooks/useFirestoreData';
import { useFirestoreActions } from './hooks/useFirestoreActions';
import { WasherRegistration } from './components/WasherRegistration';
import { LocationTracker } from './components/LocationTracker';
import { ToastProvider, useToast } from './components/Toast';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { analytics } from './services/AnalyticsService';
import { securityService } from './services/SecurityService';
import { pushNotificationService } from './services/pushNotificationService';
import { usePlatform } from './utils/platformDetection';

// Extend Window interface for Native interaction (Combined with types.ts)
declare global {
    interface Window {
        nativeUserData?: {
            uid: string;
            email: string;
            displayName: string;
            token: string;
        };
        isNativeApp?: boolean;
    }
}

// Lazy load heavy components for code splitting
const ClientScreens = React.lazy(() => import('./components/Client').then(m => ({ default: m.ClientScreens })));
const WasherScreens = React.lazy(() => import('./components/Washer').then(m => ({ default: m.WasherScreens })));
const AdminScreens = React.lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminScreens })));
const NativeTest = React.lazy(() => import('./components/NativeTest').then(m => ({ default: m.NativeTest })));

// Define libraries as static constant to prevent infinite re-renders
const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry")[] = ['places', 'geometry'];

const AppContent: React.FC = () => {
    const { showToast } = useToast();
    const { platform, isMobile, isIOS, isAndroid, hasNotch } = usePlatform();

    useEffect(() => {
        console.log(`🚀 VERSION 2.9 LOADED - Platform: ${platform.toUpperCase()} ${hasNotch ? '(Notch)' : ''} 🚀`);

        // Add platform class to HTML tag for REM scaling
        if (isMobile) document.documentElement.classList.add('platform-mobile');
        if (isAndroid) document.documentElement.classList.add('platform-android');
        if (isIOS) document.documentElement.classList.add('platform-ios');

        // Track platform
        analytics.logEvent('app_platform_detected', {
            platform,
            isMobile,
            isIOS,
            isAndroid,
            hasNotch,
            userAgent: navigator.userAgent
        });

        // Register Service Worker for PWA
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => {
                        console.log('✅ Service Worker registered for PWA:', reg);
                        analytics.logEvent('pwa_sw_registered', { platform });
                    })
                    .catch(err => console.error('❌ SW registration failed:', err));
            });
        }

        // Track app load
        analytics.trackScreenView('App_Loaded');
    }, [platform, isMobile, isIOS, isAndroid, hasNotch]);

    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);
    const [currentUser, setCurrentUser] = useState<TeamMember | ClientUser | null>(null);

    // REAL-TIME DATA FROM FIRESTORE
    const {
        orders: firestoreOrders, clients: firestoreClients, team: firestoreTeam,
        packages: firestorePackages, packagesError, addons: firestoreAddons, vehicleTypes: firestoreVehicleTypes,
        discounts: firestoreDiscounts, bonuses: firestoreBonuses, payments: firestorePayments,
        issues: firestoreIssues, messages: firestoreMessages, notifications: firestoreNotifications,
        serviceArea: firestoreServiceArea,
        washerApplications,
        loading: dataLoading
    } = useFirestoreData(firebaseUser, currentUser?.role);

    const {
        createOrder, updateOrder, cancelOrder, savePackage, deletePackage, saveAddon, deleteAddon,
        updateUserProfile, deleteUser, addClient, saveVehicleType, deleteVehicleType,
        createDiscount, updateDiscount, deleteDiscount,
        createBonus, updateBonus, deleteBonus,
        createPayment, submitWasherApplication, approveWasherApplication, rejectWasherApplication,
        createIssue, sendMessage, markMessagesAsRead, addNotification, submitOrderRating,
        saveServiceArea, grabOrder
    } = useFirestoreActions();

    // Local state for UI logic
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ONBOARDING);

    // --- GOOGLE MAPS LOADER (Global) ---
    const { isLoaded: isGoogleMapsLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries: GOOGLE_MAPS_LIBRARIES
    });

    // --- HISTORY MANAGEMENT FOR ANDROID BACK BUTTON ---
    useEffect(() => {
        window.history.replaceState({ screen: currentScreen }, '');

        const handlePopState = (event: PopStateEvent) => {
            if (event.state && event.state.screen) {
                console.log("Navigating back to:", event.state.screen);
                setCurrentScreen(event.state.screen);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // --- NAVIGATION MANAGER ---
    const navigateTo = (screen: Screen) => {
        if (currentScreen === screen) return; // Prevent duplicate navigation

        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
            window.history.pushState({ screen }, '', `?screen=${screen}`);
        }
        setCurrentScreen(screen);
    };

    // --- CAPACITOR ANDROID BACK BUTTON ---
    useEffect(() => {
        let backListener: any;
        const setupBackListener = async () => {
            backListener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
                const rootScreens = [
                    Screen.ONBOARDING,
                    Screen.LOGIN,
                    Screen.REGISTER,
                    Screen.CLIENT_HOME,
                    Screen.WASHER_DASHBOARD,
                    Screen.ADMIN_DASHBOARD
                ];

                if (rootScreens.includes(currentScreen)) {
                    console.log('Minimizing app from root screen:', currentScreen);
                    CapacitorApp.minimizeApp();
                } else {
                    console.log('Navigating back from:', currentScreen);
                    window.history.back();
                }
            });
        };

        setupBackListener();
        return () => {
            if (backListener) {
                backListener.remove();
            }
        };
    }, [currentScreen]);

    // Data State (Synced from Firestore)
    const [orders, setOrders] = useState<Order[]>([]);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [clients, setClients] = useState<ClientUser[]>([]);
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const [addons, setAddons] = useState<ServiceAddon[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
    const [discounts, setDiscounts] = useState<any[]>([]);
    const [bonuses, setBonuses] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [serviceArea, setServiceArea] = useState<any>(null);
    const [globalFees, setGlobalFees] = useState<{ name: string, percentage: number }[]>([{ name: 'App Commission', percentage: 20 }]);

    // Load Global Fees from Firestore
    useEffect(() => {
        const loadFees = async () => {
            try {
                const docRef = doc(db, 'settings', 'fees');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().globalFees) {
                    setGlobalFees(docSnap.data().globalFees);
                    console.log('✅ Global Fees loaded:', docSnap.data().globalFees);
                }
            } catch (e) {
                console.error("Error loading fees", e);
            }
        };
        loadFees();
    }, []);

    // Sync Firestore -> Local State
    useEffect(() => {
        if (!dataLoading) {
            setOrders(firestoreOrders || []);
            setTeam(firestoreTeam || []);
            setClients(firestoreClients || []);
            setPackages(firestorePackages || []);
            setAddons(firestoreAddons || []);
            setVehicleTypes(firestoreVehicleTypes || []);
            setDiscounts(firestoreDiscounts || []);
            setBonuses(firestoreBonuses || []);
            setPayments(firestorePayments || []);
            setIssues(firestoreIssues || []);
            setMessages(firestoreMessages || []);
            setNotifications(firestoreNotifications || []);
            setServiceArea(firestoreServiceArea || null);
        }
    }, [firestoreOrders, firestoreTeam, firestoreClients, firestorePackages, firestoreAddons, firestoreVehicleTypes, firestoreDiscounts, firestoreBonuses, firestorePayments, firestoreIssues, firestoreMessages, firestoreNotifications, firestoreServiceArea, dataLoading]);

    // SYNC CURRENT USER WITH REAL-TIME FIRESTORE DATA
    useEffect(() => {
        if (currentUser?.id) {
            if (currentUser.role === 'client') {
                const found = clients.find(c => c.id === currentUser.id);
                if (found && JSON.stringify(found) !== JSON.stringify(currentUser)) {
                    console.log("⚡ Auto-syncing currentUser data from Firestore...");
                    setCurrentUser(found);
                }
            } else {
                const found = team.find(t => t.id === currentUser.id);
                if (found && JSON.stringify(found) !== JSON.stringify(currentUser)) {
                    console.log("⚡ Auto-syncing teamMember data from Firestore...");
                    setCurrentUser(found);
                }
            }
        }
    }, [clients, team, currentUser]);

    // UI State
    const [supportPhone, setSupportPhone] = useState<string>('');
    const [reportEmail, setReportEmail] = useState<string>('');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [issues, setIssues] = useState<IssueReport[]>([]);
    const [newOrderDraft, setNewOrderDraft] = useState<Partial<Order>>({});
    const [isLoading, setIsLoading] = useState(false);

    // --- OPTIMISTIC AUTH (LOCAL STORAGE CACHE) ---
    useEffect(() => {
        try {
            const cachedProfile = localStorage.getItem('app_user_cache');
            if (cachedProfile) {
                const parsed = JSON.parse(cachedProfile);
                console.log('⚡ OPTIMISTIC LOAD: Found cached profile', parsed.email);

                // Validate essential fields to prevent crashes
                if (!parsed.id || !parsed.role) {
                    throw new Error('Invalid cached profile structure');
                }

                setCurrentUser(parsed);

                // ALWAYS navigate to home dashboard on app load, ignore URL params
                if (parsed.role === 'client') navigateTo(Screen.CLIENT_HOME);
                if (parsed.role === 'washer') navigateTo(Screen.WASHER_DASHBOARD);
                if (parsed.role === 'admin') navigateTo(Screen.ADMIN_DASHBOARD);
            }
        } catch (e) {
            console.warn('Optimistic load failed, clearing cache:', e);
            localStorage.removeItem('app_user_cache');
            setCurrentUser(null);
        }

        // Define global handler for FCM Token from Android
        (window as any).onFCMTokenReceived = async (token: string) => {
            console.log('📨 FCM Token Received from Android:', token);
            if (auth.currentUser) {
                try {
                    const { doc, setDoc } = await import('firebase/firestore');
                    const { db } = await import('./firebase');

                    // Save to Firestore with merge to avoid overwriting other fields
                    await setDoc(doc(db, 'users', auth.currentUser.uid), {
                        fcmToken: token,
                        lastTokenUpdate: new Date().toISOString()
                    }, { merge: true });

                    console.log('✅ FCM Token saved via Web App successfully');

                    // Also save to local storage for debugging/reference
                    localStorage.setItem('fcm_token', token);
                } catch (error) {
                    console.error('❌ Error saving FCM token from Web:', error);
                }
            } else {
                console.warn('⚠️ Received FCM token but no user is logged in. Storing locally for later.');
                localStorage.setItem('pending_fcm_token', token);
            }
        };

        // Check if we have a pending token to save after login
        const pendingToken = localStorage.getItem('pending_fcm_token');
        if (pendingToken && auth.currentUser) {
            (window as any).onFCMTokenReceived(pendingToken);
            localStorage.removeItem('pending_fcm_token');
        }

        return () => {
            // Cleanup: delete (window as any).onFCMTokenReceived; 
            // Better to leave it or nullify it to avoid errors if Android calls it later
            (window as any).onFCMTokenReceived = () => { };
        };
    }, [firebaseUser]); // Re-bind if user changes

    // --- FIREBASE AUTH LOGIC ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setFirebaseUser(user);
            setIsAuthLoaded(true);

            if (user) {
                if (typeof window !== 'undefined' && window.Android?.setUserId) {
                    window.Android.setUserId(user.uid);
                    // Explicitly request token update
                    if (window.Android?.requestFCMToken) {
                        console.log('📲 Requesting FCM token update from Android...');
                        window.Android.requestFCMToken();
                    }
                }

                const email = user.email;
                if (!email) return;

                let userProfile: any = null;
                try {
                    userProfile = await authService.getCurrentUserProfile(user.uid);
                } catch (e) {
                    console.error('❌ CRITICAL ERROR: Failed to fetch user profile. Aborting to protect data.', e);
                    showToast('Connection error loading profile. Please refresh.', 'error');
                    return; // ABORT: Do NOT proceed to create a new profile if the read failed!
                }

                if (!userProfile) {
                    console.warn('User document does not exist. Creating fallback profile...');
                    // Only create if we are SURE it doesn't exist (no error thrown)
                    userProfile = {
                        id: user.uid,
                        name: user.displayName || 'App User',
                        email: email,
                        role: 'client',
                        createdAt: new Date().toISOString(),
                        phone: '',
                        address: '',
                        savedVehicles: [] // Ensure field exists
                    };

                    // Save the profile to Firestore so it persists
                    try {
                        const { doc, setDoc } = await import('firebase/firestore');
                        const { db } = await import('./firebase');
                        // Use merge: true to avoid overwriting existing data if it exists but wasn't fetched correctly
                        await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });
                        console.log('✅ User profile created/merged successfully in Firestore');
                    } catch (e) {
                        console.error('Failed to create user profile:', e);
                    }
                }

                const role = userProfile.role || 'client';

                if (role === 'admin') {
                    const existingAdmin = team.find(u => u.email.toLowerCase() === email.toLowerCase());
                    const adminUser: TeamMember = existingAdmin || {
                        id: user.uid,
                        name: userProfile.name || 'Admin',
                        email: email,
                        role: 'admin',
                        status: 'Active',
                        joinedDate: userProfile.createdAt || new Date().toISOString(),
                        avatar: userProfile.avatar || user.photoURL || '',
                        completedJobs: 0
                    };
                    setCurrentUser(adminUser);
                    analytics.setUser(user.uid, { role: 'admin', email });
                    analytics.trackLogin('email');

                    if (currentScreen.startsWith('ONBOARDING') || currentScreen.startsWith('LOGIN') || currentScreen.startsWith('REGISTER')) {
                        console.log('Redirecting Admin to Dashboard');
                        navigateTo(Screen.ADMIN_DASHBOARD);
                    }
                } else if (role === 'washer') {
                    const existingWasher = team.find(u => u.email.toLowerCase() === email.toLowerCase());
                    const washerUser: TeamMember = existingWasher || {
                        id: user.uid,
                        name: userProfile.name || 'Washer',
                        email: email,
                        role: 'washer',
                        status: 'Active',
                        joinedDate: userProfile.createdAt || new Date().toISOString(),
                        avatar: userProfile.avatar || user.photoURL || '',
                        completedJobs: 0,
                        rating: 5.0
                    };

                    if (washerUser.status === 'Blocked') {
                        showToast('Access Denied: Your account has been blocked.', 'error');
                        authService.logout();
                        return;
                    }

                    setCurrentUser(washerUser);
                    if (currentScreen.startsWith('ONBOARDING') || currentScreen.startsWith('LOGIN') || currentScreen.startsWith('REGISTER')) {
                        console.log('Redirecting Washer to Dashboard');
                        navigateTo(Screen.WASHER_DASHBOARD);
                    }
                } else {
                    const clientUser: ClientUser = {
                        id: user.uid,
                        email: email,
                        name: userProfile.name || user.displayName || 'Client',
                        role: 'client',
                        phone: userProfile.phone || '',
                        address: userProfile.address || '',
                        avatar: userProfile.avatar || user.photoURL || '',
                        savedVehicles: userProfile.savedVehicles || [],
                        savedAddresses: userProfile.savedAddresses || [],
                        savedCards: userProfile.savedCards || []
                    };

                    setCurrentUser(clientUser);
                    analytics.setUser(user.uid, { role: 'client', email });

                    if (currentScreen.startsWith('ONBOARDING') || currentScreen.startsWith('LOGIN') || currentScreen.startsWith('REGISTER')) {
                        console.log('Redirecting Client to Home');
                        navigateTo(Screen.CLIENT_HOME);
                    }
                }
            } else {
                if (currentUser) {
                    console.log('User signed out, clearing cache');
                    setCurrentUser(null);
                    localStorage.removeItem('app_user_cache');
                }
            }
        });

        return () => unsubscribe();
    }, [team, clients, currentScreen]);

    // --- UNIFIED NOTIFICATION SERVICE ---
    useEffect(() => {
        if (firebaseUser && currentUser) {
            import('./services/pushNotificationService').then(({ pushNotificationService }) => {
                pushNotificationService.initialize(currentUser.id);
            });

            // HANDLE NATIVE FCM TOKEN (Custom Bridge)
            window.onFCMTokenReceived = async (token: string) => {
                console.log('📱 FCM Token Received from Native Android:', token);
                try {
                    const { doc, updateDoc, setDoc } = await import('firebase/firestore');
                    const userRef = doc(db, 'users', currentUser.id);
                    // Use set with merge to be safe
                    await setDoc(userRef, { fcmToken: token }, { merge: true });
                    console.log('✅ FCM Token saved successfully to Firestore (Native Bridge)');
                } catch (e) {
                    console.error('❌ Error saving native FCM token:', e);
                }
            };

            // Request token immediately in case we missed the onPageFinished event
            if (window.Android?.requestFCMToken) {
                console.log('👋 Requesting FCM Token from Native Bridge...');
                window.Android.requestFCMToken();
            }

            const handleForegroundMessage = (event: any) => {
                const payload = event.detail;
                if (payload.notification) {
                    const title = payload.notification.title || 'Notification';
                    const body = payload.notification.body || '';

                    // CRITICAL: Verify notification is for current user
                    const targetUserId = payload.data?.targetUserId || payload.data?.userId || payload.data?.recipientId;
                    const targetRole = payload.data?.targetRole || payload.data?.role;

                    console.log(`🔍 Filtering Notification: targetUser=${targetUserId}, targetRole=${targetRole} (Current: ${currentUser?.id}, ${currentUser?.role})`);

                    // Filter by user ID if provided
                    if (targetUserId && currentUser && targetUserId !== currentUser.id) {
                        console.warn(`⚠️ Ignoring notification for different user: ${targetUserId}`);
                        return;
                    }

                    // Filter by role if provided
                    if (targetRole && currentUser && targetRole !== currentUser.role) {
                        console.warn(`⚠️ Ignoring notification for different role: ${targetRole}`);
                        return;
                    }

                    // Strict check for admins: only show "admin" prefix notifications if the role matches
                    if (currentUser?.role !== 'admin' && targetRole === 'admin') {
                        console.warn(`⚠️ Blocking Admin notification for non-admin user`);
                        return;
                    }

                    console.log(`🔔 Foreground Notification Confirmed for ${currentUser?.role}: ${title}`);
                    showToast(`${title}: ${body}`, 'info');
                }
            };

            window.addEventListener('fcm-message', handleForegroundMessage);
            return () => {
                window.removeEventListener('fcm-message', handleForegroundMessage);
            };
        }
    }, [firebaseUser, currentUser]);

    // --- DEEP LINKING ---
    const [targetOrderId, setTargetOrderId] = useState<string | null>(null);

    // Initial URL Params Check (Cold Start)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const screenParam = params.get('screen');
            const orderIdParam = params.get('orderId');

            if (screenParam && Object.values(Screen).includes(screenParam as Screen)) {
                console.log('🔗 Deep Link Detected (Cold Start):', screenParam, orderIdParam);
                navigateTo(screenParam as Screen);
                if (orderIdParam) setTargetOrderId(orderIdParam);
            }

            // Define native bridge handler for hot linking
            window.handleDeepLink = (screen: string, orderId: string) => {
                console.log('🔗 Deep Link Received (Native Bridge):', screen, orderId);
                if (Object.values(Screen).includes(screen as Screen)) {
                    navigateTo(screen as Screen);
                    if (orderId) setTargetOrderId(orderId);
                }
            };
        }
    }, []);

    // REAL-TIME LISTENER FOR CURRENT USER PROFILE
    useEffect(() => {
        if (!firebaseUser || !currentUser) return;

        console.log('👂 Setting up real-time listener for user:', currentUser.id);

        const unsubscribe = onSnapshot(
            doc(db, 'users', currentUser.id),
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const updatedData = { id: docSnapshot.id, ...docSnapshot.data() } as any;
                    console.log('🔄 User document updated from Firestore:', updatedData);
                    console.log('   savedVehicles:', updatedData.savedVehicles || []);
                    setCurrentUser(updatedData);
                    localStorage.setItem('app_user_cache', JSON.stringify(updatedData));
                } else {
                    console.warn('⚠️ User document does not exist:', currentUser.id);
                }
            },
            (error) => {
                console.error('❌ Error listening to user document:', error);
            }
        );

        return () => {
            console.log('👋 Cleaning up user listener');
            unsubscribe();
        };
    }, [firebaseUser, currentUser?.id]);

    // --- ACTIONS ---
    const handleLogout = async () => {
        console.log('🚪 Logging out user:', currentUser?.id, currentUser?.role);

        // Clear FCM token to prevent notifications going to wrong user
        try {
            if (currentUser?.id) {
                console.log('🔑 Clearing FCM token from Firestore...');
                await updateUserProfile(currentUser.id, { fcmToken: null });
                console.log('✅ FCM token cleared from Firestore');
            }

            await pushNotificationService.clearToken();
            console.log('✅ FCM token cleared from service');
        } catch (error) {
            console.error('❌ Error clearing FCM token on logout:', error);
        }

        await authService.logout();
        setCurrentUser(null);
        localStorage.removeItem('app_user_cache');
        navigateTo(Screen.ONBOARDING);
        showToast('Logged out successfully', 'info');
    };

    const handleUpdateWasherProfile = async (updates: any) => {
        if (!currentUser) return;
        try {
            await updateUserProfile(currentUser.id, updates);
            setCurrentUser({ ...currentUser, ...updates });
            showToast('Profile updated', 'success');
        } catch (e) {
            showToast("Error updating profile", 'error');
        }
    };

    const handleUpdateClientProfile = async (updates: any) => {
        if (!currentUser) return;
        try {
            console.log('🔵 handleUpdateClientProfile START');
            console.log('   currentUser.id:', currentUser.id);
            console.log('   updates:', JSON.stringify(updates, null, 2));
            console.log('   Calling updateUserProfile...');
            await updateUserProfile(currentUser.id, updates);
            console.log('✅ Firestore updated successfully - waiting for listener to update UI');
            showToast('Profile updated', 'success');
            console.log('🔵 handleUpdateClientProfile END');
        } catch (e) {
            console.error('❌ Error in handleUpdateClientProfile:', e);
            showToast("Error updating profile", 'error');
        }
    };

    const handleCreateOrder = async (orderData: Partial<Order>) => {
        setIsLoading(true);
        try {
            let calculatedPrice = orderData.price || 0;

            if (calculatedPrice === 0 && orderData.vehicleConfigs && orderData.vehicleConfigs.length > 0) {
                console.log('💰 Calculating price from vehicleConfigs...');
                calculatedPrice = orderData.vehicleConfigs.reduce((total, config) => {
                    const pkg = packages.find(p => p.id === config.packageId);
                    const pkgPrice = pkg?.price[config.vehicleType] || 0;
                    const addonsTotal = (config.addonIds || []).reduce((addonSum: number, addonId: string) => {
                        const addon = addons.find(a => a.id === addonId);
                        const addonPrice = addon?.price[config.vehicleType] || 0;
                        return addonSum + addonPrice;
                    }, 0);
                    console.log(`  ${config.vehicleModel}: Package $${pkgPrice} + Addons $${addonsTotal}`);
                    return total + pkgPrice + addonsTotal;
                }, 0);
                console.log(`✅ Total calculated price: $${calculatedPrice}`);
            }

            const newOrder: any = {
                clientName: currentUser?.name || 'Client',
                clientId: currentUser?.id,
                vehicle: orderData.vehicle || (orderData.vehicleConfigs && orderData.vehicleConfigs.length > 0 ? orderData.vehicleConfigs[0].vehicleModel : 'Unknown Vehicle'),
                vehicleType: orderData.vehicleType || (orderData.vehicleConfigs && orderData.vehicleConfigs.length > 0 ? orderData.vehicleConfigs[0].vehicleType : 'Sedan'),
                service: orderData.service || 'Ultimate Shine',
                addons: orderData.addons || [],
                vehicleConfigs: orderData.vehicleConfigs || [],
                date: orderData.date || 'Today',
                time: orderData.time || '10:00 AM',
                address: orderData.address || (currentUser as ClientUser)?.address || '123 Main St, Springfield',
                price: calculatedPrice,
                basePrice: calculatedPrice,
                status: 'Pending',
                location: orderData.location
            };

            console.log('📦 Creating order with price:', calculatedPrice);
            const orderId = await createOrder(newOrder);
            setNewOrderDraft({});
            navigateTo(Screen.CLIENT_HOME);
            showToast('Order created successfully!', 'success');
            return orderId;
        } catch (error) {
            showToast("Failed to create order", 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateOrder = async (orderId: string, updates: Partial<Order>) => {
        try {
            await updateOrder(orderId, updates);
            showToast('Order updated', 'success');
        } catch (error) {
            showToast("Failed to update order", 'error');
        }
    };

    const handleCancelOrder = async (orderId: string, applyFee: boolean = false) => {
        try {
            await cancelOrder(orderId, applyFee);
            const order = orders.find(o => o.id === orderId);
            if (order && order.clientId) {
                const client = clients.find(c => c.id === order.clientId);
                if (client) {
                    const currentRating = typeof client.rating === 'number' ? client.rating : 5.0;
                    const newRating = Math.max(0, parseFloat((currentRating - 0.5).toFixed(1)));
                    const newCount = (client.cancellationCount || 0) + 1;
                    await updateUserProfile(client.id, {
                        rating: newRating,
                        cancellationCount: newCount
                    });
                    console.log(`Penalty applied to Client ${client.name}: Rating ${currentRating} -> ${newRating}`);
                }
            }
        } catch (e) {
            console.error("handleCancelOrder failed", e);
            throw e;
        }
    };

    const handleAssignOrder = async (orderId: string, washerId: string) => {
        const washer = team.find(w => w.id === washerId);
        await updateOrder(orderId, {
            washerId,
            washerName: washer?.name || 'Unknown',
            status: 'Assigned'
        });
        showToast('Order assigned successfully', 'success');
    };

    const handleAddTeamMember = async (memberData: any) => {
        showToast('Team member creation requires Admin API integration', 'info');
    };

    const handleToggleBlockUser = async (userId: string) => {
        const user = team.find(u => u.id === userId);
        const newStatus = user?.status === 'Blocked' ? 'Active' : 'Blocked';
        await updateUserProfile(userId, { status: newStatus });
        showToast(`User ${newStatus === 'Blocked' ? 'blocked' : 'unblocked'}`, 'success');
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('⚠️ Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await deleteUser(userId);
                showToast('User deleted successfully', 'success');
            } catch (error) {
                showToast('Error deleting user', 'error');
            }
        }
    };

    const handleSavePackage = async (pkg: ServicePackage) => { await savePackage(pkg); showToast('Package saved', 'success'); };
    const handleDeletePackage = async (id: string) => { await deletePackage(id); showToast('Package deleted', 'info'); };
    const handleSaveAddon = async (addon: ServiceAddon) => { await saveAddon(addon); showToast('Addon saved', 'success'); };
    const handleDeleteAddon = async (id: string) => { await deleteAddon(id); showToast('Addon deleted', 'info'); };
    const handleSaveVehicleType = async (type: any) => { await saveVehicleType(type); showToast('Vehicle Type saved', 'success'); };
    const handleDeleteVehicleType = async (id: string) => { await deleteVehicleType(id); showToast('Vehicle Type deleted', 'info'); };

    // --- NATIVE ANDROID INTEGRATION ---
    useEffect(() => {
        if (isAndroid && typeof window !== 'undefined') {
            console.log('📱 Initializing Native Android Bridge Callbacks');

            // Handler for FCM token received from Native
            window.onFCMTokenReceived = async (token: string) => {
                console.log('📱 FCM Token Received from Native Android:', token);
                if (currentUser && currentUser.id) {
                    if ((currentUser as any).fcmToken === token) {
                        console.log('✅ FCM Token already up to date. Skipping save.');
                        return;
                    }
                    try {
                        await updateUserProfile(currentUser.id, { fcmToken: token });
                        console.log('✅ FCM Token saved successfully to Firestore');
                    } catch (err) {
                        console.error('❌ Error saving native FCM token:', err);
                    }
                } else {
                    console.warn('⚠️ Received FCM token but no user is logged in. Storing in localStorage.');
                    localStorage.setItem('pendingFCMToken', token);
                }
            };

            // Request token if missing and user logged in
            if (currentUser && !(currentUser as any).fcmToken && window.Android?.requestFCMToken) {
                console.log('📲 Requesting FCM token from Android native app (Missing token)...');
                window.Android.requestFCMToken();
            }

            // Check for pending token if user just logged in
            const pendingToken = localStorage.getItem('pendingFCMToken');
            if (pendingToken && currentUser && currentUser.id) {
                console.log('📱 Found pending FCM token, saving now...');
                updateUserProfile(currentUser.id, { fcmToken: pendingToken })
                    .then(() => {
                        console.log('✅ Pending FCM token saved');
                        localStorage.removeItem('pendingFCMToken');
                    })
                    .catch(err => console.error('❌ Error saving pending FCM token:', err));
            }
        }
    }, [isAndroid, currentUser?.id, (currentUser as any)?.fcmToken]);

    // Sync User ID with Native Bridge for token registration on native side
    useEffect(() => {
        if (isAndroid && currentUser && window.Android?.setUserId) {
            console.log('🔑 Syncing UserID with Native bridge:', currentUser.id);
            window.Android.setUserId(currentUser.id);
        }
    }, [isAndroid, currentUser?.id]);

    // --- RENDER ---
    if (!isAuthLoaded) {
        return <LoadingSpinner message="Authenticating..." />;
    }

    return (
        <div className="h-screen w-screen overflow-hidden bg-background-dark text-white font-sans">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-10"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl opacity-10"></div>
            </div>

            <LocationTracker
                currentUser={currentUser && (currentUser.role === 'washer') ? (currentUser as TeamMember) : null}
                orders={orders}
            />

            <div className={`relative z-10 w-full h-full mx-auto bg-background-dark shadow-2xl overflow-hidden flex flex-col ${currentScreen.startsWith('ADMIN') ? 'max-w-full' : 'max-w-md'}`}>
                {(currentScreen.startsWith('ONBOARDING') || currentScreen === Screen.LOGIN || currentScreen === Screen.REGISTER || currentScreen === Screen.RECOVER_PASSWORD) && (
                    <AuthScreens screen={currentScreen} navigate={navigateTo} />
                )}

                {currentScreen === Screen.WASHER_REGISTRATION && (
                    <WasherRegistration
                        navigate={navigateTo}
                        onBack={() => {
                            if (currentUser) {
                                if (currentUser.role === 'client') navigateTo(Screen.CLIENT_PROFILE);
                                else if (currentUser.role === 'washer') navigateTo(Screen.WASHER_DASHBOARD);
                                else if (currentUser.role === 'admin') navigateTo(Screen.ADMIN_DASHBOARD);
                                else navigateTo(Screen.LOGIN);
                            } else {
                                navigateTo(Screen.LOGIN);
                            }
                        }}
                        initialData={currentUser ? {
                            name: currentUser.name,
                            email: currentUser.email,
                            phone: (currentUser as any).phone,
                            address: (currentUser as any).address
                        } : undefined}
                    />
                )}

                {firebaseUser && currentUser && currentScreen !== Screen.WASHER_REGISTRATION && (
                    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
                        {(() => {
                            switch (true) {
                                case currentScreen.startsWith('CLIENT'):
                                    const clientUser = currentUser as ClientUser;
                                    console.log('🔵 Passing user to ClientScreens:', {
                                        id: clientUser.id,
                                        savedCards: clientUser.savedCards,
                                        savedVehicles: clientUser.savedVehicles?.length
                                    });
                                    return (
                                        <ClientScreens
                                            screen={currentScreen}
                                            navigate={navigateTo}
                                            orders={orders.filter(o => o.clientId === currentUser.id)}
                                            updateOrder={handleUpdateOrder}
                                            cancelOrder={handleCancelOrder}
                                            createOrder={handleCreateOrder}
                                            user={clientUser}
                                            team={team}
                                            updateProfile={handleUpdateClientProfile}
                                            notifications={notifications}
                                            addNotification={addNotification}
                                            messages={messages}
                                            sendMessage={sendMessage as any}
                                            markMessagesAsRead={markMessagesAsRead}
                                            packages={packages}
                                            packagesError={packagesError || null}
                                            addons={addons}
                                            vehicleTypes={vehicleTypes}
                                            logout={handleLogout}
                                            targetOrderId={targetOrderId} // Pass deep link target
                                            newOrderDraft={newOrderDraft}
                                            setNewOrderDraft={setNewOrderDraft}
                                            createIssue={createIssue}
                                            submitOrderRating={submitOrderRating}
                                            serviceArea={serviceArea}
                                            globalFees={globalFees}
                                            discounts={discounts}
                                        />
                                    );

                                case currentScreen.startsWith('WASHER'):
                                    const washerUser = currentUser as TeamMember;
                                    return (
                                        <WasherScreens
                                            screen={currentScreen}
                                            navigate={navigateTo}
                                            orders={orders}
                                            updateOrder={handleUpdateOrder}
                                            currentWasherId={currentUser.id}
                                            currentWasher={washerUser}
                                            updateWasherProfile={handleUpdateWasherProfile}
                                            supportPhone={supportPhone}
                                            notifications={notifications}
                                            addNotification={addNotification}
                                            messages={messages}
                                            sendMessage={sendMessage as any}
                                            markMessagesAsRead={markMessagesAsRead}
                                            packages={packages}
                                            addons={addons}
                                            logout={handleLogout}
                                            grabOrder={grabOrder}
                                            showToast={showToast}
                                            initialOrderId={targetOrderId} // Pass deep link target
                                        />
                                    );

                                case currentScreen.startsWith('ADMIN'):
                                    return (
                                        <AdminScreens
                                            screen={currentScreen}
                                            navigate={navigateTo}
                                            orders={orders}
                                            team={team}
                                            clients={clients}
                                            packages={packages}
                                            addons={addons}
                                            vehicleTypes={vehicleTypes}
                                            supportPhone={supportPhone}
                                            setSupportPhone={setSupportPhone}
                                            assignOrder={handleAssignOrder}
                                            updateOrder={handleUpdateOrder}
                                            cancelOrder={cancelOrder}
                                            addTeamMember={handleAddTeamMember}
                                            toggleBlockUser={handleToggleBlockUser}
                                            deleteUser={handleDeleteUser}
                                            updateUserProfile={updateUserProfile}
                                            onSavePackage={handleSavePackage}
                                            onDeletePackage={handleDeletePackage}
                                            onSaveAddon={handleSaveAddon}
                                            onDeleteAddon={handleDeleteAddon}
                                            onSaveVehicleType={handleSaveVehicleType}
                                            onDeleteVehicleType={handleDeleteVehicleType}
                                            washerApplications={washerApplications || []}
                                            approveWasher={async (id, data) => { await approveWasherApplication(id, data); showToast('Washer Approved!', 'success'); }}
                                            rejectWasher={async (id) => { await rejectWasherApplication(id); showToast('Application Rejected', 'info'); }}
                                            issues={issues}
                                            bonuses={bonuses}
                                            discounts={discounts}
                                            payments={payments}
                                            createBonus={createBonus}
                                            updateBonus={updateBonus}
                                            deleteBonus={deleteBonus}
                                            createDiscount={createDiscount}
                                            updateDiscount={updateDiscount}
                                            deleteDiscount={deleteDiscount}
                                            createPayment={createPayment}
                                            showToast={showToast}
                                            currentUser={currentUser as TeamMember | null}
                                            logout={handleLogout}
                                            reportEmail={reportEmail}
                                            setReportEmail={setReportEmail}
                                            saveServiceArea={saveServiceArea}
                                            serviceArea={serviceArea}
                                            addNotification={addNotification}
                                        />
                                    );

                                case currentScreen === Screen.NATIVE_TEST:
                                    return <NativeTest navigate={navigateTo} />;

                                default:
                                    return null;
                            }
                        })()}
                    </Suspense>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => (
    <ErrorBoundary>
        <ToastProvider>
            <AppContent />
        </ToastProvider>
    </ErrorBoundary>
);

export default App;
