import React, { useState, useEffect, useRef } from 'react';
import { i18n } from '../services/i18n';
import { ConfirmationModal } from './ConfirmationModal';
import { UserMenu } from './UserMenu';
import { Screen, Order, OrderStatus, ServicePackage, ServiceAddon, VehicleType, ClientUser, Notification, NotificationType, Message, IssueReport, SavedVehicle } from '../types';
import { AddVehicleModal } from './AddVehicleModal';
import { useToast } from './Toast';
import { FloatingChatButton } from './FloatingChatButton';
// import { ChatModal } from './ChatModal';
// PAYMENT: import { PaymentModal } from './PaymentModal';
import { TrackingUI } from './TrackingUI';
import { NotificationService } from '../services/NotificationService';
import { LiveMap } from './LiveMap';
import { TrackingMap } from './TrackingMap';
import { OrderChat } from './OrderChat';
import { isWithinServiceArea, mockGeocodeZip } from '../utils/location';
import { triggerNativeHaptic, showNativeToast, requestNativeLocation } from '../utils/native';
import { AddressAutocomplete } from './AddressAutocomplete';
import { SupportChat } from './SupportChat';
import { SupportChatClient } from './SupportChatClient';
import { CONDITION_QUESTIONS } from '../data/conditionQuestions';
import { storage, db } from '../firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { LoadingSpinner } from './LoadingSpinner';

// Import new screen components
import { VehicleSelectionScreen } from './client/VehicleSelectionScreen';
import { ServiceSelectionScreen } from './client/ServiceSelectionScreen';
import { DateTimeSelectionScreen } from './client/DateTimeSelectionScreen';
import { AddressSelectionScreen } from './client/AddressSelectionScreen';
import { OrderConfirmationScreen } from './client/OrderConfirmationScreen';
// PAYMENT: import { PaymentMethodsScreen } from './client/PaymentMethodsScreen';
import { LoyaltyProgram } from './LoyaltyProgram';
// PAYMENT: import { StripeService } from '../services/StripeService';


interface ClientProps {
  screen: Screen;
  navigate: (screen: Screen) => void;
  orders: Order[];
  user: ClientUser;
  packages: ServicePackage[];
  packagesError: string | null;
  addons: ServiceAddon[];
  team: import('../types').TeamMember[];
  vehicleTypes: any[]; // VehicleTypeConfig[] | any[]
  createOrder: (data: Partial<Order>) => Promise<string>;
  updateOrder: (id: string, data: Partial<Order>) => Promise<void>;
  cancelOrder: (id: string, applyFee?: boolean) => Promise<void>;
  newOrderDraft: Partial<Order>;
  setNewOrderDraft: (data: Partial<Order>) => void;
  notifications: Notification[];
  addNotification: (userId: string, title: string, message: string, type: NotificationType, linkTo?: Screen, relatedId?: string) => void;
  messages: Message[];
  sendMessage: (senderId: string, receiverId: string, orderId: string, content: string, type?: 'text' | 'image') => Promise<any>;
  markMessagesAsRead: (orderId: string, userId: string) => Promise<void>;
  createIssue: (issueData: Omit<IssueReport, 'id' | 'timestamp' | 'status'>) => void;
  updateProfile: (updates: any) => Promise<void>;
  logout: () => void;
  submitOrderRating: (orderId: string, ratingData: { clientRating: number, clientReview: string, tip: number, washerId: string }) => Promise<void>;
  serviceArea: any;
  globalFees: { name: string, percentage: number }[];
  discounts: import('../types').Discount[];
  targetOrderId?: string | null;
}

const ClientContent: React.FC<ClientProps> = (props) => {
  // Destructure scalar props that don't need array normalization
  const {
    screen, navigate, user, packagesError,
    createOrder, updateOrder, cancelOrder, newOrderDraft, setNewOrderDraft,
    addNotification, sendMessage, markMessagesAsRead, createIssue, updateProfile, logout,
    submitOrderRating, serviceArea, targetOrderId
  } = props;

  // --- STABILITY & NORMALIZATION BLOCK (v3.4 FINAL) ---
  // Shadow incoming array props with safe versions using the ORIGINAL names.
  // This makes the entire 2800+ line file stable without manual renaming.
  const orders = Array.isArray(props.orders) ? props.orders : [];
  const packages = Array.isArray(props.packages) ? props.packages : [];
  const addons = Array.isArray(props.addons) ? props.addons : [];
  const team = Array.isArray(props.team) ? props.team : [];
  const vehicleTypes = Array.isArray(props.vehicleTypes) ? props.vehicleTypes : [];
  const notifications = Array.isArray(props.notifications) ? props.notifications : [];
  const messages = Array.isArray(props.messages) ? props.messages : [];
  const globalFees = Array.isArray(props.globalFees) ? props.globalFees : [];
  const discounts = Array.isArray(props.discounts) ? props.discounts : [];

  // Shadow user sub-arrays with safe versions
  const vehicles = user?.savedVehicles || [];
  // Note: cards and addresses are handled as state below to support Stripe/Local updates

  // --- DEEP LINKING LOGIC ---
  const [orderToView, setOrderToView] = useState<Order | null>(null);

  useEffect(() => {
    if (targetOrderId && orders.length > 0) {
      const order = orders.find(o => o.id === targetOrderId);
      if (order) {
        console.log('🔗 Client Deep Link: Viewing order', targetOrderId);
        setOrderToView(order);
      }
    }
  }, [targetOrderId, orders]);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'primary';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'primary'
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'primary' = 'primary') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      type
    });
  };

  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

  // Monitor Viewed Order for Real-Time Status Changes
  useEffect(() => {
    if (orderToView) {
      const liveOrder = (orders || []).find(o => o.id === orderToView.id);

      if (!liveOrder) {
        setOrderToView(null);
        return;
      }

      if (liveOrder.status === 'Cancelled' && orderToView.status !== 'Cancelled') {
        showNativeToast('Your order has been cancelled.');
      }

      if (JSON.stringify(liveOrder) !== JSON.stringify(orderToView)) {
        setOrderToView(liveOrder);
      }
    }
  }, [orders, orderToView]);

  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'portfolio'>('services');

  // Draggable Floating Action Button
  const DraggableFab = ({ onClick, unreadCount }: { onClick: () => void, unreadCount: number }) => {
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Handle Dragging
    useEffect(() => {
      const handleMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

        // Calculate new position
        let newX = clientX - startPos.x;
        let newY = clientY - startPos.y;

        // Boundaries
        const maxX = window.innerWidth - 60;
        const maxY = window.innerHeight - 60;
        newX = Math.max(10, Math.min(newX, maxX));
        newY = Math.max(10, Math.min(newY, maxY));

        setPosition({ x: newX, y: newY });
      };

      const handleUp = () => {
        setIsDragging(false);
      };

      if (isDragging) {
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('touchend', handleUp);
      }

      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleUp);
      };
    }, [isDragging, startPos]);

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
      // Prevent default to stop scrolling/selection on touch
      // e.preventDefault(); // CAREFUL: This might block click if not handled correctly.
      // Better relies on a small threshold for click vs drag, or simply:

      // Only start drag if it's the left button for mouse
      if ('button' in e && (e as React.MouseEvent).button !== 0) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

      setStartPos({ x: clientX - position.x, y: clientY - position.y });
      setIsDragging(true);
    };

    // We need to differentiate between a Drag and a Click
    // Simple heuristic: if we moved significantly, it's a drag.
    // But since we update position live, `onClick` might fire after mouseup.
    // We can track total movement distance.
    const [hasMoved, setHasMoved] = useState(false);
    useEffect(() => {
      if (isDragging) setHasMoved(true);
      else {
        // Reset hasMoved after a short delay to allow onClick to check it?
        // Actually, better to check on MouseUp/Click event if we moved.
        setTimeout(() => setHasMoved(false), 100);
      }
    }, [isDragging]);

    return (
      <button
        ref={buttonRef}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onClick={(e) => {
          if (!hasMoved) onClick();
        }}
        style={{
          left: position.x,
          top: position.y,
          touchAction: 'none' // Important for preventing scroll while dragging
        }}
        className={`fixed z-50 w-14 h-14 rounded-full bg-primary text-black shadow-lg flex items-center justify-center transition-transform active:scale-95 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <span className="material-symbols-outlined text-2xl">chat</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-background-dark">
            {unreadCount}
          </span>
        )}
      </button>
    );
  };

  // Removed duplicate ClientScreens definition
  console.log('🎬 ClientScreens RENDERED - user.savedCards:', user?.savedCards);

  // Log user data on mount - BUILD v3.5 FINAL
  useEffect(() => {
    if (user) {
      console.log('👤 USER DATA:', {
        id: user.id || 'no-id',
        name: user.name || 'no-name',
        email: user.email || 'no-email',
        savedCards: user.savedCards || [],
        savedVehicles: user.savedVehicles?.length || 0,
        savedAddresses: user.savedAddresses?.length || 0
      });
    }
  }, [user]);

  const { showToast } = useToast();
  // State for CLIENT_VEHICLE screen (Hoisted to fix React Error #310)
  const [tempSelectedVehicles, setTempSelectedVehicles] = useState<string[]>([]);

  // State for CLIENT_DATE_TIME screen
  const [selectedOption, setSelectedOption] = useState<'asap' | 'scheduled'>('scheduled');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // State for CLIENT_ADDRESS screen
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Derived state
  console.log('🚗 DEBUG savedVehicles:', {
    type: typeof user.savedVehicles,
    isArray: Array.isArray(user.savedVehicles),
    value: user.savedVehicles,
    length: user.savedVehicles?.length
  });

  // Handler for confirming order
  const handleConfirmOrder = (finalTotal: number) => {
    console.log('📝 ===== CONFIRMING ORDER =====');
    console.log('💰 Final Total:', finalTotal);
    console.log('🚗 Vehicle Configs:', vehicleConfigs);

    console.log('📋 Temp Selected Vehicles:', tempSelectedVehicles);
    console.log('📅 Date/Time:', selectedDate, selectedTime);
    console.log('📍 Address:', selectedAddress);

    // Create order data
    // PAYMENT: Card selection removed
    // const selectedCardData = (cards || []).find(c => c.id === selectedCard);


    const orderData: Partial<Order> = {
      clientId: user.id,
      clientName: user.name,
      vehicleConfigs: vehicleConfigs || [],
      // Legacy fields for backward compatibility
      vehicle: (vehicleConfigs || []).length > 0 ? (vehicleConfigs || [])[0].vehicleModel : '',
      vehicleType: (vehicleConfigs || []).length > 0 ? (vehicleConfigs || [])[0].vehicleType : 'sedan',
      service: (packages || []).find(p => p.id === (vehicleConfigs || [])[0]?.packageId)?.name || '',
      date: selectedDate,
      time: selectedTime,
      address: selectedAddress,
      price: finalTotal, // Use the calculated total price
      basePrice: finalTotal,
      status: 'Pending' as OrderStatus,
      paymentStatus: 'Pending'
      // PAYMENT: Payment method removed
      // paymentMethod: selectedCardData ? {
      //   last4: selectedCardData.last4,
      //   brand: selectedCardData.brand
      // } : null
    };

    console.log('📦 Order Data to save:', orderData);
    createOrder(orderData as Order);
    showToast('Order created successfully!', 'success');
    navigate(Screen.CLIENT_HOME);
  };

  // Check for order requiring rating (Blocking Flow), ignoring explicitly skipped ones locally to avoid flicker
  const [recentlyRatedOrders, setRecentlyRatedOrders] = useState<string[]>([]);
  const orderToRate = (orders || []).find(o =>
    o.status === 'Completed' &&
    !o.clientRating &&
    !recentlyRatedOrders.includes(o.id)
  );

  // --- AUTO-CLOSE LOGIC (10 Minutes) ---
  // User Requirement: "si no lo hace en 10 min se termina la orden completamente y se le cobra solo lo que gasto"

  // Use a ref to track processed orders instantly without triggering re-renders/looping
  const processedOrdersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkAutoClose = async () => {
      if (!orders || orders.length === 0) return;

      const TEN_MINUTES_MS = 10 * 60 * 1000;
      const now = Date.now();

      // Find candidates that haven't been processed in this session
      const staleOrders = orders.filter(o =>
        o.status === 'Completed' &&
        !o.clientRating && // Client hasn't rated/tipped yet
        o.completedAt &&
        (now - o.completedAt) > TEN_MINUTES_MS &&
        !processedOrdersRef.current.has(o.id)
      );

      if (staleOrders.length > 0) {
        console.log("⏰ Found stale completed orders for auto-close:", staleOrders.map(o => o.id));

        for (const order of staleOrders) {
          // Double check inside loop (in case of race conditions or rapid fires)
          if (processedOrdersRef.current.has(order.id)) continue;

          // MARK AS PROCESSED IMMEDIATELY
          processedOrdersRef.current.add(order.id);

          try {
            // Silently auto-finalize stale orders to keep the UI clean
            await submitOrderRating(order.id, {
              clientRating: 5,
              clientReview: 'Auto-completed by system',
              tip: 0,
              washerId: order.washerId || ''
            });
          } catch (e) {
            // Already marked as processed, so it won't retry frequently
          }
        }
      }
    };

    // Check periodically (every 1 minute)
    const intervalId = setInterval(checkAutoClose, 60000);

    // Also check on mount
    checkAutoClose();

    return () => clearInterval(intervalId);
  }, [orders, submitOrderRating]); // Removed recentlyRatedOrders dependency to avoid loop

  const [weather, setWeather] = useState<{ temp: number; description: string; icon: string; recommendation: string } | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await import('../services/WeatherService').then(m => m.WeatherService.getCurrentWeather(0, 0));
        setWeather(data);
      } catch (e) {
        console.error("Failed to load weather", e);
      }
    };
    fetchWeather();
  }, []);

  // --- AUTO-RECOVERY REMOVED (As requested by user to prevent restoration of deleted vehicles) ---

  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const activeTrackingOrder = orders.find(o => o.id === trackingOrderId);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showOrderChat, setShowOrderChat] = useState(false);
  const [chatManuallyClosed, setChatManuallyClosed] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);


  // Rating & Tip State
  const [currentRating, setCurrentRating] = useState(0);
  const [clientReviewText, setClientReviewText] = useState('');
  const [currentTip, setCurrentTip] = useState(0);
  const [showCustomTipInput, setShowCustomTipInput] = useState(false);
  const [customTip, setCustomTip] = useState('');

  // Saved Vehicles State
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<SavedVehicle | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [successfullyCancelledIds, setSuccessfullyCancelledIds] = useState<string[]>([]);
  const [optimisticOrders, setOptimisticOrders] = useState<Order[]>([]);

  // Cleanup optimistic orders when they appear in real Firestore data
  useEffect(() => {
    if (optimisticOrders.length > 0) {
      const realOrderIds = new Set(orders.map(o => o.id));
      const remainingOptimistic = optimisticOrders.filter(oo => !realOrderIds.has(oo.id));

      if (remainingOptimistic.length !== optimisticOrders.length) {
        setOptimisticOrders(remainingOptimistic);
      }
    }
  }, [orders, optimisticOrders]);

  // Calculate unread messages count for the client
  const messageUnreadCount = (messages || []).filter(m => m.receiverId === user.id && !m.read).length;

  // Reset manually closed flag ONLY if a new message arrives (using ref to avoid loops)
  const prevClientUnreadCountRef = useRef(messageUnreadCount);
  useEffect(() => {
    if (messageUnreadCount > prevClientUnreadCountRef.current) {
      setChatManuallyClosed(false);
    }
    prevClientUnreadCountRef.current = messageUnreadCount;
  }, [messageUnreadCount]);

  // Consolidated Auto-open Chat Logic for Client
  useEffect(() => {
    if (messages.length === 0) return;

    // Auto-open if there are unread messages, chat is not manually closed, and not already open
    if (messageUnreadCount > 0 && !showOrderChat && !chatManuallyClosed) {
      // Find the most recent unread message to identify the order
      const lastUnread = [...messages].reverse().find(m => m.receiverId === user.id && !m.read);

      if (lastUnread) {
        const order = orders.find(o => o.id === lastUnread.orderId);
        // Only auto-open for active orders
        if (order && ['Assigned', 'En Route', 'Arrived', 'In Progress'].includes(order.status)) {
          console.log("📨 Auto-opening chat for order:", order.id);
          setViewingOrder(order);
          setShowOrderChat(true);
          triggerNativeHaptic();
        }
      }
    }
  }, [showOrderChat, chatManuallyClosed, user.id, orders, messageUnreadCount, (messages || []).length]);

  // Mark messages as read when chat is open
  useEffect(() => {
    // Find the order currently being viewed in chat
    const activeOrderInChat = orders.find(o => o.id === viewingOrder?.id);
    // Count unread messages for this specific order and current user
    const chatUnreadCount = activeOrderInChat
      ? (messages || []).filter(m => m.orderId === activeOrderInChat.id && m.receiverId === user.id && !m.read).length
      : 0;

    if (showOrderChat && activeOrderInChat && chatUnreadCount > 0) {
      markMessagesAsRead(activeOrderInChat.id, user.id);
    }
  }, [showOrderChat, viewingOrder?.id, messages, user.id, markMessagesAsRead, orders]);

  const handleEditVehicle = (vehicle: SavedVehicle) => {
    setEditingVehicle(vehicle);
    setShowAddVehicleModal(true);
  };

  const handleAddSavedVehicle = async (vehicleData: { make: string; model: string; year: string; color: string; plate?: string; type: VehicleType }, image: string | null) => {
    try {
      console.log('🚗 Starting vehicle save process...');

      // Prepare vehicle data
      const vehicleMake = String(vehicleData.make || '');
      const vehicleModel = String(vehicleData.model || '');
      const vehicleYear = String(vehicleData.year || '');
      const vehicleColor = String(vehicleData.color || '');
      const vehiclePlate = String(vehicleData.plate || '');
      const vehicleType = String(vehicleData.type || 'sedan');

      // Upload image to Firebase Storage if provided
      let imageUrl: string | null = (editingVehicle?.image) || null; // Fallback to existing if not changed

      console.log('📸 Processing vehicle image. Incoming image value:', image ? (image.startsWith('http') ? 'URL' : 'DataURI') : 'NULL');

      if (image) {
        if (image.startsWith('http')) {
          // It's already a URL, keep it
          console.log('🔗 Keeping existing image URL:', image.substring(0, 50) + '...');
          imageUrl = image;
        } else if (image.startsWith('data:image')) {
          // It's a base64 string (or new file), upload it
          try {
            console.log('📸 NEW IMAGE DETECTED (base64). Starting upload...');
            const vehicleId = editingVehicle?.id || `v_${Date.now()}`;

            const storagePath = `vehicles/${user.id}/${vehicleId}.jpg`;
            console.log('📂 Storage Path:', storagePath);

            const storageRef = ref(storage, storagePath);

            // Upload base64 image
            console.log('⌛ Uploading string...');
            const uploadResult = await uploadString(storageRef, image, 'data_url');
            console.log('📤 Upload complete. Metadata:', uploadResult.metadata.fullPath);

            // Get download URL
            imageUrl = await getDownloadURL(storageRef);
            console.log('✅ Download URL obtained:', imageUrl);
          } catch (uploadError) {
            console.error('❌ Error during Firebase Storage operation:', uploadError);
            showToast('Warning: Image upload failed, saving vehicle with old/no image', 'warning');
          }
        } else {
          console.warn('⚠️ Image format not recognized (not http and not data:image). Skipping upload.');
        }
      } else {
        console.log('ℹ️ No image provided to save process');
      }

      let allVehicles = [];

      if (editingVehicle) {
        // UPDATE EXISTING VEHICLE
        console.log('🔄 Updating existing vehicle:', editingVehicle.id);

        allVehicles = (user.savedVehicles || []).map(v => {
          if (v.id === editingVehicle.id) {
            return {
              ...v,
              make: vehicleMake,
              model: vehicleModel,
              year: vehicleYear,
              color: vehicleColor,
              plate: vehiclePlate,
              type: vehicleType,
              image: imageUrl || v.image // Keep old image if new upload failed
            };
          }
          return v;
        });

      } else {
        // CREATE NEW VEHICLE
        const vehicleId = `v_${Date.now()}`;
        const existingVehicles = user.savedVehicles || [];
        const isFirstVehicle = existingVehicles.length === 0;

        // DEFENSIVE CHECK: If we have orders but NO vehicles, it's highly suspicious that the profile is stale.
        if (isFirstVehicle && (orders || []).length > 0) {
          console.warn('⚠️ DEFENSIVE: User has orders but 0 saved vehicles. Profile might be stale.');
        }

        const newVehicle = {
          id: vehicleId,
          make: vehicleMake,
          model: vehicleModel,
          year: vehicleYear,
          color: vehicleColor,
          plate: vehiclePlate,
          type: vehicleType,
          isDefault: isFirstVehicle,
          image: imageUrl
        };

        console.log('📦 New vehicle:', newVehicle);
        allVehicles = [...existingVehicles, newVehicle];
      }

      console.log('📤 Sending to Firestore (without base64):', allVehicles.map(v => ({ ...v, image: v.image ? 'URL' : null })));

      // Update directly
      console.log('🔄 Calling updateProfile with savedVehicles...');

      // OPTIMISTIC UPDATE: Update local user state immediately to verify UI responsiveness
      // We rely on the parent (App.tsx) listener to confirm, but this helps debugging.

      await updateProfile({ savedVehicles: allVehicles });

      console.log('✅ SUCCESS!');
      showToast(editingVehicle ? 'Vehicle updated successfully!' : 'Vehicle added successfully!', 'success');
      setShowAddVehicleModal(false);
      setEditingVehicle(null); // Reset editing state

    } catch (error) {
      console.error('❌ FAILED to save vehicle:', error);
      showToast(`Error saving vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const handleDeleteSavedVehicle = async (vehicleId: string) => {
    showConfirm(
      'Delete Vehicle',
      'Are you sure you want to remove this vehicle?',
      async () => {
        try {
          console.log(`🗑️ Deleting vehicle ${vehicleId}...`);
          const updatedVehicles = (user.savedVehicles || []).filter(v => v.id !== vehicleId);

          if (updatedVehicles.length === (user.savedVehicles || []).length) {
            console.warn('⚠️ Vehicle ID not found in list, nothing to delete.');
          }

          await updateProfile({ savedVehicles: updatedVehicles });
          console.log('✅ Vehicle deleted successfully in Firestore');
          showToast('Vehicle removed', 'success');
        } catch (error) {
          console.error('❌ Error deleting vehicle:', error);
          showToast(`Failed to delete vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
      },
      'danger'
    );
  };




  const handleSubmitRating = async () => {
    if (!orderToRate || !currentRating) return;

    try {
      const totalAmount = (orderToRate.price || 0) + currentTip; // Used for calculation if needed locally, though submitOrderRating handles updates
      await submitOrderRating(orderToRate.id, {
        clientRating: currentRating,
        clientReview: clientReviewText,
        tip: currentTip,
        washerId: orderToRate.washerId || ''
      });
      showToast('Thank you for your rating!', 'success');
      setClientReviewText('');
      setCurrentRating(0);
      setCurrentTip(0);
      navigate(Screen.CLIENT_HOME);
    } catch (e) {
      showToast('Error al enviar calificación', 'error');
    }
  };

  // Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false); // For Wallet/Profile
  const [showCheckoutModal, setShowCheckoutModal] = useState(false); // For Order Checkout
  const [pendingOrderData, setPendingOrderData] = useState<Partial<Order> | null>(null);

  const handleReorder = (order: Order) => {
    // 1. Try to reconstruct configs
    let configs = order.vehicleConfigs;

    if (!configs || configs.length === 0) {
      const pkg = packages.find(p => p.name === order.service);
      // Try to match vehicle string "Toyota Camry" to saved vehicle
      const vehicle = vehicles.find(v => v.model === order.vehicle) || vehicles[0];

      if (vehicle && pkg) {
        configs = [{
          vehicleId: vehicle.id,
          vehicleModel: vehicle.model,
          vehicleType: vehicle.type, // Added to match interface
          packageId: pkg.id,
          addonIds: []
        }];
      } else {
        showToast('Cannot reorder this item automatically. Please start a new booking.', 'warning');
        navigate(Screen.CLIENT_VEHICLE);
        return;
      }
    }

    // 2. Set Draft & navigate
    // We assume setVehicleConfigs and setSelectedVehicleIds are in scope (top-level)
    try {
      setVehicleConfigs(configs);
      setSelectedVehicleIds(configs.map(c => c.vehicleId));
    } catch (e) {
      console.warn('State setters error', e);
    }

    setNewOrderDraft({
      ...newOrderDraft,
      vehicleConfigs: configs,
      service: order.service,
      price: order.price
    });

    navigate(Screen.CLIENT_SERVICE_SELECT);
  };



  const unreadCount = (notifications || []).filter(n => !n.read && n.userId === user.id).length;

  // Get active order for chat context
  const activeOrder = (orders || []).find(o => ['Assigned', 'En Route', 'Arrived', 'In Progress'].includes(o.status));
  const activeChatMessages = activeOrder ? (messages || []).filter(m => m.orderId === activeOrder.id) : [];

  // Chat Unread Count (Specific to Chat Messages, not generic notifications if separated, but here we used notifications for messages too)
  // Let's filter notifications for "New Message" related to this order or just use unreadCount for simplicity as per request
  const chatUnreadCount = (notifications || []).filter(n => !n.read && n.userId === user.id && n.title === 'New Message').length;


  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatMessage.trim() || !activeOrder || !activeOrder.washerId) return;

    sendMessage(user.id, activeOrder.washerId, activeOrder.id, chatMessage);
    setChatMessage('');
  };

  // Status Change Notifications
  const prevStatusRef = useRef<Record<string, import('../types').OrderStatus>>({});

  useEffect(() => {
    const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled');

    activeOrders.forEach(order => {
      const prev = prevStatusRef.current[order.id];
      if (prev && prev !== order.status) {
        if (order.status === 'Assigned') {
          showToast(`Washer assigned! ${order.washerName || 'Your washer'} is on the way.`, 'success');
          addNotification(user.id, 'Washer Assigned', `${order.washerName || 'A washer'} has accepted your request.`, 'success', Screen.CLIENT_HOME);
        } else if (order.status === 'En Route') {
          showToast(`Washer is en route!`, 'info');
          addNotification(user.id, 'Washer En Route', `${order.washerName || 'Washer'} is driving to your location.`, 'info', Screen.CLIENT_HOME);
        } else if (order.status === 'Arrived') {
          showToast(`Washer has arrived!`, 'success');
          addNotification(user.id, 'Washer Arrived', 'Please meet the washer or unlock your car.', 'success', Screen.CLIENT_HOME);
        } else if (order.status === 'In Progress') {
          showToast(`Cleaning started!`, 'info');
          addNotification(user.id, 'Cleaning Started', 'The washer has started working on your vehicle.', 'info', Screen.CLIENT_HOME);
        }
      }
      prevStatusRef.current[order.id] = order.status;
    });
  }, [orders, user.id, addNotification, showToast]);

  // Support Chat Component

  const NotificationList = () => (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center md:justify-end md:p-4">
      <div className="bg-surface-dark w-full h-full md:w-96 md:h-auto md:max-h-[80vh] md:rounded-2xl border-0 md:border border-white/10 shadow-2xl overflow-hidden md:mt-16 flex flex-col">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
          <h3 className="font-bold text-lg">Notifications</h3>
          <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {((notifications || []).filter(n => n.userId === user.id)).length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_off</span>
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.filter(n => n.userId === user.id).map(notification => (
              <div key={notification.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}>
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

  // ... inside ClientScreens return
  // I need to find where to insert the bell icon. It should be in the header.


  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileImage, setProfileImage] = useState(user.avatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80');
  const profileInputRef = useRef<HTMLInputElement>(null);

  // Garage State
  const [garageTab, setGarageTab] = useState<'vehicles' | 'addresses'>('vehicles');
  const [addresses, setAddresses] = useState<any[]>([]);

  // Load saved addresses from user profile
  // Load saved addresses from user profile
  useEffect(() => {
    console.log('📍 Address Effect Triggered', {
      hasUser: !!user,
      savedAddresses: user.savedAddresses,
      length: user.savedAddresses?.length
    });

    if (user.savedAddresses && user.savedAddresses.length > 0) {
      console.log('📍 Setting addresses from PROFILE');
      setAddresses(user.savedAddresses);
    } else {
      console.log('📍 Setting addresses to DEFAULT');
      // Default address if none saved
      setAddresses([{ id: 'a1', label: 'Home', address: '123 Main St', icon: 'home' }]);
    }
  }, [user.savedAddresses]);

  // Add Vehicle/Address Modal State
  // showAddVehicleModal is defined above (line 152)
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', year: '', color: '', plate: '', type: 'Sedan' as VehicleType });
  const [newVehicleImage, setNewVehicleImage] = useState<string | null>(null);
  const vehicleInputRef = useRef<HTMLInputElement>(null);

  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', address: '' });
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);

    // 1. Try Native Android Bridge
    if (typeof window !== 'undefined' && window.Android?.requestLocation) {
      // Define global callback if not exists
      window.onLocationReceived = (latitude: number, longitude: number) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
          setIsLocating(false);
          if (status === 'OK' && results && results[0]) {
            setNewAddress(prev => ({ ...prev, address: results[0].formatted_address }));
          } else {
            showToast('Could not find address from location.', 'error');
          }
        });
      };
      window.Android.requestLocation();
      return;
    }

    // 2. Fallback to Web API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // Use Google Maps Geocoding API to get address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
          setIsLocating(false);
          if (status === 'OK' && results && results[0]) {
            setNewAddress(prev => ({ ...prev, address: results[0].formatted_address }));
          } else {
            showToast('Could not find address from location.', 'error');
          }
        });
      }, (error) => {
        setIsLocating(false);
        showToast('Error getting location: ' + error.message, 'error');
      });
    } else {
      setIsLocating(false);
      showToast('Geolocation is not supported by this browser.', 'error');
    }
  };

  // Claim/Support State
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimDescription, setClaimDescription] = useState('');
  const [claimImage, setClaimImage] = useState<string | null>(null);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);

  // Per-Vehicle Service Configuration State
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [vehicleConfigs, setVehicleConfigs] = useState<Array<{
    vehicleId: string;
    vehicleModel: string;
    vehicleType: VehicleType;
    packageId: string;
    addonIds: string[];
  }>>([]);

  // Date/Time Selection State


  // Profile Edit State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    photo: user.avatar || '/default-avatar.png',
    address: user.address || ''
  });

  // Sync with User Prop
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        photo: user.avatar || prev.photo
      }));
    }
  }, [user]);

  // Payment Methods State
  // PAYMENT: const [showAddCardForm, setShowAddCardForm] = useState(false);
  // PAYMENT: // Filter out invalid legacy cards (must start with pm_ or card_)
  // PAYMENT: const validSavedCards = (user?.savedCards || []).filter(c => c.id.startsWith('pm_') || c.id.startsWith('card_'));
  // PAYMENT: const [selectedCard, setSelectedCard] = useState<string>(validSavedCards?.[0]?.id || '');
  // PAYMENT: const [cards, setCards] = useState<any[]>(validSavedCards || []);
  // PAYMENT: const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '', name: '' });

  // PAYMENT: Load saved cards from Stripe
  // PAYMENT: const fetchStripeCards = async () => {
  // PAYMENT:   try {
  // PAYMENT:     console.log('💳 Fetching cards from Stripe...');
  // PAYMENT:     const stripeCards = await StripeService.listPaymentMethods();
  // PAYMENT:     setCards(stripeCards);
  // PAYMENT:
  // PAYMENT:     // SYNC: Update Firestore profile with the valid cards from Stripe
  // PAYMENT:     // This ensures that Android/iOS/Web all see the same valid "cache" 
  // PAYMENT:     // and invalid local IDs are permanently removed from the DB.
  // PAYMENT:     if (user.id) {
  // PAYMENT:       console.log('🔄 Syncing Stripe cards to Firestore User Profile...');
  // PAYMENT:       updateProfile({ savedCards: stripeCards }).catch(err =>
  // PAYMENT:         console.warn('⚠️ Failed to sync cards to profile (non-critical):', err)
  // PAYMENT:       );
  // PAYMENT:     }
  // PAYMENT:
  // PAYMENT:   } catch (error) {
  // PAYMENT:     console.error('🔴 Client.fetchCards error details:', {
  // PAYMENT:       code: (error as any).code,
  // PAYMENT:       message: (error as any).message,
  // PAYMENT:       details: (error as any).details,
  // PAYMENT:       error
  // PAYMENT:     });
  // PAYMENT:     // showToast('Failed to load saved cards', 'error');
  // PAYMENT:   }
  // PAYMENT: };
  // PAYMENT:
  // PAYMENT: useEffect(() => {
  // PAYMENT:   if (user.id) {
  // PAYMENT:     fetchStripeCards();
  // PAYMENT:   }
  // PAYMENT: }, [user.id]);



  const handleClaimImageUpload = async () => {
    try {
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      const image = await Camera.getPhoto({
        quality: 60,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt, // Allow Gallery for clients
        width: 1024
      });

      if (image.dataUrl) {
        setClaimImage(image.dataUrl);
      }
    } catch (error: any) {
      console.error('Error taking claim photo:', error);
    }
  };

  const submitClaim = () => {
    if (!claimDescription.trim()) {
      showToast('Please describe the issue.', 'warning');
      return;
    }

    createIssue({
      clientId: user.id,
      clientName: user.name || 'Client',
      clientEmail: user.email,
      subject: 'Issue reported from Client App',
      description: claimDescription,
      image: claimImage || undefined,
      orderId: activeOrder?.id
    });

    showToast('Report submitted! Our support team will contact you.', 'success');
    setShowClaimModal(false);
    setClaimDescription('');
    setClaimImage(null);
  };


  const handleSaveProfile = async () => {
    try {
      // Geocode address if provided
      let addressData: any = {};
      if (profileData.address && profileData.address.trim()) {
        try {
          const geocoder = new google.maps.Geocoder();
          const result = await new Promise<{ formatted_address: string, lat: number, lng: number }>((resolve, reject) => {
            geocoder.geocode({ address: profileData.address }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                const location = results[0].geometry.location;
                resolve({
                  formatted_address: results[0].formatted_address,
                  lat: location.lat(),
                  lng: location.lng()
                });
              } else {
                reject(new Error('Address validation failed'));
              }
            });
          });

          addressData = {
            address: result.formatted_address,
            addressLat: result.lat,
            addressLng: result.lng
          };
        } catch (geoError) {
          showToast('Could not validate address. Please check and try again.', 'error');
          return;
        }
      }

      await updateProfile({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        avatar: profileData.photo,
        ...addressData
      });
      showToast('Profile updated successfully!', 'success');
      setShowEditProfileModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error');
    }
  };

  // PAYMENT: Ensure a valid card is always selected
  // PAYMENT: useEffect(() => {
  // PAYMENT:   if (Array.isArray(cards) && cards.length > 0) {
  // PAYMENT:     if (!selectedCard) {
  // PAYMENT:       console.log('💳 Auto-selecting first card (init)');
  // PAYMENT:       setSelectedCard(cards[0].id);
  // PAYMENT:     } else {
  // PAYMENT:       // Verify selection exists
  // PAYMENT:       const exists = cards.find(c => c.id === selectedCard);
  // PAYMENT:       if (!exists) {
  // PAYMENT:         console.log('💳 Selected card not found, defaulting to first');
  // PAYMENT:         setSelectedCard(cards[0].id);
  // PAYMENT:       }
  // PAYMENT:     }
  // PAYMENT:   }
  // PAYMENT: }, [cards, selectedCard]);

  // PAYMENT: const handleAddCardSuccess = () => {
  // PAYMENT:   fetchStripeCards();
  // PAYMENT:   showToast('Card added successfully!', 'success');
  // PAYMENT:   setShowAddCardForm(false);
  // PAYMENT:   setShowPaymentModal(false);
  // PAYMENT: };
  // PAYMENT:
  // PAYMENT: const handleDeleteCard = async (id: string) => {
  // PAYMENT:   try {
  // PAYMENT:     if (!window.confirm('Are you sure you want to remove this card?')) return;
  // PAYMENT:     await StripeService.deletePaymentMethod(id);
  // PAYMENT:     setCards(prev => prev.filter(c => c.id !== id));
  // PAYMENT:     showToast('Card removed', 'success');
  // PAYMENT:   } catch (error) {
  // PAYMENT:     console.error('Error removing card:', error);
  // PAYMENT:     showToast('Failed to remove card from Stripe', 'error');
  // PAYMENT:   }
  // PAYMENT: };

  // Simulate Tracking Updates
  const [eta, setEta] = useState(15);
  useEffect(() => {
    if (activeTrackingOrder && activeTrackingOrder.status === 'In Progress') {
      const interval = setInterval(() => {
        setEta((prev) => (prev > 1 ? prev - 1 : 1));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTrackingOrder]);

  const handleProfileImageChange = async () => {
    // 1. Try Capacitor Camera first (Mobile)
    try {
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      const image = await Camera.getPhoto({
        quality: 60,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        width: 800
      });

      if (image.dataUrl) {
        processUploadedPhoto(image.dataUrl);
        return;
      }
    } catch (error: any) {
      console.log('Capacitor camera not available or cancelled, trying file input:', error.message);
    }

    // 2. Fallback to hidden file input (Web)
    if (profileInputRef.current) {
      profileInputRef.current.click();
    }
  };

  const processUploadedPhoto = async (dataUrl: string) => {
    try {
      showToast('Updating profile photo...', 'info');

      // Upload to Firebase Storage
      const storageRef = ref(storage, `avatars/${user.id}/profile.jpg`);
      await uploadString(storageRef, dataUrl, 'data_url');

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Update local state
      setProfileImage(downloadURL);
      setProfileData({ ...profileData, photo: downloadURL });

      // Save to Firestore permanently
      await updateProfile({ avatar: downloadURL });

      showToast('Profile photo updated successfully!', 'success');
    } catch (error) {
      console.error('Error processing photo:', error);
      showToast('Failed to upload photo', 'error');
    }
  };

  const handleFilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processUploadedPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleVehicleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewVehicleImage(URL.createObjectURL(e.target.files[0]));
    }
  };



  const handleAddAddress = async (addrData: { label: string, address: string }) => {
    if (!addrData.label || !addrData.address) return;

    // Validation of address is already done in AddressSelectionScreen
    // We trust the input here.

    const newAddr = {
      id: `a${Date.now()}`,
      label: addrData.label,
      address: addrData.address,
      icon: 'location_on'
    };

    const updatedAddresses = [...addresses, newAddr];
    setAddresses(updatedAddresses);

    // Save to Firestore
    try {
      await updateProfile({ savedAddresses: updatedAddresses });
      showToast('Address saved successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error saving address:', error);
      showToast('Address added locally but failed to sync', 'warning');
      return false;
    }
  };

  const handleDeleteAddress = async (id: string) => {
    showConfirm(
      'Delete Address',
      'Are you sure you want to delete this address?',
      async () => {
        const updatedAddresses = addresses.filter(a => a.id !== id);
        setAddresses(updatedAddresses);

        try {
          await updateProfile({ savedAddresses: updatedAddresses });
          showToast('Address deleted', 'success');
        } catch (error) {
          console.error('Error deleting address', error);
          showToast('Failed to delete address', 'error');
        }
      },
      'danger'
    );
  };



  const handleCancelClick = (orderId: string) => {
    showConfirm(
      'Cancellation Policy',
      "Cancelling this order will incur a $10.00 fee. Do you want to proceed?",
      () => cancelOrder(orderId),
      'danger'
    );
  };

  const handleSaveClientEdit = () => {
    if (editingOrder) {
      updateOrder(editingOrder.id, {
        date: editingOrder.date,
        time: editingOrder.time,
        address: editingOrder.address
      });
      setEditingOrder(null);
    }
  };

  const handleSelectPackage = (pkg: ServicePackage) => {
    const type = newOrderDraft.vehicleType || 'Sedan';
    const price = pkg.price[type];
    setNewOrderDraft({ service: pkg.name, price: price, addons: [] });
  };

  const handleToggleAddon = (name: string, price: number) => {
    const currentAddons = newOrderDraft.addons || [];
    let newAddons = currentAddons.includes(name) ? currentAddons.filter(a => a !== name) : [...currentAddons, name];
    let newPrice = (newOrderDraft.price || 0) + (currentAddons.includes(name) ? -price : price);
    setNewOrderDraft({ addons: newAddons, price: newPrice });
  };

  const BottomNav = () => (
    <div className="bg-background-dark/95 backdrop-blur-xl border-t border-white/5 p-2 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] z-20">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {[
          { icon: 'home', label: 'Home', action: () => navigate(Screen.CLIENT_HOME), active: screen === Screen.CLIENT_HOME },
          { icon: 'history', label: 'History', action: () => navigate(Screen.CLIENT_BOOKINGS), active: screen === Screen.CLIENT_BOOKINGS || screen === Screen.CLIENT_RATING },
          { icon: 'directions_car', label: 'Garage', action: () => navigate(Screen.CLIENT_GARAGE), active: screen === Screen.CLIENT_GARAGE },
          { icon: 'person', label: 'Profile', action: () => navigate(Screen.CLIENT_PROFILE), active: screen === Screen.CLIENT_PROFILE },
        ].map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 relative group w-16 ${item.active
              ? 'text-primary'
              : 'text-slate-500 hover:text-slate-300'
              }`}
          >
            {/* Active Indicator Bar */}
            {item.active && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-lg shadow-lg shadow-primary/20"></div>
            )}

            {/* Icon */}
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${item.active
              ? 'bg-primary/20'
              : 'bg-transparent group-hover:bg-white/5'
              }`}>
              <span className={`material-symbols-outlined text-2xl transition-all duration-300 ${item.active
                ? 'filled text-primary'
                : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                {item.icon}
              </span>
            </div>

            {/* Label */}
            <span className={`text-[10px] font-bold relative z-10 transition-all duration-300`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderGlobalModals = () => (
    <>
      <AddVehicleModal
        isOpen={showAddVehicleModal}
        onClose={() => {
          setShowAddVehicleModal(false);
          setEditingVehicle(null); // Clear editing state on close
        }}
        onSave={(data, image) => handleAddSavedVehicle(data, image)}
        onDelete={() => {
          if (editingVehicle) {
            handleDeleteSavedVehicle(editingVehicle.id);
            setShowAddVehicleModal(false);
            setEditingVehicle(null);
          }
        }}
        vehicleTypes={vehicleTypes}
        initialVehicle={editingVehicle}
      />

      {/* Notifications Modal */}
      {showNotifications && <NotificationList />}

      {/* Chat Modal for specific order */}
      {showOrderChat && viewingOrder && (
        <OrderChat
          orderId={viewingOrder.id}
          currentUserId={user.id}
          currentUserName={user.name}
          otherUserId={viewingOrder.washerId!}
          otherUserName={viewingOrder.washerName || 'Washer'}
          messages={messages}
          sendMessage={sendMessage as any}
          isOpen={showOrderChat}
          onClose={() => {
            setShowOrderChat(false);
            setChatManuallyClosed(true);
          }}
        />
      )}

      {/* Support Chat Modal */}
      {showSupportChat && (
        <SupportChatClient
          currentUser={user}
          onClose={() => setShowSupportChat(false)}
        />
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-surface-dark w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-6">
            <h3 className="font-bold text-lg mb-4">Edit Order</h3>
            <div className="space-y-3">
              <input type="text" value={editingOrder.date} onChange={(e) => setEditingOrder({ ...editingOrder, date: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 h-10 text-white" />
              <input type="text" value={editingOrder.time} onChange={(e) => setEditingOrder({ ...editingOrder, time: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 h-10 text-white" />
              <input type="text" value={editingOrder.address} onChange={(e) => setEditingOrder({ ...editingOrder, address: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 h-10 text-white" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditingOrder(null)} className="flex-1 py-2 rounded-lg bg-white/10">Cancel</button>
              <button onClick={handleSaveClientEdit} className="flex-1 py-2 rounded-lg bg-primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {activeTrackingOrder && (
        <TrackingUI
          activeTrackingOrder={activeTrackingOrder}
          user={user}
          setTrackingOrderId={setTrackingOrderId}
          setShowOrderChat={setShowOrderChat}
          showOrderChat={showOrderChat}
          messages={messages}
          sendMessage={sendMessage}
          updateOrder={updateOrder}
          showNativeToast={showNativeToast}
          submitOrderRating={submitOrderRating}
          navigate={navigate as any}
          packages={packages}
          addons={addons}
        />
      )}

      {/* Profile & Settings Modals */}
      {showEditProfileModal ? (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-dark w-full max-w-md rounded-2xl border border-white/10 p-6">
            <h3 className="font-bold text-xl mb-6">{i18n.t('edit_profile')}</h3>
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-primary" style={{ backgroundImage: `url("${profileData.photo}")` }}></div>
                  <button onClick={handleProfileImageChange} className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark shadow-lg border-2 border-surface-dark">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                  </button>
                  <input type="file" ref={profileInputRef} onChange={handleFilePhotoChange} accept="image/*" className="hidden" />
                </div>
                <p className="text-xs text-slate-400 mt-2">{i18n.t('click_camera')}</p>
              </div>
              <div><label className="text-xs text-slate-400 uppercase font-bold">{i18n.t('full_name')}</label><input type="text" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mt-1 text-white" /></div>
              <div><label className="text-xs text-slate-400 uppercase font-bold">{i18n.t('email_address')}</label><input type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mt-1 text-white" /></div>
              <div><label className="text-xs text-slate-400 uppercase font-bold">{i18n.t('phone_number')}</label><input type="tel" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mt-1 text-white" /></div>
              <div>
                <label className="text-xs text-slate-400 uppercase font-bold">Home Address</label>
                <textarea value={profileData.address || ''} onChange={e => setProfileData({ ...profileData, address: e.target.value })} placeholder="Enter your full address..." rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mt-1 text-white resize-none" />
              </div>
              <button onClick={handleSaveProfile} style={{ backgroundColor: '#3b82f6' }} className="w-full hover:brightness-90 h-12 rounded-xl font-bold mt-4 text-white shadow-blue transition-all">{i18n.t('save_changes')}</button>
              <button onClick={() => setShowEditProfileModal(false)} className="w-full text-slate-400 py-2">{i18n.t('cancel')}</button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Address Management Modal */}
      {showAddressModal ? (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-dark w-full max-w-md rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl">My Addresses</h3>
              <button onClick={() => setShowAddressModal(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="space-y-3 mb-6">
              {(addresses || []).map(addr => (
                <div key={addr.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">{addr.icon || 'location_on'}</span>
                    <div>
                      <p className="font-bold">{addr.label || addr.name || 'Address'}</p>
                      <p className="text-sm text-slate-400">{addr.address}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowAddAddressModal(true)} className="w-full bg-primary h-12 rounded-xl font-bold flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">add</span> Add New Address
            </button>
          </div>
        </div>
      ) : null}

      {/* Claim Modal */}
      {showClaimModal ? (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-dark w-full max-w-md rounded-2xl border border-white/10 p-6">
            <h3 className="font-bold text-xl mb-4 text-red-400 flex items-center gap-2"><span className="material-symbols-outlined">report_problem</span> Report an Issue</h3>
            <textarea value={claimDescription} onChange={e => setClaimDescription(e.target.value)} placeholder="Describe the problem..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mb-4 text-white h-32 resize-none" />
            <div className="flex gap-3">
              <button onClick={() => setShowClaimModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:bg-white/5">Cancel</button>
              <button onClick={submitClaim} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600">Submit Claim</button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Loyalty Program Modal */}
      {showLoyaltyModal ? (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-dark w-full max-w-md rounded-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface-dark border-b border-white/10 p-4 flex justify-between items-center z-10">
              <h3 className="font-bold text-xl">Loyalty Program</h3>
              <button onClick={() => setShowLoyaltyModal(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-4">
              <LoyaltyProgram userId={user?.id || ''} />
            </div>
          </div>
        </div>
      ) : null}

      {/* Styled Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirm}
        confirmText="Proceed"
        cancelText="Cancel"
        type={confirmModal.type}
      />
    </>
  );

  // CLIENT_HOME Screen
  if (screen === Screen.CLIENT_HOME) {
    const activeOrder = orders.find(o => ['Pending', 'Assigned', 'En Route', 'Arrived', 'In Progress'].includes(o.status));

    return (
      <div className="flex flex-col h-full bg-background-dark text-white">
        {renderGlobalModals()}
        <div className="flex-1 overflow-y-auto p-4 pb-24">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-slate-400 text-sm">Welcome back,</p>
              <h1 className="text-2xl font-bold">{(profileData.name || '').split(' ')[0] || 'User'}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(Screen.CLIENT_PROFILE)} className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white/10" style={{ backgroundImage: `url("${profileData.photo}")` }}></button>
            </div>
          </div>

          {/* Weather Widget */}
          <div className="bg-gradient-to-br from-blue-600/20 via-cyan-500/20 to-teal-500/20 rounded-2xl p-6 border border-cyan-500/30 mb-8 relative overflow-hidden shadow-2xl backdrop-blur-sm">
            {/* Animated Background Effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-cyan-400 font-bold mb-1 text-sm uppercase tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                    Current Weather
                  </p>
                  <h2 className="text-5xl font-black text-white mb-1 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{weather ? `${weather.temp}°C` : '--°C'}</h2>
                  <p className="text-cyan-300 capitalize font-medium">{weather ? weather.description : 'Loading...'}</p>
                </div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/30 flex items-center justify-center border-2 border-cyan-400/40 shadow-lg shadow-cyan-500/30 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-5xl text-cyan-300">
                    {weather ? weather.icon : 'routine'}
                  </span>
                </div>
              </div>

              {weather?.recommendation && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-sm text-white/90 italic font-medium">
                    "{weather.recommendation}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <h2 className="font-bold text-lg mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => {
                triggerNativeHaptic();
                setTempSelectedVehicles([]); // Reset selection
                navigate(Screen.CLIENT_VEHICLE);
              }}
              className="bg-surface-dark border border-white/5 p-4 rounded-2xl hover:border-primary/50 transition-all text-left group shadow-lg hover:shadow-primary/5"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary">add</span>
              </div>
              <p className="font-bold text-white">Book a Wash</p>
              <p className="text-xs text-slate-400 mt-1">Schedule service</p>
            </button>
            <button
              onClick={() => { triggerNativeHaptic(); navigate(Screen.CLIENT_GARAGE); }}
              className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-2xl hover:border-purple-500/40 transition-all text-left group shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-purple-400">directions_car</span>
              </div>
              <p className="font-bold text-white group-hover:text-purple-200 transition-colors">My Garage</p>
              <p className="text-xs text-purple-400/60 mt-1">{(vehicles || []).length} Vehicles</p>
            </button>
          </div>

          {/* Active Order Card - Moved here */}

          {/* Active Orders */}
          <h2 className="font-bold text-lg mb-3">Active Orders</h2>
          <div className="space-y-3 mb-6">
            {(() => {
              // Combine Firestore orders with optimistic orders, preventing duplicates
              const activeOrders = [...optimisticOrders, ...orders]
                .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
                .filter(o =>
                  ['Pending', 'Assigned', 'En Route', 'Arrived', 'In Progress'].includes(o.status) &&
                  !successfullyCancelledIds.includes(o.id)
                );
              return activeOrders.map(order => (
                <div key={order.id} className="bg-surface-dark border border-white/10 rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-1 inline-block">{order.status}</span>
                      <h3 className="font-bold text-base">{order.service}</h3>
                      <p className="text-sm text-slate-300">{order.vehicle}</p>
                    </div>
                    <p className="font-bold">${order.price}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      {order.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {order.time}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setTrackingOrderId(order.id)} className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold text-sm shadow-blue hover:scale-[1.02] active:scale-[0.98] transition-all ring-1 ring-white/10">Order Status</button>
                    <button
                      disabled={cancellingOrderId === order.id}
                      onClick={() => {
                        const isAssigned = order.status !== 'Pending';
                        const message = isAssigned
                          ? "A washer has been assigned! Cancelling now will incur a $10.00 cancellation fee charged to your payment method. Do you wish to proceed?"
                          : "Are you sure you want to cancel? No fee will be charged as no washer has been assigned yet.";

                        showConfirm(
                          'Cancel Order',
                          message,
                          async () => {
                            setCancellingOrderId(order.id);
                            try {
                              // OPTIMISTIC UPDATE: Hide immediately
                              setSuccessfullyCancelledIds(prev => [...prev, order.id]);

                              // Also remove from optimistic list if it exists there
                              setOptimisticOrders(prev => prev.filter(o => o.id !== order.id));

                              await cancelOrder(order.id, isAssigned);
                              showToast('Order cancelled.', 'success');
                            } catch (e) {
                              console.error('Cancel failed', e);
                              showToast('Could not cancel order.', 'error');
                              setCancellingOrderId(null);
                              // Revert optimistic update if failed
                              setSuccessfullyCancelledIds(prev => prev.filter(id => id !== order.id));
                            }
                          },
                          'danger'
                        );
                      }}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-bold text-sm hover:bg-red-500/30 transition-colors disabled:opacity-50"
                    >
                      {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ));
            })()}
            {orders.filter(o => ['Pending', 'Assigned', 'En Route', 'Arrived', 'In Progress'].includes(o.status)).length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">No active orders</p>
            )}
          </div>
        </div>



        <BottomNav />
        {renderGlobalModals()}
      </div>
    );
  }

  // CLIENT_BOOKINGS Screen (renamed to History)
  if (screen === Screen.CLIENT_BOOKINGS) {
    const pastOrders = orders.filter(o => ['Completed', 'Cancelled'].includes(o.status));

    return (
      <div className="flex flex-col h-full bg-background-dark text-white">
        <div className="flex-1 overflow-y-auto p-4 pb-24">
          <h1 className="text-2xl font-bold mb-6">History</h1>

          {/* Past Orders */}
          <h2 className="text-sm text-slate-400 uppercase font-bold mb-3">Past Orders</h2>
          <div className="space-y-3">
            {pastOrders.length > 0 ? pastOrders.map(order => (
              <div key={order.id} className="bg-surface-dark border border-white/5 rounded-xl p-4 transition-all hover:bg-white/5">
                <button
                  onClick={() => {
                    setNewOrderDraft({});
                    setViewingOrder(order);
                    navigate(Screen.CLIENT_RATING);
                  }}
                  className="w-full text-left"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold">{order.service}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${order.status === 'Completed' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{order.status}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{order.vehicle}</p>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{order.date}</span>
                    <span className="font-bold text-slate-300">${order.price}</span>
                  </div>
                </button>
                <div className="mt-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleReorder(order)}
                    className="w-full py-2 bg-primary/10 text-primary rounded-lg font-bold text-sm hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">replay</span>
                    Order Again
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-slate-500 text-sm italic">No past orders</p>
            )}

          </div>
        </div>

        <BottomNav />
        {renderGlobalModals()}
      </div>
    );
  }















  // CLIENT_GARAGE Screen
  if (screen === Screen.CLIENT_GARAGE) {
    return (
      <div className="flex flex-col h-full bg-background-dark text-white items-center">
        <div className="w-full max-w-lg flex flex-col h-full relative">
          <header className="flex items-center px-4 py-4 border-b border-white/5">
            <button onClick={() => navigate(Screen.CLIENT_HOME)}><span className="material-symbols-outlined">arrow_back_ios_new</span></button>
            <h1 className="flex-1 text-center font-bold text-lg mr-6">My Garage</h1>
            <button onClick={() => {
              setEditingVehicle(null); // Ensure editingVehicle is null for Add action
              setNewVehicle({ make: '', model: '', year: '', color: '', plate: '', type: 'Sedan' as VehicleType });
              setNewVehicleImage(null);
              setShowAddVehicleModal(true);
            }} className="text-primary"><span className="material-symbols-outlined">add</span></button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-24">
            {(vehicles || []).map(vehicle => (
              <div key={vehicle.id} className="bg-surface-dark rounded-xl overflow-hidden border border-white/5 group">
                <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url("${vehicle.image}")` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-xl font-bold">{vehicle.model}</h3>
                    <p className="text-sm text-slate-300">{vehicle.plate} • {vehicle.color}</p>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditVehicle(vehicle)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 backdrop-blur-md"><span className="material-symbols-outlined text-sm">edit</span></button>
                    <button onClick={() => handleDeleteSavedVehicle(vehicle.id)} className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500/30 backdrop-blur-md"><span className="material-symbols-outlined text-sm">delete</span></button>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center bg-white/5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{vehicle.type}</span>
                  <div className="w-6 h-6 flex items-center justify-center">
                    {(() => {
                      const typeConfig = vehicleTypes.find(t => t.name === vehicle.type);
                      const icon = typeConfig?.icon || 'directions_car';
                      if (icon.includes('/') || icon.includes('.')) {
                        return <img src={icon} alt={vehicle.type} className="w-full h-full object-contain opacity-50" />;
                      }
                      return <span className="material-symbols-outlined text-slate-500">{icon}</span>;
                    })()}
                  </div>
                </div>
              </div>
            ))}

            {(vehicles || []).length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">garage</span>
                <p>Your garage is empty.</p>
                <button onClick={() => setShowAddVehicleModal(true)} className="mt-4 text-primary font-bold">Add a Vehicle</button>
              </div>
            )}
          </div>

          <BottomNav />

          {/* PAYMENT: PaymentModal Component
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handleAddCardSuccess}
          />
          */}

          {renderGlobalModals()}
        </div>
      </div>
    );
  }

  if (screen === Screen.CLIENT_PROFILE) {
    return (
      <div className="flex flex-col h-full bg-background-dark text-white relative">
        <div className="flex-1 overflow-y-auto p-4 pb-32">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{i18n.t('profile')}</h1>
          </div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-primary" style={{ backgroundImage: `url("${profileData.photo}")` }}></div>
            <div>
              <h2 className="font-bold text-lg">{profileData.name}</h2>
              <p className="text-slate-400">{profileData.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button onClick={() => setShowEditProfileModal(true)} className="w-full bg-surface-dark p-4 rounded-xl flex items-center justify-between border border-white/5 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><span className="material-symbols-outlined text-slate-400">person</span> <span>{i18n.t('edit_profile')}</span></div>
              <span className="material-symbols-outlined text-slate-500">chevron_right</span>
            </button>
            <button onClick={() => navigate(Screen.CLIENT_GARAGE)} className="w-full bg-surface-dark p-4 rounded-xl flex items-center justify-between border border-white/5 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><span className="material-symbols-outlined text-slate-400">garage</span> <span>{i18n.t('my_garage')}</span></div>
              <span className="material-symbols-outlined text-slate-500">chevron_right</span>
            </button>
            <div className="w-full bg-surface-dark p-4 rounded-xl flex items-center justify-between border border-white/5 opacity-60 cursor-not-allowed">
              <div className="flex items-center gap-3"><span className="material-symbols-outlined text-slate-400">credit_card</span> <span>{i18n.t('payment_methods')}</span></div>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg font-bold border border-blue-500/30">Coming Soon</span>
            </div>
            <button onClick={() => setShowAddressModal(true)} className="w-full bg-surface-dark p-4 rounded-xl flex items-center justify-between border border-white/5 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><span className="material-symbols-outlined text-slate-400">location_on</span> <span>{i18n.t('my_addresses')}</span></div>
              <span className="material-symbols-outlined text-slate-500">chevron_right</span>
            </button>



            {/* Loyalty Program Button */}
            <button onClick={() => setShowLoyaltyModal(true)} className="w-full bg-gradient-to-r from-amber-500/10 to-purple-500/10 p-4 rounded-xl flex items-center justify-between border border-amber-500/30 hover:border-amber-500/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-400">stars</span>
                <div className="text-left">
                  <span className="font-bold text-white">{i18n.t('loyalty_program')}</span>
                  <p className="text-xs text-slate-400">{i18n.t('loyalty_desc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-amber-500/20 px-2 py-1 rounded-lg text-amber-500 text-[10px] font-black border border-amber-500/20">
                  {(user?.loyaltyPoints || 0)} {(user?.loyaltyPoints === 1 ? 'WASH' : 'WASHES')}
                </div>
                <span className="material-symbols-outlined text-amber-400">chevron_right</span>
              </div>
            </button>

            {/* Contact Support Button */}
            <button onClick={() => setShowSupportChat(true)} className="w-full bg-surface-dark p-4 rounded-xl flex items-center justify-between border border-white/5 mt-6 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">support_agent</span> <span className="text-primary font-bold">{i18n.t('contact_support')}</span></div>
              <span className="material-symbols-outlined text-primary">chevron_right</span>
            </button>

            {/* Join Team Button */}
            <button onClick={() => navigate(Screen.WASHER_REGISTRATION)} className="w-full bg-surface-dark p-4 rounded-xl flex items-center justify-between border border-white/5 mt-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-green-400">work</span>
                <span className="font-bold text-white">{i18n.t('join_team')}</span>
              </div>
              <span className="material-symbols-outlined text-slate-500">chevron_right</span>
            </button>

            {/* Manual Push Notifications Request */}
            <button
              onClick={() => {
                import('../services/pushNotificationService').then(m => {
                  m.pushNotificationService.requestPermissionsIfNeeded().then(success => {
                    if (success) showToast('Notification permissions requested', 'success');
                    else showToast('Could not enable notifications', 'warning');
                  });
                });
              }}
              className="w-full bg-blue-500/10 p-4 rounded-xl flex items-center justify-between border border-blue-500/20 mt-8 hover:bg-blue-500/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-400">notifications_active</span>
                <div className="text-left">
                  <span className="font-bold text-white">Enable Push Notifications</span>
                  <p className="text-xs text-slate-400">Stay updated with your orders</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-blue-400">chevron_right</span>
            </button>

            {/* Log Out Button - Restored as per user request */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <button
                onClick={() => showConfirm('Logout', 'Are you sure you want to log out?', logout)}
                className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-all border border-red-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                    <span className="material-symbols-outlined">logout</span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-red-500">Log Out</div>
                    <div className="text-xs text-white/40">Securely sign out of your account</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-white/20">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        <BottomNav />
        {renderGlobalModals()}
      </div>
    );
  }


  // CLIENT_BOOKINGS Screen (History)
  if ((screen as any) === Screen.CLIENT_BOOKINGS) {
    const historicalOrders = orders.filter(o => ['Completed', 'Cancelled'].includes(o.status))
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    return (
      <div className="flex flex-col h-full bg-background-dark text-white">
        <header className="flex items-center px-4 py-4 border-b border-white/5 bg-surface-dark/50 backdrop-blur-md sticky top-0 z-30">
          <button onClick={() => navigate(Screen.CLIENT_HOME)}><span className="material-symbols-outlined text-slate-400">arrow_back_ios_new</span></button>
          <h1 className="flex-1 text-center font-bold text-lg mr-6">Order History</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
          {historicalOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 opacity-60">
              <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">history_toggle_off</span>
              <p className="text-slate-400 font-medium">No past orders found.</p>
              <p className="text-xs text-slate-500 mt-2">Your completed and cancelled orders will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {historicalOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => {
                    setViewingOrder(order);
                    navigate(Screen.CLIENT_RATING);
                  }}
                  className="bg-surface-dark border border-white/5 rounded-2xl p-4 active:scale-[0.98] transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${order.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        <span className="material-symbols-outlined">{order.status === 'Completed' ? 'check_circle' : 'cancel'}</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm">{order.service || (order.vehicleConfigs && order.vehicleConfigs.length > 1 ? `${order.vehicleConfigs.length} Vehicles` : 'Custom Service')}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                          {new Date(order.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-white">${(order.price || 0).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px]">
                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      <span className="truncate max-w-[150px]">{order.address?.split(',')?.[0] || 'Address'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.clientRating && (
                        <div className="flex items-center gap-0.5 text-amber-500">
                          <span className="material-symbols-outlined text-[10px] filled">star</span>
                          <span className="font-bold">{order.clientRating}</span>
                        </div>
                      )}
                      <span className={`px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${order.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    );
  }


  // CLIENT_RATING Screen (Also serves as Order Details)
  if (screen === Screen.CLIENT_RATING) {
    const orderToView = viewingOrder || orders.find(o => o.status === 'Completed' && !o.clientRating);

    if (!orderToView) {
      return (
        <div className="flex flex-col h-full bg-background-dark text-white items-center justify-center p-4">
          <p>No order details found.</p>
          <button onClick={() => navigate(Screen.CLIENT_HOME)} className="mt-4 text-primary">Go Home</button>
        </div>
      );
    }

    const actualSubtotal = orderToView.basePrice || orderToView.price || 0;
    const discountAmountTotal = orderToView.discountAmount || 0;
    const finalBillTotal = orderToView.price || 0;
    const isRated = !!(orderToView.clientRating);
    const existingTip = orderToView.tip || 0;

    // State for rating flow - Initialize with existing or defaults
    // Note: detailed state management is lifted up to ClientScreens logic if needed, but local state works for this form
    // PAYMENT: Tip removed, total is just the base price
    const totalWithTip = finalBillTotal;

    const handleTipSelect = (pct: number) => {
      if (isRated) return;
      const tipAmount = actualSubtotal * pct;
      setCurrentTip(tipAmount);
      setShowCustomTipInput(false);
      setCustomTip('');
    };

    const handleCustomTipChange = (e: any) => {
      if (isRated) return;
      const val = e.target.value;
      setCustomTip(val);
      setCurrentTip(parseFloat(val) || 0);
    };

    const submitRating = async () => {
      console.log('⭐ Submit Rating Clicked');

      if (isRated) {
        console.log('Already rated, navigating home');
        navigate(Screen.CLIENT_BOOKINGS);
        return;
      }

      // Validation: Require rating selection
      if (!currentRating || currentRating === 0) {
        console.log('No rating selected');
        showToast('Please select a rating', 'warning');
        return;
      }

      console.log('Submitting rating:', {
        orderId: orderToView.id,
        rating: currentRating,
        review: clientReviewText,
        tip: currentTip
      });

      // If rating is 4 or less and no comment, encourage but don't require
      if (currentRating < 5 && !clientReviewText.trim()) {
        showToast('Consider leaving a comment to help us improve', 'info');
      }

      try {
        if (!submitOrderRating) {
          console.error('submitOrderRating function is missing!');
          showToast('Internal error: Cannot submit rating', 'error');
          return;
        }


        await submitOrderRating(orderToView.id, {
          clientRating: currentRating,
          clientReview: clientReviewText.trim(),
          tip: 0, // PAYMENT: Tip removed, always 0
          washerId: orderToView.washerId || ''
        });

        console.log('✅ Rating submitted successfully');
        showToast('Thank you for your feedback!', 'success');

        // Reset ALL rating state to prevent blocking
        setRecentlyRatedOrders(prev => [...prev, orderToView.id]); // <--- CRITICAL FIX
        setCurrentRating(0);
        setClientReviewText('');
        setCurrentTip(0);
        setViewingOrder(null);

        // Navigate back to home
        navigate(Screen.CLIENT_HOME);

      } catch (error) {
        console.error('Error submitting rating:', error);
        showToast('Error submitting review. Please try again.', 'error');
      } finally {
        setIsSubmittingRating(false);
      }
    };

    return (
      <div className="fixed inset-0 flex flex-col bg-background-dark text-white z-50 overflow-hidden">
        {/* Custom Header with Logo */}
        <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
          <button onClick={() => navigate(Screen.CLIENT_HOME)}><span className="material-symbols-outlined text-slate-300">arrow_back</span></button>
          <img src="/logo.png" alt="Logo" className="h-8 object-contain drop-shadow-md" />
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-xs text-primary font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-20 pb-32">

          {/* Receipt Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-3 mx-auto">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h1 className="text-xl font-bold mb-1">Service Completed</h1>
            <p className="text-sm text-slate-400">
              {isRated ? 'Thank you for your feedback!' : 'Please review your service'}
            </p>
          </div>

          {/* Professional Receipt Card */}
          <div className="w-full bg-surface-dark rounded-2xl border border-white/10 mb-6 overflow-hidden">
            {/* Receipt Header */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Order ID</p>
                  <p className="text-sm font-mono text-white">{orderToView.id.slice(-8)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Date</p>
                  <p className="text-sm text-white">{new Date(orderToView.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined">local_car_wash</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white mb-1">{orderToView.service}</p>
                  <p className="text-sm text-slate-400">{orderToView.vehicle}</p>
                  {orderToView.vehicleColor && (
                    <p className="text-xs text-slate-500">{orderToView.vehicleColor}</p>
                  )}
                </div>
              </div>

              {/* Add-ons if any */}
              {orderToView.addons && orderToView.addons.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-2">Add-ons</p>
                  {orderToView.addons.map((addon: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm mb-1">
                      <span className="text-slate-300">{addon.name}</span>
                      <span className="text-white">${addon.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Billing Summary */}
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Service</span>
                <span className="text-white">${actualSubtotal.toFixed(2)}</span>
              </div>

              {discountAmountTotal > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-400">Discount</span>
                  <span className="text-green-400">-${discountAmountTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-white/10 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">${finalBillTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Notice */}
              <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-blue-400 text-sm mt-0.5">info</span>
                  <p className="text-xs text-blue-300">
                    <span className="font-bold">Payment due in cash</span> upon service completion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="w-full bg-surface-dark rounded-2xl border border-white/10 p-5 mb-6">
            <h3 className="font-bold text-white mb-4 text-center">Rate Your Experience</h3>

            {/* Rating Stars */}
            <div className="flex justify-center gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => !isRated && setCurrentRating(star)}
                  className={`transition-transform hover:scale-110 disabled:opacity-100 disabled:cursor-default`}
                  disabled={isRated}
                >
                  <span className={`material-symbols-outlined text-4xl ${star <= (currentRating || 0) ? 'text-amber-400 filled' : 'text-slate-600'}`}>
                    star
                  </span>
                </button>
              ))}
            </div>

            {/* Comment Section */}
            {currentRating > 0 && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-sm text-slate-300 mb-2 block">
                  {currentRating < 5 ? 'Tell us what went wrong:' : 'Share your experience (optional):'}
                </label>
                <textarea
                  className="w-full bg-background-dark border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary transition-colors h-24 resize-none"
                  placeholder={currentRating < 5 ? "The washer was..." : "Great service! The washer was..."}
                  value={clientReviewText}
                  onChange={(e) => setClientReviewText(e.target.value)}
                  disabled={isRated}
                />
              </div>
            )}
          </div>

        </div>

        {/* Footer Action */}
        <div className="absolute bottom-0 w-full bg-surface-dark border-t border-white/10 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-20">
          {!isRated && (
            <button
              onClick={submitRating}
              disabled={!currentRating || currentRating === 0}
              className="w-full py-4 bg-primary hover:bg-primary/90 rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          )}
          {isRated && (
            <button onClick={() => navigate(Screen.CLIENT_HOME)} className="w-full py-4 bg-white/10 text-white font-bold rounded-xl">
              Back to Home
            </button>
          )}
        </div>

        {/* Helper Comps */}
        {renderGlobalModals()}
      </div>
    );
  }


  // PAYMENT: CLIENT_PAYMENT Screen - COMMENTED OUT (Payment screen is skipped)
  /*
  if ((screen as any) === Screen.CLIENT_PAYMENT) {
    return (
      <div className="flex flex-col h-full bg-background-dark text-white">
        <header className="flex items-center px-4 py-4 border-b border-white/5">
          <button onClick={() => navigate(Screen.CLIENT_SERVICE_SELECT)}><span className="material-symbols-outlined">arrow_back_ios_new</span></button>
          <h1 className="flex-1 text-center font-bold text-lg mr-6">Payment Method</h1>
        </header>
   
        <div className="flex-1 overflow-y-auto p-4 pb-32">
          <h2 className="text-sm text-slate-400 uppercase font-bold mb-4">Select Payment Method</h2>
   
          <div className="space-y-3 mb-6">
            {(cards || []).map(card => (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${selectedCard === card.id
                  ? 'border-primary bg-primary/10'
                  : 'border-white/10 bg-white/5'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCard === card.id ? 'border-primary' : 'border-slate-500'
                    }`}>
                    {selectedCard === card.id && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                  </div>
                  <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs font-bold">{card.brand}</div>
                  <div className="flex-1 text-left">
                    <p className="font-bold">•••• {card.last4}</p>
                    <p className="text-xs text-slate-400">Expires {card.expiry}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
   
          <button onClick={() => setShowPaymentModal(true)} className="w-full p-4 rounded-xl border-2 border-dashed border-white/20 text-slate-400 hover:border-primary hover:text-primary transition-colors">
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">add</span>
              <span className="font-bold">Add New Card</span>
            </div>
          </button>
        </div>
   
        <div className="absolute bottom-0 w-full bg-surface-dark border-t border-white/5 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            onClick={() => navigate(Screen.CLIENT_CONFIRM)}
            className="w-full h-14 bg-primary rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors"
          >
            Continue to Confirm
          </button>
        </div>
      </div>
    );
  }
  */




  // CLIENT_REPORT_ISSUE Screen
  if (screen === Screen.CLIENT_REPORT_ISSUE) {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState('');

    const handleSubmitIssue = () => {
      if (!subject.trim() || !description.trim()) {
        showToast('Please fill in all fields', 'warning');
        return;
      }

      const issueData: any = {
        clientId: user.id,
        clientName: user.name,
        clientEmail: user.email,
        subject,
        description
      };

      // Only add orderId if it exists
      if (selectedOrderId) {
        issueData.orderId = selectedOrderId;
      }

      createIssue(issueData);

      showToast('Issue reported successfully. We will contact you shortly.', 'success');
      navigate(Screen.CLIENT_PROFILE);
    };

    return (
      <div className="flex flex-col h-full bg-background-dark text-white safe-area-top">
        <header className="flex items-center px-4 py-4 border-b border-white/5">
          <button onClick={() => navigate(Screen.CLIENT_PROFILE)} className="w-10 h-10 flex items-center justify-center -ml-2">
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>
          <h1 className="flex-1 text-center font-bold text-lg mr-8">Report an Issue</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 pb-20">
          <div className="space-y-4">
            <div className="bg-surface-dark p-4 rounded-xl border border-white/5">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Washer late, Quality issue..."
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div className="bg-surface-dark p-4 rounded-xl border border-white/5">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Related Order (Optional)</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              >
                <option value="">Select an order...</option>
                {(orders || []).map(o => (
                  <option key={o.id} value={o.id}>
                    {new Date(o.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()} - {o.vehicleName || 'Vehicle'} ({o.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-surface-dark p-4 rounded-xl border border-white/5">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the issue in detail..."
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-500 min-h-[150px] focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-surface-dark">
          <button
            onClick={handleSubmitIssue}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">send</span>
            Submit Report
          </button>
        </div>
        <BottomNav />
        {renderGlobalModals()}
      </div>
    );
  }

  if ((screen as any) === Screen.CLIENT_VEHICLE) {
    return (
      <>
        {renderGlobalModals()}
        <VehicleSelectionScreen
          vehicles={vehicles}
          tempSelectedVehicles={tempSelectedVehicles}
          setTempSelectedVehicles={setTempSelectedVehicles}
          setVehicleConfigs={setVehicleConfigs}
          setSelectedVehicleIds={setSelectedVehicleIds}
          setCurrentVehicleIndex={setCurrentVehicleIndex}
          navigate={navigate}
          setShowAddVehicleModal={(show) => {
            console.log('🚗 VehicleSelectionScreen: setShowAddVehicleModal called with:', show);
            if (show) {
              console.log('🔄 Resetting editingVehicle to null for new vehicle');
              setEditingVehicle(null); // Reset edit state when opening "Add New"
            }
            setShowAddVehicleModal(show);
          }}
          showToast={showToast}
          onEdit={(vehicle) => {
            console.log('✏️ VehicleSelectionScreen: onEdit called with vehicle:', vehicle);
            handleEditVehicle(vehicle);
          }}
        />
      </>
    );
  }

  // CLIENT_GARAGE Screen
  if ((screen as any) === Screen.CLIENT_GARAGE) {
    return (
      <div className="flex flex-col h-full bg-background-dark text-white">
        {renderGlobalModals()}
        <header className="flex items-center px-4 py-4 border-b border-white/5 bg-surface-dark/50 backdrop-blur-md sticky top-0 z-30">
          <button onClick={() => navigate(Screen.CLIENT_HOME)}><span className="material-symbols-outlined text-slate-400">arrow_back_ios_new</span></button>
          <h1 className="flex-1 text-center font-bold text-lg mr-6">My Garage</h1>
          <button onClick={() => {
            setEditingVehicle(null);
            setShowAddVehicleModal(true);
          }}><span className="material-symbols-outlined text-primary">add</span></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
          {(vehicles || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 opacity-60">
              <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">no_crash</span>
              <p className="text-slate-400 font-medium">Your garage is empty.</p>
              <p className="text-xs text-slate-500 mt-2">Add your first vehicle to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {(vehicles || []).map((v) => (
                <div key={v.id} className="relative group overflow-hidden rounded-2xl bg-surface-dark border border-white/5 shadow-2xl transition-all hover:scale-[1.02] hover:shadow-primary/10 hover:border-primary/30">
                  {/* Vehicle Image / Placeholder */}
                  <div className="aspect-video w-full bg-black/60 relative flex items-center justify-center overflow-hidden">
                    {v.image ? (
                      <img src={v.image} alt={v.model} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      // PREMIUM SVG PLACEHOLDER (No external URLs)
                      <div className="flex flex-col items-center justify-center opacity-20 w-full h-full p-8">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
                          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.29 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 6.5H17.5L18.5 9.5H5.5L6.5 6.5ZM19 17H5V12L5.5 11H18.5L19 12V17Z" fill="currentColor" />
                          <path d="M7.5 16C8.32843 16 9 15.3284 9 14.5C9 13.6716 8.32843 13 7.5 13C6.67157 13 6 13.6716 6 14.5C6 15.3284 6.67157 16 7.5 16Z" fill="currentColor" />
                          <path d="M16.5 16C17.3284 16 18 15.3284 18 14.5C18 13.6716 17.3284 13 16.5 13C15.6716 13 15 13.6716 15 14.5C15 15.3284 15.6716 16 16.5 16Z" fill="currentColor" />
                        </svg>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent"></div>
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-0.5">{v.model}</h3>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-0">{v.make || 'Vehicle'} • {v.color || 'Custom'}</p>

                    <div className="flex justify-between items-end mt-4">
                      <div className="px-3 py-1 rounded bg-white/5 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-slate-400 uppercase">
                        {v.type.replace('_', ' ')}
                      </div>
                      <span className="material-symbols-outlined text-slate-600">garage</span>
                    </div>
                  </div>

                  {/* Edit Action - Full Click */}
                  <button
                    onClick={() => {
                      setEditingVehicle(v);
                      setShowAddVehicleModal(true);
                    }}
                    className="absolute inset-0 z-10"
                  ></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    );
  }

  // CLIENT_SERVICE_SELECT Screen (MISSING - causes blue screen)
  if ((screen as any) === Screen.CLIENT_SERVICE_SELECT) {
    console.log('🎨 Rendering CLIENT_SERVICE_SELECT screen');
    return (
      <ServiceSelectionScreen
        packages={packages}
        packagesError={packagesError}
        addons={addons}
        vehicles={vehicles}
        selectedVehicleIds={selectedVehicleIds}
        currentVehicleIndex={currentVehicleIndex}
        vehicleConfigs={vehicleConfigs}
        setVehicleConfigs={setVehicleConfigs}
        setCurrentVehicleIndex={setCurrentVehicleIndex}
        navigate={navigate}
        showToast={showToast}
      />
    );
  }

  // CLIENT_DATE_TIME Screen
  if ((screen as any) === Screen.CLIENT_DATE_TIME) {
    console.log('🕐 Rendering CLIENT_DATE_TIME screen');
    console.log('📅 States:', { selectedOption, selectedDate, selectedTime });

    try {
      return (
        <DateTimeSelectionScreen
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          navigate={navigate}
          showToast={showToast}
          orders={orders}
          team={team}
        />
      );
    } catch (error) {
      console.error('❌ Error rendering DateTimeSelectionScreen:', error);
      return (
        <div className="flex flex-col h-full bg-background-dark text-white items-center justify-center p-4">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
          <h1 className="text-2xl font-bold mb-2">Error Loading Screen</h1>
          <p className="text-slate-400 text-center mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
          <button
            onClick={() => navigate(Screen.CLIENT_VEHICLE)}
            className="bg-primary px-6 py-3 rounded-xl font-bold"
          >
            Go Back
          </button>
        </div>
      );
    }
  }

  // CLIENT_ADDRESS Screen
  if ((screen as any) === Screen.CLIENT_ADDRESS) {
    console.log('📍 Rendering CLIENT_ADDRESS screen. Addresses:', addresses, 'User Address:', user.address);
    return (
      <AddressSelectionScreen
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        navigate={navigate}
        showToast={showToast}
        savedAddresses={addresses}
        userAddress={user.address}
        onSaveAddress={handleAddAddress}
        onDeleteAddress={handleDeleteAddress}
        serviceArea={serviceArea}
      />
    );
  }

  // PAYMENT: CLIENT_PAYMENT_METHODS Screen - ENTIRE SCREEN COMMENTED OUT
  /*
  if ((screen as any) === Screen.CLIENT_PAYMENT_METHODS) {
    console.log('💳 Rendering PaymentMethodsScreen');
    return (
      <>
        <PaymentMethodsScreen
          savedCards={cards}
          selectedCardId={selectedCard}
          onSelectCard={setSelectedCard}
          onAddCard={() => setShowPaymentModal(true)}
          navigate={navigate}
        />
        {/* Payment Methods Modal (Reused) *\/}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">
            <div className="bg-surface-dark w-full max-w-md rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl">Payment Methods</h3>
                <button onClick={() => setShowPaymentModal(false)}><span className="material-symbols-outlined">close</span></button>
              </div>
              {!showAddCardForm ? (
                <>
                  <div className="space-y-3 mb-6">
                    {(cards || []).map(card => (
                      <div key={card.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs font-bold uppercase">{card.brand}</div>
                          <div>
                            <p className="font-bold">•••• {card.last4}</p>
                            <p className="text-xs text-slate-400">Expires {card.expiry}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteCard(card.id)} className="text-red-400 hover:text-red-300"><span className="material-symbols-outlined">delete</span></button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowAddCardForm(true)} className="w-full bg-primary h-12 rounded-xl font-bold flex items-center justify-center gap-2 text-black"><span className="material-symbols-outlined">add</span> Add New Card</button>
                </>
              ) : (
                <div className="space-y-4">
                  <PaymentModal
                    isOpen={showAddCardForm}
                    onClose={() => setShowAddCardForm(false)}
                    onSuccess={handleAddCardSuccess}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
  */

  // CLIENT_CONFIRM Screen (Order Confirmation)
  if ((screen as any) === Screen.CLIENT_CONFIRM) {
    const handleConfirmOrder = (finalTotal: number, discount?: import('../types').Discount | null) => {
      console.log('✅ handleConfirmOrder CALLED with total:', finalTotal);
      console.log('📍 selectedLocation:', selectedLocation);
      console.log('🏠 selectedAddress:', selectedAddress);

      if (!selectedLocation) {
        console.error('❌ Missing location for order confirmation');
        showToast('Location error: Could not retrieve coordinates. Please re-select the address.', 'error');
        return;
      }

      const finalDate = (selectedOption === 'asap' ? 'Wash Now' : selectedDate) || 'Date Not Selected';
      const finalTime = (selectedOption === 'asap' ? 'Wash Now' : selectedTime) || 'Time Not Selected';

      let totalPrice = selectedOption === 'asap' ? 15 : 0; // Start with Wash Now fee if applicable
      let summaryPackageName = '';

      if ((vehicleConfigs || []).length > 0) {
        (vehicleConfigs || []).forEach(config => {
          const pkg = (packages || []).find(p => p.id === config.packageId);
          if (pkg && pkg.price) {
            const pkgPrice = pkg.price[config.vehicleType] || 0;
            totalPrice += pkgPrice;
            if (!summaryPackageName) summaryPackageName = pkg.name;
          }
          (config.addonIds || []).forEach(addonId => {
            const addon = (addons || []).find(a => a.id === addonId);
            if (addon && addon.price) {
              const addonPrice = addon.price[config.vehicleType] || 0;
              totalPrice += addonPrice;
            }
          });
        });

        if ((vehicleConfigs || []).length > 1) {
          summaryPackageName = `${(vehicleConfigs || []).length} Vehicles`;
        }
      }

      const discountAmount = totalPrice - finalTotal;

      const orderData = {
        vehicleConfigs: vehicleConfigs || [],
        date: finalDate,
        time: finalTime,
        price: finalTotal,
        basePrice: totalPrice,
        discountAmount: discountAmount > 0 ? discountAmount : 0,
        discountCode: discount?.code || '',
        packageName: summaryPackageName || 'Custom Service',
        estimatedDuration: '0 min',
        status: 'Pending' as const,
        address: selectedAddress || 'Address Not Provided',
        location: selectedLocation,
        clientName: user?.name || 'Unknown Client',
        clientId: user?.id || 'unknown_id'
      };

      setIsProcessingOrder(true);
      createOrder(orderData).then(async (docId) => {
        try {
          // 1. INCREMENT DISCOUNT USAGE IF APPLICABLE
          if (discount?.id) {
            console.log('🎟️ Marking discount as used:', discount.code);
            const discountRef = doc(db, 'discounts', discount.id);
            await updateDoc(discountRef, {
              usageCount: increment(1)
            });
          }

          // PAYMENT: 2. PROCESS REAL STRIPE PAYMENT - COMMENTED OUT
          // PAYMENT: const selectedCardData = cards.find(c => c.id === selectedCard) || cards[0];
          // PAYMENT: if (!selectedCardData) {
          // PAYMENT:   throw new Error('No payment method selected');
          // PAYMENT: }
          // PAYMENT:
          // PAYMENT: console.log('💳 Processing Stripe payment for order:', docId);
          // PAYMENT: await StripeService.createPayment(totalPrice, selectedCardData.id, docId);
          // PAYMENT: console.log('✅ Payment processed successfully');

          // PAYMENT DISABLED: Orders are now created without payment processing
          console.log('ℹ️ Payment processing disabled - order created with pending payment status');

          setIsProcessingOrder(false);
          // OPTIMISTIC UPDATE: Add to active orders immediately
          const optimisticOrder: Order = {
            id: docId,
            ...orderData,
            status: 'Pending',
            createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
            vehicleName: orderData.vehicleConfigs[0]?.vehicleType, // Fallback name
            // Legacy fields for compatibility
            vehicle: orderData.vehicleConfigs[0]?.vehicleModel || 'Unknown Vehicle',
            vehicleType: orderData.vehicleConfigs[0]?.vehicleType || 'sedan',
            service: orderData.packageName
          };
          setOptimisticOrders(prev => [optimisticOrder, ...prev]);

          // Clear configs
          setVehicleConfigs([]);
          setTempSelectedVehicles([]);

          navigate(Screen.CLIENT_HOME); // Go to Home to see the "Active Order"
        } catch (paymentErr: any) {
          console.error("Payment failed:", paymentErr);
          // In a real app, you might want to mark the order as "payment_failed" or delete it
          // For now, we inform the user. The order is already created in Firestore with paymentStatus: 'failed' (or unpaid)
          setIsProcessingOrder(false);
          updateOrder(docId, { status: 'Cancelled', cancelReason: `Payment failed: ${paymentErr.message}` });
          showToast(`Payment failed: ${paymentErr.message}. Order cancelled.`, "error");
        }
      }).catch(err => {
        console.error("Order creation failed:", err);
        setIsProcessingOrder(false);
        showToast("Error creating order. Please try again.", "error");
      });
    };

    return (
      <>
        <OrderConfirmationScreen
          packages={packages}
          addons={addons}
          vehicles={vehicles}
          vehicleConfigs={vehicleConfigs}
          selectedOption={selectedOption}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectedAddress={selectedAddress}
          globalFees={globalFees}
          discounts={discounts}
          onConfirmOrder={handleConfirmOrder}
          navigate={navigate}
          showFeesToClient={false}
          // PAYMENT: selectedCard prop commented out
          // PAYMENT: selectedCard={(() => {
          // PAYMENT:   const currentCards = cards || [];
          // PAYMENT:   // Filter invalid cards from fallback source too
          // PAYMENT:   const fallbackCards = (user?.savedCards || []).filter(c => c.id.startsWith('pm_') || c.id.startsWith('card_'));
          // PAYMENT:
          // PAYMENT:   const allCards = currentCards.length > 0 ? currentCards : fallbackCards;
          // PAYMENT:   const cardId = selectedCard || fallbackCards?.[0]?.id;
          // PAYMENT:   return allCards.find(c => c.id === cardId) || allCards[0] || null;
          // PAYMENT: })()}
          // PAYMENT: onAddCard={() => {
          // PAYMENT:   navigate(Screen.CLIENT_PAYMENT_METHODS);
          // PAYMENT: }}
          userId={user.id}
          isProcessing={isProcessingOrder}
        />

        {/* PAYMENT: Payment Modal in CLIENT_CONFIRM - ENTIRE SECTION COMMENTED OUT
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">
            <div className="bg-surface-dark w-full max-w-md rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-white">Payment Methods</h3>
                <button onClick={() => setShowPaymentModal(false)}><span className="material-symbols-outlined text-white">close</span></button>
              </div>
              {!showAddCardForm ? (
                <>
                  <div className="space-y-3 mb-6">
                    {(cards || []).map(card => (
                      <div key={card.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs font-bold text-white uppercase">{card.brand}</div>
                          <div>
                            <p className="font-bold text-white">•••• {card.last4}</p>
                            <p className="text-xs text-slate-400">Expires {card.expiry}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteCard(card.id)} className="text-red-400 hover:text-red-300"><span className="material-symbols-outlined">delete</span></button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowAddCardForm(true)} className="w-full bg-primary h-12 rounded-xl font-bold flex items-center justify-center gap-2 text-black"><span className="material-symbols-outlined">add</span> Add New Card</button>
                </>
              ) : (
                <div className="space-y-4">
                  <PaymentModal
                    isOpen={showAddCardForm}
                    onClose={() => setShowAddCardForm(false)}
                    onSuccess={handleAddCardSuccess}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        */ }
      </>
    );
  }

  console.log('⚠️ No screen matched, returning null. Current screen:', screen);
  return null;
};

export const ClientScreens = ClientContent;


