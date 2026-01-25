
export enum Screen {
  // Auth
  ONBOARDING = 'ONBOARDING',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  RECOVER_PASSWORD = 'RECOVER_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  WASHER_REGISTRATION = 'WASHER_REGISTRATION',

  // Client
  CLIENT_HOME = 'CLIENT_HOME',
  CLIENT_VEHICLE = 'CLIENT_VEHICLE',
  CLIENT_DATE_TIME = 'CLIENT_DATE_TIME',
  CLIENT_ADDRESS = 'CLIENT_ADDRESS',
  CLIENT_SERVICE_SELECT = 'CLIENT_SERVICE_SELECT',
  CLIENT_CONDITION_CHECK = 'CLIENT_CONDITION_CHECK',
  CLIENT_PAYMENT = 'CLIENT_PAYMENT',
  CLIENT_PAYMENT_METHODS = 'CLIENT_PAYMENT_METHODS',
  CLIENT_CONFIRM = 'CLIENT_CONFIRM',
  CLIENT_BOOKINGS = 'CLIENT_BOOKINGS',
  CLIENT_PROFILE = 'CLIENT_PROFILE',
  CLIENT_RATING = 'CLIENT_RATING',
  CLIENT_GARAGE = 'CLIENT_GARAGE',
  CLIENT_REPORT_ISSUE = 'CLIENT_REPORT_ISSUE',
  CLIENT_TRACKING = 'CLIENT_TRACKING',

  // Washer
  WASHER_DASHBOARD = 'WASHER_DASHBOARD',
  WASHER_ORDER_QUEUE = 'WASHER_ORDER_QUEUE',
  WASHER_JOBS = 'WASHER_JOBS',
  WASHER_JOB_DETAILS = 'WASHER_JOB_DETAILS',
  WASHER_EARNINGS = 'WASHER_EARNINGS',
  WASHER_SETTINGS = 'WASHER_SETTINGS',
  WASHER_PROFILE = 'WASHER_PROFILE',

  // Admin
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_TEAM = 'ADMIN_TEAM',
  ADMIN_ANALYTICS = 'ADMIN_ANALYTICS',
  ADMIN_CLIENTS = 'ADMIN_CLIENTS',
  ADMIN_PRICING = 'ADMIN_PRICING',
  ADMIN_PAYROLL = 'ADMIN_PAYROLL',
  ADMIN_DISCOUNTS = 'ADMIN_DISCOUNTS',
  ADMIN_FINANCIAL_REPORTS = 'ADMIN_FINANCIAL_REPORTS',
  ADMIN_WASHER_EARNINGS = 'ADMIN_WASHER_EARNINGS',
  ADMIN_WASHER_HISTORY = 'ADMIN_WASHER_HISTORY',
  ADMIN_APP_EARNINGS = 'ADMIN_APP_EARNINGS',
  ADMIN_TAX_REPORTS = 'ADMIN_TAX_REPORTS',
  ADMIN_SETTINGS = 'ADMIN_SETTINGS',
  ADMIN_ISSUES = 'ADMIN_ISSUES',
  ADMIN_SERVICE_AREA = 'ADMIN_SERVICE_AREA',
  ADMIN_QUOTES = 'ADMIN_QUOTES',
  NATIVE_TEST = 'NATIVE_TEST',
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Assigned' | 'En Route' | 'Arrived' | 'In Progress' | 'Completed' | 'Cancelled';
export type UserRole = 'client' | 'washer' | 'admin';
export type UserStatus = 'Active' | 'Blocked' | 'Offline' | 'On Job' | 'Applicant';

// Vehicle Types for Pricing logic
export type VehicleMainCategory = 'cars_suvs' | 'trucks' | 'rvs' | 'vans' | 'commercial' | 'motorcycles' | 'other';
export type VehicleSize = 'small' | 'medium' | 'large' | 'xlarge' | 'massive';

export interface VehicleTypeConfig {
  id: string;
  name: string;
  icon: string;
  mainCategory: VehicleMainCategory;
  subCategory?: string; // car, suv, pickup, rv, etc.
  size: VehicleSize;
  basePrice: number;
  examples: string[];
  description?: string;
  active: boolean;
  order?: number;
}

export type VehicleType = string;

export interface ServiceFee {
  name: string;
  percentage: number;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: Record<VehicleType, number>; // Price mapping per vehicle type
  description: string;
  duration: string; // e.g. "1h 30m"
  image?: string;
  features?: string[]; // Optional list of features included in the package
  washerCommission?: number; // Legacy: Percentage that goes to washer. If fees are present, this is ignored or used as base.
  appCommission?: number; // Dedicated App Commission %
  fees?: ServiceFee[]; // New: List of fees to deduct from total (e.g. Admin Fee 20%)
}

export interface ServiceAddon {
  id: string;
  name: string;
  price: Record<VehicleType, number>; // Price mapping per vehicle type
  description: string;
  duration: string; // Mandatory
  image?: string;
  washerCommission?: number; // Legacy/Target Payout
  appCommission?: number; // Dedicated App Commission % (e.g. 20)
  fees?: ServiceFee[]; // List of additional fees
}

// Per-vehicle service configuration
export interface VehicleServiceConfig {
  vehicleId: string;
  vehicleModel: string; // for display
  vehicleType: VehicleType; // Added for pricing context
  packageId: string;
  addonIds: string[];
}

export interface Order {
  id: string;
  clientId?: string; // ID of the client who placed the order
  clientPhone?: string;
  clientName: string;
  vehicleId?: string;
  packageId?: string;

  // Per-vehicle configurations (new multi-vehicle support)
  vehicleConfigs?: VehicleServiceConfig[];

  // Legacy single-vehicle fields (for backward compatibility)
  vehicle: string;
  vehicleType: VehicleType; // Added to track pricing basis
  service: string;
  addons?: string[]; // Array of addon names

  date: string;
  time: string;
  address: string;
  price: number;
  basePrice?: number; // Original price before tip (for fee calculations)
  tip?: number;
  status: OrderStatus;
  washerStatus?: 'En Route' | 'Arrived' | 'Working' | 'Completed';
  clientNoShow?: boolean;
  autoCloseTime?: number; // Timestamp for 10-minute auto-close
  paymentStatus?: 'Pending' | 'Paid' | 'Failed';
  displayId?: string; // Sequential ID assigned upon confirmation/assignment
  estimatedArrival?: string; // ETA provided by washer (e.g., "15 min", "20 min")
  washerId?: string;
  washerName?: string;
  createdAt?: any; // Firestore Timestamp
  rating?: number;
  washerRating?: number; // Snapshot of washer's rating
  location?: { lat: number; lng: number; address?: string; }; // For map tracking
  assignedTo?: string; // ID of the washer assigned to this order
  washerAvatar?: string;
  vehicleName?: string;
  vehicleColor?: string;
  washerLocation?: { lat: number; lng: number; }; // For washer tracking
  photos?: {
    before?: string[] | {
      front?: string;
      leftSide?: string;
      rightSide?: string;
      back?: string;
      interiorFront?: string;
      interiorBack?: string;
    };
    after?: {
      front?: string;
      leftSide?: string;
      rightSide?: string;
      back?: string;
      interiorFront?: string;
      interiorBack?: string;
    };
  };
  completedAt?: number; // Timestamp when washer marked as completed
  clientRating?: number; // 1-5 stars from client
  clientReview?: string; // Review text from client
  claim?: { // Client complaint/issue
    description: string;
    image?: string;
    status: 'Open' | 'Resolved';
  };
  discountCode?: string; // Applied discount code
  discountAmount?: number; // Amount discounted
  review?: string; // Washer review (for analytics feedback)
  receiptUrl?: string; // URL to generated receipt (PDF or HTML)
  receiptSentAt?: number; // Timestamp when receipt was emailed
  paymentMethod?: 'stripe' | 'card' | 'apple_pay' | 'google_pay' | 'cash_app' | { last4: string; brand: string } | null; // Payment method used
  stripePaymentMethodId?: string; // ID of the Stripe PaymentMethod used
  authorizedAmount?: number; // Amount authorized (hold)
  capturedAmount?: number; // Amount actually charged (base + tip)
  refundAmount?: number; // Amount refunded
  cancellationFee?: number; // Fee charged for cancellation ($15 if washer assigned)

  // Washer Workflow Fields
  clientAuthorized?: boolean;
  arrivedAt?: number;
  cancelReason?: string;
  waitingForClient?: boolean;
  waitingStartTime?: number; // Timestamp cuando washer llegó
  waitingNotificationsSent?: number[]; // Array de timestamps de notificaciones enviadas
  waitingTimeBlocks?: number; // Número de bloques de 10 min completados (0, 1, 2, 3...)
  waitingCharge?: number; // Cargo total por espera ($10 por cada bloque después del primero)
  waitingChargePerBlock?: number; // Default: $10 por bloque de 10 min
  washerEarnings?: number; // Lo que el washer gana neto (subtotal - fees + tip)
  appRevenue?: number; // Lo que la app gana (suma de fees)

  // Admin Flags
  adminFlag?: boolean;
  adminAlertReason?: string;

  // Financial Breakdown (for tax reporting and transparency)
  // Financial Breakdown (for tax reporting and transparency)
  financialBreakdown?: {
    // Costos base
    servicesSubtotal: number;      // Suma de paquetes + addons
    asapFee: number;               // $10 o $0
    discountAmount: number;        // Descuento aplicado
    subtotalAfterDiscount: number; // Subtotal - descuento

    // Fees aplicados
    fees: {
      name: string;                // "App Commission"
      percentage: number;          // 20
      amount: number;              // Calculado
    }[];
    totalFees: number;             // Suma de fees

    // Total cliente
    clientTotal: number;           // Lo que paga el cliente (sin propina)
    tipAmount: number;             // Propina (puede ser 0)
    grandTotal: number;            // clientTotal + tip

    // Ganancias washer
    washerCommissionRate: number;  // % usado (ej. 40)
    washerBaseEarnings: number;    // Comisión de servicios
    washerTipEarnings: number;     // Propina (100%)
    washerGrossEarnings: number;   // Base + Tips

    // Ganancias app
    appRevenue: number;            // Total de fees

    // Snapshot de configuración
    globalFeesSnapshot: { name: string; percentage: number }[];
    discountCodeSnapshot?: string;
  };
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  userId: string; // ID of the user who receives the notification
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: number;
  linkTo?: Screen; // Optional screen to navigate to
  relatedId?: string; // Optional related ID (e.g., orderId)
}

// Unified User Interface for Auth
export interface User {
  id: string;
  email: string;
  password?: string; // For mock auth purposes
  role: UserRole;
  name: string;
  avatar?: string;
  fcmToken?: string;
}

// Saved Vehicle Structure for Client Profile
export interface SavedVehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  year: string;
  color: string;
  plate?: string;
  isDefault: boolean;
  image?: string | null;
}

export interface WorkingDay {
  day: number; // 0 (Sun) to 6 (Sat)
  enabled: boolean;
  slots: { start: string; end: string }[]; // e.g. [{start: "08:00", end: "17:00"}]
}

export interface ClientUser extends User {
  phone: string;
  address: string;
  savedVehicles?: SavedVehicle[];
  savedAddresses?: Array<{ id: string; label: string; address: string; icon: string }>;
  savedCards?: Array<{ id: string; brand: string; last4: string; expiry: string }>;
  loyaltyPoints?: number;
  claimedMilestones?: number[]; // [5, 10, 15]
  rating?: number;
  cancellationCount?: number;
  status?: 'Active' | 'Blocked';
  nextOrderDiscount?: number;
  nextOrderDiscountReason?: string;

  // Notification Preferences
  notificationPreferences?: {
    weatherAlerts?: boolean;      // Notificaciones de buen clima
    orderUpdates?: boolean;        // Actualizaciones de orden
    promotions?: boolean;          // Promociones y descuentos
    reminders?: boolean;           // Recordatorios de servicio/inactividad
  };

  // Notification Tracking
  lastWeatherNotification?: string;  // Fecha YYYY-MM-DD de última notificación de clima
  lastInactivityReminder?: number;   // Timestamp de último recordatorio de inactividad
}


// Extended interface for Team Members (Washers & Admins)
export interface TeamMember extends User {
  status: UserStatus;
  completedJobs?: number;
  rating?: number;
  phone?: string;
  address?: string;
  // Specific fields for Washers
  driverLicense?: string;
  insuranceNumber?: string;
  vehiclePlate?: string;
  vehicleModel?: string;
  joinedDate: string;
  // Availability tracking (for single-washer mode with travel time buffer)
  schedule?: WorkingDay[];
  submittedAt?: number;
}

// For backward compatibility with existing washer code, we alias Washer to TeamMember
export type Washer = TeamMember;

export interface NavItem {
  label: string;
  icon: string;
  screen: Screen;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  orderId: string; // Links chat to a specific order
  content: string;
  timestamp: number;
  read: boolean;
  type: 'text' | 'image';
}

export interface Conversation {
  orderId: string;
  participants: {
    client: { id: string; name: string; avatar?: string };
    washer: { id: string; name: string; avatar?: string };
  };
  lastMessage?: Message;
  unreadCount: number;
}

// Payment System Types

export interface PayrollPeriod {
  id: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  status: 'open' | 'closed' | 'paid';
  closedDate?: string;
  closedBy?: string; // Admin ID
}

export interface WasherPayment {
  id: string;
  washerId: string;
  washerName: string;
  periodId: string;
  baseEarnings: number;
  tips: number;
  bonuses: number;
  deductions: number;
  totalPaid: number;
  completedJobs: number;
  paidDate: string;
  paidBy: string; // Admin ID
  paidByName: string;
  notes?: string;
  orderIds: string[]; // List of order IDs included in this payment
  paymentMethod?: 'cash' | 'transfer' | 'check' | 'other';
}

export interface Deduction {
  id: string;
  washerId: string;
  washerName: string;
  amount: number;
  type: 'penalty' | 'advance' | 'equipment' | 'insurance' | 'other';
  description: string;
  date: string;
  createdBy: string; // Admin ID
  createdByName: string;
  appliedToPeriodId?: string; // If already applied to a payment
  status: 'pending' | 'applied' | 'cancelled';
}

export interface Bonus {
  id: string;
  washerId: string;
  washerName: string;
  amount: number;
  reason: string;
  date: string;
  createdBy: string; // Admin ID
  createdByName: string;
  appliedToPeriodId?: string;
  status: 'pending' | 'applied' | 'cancelled';
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // Percentage (0-100) or fixed amount
  description: string;
  active: boolean;
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
  usageCount: number;
  applicableTo: 'all' | 'packages' | 'addons' | 'total';
  specificItems?: string[]; // IDs of specific packages/addons
  minimumOrderAmount?: number;
  createdBy: string; // Admin ID
  createdDate: string;
  clientId?: string; // Optional: restrict this discount to a specific client
}

export interface TaxReport {
  id: string;
  year: number;
  generatedAt: number;
  generatedBy: string;

  summary: {
    totalOrders: number;
    grossRevenue: number;
    totalAppFees: number;
    totalWasherPayments: number;
    totalTips: number;
    totalDiscounts: number;
    totalRefunds: number;
  };

  monthlyBreakdown: {
    monthIndex: number;
    month: string;
    orders: number;
    revenue: number;
    appFees: number;
    washerPayments: number;
  }[];

  serviceBreakdown: {
    serviceName: string;
    orderCount: number;
    revenue: number;
  }[];

  washer1099Data: {
    washerId: string;
    washerName: string;
    totalPaid: number;
    orderCount: number;
  }[];

  feeBreakdown: {
    feeName: string;
    totalAmount: number;
  }[];
}

export interface WasherTaxReport {
  id: string;
  washerId: string;
  washerName: string;
  year: number;
  generatedAt: number;

  summary: {
    totalOrders: number;
    baseEarnings: number;
    tips: number;
    bonuses: number;
    deductions: number;
    totalEarnings: number;
  };

  monthlyBreakdown: {
    month: string;
    orders: number;
    commissions: number;
    tips: number;
    total: number;
  }[];

  serviceBreakdown: {
    serviceName: string;
    orderCount: number;
    earnings: number;
  }[];
}

export interface IssueReport {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  clientEmail: string;
  subject: string;
  description: string;
  status: 'Open' | 'Resolved';
  timestamp: number;
  orderId?: string;
  response?: string;
  image?: string;
}

// Service Area Configuration
export interface ServiceArea {
  centerLat: number;
  centerLng: number;
  radiusMiles: number;
  cityName?: string;
}

// Native Android Interface (Window Extension)
export interface AndroidInterface {
  showToast(message: string): void;
  requestLocation(): void;
  vibrate(milliseconds: number): void;
  shareText(text: string, title: string): void;
  showConfirmationDialog(title: string, message: string, callbackName: string): void;
  setUserId(uid: string): void;
  requestFCMToken(): void;
  getUserToken(callback: string): void;
  logout(): void;
}

declare global {
  interface Window {
    Android?: AndroidInterface;
    onLocationReceived?: (lat: number, lng: number) => void;
    onFCMTokenReceived?: (token: string) => void;
    handleDeepLink?: (screen: string, orderId: string) => void;
    onDialogResult?: (confirmed: boolean) => void;
  }
}
