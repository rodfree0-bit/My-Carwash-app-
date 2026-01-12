import React, { useState, useEffect } from 'react';
import { UserMenu } from './UserMenu';
import { Screen, Order, OrderStatus, Notification, NotificationType, Message, ServicePackage, ServiceAddon, TeamMember, ToastType } from '../types';
import { FloatingChatButton } from './FloatingChatButton';
import { ChatModal } from './ChatModal';
import { OrderChat } from './OrderChat';
import { useRef } from 'react';
import { triggerNativeHaptic } from '../utils/native';
import { LocationService } from '../services/LocationService';
import { addLoyaltyPoints } from './LoyaltyProgram';
import { PhotoCapture } from './PhotoCapture/PhotoCapture';
import { WasherSettings } from './Settings/WasherSettings';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, where, orderBy, limit, onSnapshot, addDoc, updateDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { i18n } from '../services/i18n';
import { parseSafeDate } from '../utils/dateUtils';
import { AvailableOrders } from './washer/AvailableOrders';
import { calculateOrderFinancials } from '../utils/financialCalculations';

interface WasherProps {
  screen: Screen;
  navigate: (screen: Screen) => void;
  orders: Order[];
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  currentWasherId: string;
  currentWasher: TeamMember;
  updateWasherProfile: (updates: Partial<TeamMember>) => void;
  supportPhone: string;
  notifications: Notification[];
  addNotification: (userId: string, title: string, message: string, type: NotificationType, linkTo?: Screen, relatedId?: string) => void;
  logout: () => void;
  messages: Message[];
  sendMessage: (senderId: string, receiverId: string, orderId: string, content: string, type?: 'text' | 'image') => void;
  packages: ServicePackage[];
  addons: ServiceAddon[];
  openSupport?: () => void;
  grabOrder: (orderId: string, washerName: string, washerId?: string, clientPhone?: string, washerAvatar?: string) => Promise<string>;
  showToast: (message: string, type?: ToastType) => void;
  initialOrderId?: string | null;
}

const WasherContent: React.FC<WasherProps> = ({ screen, navigate, orders, updateOrder, currentWasherId, currentWasher, updateWasherProfile, supportPhone, notifications, addNotification, logout, messages, sendMessage, packages, addons, openSupport, grabOrder, showToast, initialOrderId }) => {

  // --- Image Compression Function ---
  // --- Image Compression Function ---
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate new dimensions (max 1200px width/height)
          let width = img.width;
          let height = img.height;
          const maxSize = 1200;

          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with 0.7 quality (good balance)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // --- Native Camera Bridge ---
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const handleFileCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress image before storing
        const compressedUrl = await compressImage(file);

        if (cameraMode === 'before' && currentSlot) {
          // Store before photo in temporary state
          setBeforePhotos((prev: any) => ({ ...prev, [currentSlot]: compressedUrl }));
          setCurrentSlot('');
        } else if (cameraMode === 'after' && currentSlot) {
          setTempPhotos((prev: any) => ({ ...prev, [currentSlot]: compressedUrl }));
          setCurrentSlot('');
        }
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const triggerCamera = (mode: 'before' | 'after', slot?: string) => {
    setCameraMode(mode);
    if (slot) setCurrentSlot(slot);
    setTimeout(() => {
      cameraInputRef.current?.click();
    }, 100);
  };

  const [selectedJob, setSelectedJob] = useState<Order | null>(null);

  // --- DEEP LINKING ---
  useEffect(() => {
    if (initialOrderId) {
      const order = orders.find(o => o.id === initialOrderId);
      if (order) {
        console.log('🔗 Deep Link: Selecting order', initialOrderId);
        setSelectedJob(order);
      }
    }
  }, [initialOrderId, orders]);

  // --- REAL-TIME PROTECTION ---
  useEffect(() => {
    if (selectedJob && screen === Screen.WASHER_JOB_DETAILS) {
      const liveOrder = orders.find(o => o.id === selectedJob.id);

      if (!liveOrder) {
        showToast('This order has been removed.', 'error');
        navigate(Screen.WASHER_ORDER_QUEUE);
        return;
      }

      if (liveOrder.status === 'Cancelled' && selectedJob.status !== 'Cancelled') {
        showToast('Sorry, the client cancelled this order.', 'info');
        navigate(Screen.WASHER_ORDER_QUEUE);
        return;
      }

      if (liveOrder.washerId && liveOrder.washerId !== currentWasherId && !selectedJob.washerId) {
        showToast('Sorry, another washer already took this order.', 'warning');
        navigate(Screen.WASHER_ORDER_QUEUE);
        return;
      }

      if (JSON.stringify(liveOrder) !== JSON.stringify(selectedJob)) {
        setSelectedJob(liveOrder);
      }
    }
  }, [orders, selectedJob, currentWasherId, screen]);

  const [showETAModal, setShowETAModal] = useState(false);
  const [etaMinutes, setEtaMinutes] = useState('15');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Global Fees State
  const [globalFees, setGlobalFees] = useState<{ name: string, percentage: number }[]>([]);
  // Per-Vehicle Service Configuration State
  const [vehicleConfigs, setVehicleConfigs] = useState<any[]>([]);

  // Fetch Global Fees
  useEffect(() => {
    const fetchFees = async () => {
      try {
        const docRef = doc(db, 'settings', 'financials');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().globalFees) {
          setGlobalFees(docSnap.data().globalFees);
        }
      } catch (e) {
        console.error("Error loading global fees:", e);
      }
    };
    fetchFees();
  }, []);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-time notification system for new orders
  const [previousOrderCount, setPreviousOrderCount] = useState(0);
  const [notifiedOrders, setNotifiedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    const myOrders = orders.filter(o => o.washerId === currentWasherId);
    const newOrders = myOrders.filter(o =>
      o.status === 'Assigned' && !notifiedOrders.has(o.id)
    );

    // Notify about new orders
    if (newOrders.length > 0) {
      newOrders.forEach(order => {
        console.log('🔔 NEW ORDER ASSIGNED:', order.id, order.service);

        // Play notification sound
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77eafTRALUKfj8LZjHAU4ktjyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQYsgc7y2Yk2CBlou+3mn00QC1Cn4/C2YxwFOJLY8sx5LAUkd8fw3ZBBChRetevrqFUUCkaf4PK+bCEGLIHO8tmJNggZaLvt5p9NEAtQp+PwtmMcBTiS2PLMeSwFJHfH8N2QQQoUXrXr66hVFApGn+DyvmwhBiyBzvLZiTYIGWi77eafTRALUKfj8LZjHAU4ktjyzHksBSR3x/DdkEEKFF616+uoVRQKRp/g8r5sIQYsgc7y2Yk2CBlou+3mn00QC1Cn4/C2YxwFOJLY8sx5LAUkd8fw3ZBBChRetevrqFUUCkaf4PK+bCEGLIHO8tmJNggZaLvt5p9NEAtQp+PwtmMcBTiS2PLMeSwFJHfH8N2QQQoUXrXr66hVFApGn+DyvmwhBiyBzvLZiTYIGWi77eafTRALUKfj8LZjHAU4ktjyzHksBSR3x/DdkEEKFF616+uoVRQKRp/g8r5sIQYsgc7y2Yk2CBlou+3mn00QC1Cn4/C2Yx');
          audio.volume = 0.5;
          audio.play().catch(e => console.log('Audio play failed:', e));
        } catch (e) {
          console.log('Audio creation failed:', e);
        }

        // Show toast notification
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast(`🚗 New Order: ${order.service} - ${order.vehicle}`, 'success');
        }
      });

      // Mark as notified
      setNotifiedOrders(prev => {
        const newSet = new Set(prev);
        newOrders.forEach(o => newSet.add(o.id));
        return newSet;
      });
    }

    setPreviousOrderCount(myOrders.length);
  }, [orders, currentWasherId, notifiedOrders]);


  // Photo Workflow State
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<'before' | 'after'>('before');
  const [currentSlot, setCurrentSlot] = useState<string>(''); // For 'after' specific slots
  const [tempPhotos, setTempPhotos] = useState<any>({}); // Staging area for photos
  const [beforePhotos, setBeforePhotos] = useState<any>({}); // Before photos staging
  const [arrivedAt, setArrivedAt] = useState<number | null>(null); // Track arrival time
  const [showBeforePhotosModal, setShowBeforePhotosModal] = useState(false);

  // Chat Logic for Washer
  const activeJob = orders.find(o => o.washerId === currentWasherId && ['Assigned', 'En Route', 'Arrived', 'In Progress'].includes(o.status));
  const activeChatMessages = activeJob ? messages.filter(m => m.orderId === activeJob.id).sort((a, b) => a.timestamp - b.timestamp) : [];
  const chatUnreadCount = activeChatMessages.filter(m => m.receiverId === currentWasherId && !m.read).length;

  const handleSendMessage = (content: string) => {
    if (!activeJob) return;
    sendMessage(currentWasherId, activeJob.clientId || '', activeJob.id, content, 'text');
  };

  const unreadCount = notifications.filter(n => !n.read && n.userId === currentWasherId).length;

  // Auto-open chat on new message
  useEffect(() => {
    if (chatUnreadCount > 0 && !showChat) {
      // Check if the last message is from the client (not self)
      const lastMsg = activeChatMessages[activeChatMessages.length - 1];
      if (lastMsg && lastMsg.senderId !== currentWasherId) {
        setShowChat(true);
        triggerNativeHaptic();
        // Optional: Play a sound here if not handled globally
      }
    }
  }, [chatUnreadCount, activeChatMessages, showChat, currentWasherId]);

  // --- AUTO-START LOCATION TRACKING ---
  // --- AUTO-START LOCATION TRACKING ---
  useEffect(() => {
    // Only track if we have a valid active job ID
    if (activeJob?.id) {
      console.log('🗺️ Starting location tracking for order:', activeJob.id);
      LocationService.startTracking(currentWasherId, activeJob.id)
        .then(() => {
          console.log('✅ Location tracking started successfully');
          // Only toast if not already tracking (optional optimization, but simple toast is fine)
          // showToast('GPS tracking started', 'info'); 
        })
        .catch(err => {
          console.error('❌ Failed to start tracking:', err);
          showToast('Please enable location permissions', 'warning');
        });
    } else {
      console.log('🛑 Stopping location tracking - no active orders');
      LocationService.stopTracking();
    }

    return () => {
      LocationService.stopTracking();
    };
  }, [activeJob?.id, currentWasherId]);

  const handleEnRouteClick = async () => {
    if (!selectedJob) return;

    triggerNativeHaptic();

    let calculatedETA = '15'; // Default fallback

    // Try to calculate real ETA from Google Maps
    if (selectedJob?.location?.lat && selectedJob?.location?.lng) {
      try {
        const currentLoc = await LocationService.getCurrentLocation();
        const { duration } = await LocationService.getRouteETA(
          currentLoc.latitude,
          currentLoc.longitude,
          selectedJob.location.lat,
          selectedJob.location.lng
        );
        calculatedETA = duration.toString();
        console.log('📍 Calculated ETA from Google Maps:', calculatedETA, 'minutes');
      } catch (error) {
        console.warn('⚠️ Failed to calculate ETA, using default:', error);
      }
    }

    // Update order with calculated ETA
    console.log('🚗 Setting order to En Route:', selectedJob.id, 'ETA:', calculatedETA);
    updateOrder(selectedJob.id, {
      status: 'En Route',
      estimatedArrival: `${calculatedETA} min`
    });
    console.log('✅ Order status updated to En Route');

    // Start real-time location tracking
    try {
      await LocationService.startTracking(currentWasherId, selectedJob.id);
      console.log('📍 Location tracking started for order:', selectedJob.id);
    } catch (error) {
      console.error('❌ Failed to start location tracking:', error);
    }

    triggerNativeHaptic();
    // navigate(Screen.WASHER_JOBS); // Removed navigation to stay on details
  };

  // Old manual ETA submit function - no longer needed but keeping for reference
  const handleETASubmit = async () => {
    if (selectedJob && etaMinutes) {
      console.log('🚗 Setting order to En Route:', selectedJob.id, 'ETA:', etaMinutes);
      updateOrder(selectedJob.id, {
        status: 'En Route',
        estimatedArrival: `${etaMinutes} min`
      });
      console.log('✅ Order status updated to En Route');

      // Start real-time location tracking
      try {
        await LocationService.startTracking(currentWasherId, selectedJob.id);
        console.log('📍 Location tracking started for order:', selectedJob.id);
      } catch (error) {
        console.error('❌ Failed to start location tracking:', error);
        // Location permission denied - user will need to enable manually
      }

      setShowETAModal(false);
      setEtaMinutes('15');
      triggerNativeHaptic();
      navigate(Screen.WASHER_JOBS);
    } else {
      console.error('❌ Cannot submit ETA - missing selectedJob or etaMinutes');
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // 1. Mark as read
    try {
      if (!notification.read) {
        // Assume markNotificationRead is available or use updateDoc directly
        await updateDoc(doc(db, 'notifications', notification.id), { read: true });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }

    // 2. Navigation logic
    if (notification.relatedId && notification.linkTo) {
      if (notification.linkTo === Screen.WASHER_JOB_DETAILS) {
        const orderId = notification.relatedId;
        const targetOrder = orders.find(o => o.id === orderId);

        if (targetOrder) {
          // Check if order is already assigned to someone else
          if (targetOrder.washerId && targetOrder.washerId !== currentWasherId) {
            alert('Sorry, this order has already been assigned to another washer.');
            navigate(Screen.WASHER_ORDER_QUEUE);
          } else {
            setSelectedJob(targetOrder);
            navigate(Screen.WASHER_JOB_DETAILS);
          }
        } else {
          // If order not found in current list, maybe it was deleted or just not loaded
          alert('Sorry, this order is no longer available.');
          navigate(Screen.WASHER_ORDER_QUEUE);
        }
      } else {
        // Generic navigation for other notification types
        navigate(notification.linkTo as Screen);
      }
    }

    setShowNotifications(false);
  };

  const NotificationList = () => (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-end p-4">
      <div className="bg-surface-dark w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden mt-16">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
          <h3 className="font-bold text-lg">Notifications</h3>
          <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.filter(n => n.userId === currentWasherId || n.userId === 'washer-broadcast').length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_off</span>
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications
              .filter(n => n.userId === currentWasherId || n.userId === 'washer-broadcast')
              .sort((a, b) => b.timestamp - a.timestamp)
              .map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.type === 'success' ? 'bg-green-500/20 text-green-500' :
                      notification.type === 'warning' ? 'bg-amber-500/20 text-amber-500' :
                        notification.type === 'error' ? 'bg-red-500/20 text-red-500' :
                          'bg-blue-500/20 text-blue-500'
                      }`}>
                      <span className="material-symbols-outlined text-xl">
                        {notification.type === 'success' ? 'check_circle' :
                          notification.type === 'warning' ? 'warning' :
                            notification.type === 'error' ? 'error' : 'info'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-sm mb-1 ${!notification.read ? 'text-white' : 'text-slate-300'}`}>{notification.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-2">{notification.message}</p>
                      <p className="text-[10px] text-slate-500">{new Date(notification.timestamp).toLocaleString()}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );


  // --- WAIT FOR CLIENT LOGIC ---
  const activeCompletedJob = orders.find(o =>
    o.washerId === currentWasherId &&
    o.status === 'Completed' &&
    o.completedAt &&
    (Date.now() - o.completedAt < 10 * 60 * 1000) && // Less than 10 mins ago
    !o.clientRating // Client hasn't rated yet
  );

  if (activeCompletedJob) {
    const timeLeft = Math.max(0, 10 * 60 * 1000 - (Date.now() - (activeCompletedJob.completedAt || 0)));
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    // Auto-refresh hook would be needed for smooth timer, but let's assume parent re-renders or add simple local timer
    // For MVP, we'll just show the static calculaton or add a simplified visual timer component if needed. 
    // Ideally we force a re-render every second.

    return (
      <div className="flex flex-col h-full bg-background-dark p-6 overflow-hidden relative">
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-green-500/10 rounded-full blur-xl"></div>
            <div className="relative w-32 h-32 rounded-full bg-surface-dark border-2 border-green-500/50 flex items-center justify-center shadow-lg shadow-green-500/20">
              <span className="material-symbols-outlined text-7xl text-green-500">check_circle</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-white text-center">{i18n.t('excellent_work')}</h1>
          <p className="text-slate-300 text-lg mb-8 text-center max-w-xs">{i18n.t('service_completed_success')}</p>

          <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 w-full max-w-sm mb-8 backdrop-blur-sm">
            <p className="text-xs text-slate-500 uppercase font-bold text-center mb-2">{i18n.t('time_left_rating')}</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-black/30 rounded-lg p-3 min-w-[60px] text-center border border-white/5">
                <span className="text-3xl font-mono font-bold text-white">{minutes}</span>
                <p className="text-[10px] text-slate-500">{i18n.t('min')}</p>
              </div>
              <span className="text-2xl font-bold text-slate-600">:</span>
              <div className="bg-black/30 rounded-lg p-3 min-w-[60px] text-center border border-white/5">
                <span className="text-3xl font-mono font-bold text-white">{seconds.toString().padStart(2, '0')}</span>
                <p className="text-[10px] text-slate-500">{i18n.t('sec')}</p>
              </div>
            </div>
            <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                style={{ width: `${Math.max(0, (timeLeft / (10 * 60 * 1000)) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 text-center mt-3">
              {i18n.t('wait_client_confirm')}<br />{i18n.t('time_expires_continue')}
            </p>
          </div>

          <div className="w-full max-w-sm">
            <button
              onClick={() => {
                triggerNativeHaptic();
                if (timeLeft <= 0) {
                  // Unlock manually if time expired
                  navigate(Screen.WASHER_JOBS);
                } else {
                  // Just refresh state
                  // Maybe show toast "Still waiting..."
                }
              }}
              disabled={timeLeft > 0}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${timeLeft <= 0
                ? 'bg-white text-black hover:bg-slate-200 shadow-lg shadow-white/10'
                : 'bg-surface-dark text-slate-500 border border-white/5 cursor-not-allowed'
                }`}
            >
              {timeLeft <= 0 ? (
                <>
                  <span>Continue</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  <span>Waiting for Confirmation...</span>
                </>
              )}
            </button>
            <button
              onClick={() => navigate(Screen.WASHER_JOBS)}
              className="w-full mt-3 py-3 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back
            </button>
            <p className="text-center text-xs text-slate-600 mt-4">
              Order #{activeCompletedJob.id}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Navigation Component ---
  const ModernNav = () => (
    <nav className="absolute bottom-0 w-full bg-slate-900/80 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-around shadow-2xl z-20">
      <button onClick={() => { triggerNativeHaptic(5); navigate(Screen.WASHER_DASHBOARD); }} className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${screen === Screen.WASHER_DASHBOARD ? 'text-primary' : 'text-slate-400'}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${screen === Screen.WASHER_DASHBOARD ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 hover:bg-white/10'}`}>
          <span className="material-symbols-outlined">dashboard</span>
        </div>
        <span className={`text-xs ${screen === Screen.WASHER_DASHBOARD ? 'font-bold' : ''}`}>Dashboard</span>
      </button>
      <button onClick={() => { triggerNativeHaptic(5); navigate(Screen.WASHER_JOBS); }} className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${screen === Screen.WASHER_JOBS ? 'text-primary' : 'text-slate-400'}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${screen === Screen.WASHER_JOBS ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 hover:bg-white/10'}`}>
          <span className="material-symbols-outlined">work</span>
        </div>
        <span className={`text-xs ${screen === Screen.WASHER_JOBS ? 'font-bold' : ''}`}>{i18n.t('my_jobs')}</span>
      </button>
      <button onClick={() => { triggerNativeHaptic(5); navigate(Screen.WASHER_EARNINGS); }} className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${screen === Screen.WASHER_EARNINGS ? 'text-primary' : 'text-slate-400'}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${screen === Screen.WASHER_EARNINGS ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 hover:bg-white/10'}`}>
          <span className="material-symbols-outlined">payments</span>
        </div>
        <span className={`text-xs ${screen === Screen.WASHER_EARNINGS ? 'font-bold' : ''}`}>{i18n.t('earnings')}</span>
      </button>
      <button onClick={() => { triggerNativeHaptic(5); navigate(Screen.WASHER_PROFILE); }} className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${screen === Screen.WASHER_PROFILE ? 'text-primary' : 'text-slate-400'}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${screen === Screen.WASHER_PROFILE ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 hover:bg-white/10'}`}>
          <span className="material-symbols-outlined">person</span>
        </div>
        <span className={`text-xs ${screen === Screen.WASHER_PROFILE ? 'font-bold' : ''}`}>{i18n.t('profile')}</span>
      </button>
    </nav>
  );

  const handleGrabOrder = async (orderId: string) => {
    try {
      // Use the transactional grabOrder
      await grabOrder(
        orderId,
        currentWasherId,
        currentWasher?.name || 'Washer',
        currentWasher?.avatar
      );

      // Navigate to job details
      const updatedOrder = orders.find(o => o.id === orderId);
      if (updatedOrder) {
        setSelectedJob({
          ...updatedOrder,
          status: 'Assigned',
          washerId: currentWasherId,
          washerName: currentWasher?.name
        });
      }
      navigate(Screen.WASHER_JOB_DETAILS);

      // Show success message
      showToast('Order Assigned! You have successfully grabbed the order', 'success');
    } catch (error: any) {
      console.error('Error grabbing order:', error);
      if (error.message === 'Order already taken') {
        showToast('Sorry, another washer already took this order.', 'error');
        // If they were on details, go back
        if (screen === Screen.WASHER_JOB_DETAILS) {
          navigate(Screen.WASHER_ORDER_QUEUE);
        }
      } else {
        showToast('Could not grab order. Please try again.', 'error');
      }
    }
  };

  // WASHER_DASHBOARD Screen
  if (screen === Screen.WASHER_DASHBOARD) {
    const activeJobs = orders.filter(o => o.washerId === currentWasherId && o.status !== 'Completed' && o.status !== 'Cancelled');
    const availableJobs = orders.filter(o => o.status === 'Pending' && !o.washerId); // Ensure unassigned
    const completedJobs = orders.filter(o => o.washerId === currentWasherId && o.status === 'Completed');

    // Calculate Dashboard Stats
    const calculateEarnings = (jobs: Order[]) => {
      // Calculate total fee percentage
      const totalFeePercent = globalFees.reduce((acc, fee) => acc + (fee.percentage || 0), 0);

      return jobs.reduce((sum, job) => {
        let jobGross = 0;

        // Calculate Gross per item (Vehicle + Addons)
        if (job.vehicleConfigs && job.vehicleConfigs.length > 0) {
          job.vehicleConfigs.forEach((config: any) => {
            // Package Price
            const pkg = packages.find((p: ServicePackage) => p.id === config.packageId);
            if (pkg && config.vehicleType) {
              jobGross += (pkg.price?.[config.vehicleType] || 0);
            }
            // Addons Price
            if (config.addonIds) {
              config.addonIds.forEach((addonId: string) => {
                const addon = addons.find((a: ServiceAddon) => a.id === addonId);
                if (addon) {
                  jobGross += (addon.price?.[config.vehicleType] || 0);
                }
              });
            }
          });
        } else {
          // Fallback for legacy/simple orders
          jobGross += (job.price || 0);
        }

        // Apply Fees
        const deduction = (jobGross * totalFeePercent) / 100;
        const jobNet = jobGross - deduction;

        // Add Tips (100% to washer usually, assuming tips are on top)
        const tip = job.tip || 0;

        return sum + jobNet + tip;
      }, 0);
    };

    const totalEarnings = calculateEarnings(completedJobs);
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    const weekEarnings = calculateEarnings(completedJobs.filter(job => parseSafeDate(job.date) >= currentWeekStart));

    return (
      <div className="flex flex-col h-full bg-slate-950 text-white relative overflow-hidden">
        {showNotifications && <NotificationList />}

        <div className="flex-1 overflow-y-auto pb-24 relative z-10">
          {/* Simple Header */}
          <div className="bg-slate-900 border-b border-white/10 p-6 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg"></div>
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-surface-dark border-2 border-white/10 shadow-xl">
                    {currentWasher?.avatar ? (
                      <img src={currentWasher.avatar} alt={currentWasher.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <span className="material-symbols-outlined text-3xl text-slate-400">person</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Hello,</p>
                  <h1 className="text-2xl font-bold text-white">
                    {currentWasher?.name?.split(' ')[0] || 'Washer'}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                      <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                      <span className="text-sm font-bold text-amber-400">
                        {typeof currentWasher?.rating === 'number' ? currentWasher.rating.toFixed(1) : '5.0'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">({currentWasher?.completedJobs || 0} jobs)</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${currentWasher?.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${currentWasher?.status === 'Active' ? 'bg-green-400' : 'bg-slate-400'}`}></div>
                    {currentWasher?.status === 'Active' ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => navigate(Screen.WASHER_JOBS)} className="group relative overflow-hidden rounded-2xl bg-blue-900 border border-blue-700/30 p-5 hover:bg-blue-800 transition-all cursor-pointer shadow-xl">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-white text-2xl font-bold">pending_actions</span>
                  </div>
                  <p className="text-3xl font-bold mb-1 text-white">{activeJobs.length}</p>
                  <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest">ACTIVE JOBS</p>
                </div>
              </div>
              <div onClick={() => navigate(Screen.WASHER_EARNINGS)} className="group relative overflow-hidden rounded-2xl bg-emerald-900 border border-emerald-700/30 p-5 hover:bg-emerald-800 transition-all cursor-pointer shadow-xl">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-white text-2xl font-bold">payments</span>
                  </div>
                  <p className="text-3xl font-bold mb-1 text-white">${weekEarnings.toFixed(0)}</p>
                  <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest">{i18n.t('this_week')}</p>
                </div>
              </div>
            </div>
          </div>

          {activeJobs.length > 0 && (
            <div className="px-6 mb-6">
              <div className="space-y-3">
                {activeJobs.slice(0, 2).map(job => (
                  <button
                    key={job.id}
                    onClick={() => {
                      setSelectedJob(job);
                      navigate(Screen.WASHER_JOB_DETAILS);
                    }}
                    className="w-full bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-primary/50 transition-all text-left group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-lg text-white group-hover:text-primary transition-colors">{job.clientName}</p>
                        <p className="text-sm text-slate-400">{job.vehicle}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.status === 'In Progress' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                        {job.status === 'Assigned' ? i18n.t('assigned') : job.status === 'En Route' ? i18n.t('en_route') : job.status === 'Arrived' ? i18n.t('arrived') : job.status === 'In Progress' ? i18n.t('in_progress') : job.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="px-6 mb-6">
            <button onClick={() => navigate(Screen.WASHER_ORDER_QUEUE)} className="w-full bg-gradient-to-r from-primary/80 to-emerald-800 rounded-2xl p-5 hover:opacity-90 transition-all shadow-xl border border-white/10 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl">inbox</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-lg mb-1">Available Orders</p>
                    <p className="text-white/80 text-sm">{availableJobs.length} orders waiting</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-white text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </button>
          </div>

          {activeJobs.length === 0 && (
            <div className="px-6">
              <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-5xl text-primary/50">work_outline</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{i18n.t('no_active_jobs')}</h3>
                <p className="text-slate-400 text-sm">{i18n.t('no_assigned_jobs')}</p>
              </div>
            </div>
          )}
        </div>
        <ModernNav />
      </div>
    );
  }

  // WASHER_ORDER_QUEUE Screen
  if (screen === Screen.WASHER_ORDER_QUEUE) {
    return (
      <AvailableOrders
        orders={orders}
        navigate={(screen: Screen, orderId?: string) => {
          if (orderId) {
            setSelectedJob(orders.find(o => o.id === orderId) || null);
          }
          navigate(screen);
        }}
        onGrabOrder={handleGrabOrder}
      />
    );
  }

  // WASHER_JOBS Screen
  if (screen === Screen.WASHER_JOBS) {
    const myJobs = orders.filter(o => o.washerId === currentWasherId);
    const activeJobs = myJobs.filter(o => ['Assigned', 'En Route', 'Arrived', 'In Progress'].includes(o.status));
    const completedJobs = myJobs.filter(o => o.status === 'Completed');

    return (
      <div className="flex flex-col h-full bg-slate-950 text-white relative">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
        </div>
        {/* Header */}
        <header className="px-6 py-6 border-b border-white/10 bg-white/5 backdrop-blur-md relative z-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-primary/80 bg-clip-text text-transparent">{i18n.t('my_jobs')}</h1>
          <p className="text-sm text-slate-400 mt-1">{i18n.t('my_jobs_desc')}</p>
        </header>

        <div className="flex-1 overflow-y-auto relative z-10 pb-24">
          <div className="px-4 py-4 grid grid-cols-2 gap-3">
            <div className="bg-surface-dark rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">pending_actions</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeJobs.length}</p>
                  <p className="text-xs text-slate-400">{i18n.t('active_jobs')}</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-dark rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-400">task_alt</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedJobs.length}</p>
                  <p className="text-xs text-slate-400">{i18n.t('completed')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="flex-1 overflow-y-auto px-4 pb-24">
            {/* Active Jobs Section */}
            {activeJobs.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold text-slate-400 uppercase mb-3">{i18n.t('active_jobs')}</h2>
                <div className="space-y-3">
                  {activeJobs.map(job => (
                    <button
                      key={job.id}
                      onClick={() => {
                        setSelectedJob(job);
                        navigate(Screen.WASHER_JOB_DETAILS);
                      }}
                      className="w-full bg-surface-dark rounded-xl p-4 border border-white/5 hover:border-primary/50 transition-all text-left"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-lg">{job.clientName}</p>
                          <p className="text-sm text-slate-400">{job.vehicle}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.status === 'In Progress'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-amber-500/20 text-amber-400'
                          }`}>
                          {job.status === 'Assigned' ? i18n.t('assigned') :
                            job.status === 'En Route' ? i18n.t('en_route') :
                              job.status === 'Arrived' ? i18n.t('arrived') :
                                job.status === 'In Progress' ? i18n.t('in_progress') : job.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">local_car_wash</span>
                          <span>{job.service}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          <span>{job.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-sm text-slate-400">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        <span className="truncate">{job.address}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Jobs Section */}
            {completedJobs.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase mb-3">{i18n.t('completed_jobs')}</h2>
                <div className="space-y-3">
                  {completedJobs.map(job => (
                    <button
                      key={job.id}
                      onClick={() => {
                        setSelectedJob(job);
                        navigate(Screen.WASHER_JOB_DETAILS);
                      }}
                      className="w-full bg-surface-dark rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all text-left opacity-75"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold">{job.clientName}</p>
                          <p className="text-sm text-slate-400">{job.vehicle}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                          {i18n.t('completed')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">payments</span>
                          <span>${job.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">event</span>
                          <span>{job.date}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {myJobs.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-center px-8">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-4xl text-slate-600">work_outline</span>
                </div>
                <h3 className="text-xl font-bold mb-2">No Jobs Yet</h3>
                <p className="text-slate-400 text-sm">You have no assigned jobs at the moment. Check back later!</p>
              </div>
            )}
          </div>

        </div>
        <ModernNav />
      </div>
    );
  }

  // WASHER_JOB_DETAIL Screen
  if (screen === Screen.WASHER_JOB_DETAILS && selectedJob) {
    const isActiveJob = ['Assigned', 'En Route', 'Arrived', 'In Progress'].includes(selectedJob.status);

    return (
      <div className="flex flex-col h-full bg-background-dark text-white">
        <header className="flex items-center px-4 py-4 border-b border-white/5">
          <button onClick={() => navigate(Screen.WASHER_JOBS)}><span className="material-symbols-outlined">arrow_back_ios_new</span></button>
          <h1 className="flex-1 text-center font-bold text-lg mr-6">Job Details</h1>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4 bg-background-dark">

          {/* Main Job Card */}
          <div className="bg-black w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">

            {/* Header: Order ID & Client */}
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start mb-1">
                <div className="text-center w-full">
                  <h3 className="font-bold text-xl">Order: #{selectedJob.id.substring(0, 8)}</h3>
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium">{selectedJob.clientName}</div>
                <div className="text-slate-400 text-sm">
                  {selectedJob.completedAt ? (
                    <span>{new Date(selectedJob.completedAt).toLocaleString()}</span>
                  ) : (
                    <span>{selectedJob.date} @ {selectedJob.time}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Address Bar - Only show if active */}
            {isActiveJob && selectedJob && (
              <div
                onClick={() => {
                  if (!selectedJob) return;
                  const address = selectedJob.address;
                  const encodedAddress = encodeURIComponent(address);

                  // Detect if mobile to use native maps
                  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                  const isAndroid = /Android/i.test(navigator.userAgent);

                  let mapsUrl = '';

                  if (isMobile) {
                    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

                    if (isIOS) {
                      mapsUrl = `maps://maps.apple.com/?daddr=${encodedAddress}`;
                    } else {
                      // For Android, use Google Maps URL
                      mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
                    }
                  } else {
                    mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
                  }

                  // For Android WebView, create a link and click it (allows WebView to intercept)
                  if (isAndroid) {
                    const link = document.createElement('a');
                    link.href = mapsUrl;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  } else {
                    window.location.href = mapsUrl;
                  }
                }}
                className="bg-primary p-4 text-center text-white font-medium text-lg leading-tight shadow-lg relative cursor-pointer hover:brightness-110 transition-all active:scale-[0.98]"
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-white">location_on</span>
                    <span className="text-sm uppercase font-bold tracking-wider">Client Location</span>
                  </div>
                  <span className="text-white text-base opacity-90">{selectedJob.address}</span>
                  <div className="mt-2 bg-white/20 px-4 py-1 rounded-full text-xs font-bold border border-white/30 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">navigation</span>
                    OPEN NAVIGATION
                  </div>
                </div>
              </div>
            )}

            {/* Services List */}
            <div className="divide-y divide-white/10">
              {selectedJob.vehicleConfigs ? (
                selectedJob.vehicleConfigs.map((config: any, idx: number) => {
                  // Price estimation logic matches Admin Panel
                  const pkg = packages.find(p => p.id === config.packageId);
                  let vehiclePrice = 0;
                  if (pkg && pkg.price && config.vehicleType) {
                    vehiclePrice = pkg.price[config.vehicleType] || 0;
                  }
                  let addonsPrice = 0;
                  const vehicleAddons = (config.addonIds || []).map((aid: string) => addons.find((a: any) => a.id === aid)).filter(Boolean);
                  vehicleAddons.forEach((a: any) => {
                    if (a && a.price && config.vehicleType) {
                      addonsPrice += (a.price[config.vehicleType] || 0);
                    }
                  });
                  const lineTotal = vehiclePrice + addonsPrice;

                  return (

                    <div key={idx} className="p-4 py-5 hover:bg-white/5 transition-colors">
                      {/* Vehicle Header */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-lg text-white">{config.vehicleModel || selectedJob.vehicle}</div>
                        <div className="text-xs text-slate-500 bg-white/10 px-2 py-1 rounded">{config.vehicleType}</div>
                      </div>

                      {/* Package Item */}
                      <div className="flex justify-between text-sm mb-1">
                        <div className="text-slate-300">{pkg?.name || 'Standard Wash'}</div>
                        <div className="text-slate-300 font-medium">${vehiclePrice.toFixed(2)}</div>
                      </div>

                      {/* Add-ons List */}
                      {config.addonIds && config.addonIds.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {config.addonIds.map((aid: string) => {
                            const addon = addons.find(a => a.id === aid);
                            const addonPrice = (addon && addon.price && config.vehicleType) ? (addon.price[config.vehicleType] || 0) : 0;
                            return addon ? (
                              <div key={aid} className="flex justify-between text-sm text-slate-400 pl-2 border-l-2 border-primary/30">
                                <span>+ {addon.name}</span>
                                <span>${addonPrice.toFixed(2)}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}

                      {/* Subtotal line for this vehicle */}
                      <div className="flex justify-end mt-3 pt-2 border-t border-white/5">
                        <span className="text-xs text-slate-500 mr-2">Vehicle Total:</span>
                        <span className="font-bold text-white">${lineTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  );

                })
              ) : (
                /* Legacy Fallback */
                <div className="p-4 py-5">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-lg">{selectedJob.vehicle}</div>
                    <div className="font-bold text-lg">+${selectedJob.price}</div>
                  </div>
                  <div className="text-slate-400 text-sm">{selectedJob.service}</div>
                </div>
              )}

              {/* Financial Breakdown Footer in Card */}
              <div className="p-4 space-y-2 text-sm bg-white/5">
                {/* Calculate Financials inline for display */}
                {(() => {
                  let gross = 0;
                  if (selectedJob.vehicleConfigs) {
                    selectedJob.vehicleConfigs.forEach((c: any) => {
                      const p = packages.find(pkg => pkg.id === c.packageId);
                      if (p && p.price && c.vehicleType) gross += (p.price[c.vehicleType] || 0);
                      if (c.addonIds) {
                        c.addonIds.forEach((aid: string) => {
                          const a = addons.find(ad => ad.id === aid);
                          if (a && a.price && c.vehicleType) gross += (a.price[c.vehicleType] || 0);
                        });
                      }
                    });
                  } else {
                    gross = selectedJob.price || 0;
                  }

                  // Assuming 80% default commission if not specified
                  // Using simple 80% for display consistency as per calculateEarnings default
                  const commissionRate = 0.8;
                  const washerBase = gross * commissionRate;
                  const fees = gross - washerBase;
                  const tip = selectedJob.tip || 0;
                  const netPayout = washerBase + tip;

                  return (
                    <>
                      <div className="flex justify-between text-slate-400">
                        <span>{i18n.t('total_paid')}</span>
                        <span>${gross.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-red-400">
                        <span>{i18n.t('app_fees')} (20%)</span>
                        <span>-${fees.toFixed(2)}</span>
                      </div>
                      {tip > 0 && (
                        <div className="flex justify-between text-amber-400 font-medium">
                          <span>{i18n.t('tip_is_yours')}</span>
                          <span>+${tip.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-white/10 my-2 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg text-white">{i18n.t('your_payout')}</span>
                          <span className="font-bold text-3xl text-green-400">${netPayout.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-slate-500 text-right mt-1">{i18n.t('ready_withdrawal')}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Chat Button (Outside Card, or inside? Leaving outside for easy access as before, or integrated?) 
              Previous design had Chat button in Client Info card. 
              Ref image doesn't show Chat. I'll keep it as a distinct action button below the card. 
          */}
            {isActiveJob && (
              <button
                onClick={() => setShowChat(true)}
                className="w-full bg-surface-dark border border-primary/30 text-primary py-4 rounded-xl font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">chat</span>
                {i18n.t('chat_with')} Client
              </button>
            )}

          </div>

          {/* Action Buttons - Only for active jobs */}
          {
            isActiveJob && (
              <div className="p-4 border-t border-white/5 bg-surface-dark space-y-3">

                {/* Beautiful Celebration Screen logic moved to global check */}

                {selectedJob.status === 'Pending' && (
                  <button
                    onClick={() => handleGrabOrder(selectedJob.id)}
                    className="w-full bg-primary text-white h-14 rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">check_circle</span>
                    Grab Order
                  </button>
                )}

                {selectedJob.status === 'Assigned' && (
                  <>
                    <button
                      onClick={handleEnRouteClick}
                      className="w-full bg-blue-500 h-14 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">directions_car</span>
                      {i18n.t('on_my_way')}
                    </button>

                    {/* Cancel Order Button */}
                    <button
                      onClick={async () => {
                        const confirmed = window.confirm(
                          '⚠️ Cancel this order?\n\n' +
                          '• Your rating will decrease by 0.5 points\n' +
                          '• The order will be reassigned to another washer\n' +
                          '• This action cannot be undone'
                        );

                        if (confirmed) {
                          try {
                            const newRating = Math.max(0, (currentWasher.rating || 5) - 0.5);
                            await updateWasherProfile({ rating: newRating });
                            await updateOrder(selectedJob.id, {
                              status: 'Pending',
                              washerId: '',
                              washerName: ''
                            });
                            addNotification(selectedJob.clientId || '', 'Order Reassigned', 'Your washer cancelled. We are finding you a new one.', 'warning');
                            addNotification('admin', 'Washer Cancelled Order', `${currentWasher.name} cancelled order #${selectedJob.id}. Please reassign.`, 'warning');
                            triggerNativeHaptic();
                            navigate(Screen.WASHER_JOBS);
                          } catch (error) {
                            console.error('Error cancelling order:', error);
                            console.error('Failed to cancel order:', error);
                          }
                        }
                      }}
                      className="w-full bg-surface-dark border border-red-500/50 text-red-400 h-12 rounded-xl font-bold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">cancel</span>
                      {i18n.t('cancel')} (-0.5 ⭐)
                    </button>
                  </>
                )}

                {selectedJob.status === 'En Route' && (
                  <button
                    onClick={() => {
                      triggerNativeHaptic();
                      const arrivalTime = Date.now();
                      setArrivedAt(arrivalTime);
                      updateOrder(selectedJob.id, {
                        status: 'Arrived',
                        arrivedAt: arrivalTime,
                        waitingStartTime: arrivalTime,
                        waitingForClient: true,
                        waitingTimeBlocks: 0,
                        waitingCharge: 0
                      });
                      navigate(Screen.WASHER_JOBS);
                    }}
                    className="w-full bg-[#3b82f6] text-white shadow-blue h-14 rounded-xl font-bold hover:brightness-90 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">location_on</span>
                    {i18n.t('arrived')}
                  </button>
                )}

                {selectedJob.status === 'Arrived' && (
                  <div className="space-y-3">
                    {/* Waiting for Client Authorization */}
                    {!selectedJob.clientAuthorized ? (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="material-symbols-outlined text-amber-400 text-2xl animate-pulse">timer</span>
                          <div className="flex-1">
                            <p className="font-bold text-amber-400">{i18n.t('wait_auth')}</p>
                            <p className="text-xs text-slate-400">Client is being notified every minute.</p>
                          </div>
                        </div>

                        {selectedJob.waitingStartTime && (
                          <div className="bg-black/40 rounded-lg p-3 border border-white/5 space-y-2 mb-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">Time elapsed:</span>
                              <span className="text-sm font-bold text-white">
                                {Math.floor((Date.now() - selectedJob.waitingStartTime) / 60000)} min
                              </span>
                            </div>
                            {selectedJob.waitingCharge && selectedJob.waitingCharge > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase">Waiting Charge:</span>
                                <span className="text-lg font-black">${selectedJob.waitingCharge.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="text-center py-2">
                          <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                            <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                            <span>Waiting for client to press "Authorize"</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-green-400">check_circle</span>
                          <p className="font-bold text-green-400">{i18n.t('service_authorized')}</p>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{i18n.t('can_start_service')}</p>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        triggerNativeHaptic();
                        setBeforePhotos({});
                        setShowBeforePhotosModal(true);
                      }}
                      disabled={!selectedJob.clientAuthorized}
                      className={`w-full h-14 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${selectedJob.clientAuthorized
                        ? 'bg-[#3b82f6] text-white shadow-blue hover:brightness-90'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                    >
                      <span className="material-symbols-outlined">photo_camera</span>
                      {selectedJob.clientAuthorized ? i18n.t('take_before_photos') : i18n.t('waiting_auth')}
                    </button>

                    <button
                      onClick={() => {
                        const confirmNoShow = window.confirm('Client not present? This will mark the order as "No Show" and will require evidence photos.');
                        if (confirmNoShow) {
                          updateOrder(selectedJob.id, { status: 'Cancelled', cancelReason: 'Client No Show' });
                          navigate(Screen.WASHER_JOBS);
                        }
                      }}
                      className="w-full bg-surface-dark border border-red-500/50 text-red-400 h-14 rounded-xl font-bold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">person_off</span>
                      {i18n.t('client_no_show')}
                    </button>
                  </div>
                )}

                {selectedJob.status === 'In Progress' && (
                  <button
                    onClick={() => {
                      triggerNativeHaptic();
                      setCameraMode('after');
                      setTempPhotos({}); // Reset temp photos
                      setShowCamera(true);
                    }}
                    className="w-full bg-[#3b82f6] text-white shadow-blue h-14 rounded-xl font-bold hover:brightness-90 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">check_circle</span>
                    {i18n.t('finish_job')}
                  </button>
                )}
              </div>
            )
          }

          {/* Professional Photo Capture for "Before" Photos */}
          {
            showBeforePhotosModal && (
              <PhotoCapture
                mode="before"
                onPhotosComplete={(photos) => {
                  if (selectedJob) {
                    updateOrder(selectedJob.id, {
                      status: 'In Progress',
                      photos: { ...selectedJob.photos, before: photos }
                    });
                    setShowBeforePhotosModal(false);
                    setBeforePhotos({});
                    navigate(Screen.WASHER_JOBS);
                  }
                }}
                onCancel={() => setShowBeforePhotosModal(false)}
              />
            )
          }

          {/* Professional Photo Capture for "After" Photos */}
          {
            showCamera && cameraMode === 'after' && (
              <PhotoCapture
                mode="after"
                onPhotosComplete={(photos) => {
                  if (selectedJob) {
                    // Calculate financials before saving
                    const financials = calculateOrderFinancials(selectedJob, globalFees);

                    updateOrder(selectedJob.id, {
                      status: 'Completed',
                      completedAt: Date.now(),
                      photos: { ...selectedJob.photos, after: photos },
                      waitingForClient: true,
                      financialBreakdown: financials // Save the breakdown!
                    });

                    // Stop location tracking
                    LocationService.stopTracking();

                    setShowCamera(false);
                    setTempPhotos({});
                    // Stay on job details to show celebration screen
                  }
                }}
                onCancel={() => setShowCamera(false)}
              />
            )
          }

          {/* ETA Modal */}
          {
            showETAModal && (
              <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="bg-surface-dark w-full max-w-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold mb-4">Estimated Time of Arrival</h3>
                  <p className="text-sm text-slate-400 mb-6">How many minutes until you arrive?</p>

                  <div className="space-y-4">
                    {/* Quick Select Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {['5', '10', '15', '20'].map(min => (
                        <button
                          key={min}
                          onClick={() => setEtaMinutes(min)}
                          className={`py-3 rounded-xl font-bold border transition-all ${etaMinutes === min
                            ? 'bg-primary border-primary text-white'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                        >
                          {min}
                        </button>
                      ))}
                    </div>

                    {/* Custom Input */}
                    <div>
                      <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">Custom Minutes</label>
                      <input
                        type="number"
                        value={etaMinutes}
                        onChange={(e) => setEtaMinutes(e.target.value)}
                        placeholder="Enter minutes"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-bold"
                        min="1"
                        max="120"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setShowETAModal(false)}
                        className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleETASubmit}
                        className="flex-1 py-3 rounded-xl font-bold bg-primary hover:bg-primary-dark transition-colors"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          {/* Chat Modal for Washer */}
          {
            showChat && selectedJob && (
              <OrderChat
                orderId={selectedJob.id}
                currentUserId={currentWasherId}
                currentUserName={currentWasher?.name || 'Washer'}
                otherUserId={selectedJob?.clientId || ''}
                otherUserName={selectedJob?.clientName || 'Client'}
                messages={messages}
                sendMessage={sendMessage as any}
                isOpen={showChat}
                onClose={() => setShowChat(false)}
              />
            )
          }
        </div>
        <ModernNav />
      </div>
    );
  }

  // WASHER_JOB_DETAILS Screen
  if (screen === Screen.WASHER_JOB_DETAILS && selectedJob) {
    return (
      <div className="flex flex-col h-full bg-slate-950 text-white relative z-0">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
        </div>

        {/* Header */}
        <header className="px-6 py-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-md relative z-10 flex items-center gap-4">
          <button onClick={() => navigate(Screen.WASHER_JOBS)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Job Details</h1>
            <p className="text-xs text-slate-400">Order #{selectedJob.id.slice(0, 8)}...</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto relative z-10 pb-24 p-6">
          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 ${selectedJob.status === 'In Progress' ? 'bg-primary/20 border-primary/50 text-primary' :
              selectedJob.status === 'Arrived' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                'bg-slate-700/50 border-slate-600 text-slate-300'
              }`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              <span className="text-sm font-bold uppercase tracking-wide">{
                selectedJob.status === 'Assigned' ? i18n.t('assigned') :
                  selectedJob.status === 'En Route' ? i18n.t('en_route') :
                    selectedJob.status === 'Arrived' ? i18n.t('arrived') :
                      selectedJob.status === 'In Progress' ? i18n.t('in_progress') : selectedJob.status
              }</span>
            </div>
          </div>

          {/* Client Info Card */}
          <div className="bg-surface-dark rounded-2xl p-5 border border-white/10 mb-4 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Client</p>
                  <h2 className="text-xl font-bold text-white">{selectedJob.clientName}</h2>
                </div>
                <a href={`tel:${selectedJob.clientPhone}`} className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-white transition-all">
                  <span className="material-symbols-outlined">call</span>
                </a>
              </div>

              <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-300 leading-relaxed mb-2">{selectedJob.address}</p>
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedJob.location?.lat},${selectedJob.location?.lng}`, '_blank')}
                      className="text-xs text-primary font-bold flex items-center gap-1 hover:underline"
                    >
                      <span className="material-symbols-outlined text-[14px]">map</span>
                      OPEN NAVIGATION
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle & Service Card */}
          <div className="bg-surface-dark rounded-2xl p-5 border border-white/10 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{selectedJob.vehicle}</h3>
                <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-slate-300">{selectedJob.vehicleType}</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase">Price</p>
                <p className="text-xl font-black text-green-400">${selectedJob.price}</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Package</span>
              <span className="font-bold text-white">{selectedJob.service}</span>
            </div>
          </div>

          {/* ACTIONS SECTION */}
          <div className="space-y-4">
            {/* 1. ASSIGNED -> EN ROUTE */}
            {selectedJob.status === 'Assigned' && (
              <button
                onClick={handleEnRouteClick}
                className="w-full py-4 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark transition-all shadow-blue flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">directions_car</span>
                I'M EN ROUTE
              </button>
            )}

            {/* 2. EN ROUTE -> ARRIVED */}
            {selectedJob.status === 'En Route' && (
              <button
                onClick={() => {
                  triggerNativeHaptic();
                  updateOrder(selectedJob.id, {
                    status: 'Arrived',
                    arrivedAt: Date.now()
                  });
                  setArrivedAt(Date.now());
                }}
                className="w-full py-4 rounded-xl font-bold bg-[#3b82f6] text-white hover:brightness-90 transition-all shadow-blue-lg flex items-center justify-center gap-2 animate-pulse"
              >
                <span className="material-symbols-outlined">location_on</span>
                I HAVE ARRIVED
              </button>
            )}

            {/* 3. ARRIVED -> START WASH (Before Photos) */}
            {selectedJob.status === 'Arrived' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-3">
                {!selectedJob.clientAuthorized ? (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                      <span className="material-symbols-outlined text-amber-500">lock_clock</span>
                    </div>
                    <p className="font-bold text-amber-500 mb-1">Waiting for Authorization</p>
                    <p className="text-xs text-slate-400">Client must tap "Authorize Start".</p>
                  </div>
                ) : (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-400 text-2xl">verified_user</span>
                    <div>
                      <p className="font-bold text-green-400">Authorized!</p>
                      <p className="text-xs text-slate-300">You can start the wash.</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    triggerNativeHaptic();
                    setBeforePhotos({});
                    setShowBeforePhotosModal(true);
                  }}
                  disabled={!selectedJob.clientAuthorized}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${selectedJob.clientAuthorized
                    ? 'bg-[#3b82f6] text-white hover:scale-[1.02] shadow-blue'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                    }`}
                >
                  <span className="material-symbols-outlined">camera_alt</span>
                  Start Wash (Take Photos)
                </button>

                <button
                  onClick={() => {
                    const confirmNoShow = window.confirm('Client not present? This will mark the order as "No Show".');
                    if (confirmNoShow) {
                      updateOrder(selectedJob.id, { status: 'Cancelled', cancelReason: 'Client No Show' });
                      navigate(Screen.WASHER_JOBS);
                    }
                  }}
                  className="w-full py-3 rounded-xl font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                >
                  Client No Show
                </button>
              </div>
            )}

            {/* 4. IN PROGRESS -> FINISH WASH */}
            {selectedJob.status === 'In Progress' && (
              <div className="animate-in fade-in zoom-in duration-300">
                <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-xl p-6 mb-4 text-center">
                  <div className="w-16 h-16 bg-[#3b82f6]/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <span className="material-symbols-outlined text-[#3b82f6] text-3xl">local_car_wash</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Washing in Progress</h3>
                  <p className="text-sm text-slate-400">Client sees the "Washing" animation.</p>
                </div>

                <button
                  onClick={() => {
                    triggerNativeHaptic();
                    setCameraMode('after');
                    setTempPhotos({});
                    setShowCamera(true);
                  }}
                  className="w-full py-5 rounded-2xl font-black bg-primary text-white hover:bg-primary-dark transition-all shadow-blue-lg flex items-center justify-center gap-3 hover:scale-[1.02]"
                >
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                  FINISH WASH
                </button>
              </div>
            )}

            {/* 5. COMPLETED -> SUMMARY & EXIT */}
            {selectedJob.status === 'Completed' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-green-400 text-3xl">check_circle</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Order Completed!</h3>
                  <p className="text-sm text-slate-400">
                    {selectedJob.tip ? 'Client has tipped & rated!' : 'Waiting for client to rate & tip...'}
                  </p>
                </div>

                {/* Financial Summary */}
                <div className="bg-surface-dark border border-white/10 rounded-xl p-4">
                  <h4 className="font-bold text-slate-300 mb-3 border-b border-white/5 pb-2">Earnings Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Service Price</span>
                      <span>${selectedJob.price.toFixed(2)}</span>
                    </div>
                    {selectedJob.tip !== undefined && selectedJob.tip > 0 && (
                      <div className="flex justify-between text-amber-400 font-bold">
                        <span>Tip received!</span>
                        <span>+${selectedJob.tip?.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Calculate Washer Payout Estimate */}
                    {(() => {
                      // Re-calculate locally for immediate feedback
                      const gross = selectedJob.price + (selectedJob.tip || 0);

                      // We need accurate Fees. Assuming globalFees are loaded.
                      const totalFeePercent = globalFees.reduce((acc, fee) => acc + (fee.percentage || 0), 0);
                      const fees = (selectedJob.price * totalFeePercent) / 100;
                      const payout = gross - fees;

                      return (
                        <>
                          <div className="flex justify-between text-red-400">
                            <span>App Fees</span>
                            <span>-${fees.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-white/10 pt-2 mt-2 flex justify-between items-center">
                            <span className="font-bold text-white">Net Payout</span>
                            <span className="font-black text-2xl text-green-400">${payout.toFixed(2)}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      triggerNativeHaptic();
                      navigate(Screen.WASHER_JOBS);
                    }}
                    className="w-full py-5 rounded-2xl font-black bg-white text-black hover:bg-slate-200 transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    <span className="material-symbols-outlined">home</span>
                    BACK TO HOME
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-3">
                    You can leave this screen anytime. Earnings are saved.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Chat Button */}
        {!showChat && (
          <button
            onClick={() => setShowChat(true)}
            className="absolute bottom-6 right-6 z-20 w-14 h-14 bg-primary rounded-full text-white shadow-blue flex items-center justify-center hover:scale-110 transition-transform"
          >
            <span className="material-symbols-outlined text-2xl">chat</span>
            {chatUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900">
                {chatUnreadCount}
              </span>
            )}
          </button>
        )}

        {/* MODALS */}

        {/* Before Photos Modal */}
        {showBeforePhotosModal && (
          <PhotoCapture
            mode="before"
            onPhotosComplete={(photos) => {
              updateOrder(selectedJob.id, {
                status: 'In Progress',
                photos: { ...selectedJob.photos, before: photos }
              });
              setShowBeforePhotosModal(false);
              setBeforePhotos({});
            }}
            onCancel={() => setShowBeforePhotosModal(false)}
          />
        )}

        {/* After Photos Modal */}
        {showCamera && cameraMode === 'after' && (
          <PhotoCapture
            mode="after"
            onPhotosComplete={(photos) => {
              updateOrder(selectedJob.id, {
                status: 'Completed',
                completedAt: Date.now(),
                photos: { ...selectedJob.photos, after: photos },
                waitingForClient: true
              });

              // Award 1 loyalty point (1 wash = 1 point)
              if (selectedJob.clientId) {
                addLoyaltyPoints(selectedJob.clientId);
              }

              LocationService.stopTracking();
              setShowCamera(false);
              setTempPhotos({});
            }}
            onCancel={() => setShowCamera(false)}
          />
        )}

        {/* ETA Modal */}
        {showETAModal && (
          <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-surface-dark w-full max-w-xs rounded-2xl p-6 border border-white/10 shadow-2xl">
              <h3 className="text-xl font-bold mb-4">Arrival Estimate</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {['5', '10', '15', '20'].map(min => (
                  <button key={min} onClick={() => setEtaMinutes(min)} className={`py-2 rounded-lg border ${etaMinutes === min ? 'bg-primary border-primary text-white' : 'border-white/10'}`}>{min}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowETAModal(false)} className="flex-1 py-3 text-slate-400">Cancel</button>
                <button onClick={handleETASubmit} className="flex-1 py-3 bg-primary rounded-xl font-bold">Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Overlay */}
        {showChat && selectedJob && (
          <OrderChat
            orderId={selectedJob.id}
            currentUserId={currentWasherId}
            currentUserName={currentWasher?.name || 'Washer'}
            otherUserId={selectedJob.clientId || ''}
            otherUserName={selectedJob.clientName || 'Client'}
            messages={messages}
            sendMessage={sendMessage as any}
            isOpen={showChat}
            onClose={() => setShowChat(false)}
          />
        )}
      </div>
    );
  }

  // WASHER_EARNINGS Screen
  if (screen === Screen.WASHER_EARNINGS) {
    const completedJobs = orders.filter((o: Order) => o.washerId === currentWasherId && o.status === 'Completed');

    // Calculate totals (New Logic: Price - Global Fees)
    const calculateEarnings = (jobs: Order[]) => {
      // Calculate total fee percentage
      const totalFeePercent = globalFees.reduce((acc, fee) => acc + (fee.percentage || 0), 0);

      return jobs.reduce((acc, job) => {
        let jobGross = 0;

        // Calculate Gross per item (Vehicle + Addons)
        if (job.vehicleConfigs && job.vehicleConfigs.length > 0) {
          job.vehicleConfigs.forEach((config: any) => {
            // Package Price
            const pkg = packages.find((p: ServicePackage) => p.id === config.packageId);
            if (pkg && config.vehicleType) {
              jobGross += (pkg.price?.[config.vehicleType] || 0);
            }
            // Addons Price
            if (config.addonIds) {
              config.addonIds.forEach((addonId: string) => {
                const addon = addons.find((a: ServiceAddon) => a.id === addonId);
                if (addon) {
                  jobGross += (addon.price?.[config.vehicleType] || 0);
                }
              });
            }
          });
        } else {
          // Fallback for legacy
          jobGross += (job.price || 0);
        }

        // Apply Fees
        const jobFees = (jobGross * totalFeePercent) / 100;
        const jobNet = jobGross - jobFees;
        const tip = job.tip || 0;

        acc.gross += jobGross;
        acc.fees += jobFees;
        acc.netService += jobNet;
        acc.tips += tip;
        acc.totalNet += (jobNet + tip);
        return acc;
      }, { gross: 0, fees: 0, netService: 0, tips: 0, totalNet: 0 });
    };

    const totalStats = calculateEarnings(completedJobs);

    // Get current date with time reset to start of day
    const now = new Date();

    // Calculate start of week (Monday)
    const currentWeekStart = new Date(now);
    const day = currentWeekStart.getDay() || 7; // Mon=1 ... Sun=7
    if (day !== 1) {
      currentWeekStart.setHours(-24 * (day - 1));
    }
    currentWeekStart.setHours(0, 0, 0, 0);

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentYearStart = new Date(now.getFullYear(), 0, 1);

    const getJobDate = (job: Order) => {
      if (job.completedAt) return new Date(job.completedAt);
      const d = new Date(job.date);
      return isNaN(d.getTime()) ? new Date() : d; // Fallback for 'ASAP'
    };

    // Filter by time periods
    const weekStats = calculateEarnings(completedJobs.filter(job => getJobDate(job) >= currentWeekStart));
    const monthStats = calculateEarnings(completedJobs.filter(job => getJobDate(job) >= currentMonthStart));
    const yearStats = calculateEarnings(completedJobs.filter(job => getJobDate(job) >= currentYearStart));

    // Compatibility variables for UI
    const totalEarnings = totalStats.totalNet;
    const totalTips = totalStats.tips;
    const weekEarnings = weekStats.totalNet;
    const monthEarnings = monthStats.totalNet;
    const yearEarnings = yearStats.totalNet;

    // Group jobs by day of week for current week
    const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const weekJobs = completedJobs.filter(job => getJobDate(job) >= currentWeekStart);
    const monthJobs = completedJobs.filter(job => getJobDate(job) >= currentMonthStart); // Keep for consistency if needed
    const yearJobs = completedJobs.filter(job => getJobDate(job) >= currentYearStart);

    const dailyEarnings = daysOfWeek.map((day, index) => {
      // Adjusted index for Monday start (0=Mon, ... 6=Sun)
      // getDay(): 0=Sun, 1=Mon...
      // Map getDay() to 0-6 index where 0 is Mon: (day + 6) % 7
      const dayJobs = weekJobs.filter(job => {
        const d = getJobDate(job).getDay();
        const adjustedDay = (d + 6) % 7;
        return adjustedDay === index;
      });
      const stats = calculateEarnings(dayJobs);
      return { day, earnings: stats.totalNet, count: dayJobs.length };
    });

    return (
      <div className="flex flex-col h-full bg-background-dark text-white">
        <header className="flex items-center px-4 py-4 border-b border-white/5">
          <button onClick={() => navigate(Screen.WASHER_JOBS)}><span className="material-symbols-outlined">arrow_back_ios_new</span></button>
          <h1 className="flex-1 text-center font-bold text-lg mr-6">{i18n.t('earnings')}</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
          {/* Total Earnings Card */}
          <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 mb-6 shadow-xl">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2">{i18n.t('total_net_earnings')}</p>
            <p className="text-5xl font-bold text-white mb-4 tracking-tighter">${totalEarnings.toFixed(2)}</p>

            <div className="bg-black/30 rounded-xl p-4 space-y-2 text-sm border border-white/5">
              <div className="flex justify-between text-slate-400">
                <span>{i18n.t('gross_value')}</span>
                <span>${totalStats.gross.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-500/80">
                <span>{i18n.t('app_commission_deductions')}</span>
                <span>-${totalStats.fees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-amber-500/80">
                <span>{i18n.t('tips_100_yours')}</span>
                <span>+${totalStats.tips.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/5 my-2 pt-2"></div>
              <div className="flex justify-between font-bold text-lg text-white">
                <span>{i18n.t('your_net_payout')}</span>
                <span className="text-green-500">${totalStats.totalNet.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Period Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-surface-dark rounded-xl p-4 border border-white/5">
              <p className="text-xs text-slate-400 mb-1">{i18n.t('this_week')}</p>
              <p className="text-xl font-bold text-primary">${weekEarnings.toFixed(2)}</p>
              <p className="text-xs text-slate-500 mt-1">{weekJobs.length} {i18n.t('jobs')}</p>
            </div>
            <div className="bg-surface-dark rounded-xl p-4 border border-white/5">
              <p className="text-xs text-slate-400 mb-1">{i18n.t('this_month')}</p>
              <p className="text-xl font-bold text-primary">${monthEarnings.toFixed(2)}</p>
              <p className="text-xs text-slate-500 mt-1">{monthJobs.length} {i18n.t('jobs')}</p>
            </div>
            <div className="bg-surface-dark rounded-xl p-4 border border-white/5">
              <p className="text-xs text-slate-400 mb-1">{i18n.t('this_year')}</p>
              <p className="text-xl font-bold text-primary">${yearEarnings.toFixed(2)}</p>
              <p className="text-xs text-slate-500 mt-1">{yearJobs.length} {i18n.t('jobs')}</p>
            </div>
          </div>

          {/* Daily Breakdown - Current Week */}
          <div className="bg-surface-dark rounded-xl p-4 border border-white/5 mb-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">calendar_view_week</span>
              Weekly Breakdown
            </h3>
            <div className="space-y-2">
              {dailyEarnings.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className={`text-sm font-bold w-8 ${day.count > 0 ? 'text-primary' : 'text-slate-600'}`}>{day.day}</span>
                    <div className="flex-1 bg-black/30 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${weekEarnings > 0 ? (day.earnings / weekEarnings) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className={`text-sm font-bold ${day.count > 0 ? 'text-white' : 'text-slate-600'}`}>
                      ${day.earnings.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">{day.count} jobs</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Jobs (Filtered to Current Week) */}
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            This Week's Jobs
          </h3>
          <div className="space-y-3">
            {weekJobs.length === 0 ? (
              <p className="text-slate-500 text-center py-4 italic">No jobs completed this week yet.</p>
            ) : (
              weekJobs.sort((a, b) => getJobDate(b).getTime() - getJobDate(a).getTime()).map((job: Order) => (
                <div key={job.id} className="bg-surface-dark rounded-xl p-4 border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold">{job.clientName}</p>
                      <p className="text-sm text-slate-400">{job.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">${job.price.toFixed(2)}</p>
                      {job.tip && job.tip > 0 && (
                        <p className="text-xs text-amber-400">+${job.tip.toFixed(2)} tip</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {getJobDate(job).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {getJobDate(job).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {job.rating && (
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-yellow-400 filled">star</span>
                        <span>{job.rating}.0</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <ModernNav />
      </div>
    );
  }

  // WASHER_PROFILE Screen
  if (screen === Screen.WASHER_PROFILE) {
    return (
      <div className="flex flex-col h-full bg-background-dark text-white">
        <header className="flex items-center px-4 py-4 border-b border-white/5">
          <button onClick={() => navigate(Screen.WASHER_JOBS)}><span className="material-symbols-outlined">arrow_back_ios_new</span></button>
          <h1 className="flex-1 text-center font-bold text-lg mr-6">Profile</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-5xl text-primary">person</span>
            </div>
            <h2 className="text-xl font-bold">{currentWasher?.name || 'Washer'}</h2>
            <p className="text-sm text-slate-400">Washer</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate(Screen.WASHER_SETTINGS)}
              className="w-full bg-surface-dark rounded-xl p-4 border border-white/5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">settings</span>
                <span>Settings</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
            <button
              onClick={() => setShowHelpModal(true)}
              className="w-full bg-surface-dark rounded-xl p-4 border border-white/5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">help</span>
                <span>Help & Support</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to logout?')) {
                  logout();
                }
              }}
              className="w-full bg-surface-dark rounded-xl p-4 border border-white/5 text-left flex items-center justify-between hover:bg-red-500/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500">logout</span>
                <span className="text-red-500">Logout</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
          </div>
        </div>
        <ModernNav />
      </div>
    );
  }

  // WASHER_SETTINGS Screen
  if (screen === Screen.WASHER_SETTINGS) {
    return (
      <div className="flex flex-col h-full bg-background-dark text-white">
        <header className="flex items-center px-4 py-4 border-b border-white/5">
          <button onClick={() => navigate(Screen.WASHER_PROFILE)}>
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="flex-1 text-center font-bold text-lg mr-6">Settings</h1>
        </header>
        <div className="flex-1 overflow-y-auto pb-24">
          <WasherSettings
            currentUser={currentWasher}
            navigate={navigate}
            updateUserProfile={async (userId, updates) => {
              await updateWasherProfile(updates);
            }}
            logout={logout}
            showToast={(message) => {
              console.log(message);
            }}
            openSupport={openSupport}
          />
        </div>
        <ModernNav />
      </div>
    );
  }

  // Floating Chat Button & Modal - Available on ALL screens
  return (
    <>
      {/* Floating Chat Button with Client */}
      {activeJob && (
        <>
          <button
            onClick={() => setShowChat(true)}
            className="fixed bottom-24 right-6 w-14 h-14 bg-slate-800 border border-white/10 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 backdrop-blur-md"
          >
            <span className="material-symbols-outlined text-white text-2xl">chat</span>
            {chatUnreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900">
                {chatUnreadCount}
              </div>
            )}
          </button>

          {/* Client Chat Modal */}
          {showChat && (
            <OrderChat
              orderId={activeJob.id}
              currentUserId={currentWasherId}
              currentUserName={currentWasher?.name || 'Washer'}
              otherUserId={activeJob.clientId || ''}
              otherUserName={activeJob.clientName || 'Client'}
              messages={messages}
              sendMessage={sendMessage}
              isOpen={showChat}
              onClose={() => setShowChat(false)}
            />
          )}
        </>
      )}
    </>
  );
};

export const WasherScreens: React.FC<WasherProps> = (props) => {
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [supportMessages, setSupportMessages] = useState<Message[]>([]);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [hasUnreadSupport, setHasUnreadSupport] = useState(false);

  const { currentWasherId, currentWasher } = props;

  // Check for existing supported ticket
  useEffect(() => {
    if (!currentWasherId) return;

    const q = query(
      collection(db, 'supportTickets'),
      where('userId', '==', currentWasherId),
      where('status', '==', 'open'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const ticketDoc = snapshot.docs[0];
        setTicketId(ticketDoc.id);
        setHasUnreadSupport(ticketDoc.data().unreadByClient > 0);
      } else {
        setTicketId(null);
      }
    });
    return () => unsubscribe();
  }, [currentWasherId]);


  // Listen to messages
  useEffect(() => {
    if (!ticketId) {
      setSupportMessages([]);
      return;
    }

    const q = query(collection(db, 'supportTickets', ticketId, 'messages'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Message));
      // Sort by timestamp asc safely handling both Timestamp and number
      setSupportMessages(msgs.sort((a, b) => {
        const at = (a.timestamp as any)?.toMillis?.() || a.timestamp || 0;
        const bt = (b.timestamp as any)?.toMillis?.() || b.timestamp || 0;
        return at - bt;
      }));
    });

    return () => unsubscribe();
  }, [ticketId]);

  // Mark read when opening
  useEffect(() => {
    if (isSupportChatOpen && ticketId && hasUnreadSupport) {
      updateDoc(doc(db, 'supportTickets', ticketId), { unreadByClient: 0 });
    }
  }, [isSupportChatOpen, ticketId, hasUnreadSupport]);

  const handleSupportSend = async (text: string) => {
    if (!text.trim()) return;

    let currentTicketId = ticketId;

    if (!currentTicketId) {
      const newTicketRef = await addDoc(collection(db, 'supportTickets'), {
        userId: currentWasherId,
        userName: currentWasher.name || 'Washer',
        userEmail: currentWasher.email || '',
        userRole: 'washer',
        source: 'App - Washer',
        status: 'open',
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        unreadByClient: 0,
        unreadByAdmin: 1
      });
      currentTicketId = newTicketRef.id;
      setTicketId(currentTicketId);
    } else {
      // Use a simpler approach for incrementing unread without transaction for now, assuming serialized edits or just accepting slight race condition
      const ticketSnap = await getDoc(doc(db, 'supportTickets', currentTicketId));
      const currentUnread = ticketSnap.data()?.unreadByAdmin || 0;

      updateDoc(doc(db, 'supportTickets', currentTicketId), {
        lastMessageAt: serverTimestamp(),
        status: 'open',
        unreadByAdmin: currentUnread + 1
      });
    }

    await addDoc(collection(db, 'supportTickets', currentTicketId, 'messages'), {
      senderId: currentWasherId,
      senderName: currentWasher.name,
      senderRole: 'washer',
      message: text,
      timestamp: serverTimestamp(),
      read: false
    });
  };

  return (
    <div className="relative h-full">
      <WasherContent
        screen={props.screen}
        navigate={props.navigate}
        orders={props.orders}
        updateOrder={props.updateOrder}
        currentWasherId={props.currentWasherId}
        currentWasher={props.currentWasher}
        updateWasherProfile={props.updateWasherProfile}
        supportPhone={props.supportPhone}
        notifications={props.notifications}
        addNotification={props.addNotification}
        logout={props.logout}
        messages={props.messages}
        sendMessage={props.sendMessage}
        packages={props.packages}
        addons={props.addons}
        openSupport={() => setIsSupportChatOpen(true)}
        grabOrder={props.grabOrder}
        showToast={props.showToast}
        initialOrderId={props.initialOrderId}
      />

      <ChatModal
        isOpen={isSupportChatOpen}
        onClose={() => setIsSupportChatOpen(false)}
        messages={supportMessages}
        currentUserId={currentWasherId}
        chatTitle="Washer Support"
        chatSubtitle="Chat with Admin"
        onSendMessage={handleSupportSend}
      />
    </div>
  );
};
