import React, { useState } from 'react';
import { Screen } from '../types';
import { authService } from '../services/authService';
import { LegalModal } from './LegalComponents';

interface AuthProps {
  screen: Screen;
  navigate: (screen: Screen) => void;
}

// Helper function to translate Firebase errors to user-friendly messages
const getErrorMessage = (error: any): string => {
  const errorCode = error?.code || '';
  const errorMessage = error?.message || '';

  // Check for common Firebase error codes
  if (errorCode.includes('invalid-credential') || errorCode.includes('wrong-password') || errorCode.includes('user-not-found')) {
    return 'Invalid email or password. Please try again.';
  }
  if (errorCode.includes('email-already-in-use')) {
    return 'This email is already registered. Please sign in instead.';
  }
  if (errorCode.includes('weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (errorCode.includes('invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (errorCode.includes('network-request-failed')) {
    return 'Network error. Please check your connection and try again.';
  }
  if (errorCode.includes('too-many-requests')) {
    return 'Too many attempts. Please try again later.';
  }

  // Check error message for Firebase-specific text
  if (errorMessage.toLowerCase().includes('firebase')) {
    return 'An error occurred. Please try again.';
  }

  // Return a generic message if we can't identify the error
  return errorMessage || 'An error occurred. Please try again.';
};

// --- Custom Components ---

const CustomInput = ({ label, type, value, onChange, placeholder }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="mb-5">
      <label className="block text-xs uppercase text-slate-400 font-bold mb-2 ml-1">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 md:p-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all pr-12 text-base min-h-[48px]"
          style={{ fontSize: '16px' }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-xl">
              {showPassword ? 'visibility' : 'visibility_off'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

const CustomButton = ({ children, onClick, disabled, variant = 'primary' }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full min-h-[56px] h-auto py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 touch-manipulation ${disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${variant === 'primary'
        ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20 active:scale-[0.98]'
        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 active:scale-[0.98]'
      }`}
    style={{ fontSize: '18px' }}
  >
    {children}
  </button>
);

// --- Login Screen ---

const LoginScreen = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.login(email, password);
      // Firebase onAuthStateChanged in App.tsx will handle navigation
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark p-6 overflow-y-auto">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-8">
        <div className="mb-8 text-center">
          <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center mx-auto mb-6 overflow-hidden rounded-[2rem]">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-base">Sign in to continue to your dashboard</p>
        </div>

        {error && (
          <div className={`border rounded-xl p-4 mb-6 flex items-start gap-3 ${error.includes('sent') || error.includes('Check your email')
            ? 'bg-green-500/10 border-green-500/20'
            : 'bg-red-500/10 border-red-500/20'
            }`}>
            <span className={`material-symbols-outlined mt-0.5 text-xl ${error.includes('sent') || error.includes('Check your email')
              ? 'text-green-500'
              : 'text-red-500'
              }`}>
              {error.includes('sent') || error.includes('Check your email') ? 'check_circle' : 'error'}
            </span>
            <p className={`text-sm ${error.includes('sent') || error.includes('Check your email')
              ? 'text-green-200'
              : 'text-red-200'
              }`}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <CustomInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
          <CustomInput
            label="Password"
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={() => navigate(Screen.RECOVER_PASSWORD)}
              className="text-sm text-primary font-bold min-h-[44px] px-2 py-2 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <CustomButton disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </CustomButton>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          &copy; 2025 My Carwash App. All rights reserved.
          <br />
          <span className="text-primary font-bold">v5.0 - SEMI TRUCK EDITION 🚛</span>
        </p>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-base">
            Don't have an account?{' '}
            <button onClick={() => navigate(Screen.REGISTER)} className="text-primary font-bold hover:underline min-h-[44px] px-2 py-2 inline-flex items-center">
              Create Account
            </button>
          </p>
        </div>
        <div className="mt-4 text-center">
          <button onClick={() => navigate(Screen.WASHER_REGISTRATION)} className="text-sm text-slate-500 font-medium hover:text-white transition-colors min-h-[44px] px-4 py-2">
            Want to work with us? <span className="underline">Join our Team</span>
          </button>
        </div>
      </div>
      <div className="text-center pb-4">
        <button onClick={() => navigate(Screen.ONBOARDING)} className="text-slate-500 text-sm font-bold flex items-center justify-center gap-1 hover:text-white transition-colors min-h-[44px] px-4 py-2 mx-auto">
          <span className="material-symbols-outlined text-base">arrow_back</span> Back to Home
        </button>
      </div>
    </div>
  );
};

// --- Forgot Password Screen ---

const ForgotPasswordScreen = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!email) {
      setMessage('Please enter your email address');
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      await authService.resetPassword(email);
      setMessage('Password reset email sent! Check your inbox and spam folder.');
      setIsSuccess(true);
    } catch (err: any) {
      setMessage(getErrorMessage(err));
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark p-6 overflow-y-auto">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-8">
        <div className="mb-8 text-center">
          <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center mx-auto mb-6 overflow-hidden rounded-[2rem]">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Forgot Password?</h1>
          <p className="text-slate-400 text-base">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        {message && (
          <div className={`border rounded-xl p-4 mb-6 flex items-start gap-3 ${isSuccess
            ? 'bg-green-500/10 border-green-500/20'
            : 'bg-red-500/10 border-red-500/20'
            }`}>
            <span className={`material-symbols-outlined mt-0.5 text-xl ${isSuccess ? 'text-green-500' : 'text-red-500'
              }`}>
              {isSuccess ? 'check_circle' : 'error'}
            </span>
            <p className={`text-sm ${isSuccess ? 'text-green-200' : 'text-red-200'
              }`}>{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <CustomInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />

          <CustomButton disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </CustomButton>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-base">
            Remember your password?{' '}
            <button onClick={() => navigate(Screen.LOGIN)} className="text-primary font-bold hover:underline min-h-[44px] px-2 py-2 inline-flex items-center">
              Back to Sign In
            </button>
          </p>
        </div>
      </div>
      <div className="text-center pb-4">
        <button onClick={() => navigate(Screen.ONBOARDING)} className="text-slate-500 text-sm font-bold flex items-center justify-center gap-1 hover:text-white transition-colors min-h-[44px] px-4 py-2 mx-auto">
          <span className="material-symbols-outlined text-base">arrow_back</span> Back to Home
        </button>
      </div>
    </div>
  );
};

// --- Register Screen ---

const RegisterScreen = ({ navigate }: { navigate: (s: Screen) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!termsAccepted) {
      setError('You must accept the Terms & Conditions to create an account.');
      setIsLoading(false);
      return;
    }

    try {
      const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;
      const role = authService.isAdminEmail(email) ? 'admin' : 'client';

      await authService.register(email, password, {
        name: `${firstName} ${lastName}`,
        phone: phoneNumber,
        address: fullAddress,
        role
      });

      // Firebase will automatically authenticate the user
      // App.tsx will detect the auth state change and navigate accordingly
      // No need to manually navigate or show success screen

    } catch (err: any) {
      setError(getErrorMessage(err));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark p-6 overflow-y-auto">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="mb-8 text-center pt-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-slate-400">Join us to get the best car wash service</p>
        </div>

        {error && (
          <div className={`border rounded-xl p-4 mb-6 flex items-start gap-3 ${error.includes('created') || error.includes('verify')
            ? 'bg-green-500/10 border-green-500/20'
            : 'bg-red-500/10 border-red-500/20'
            }`}>
            <span className={`material-symbols-outlined mt-0.5 ${error.includes('created') || error.includes('verify')
              ? 'text-green-500'
              : 'text-red-500'
              }`}>
              {error.includes('created') || error.includes('verify') ? 'check_circle' : 'error'}
            </span>
            <p className={`text-sm ${error.includes('created') || error.includes('verify')
              ? 'text-green-200'
              : 'text-red-200'
              }`}>{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="flex gap-3">
            <div className="flex-1">
              <CustomInput
                label="First Name"
                value={firstName}
                onChange={(e: any) => setFirstName(e.target.value)}
                placeholder="John"
              />
            </div>
            <div className="flex-1">
              <CustomInput
                label="Last Name"
                value={lastName}
                onChange={(e: any) => setLastName(e.target.value)}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-slate-400 text-sm font-bold mb-2">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, '');
                if (val.length > 11) val = val.slice(0, 11);
                if (val.length > 0 && val[0] !== '1') val = '1' + val;

                let formatted = '+';
                if (val.length > 0) formatted += val.substring(0, 1);
                if (val.length > 1) formatted += ' (' + val.substring(1, 4);
                if (val.length > 4) formatted += ') ' + val.substring(4, 7);
                if (val.length > 7) formatted += '-' + val.substring(7, 11);

                setPhoneNumber(formatted);
              }}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <label className="block text-slate-400 text-sm font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">location_on</span>
              Service Address
              <span className="text-xs text-slate-500">(To verify coverage)</span>
            </label>

            <div className="mb-3">
              <label className="block text-slate-500 text-xs uppercase font-bold mb-1">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main Street"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-slate-500 text-xs uppercase font-bold mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Houston"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-xs uppercase font-bold mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                  placeholder="TX"
                  maxLength={2}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all text-sm uppercase"
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-slate-500 text-xs uppercase font-bold mb-1">ZIP Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="77001"
                maxLength={5}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all text-sm"
              />
            </div>

            {address.length > 5 && city.length > 2 && zipCode.length === 5 && (
              <div className="mt-3 flex items-center gap-2 text-xs p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                <span className="text-green-400">Service available in your area!</span>
              </div>
            )}
          </div>

          <CustomInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
          <CustomInput
            label="Password"
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
          />

          <div className="mb-6 flex items-start gap-3 p-2">
            <div className="relative flex items-center h-5 mt-1">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-5 h-5 bg-white/5 border border-white/20 rounded focus:ring-primary focus:ring-offset-background-dark text-primary cursor-pointer accent-primary"
              />
            </div>
            <label htmlFor="terms" className="text-sm text-slate-400 select-none cursor-pointer">
              I agree to the{' '}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setShowLegalModal('terms'); }}
                className="text-primary hover:text-white hover:underline font-bold transition-colors"
              >
                Terms & Conditions
              </button>
              {' '}and{' '}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setShowLegalModal('privacy'); }}
                className="text-primary hover:text-white hover:underline font-bold transition-colors"
              >
                Privacy Policy
              </button>
              .
            </label>
          </div>

          <div className="mt-2 mb-6">
            <CustomButton disabled={isLoading || !termsAccepted} onClick={handleRegister}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </CustomButton>
          </div>
        </form>

        <LegalModal
          isOpen={!!showLegalModal}
          onClose={() => setShowLegalModal(null)}
          title={showLegalModal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
          content={showLegalModal === 'terms' ? 'terms' : 'privacy'}
        />

        <div className="text-center">
          <p className="text-slate-400">
            Already have an account?{' '}
            <button onClick={() => navigate(Screen.LOGIN)} className="text-primary font-bold hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
      <div className="text-center pb-4">
        <button onClick={() => navigate(Screen.ONBOARDING)} className="text-slate-500 text-sm font-bold flex items-center justify-center gap-1 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-base">arrow_back</span> Back to Home
        </button>
      </div>
    </div >
  );
};

// --- Onboarding Screen - Carousel with Car Wash Services ---
const carWashSlides = [
  {
    url: "/ceramic_coating.webp",
    title: "Premium Ceramic Coating",
    desc: "Professional nano-ceramic protection that shields your paint from UV rays, dirt, and scratches with a stunning mirror finish"
  },
  {
    url: "/wheel_polish.webp",
    title: "Professional Wheel Detailing",
    desc: "Deep cleaning and polishing of rims, tires, and brake calipers for a showroom-quality shine"
  },
  {
    url: "/paint_restoration.webp",
    title: "Paint Correction & Restoration",
    desc: "Expert buffing and polishing to remove swirl marks, scratches, and oxidation - bringing back your car's original brilliance"
  },
  {
    url: "/interior_detail.webp",
    title: "Complete Interior Detailing",
    desc: "Deep cleaning, conditioning, and protection for seats, carpets, dashboard, and every interior surface"
  }
];

const OnboardingScreen = ({ navigate, onOpenChat }: { navigate: (s: Screen) => void, onOpenChat: () => void }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Auto-rotate carousel every 4.5 seconds (only if auto-rotating is enabled)
  React.useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % carWashSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    setIsAutoRotating(false); // Stop auto-rotation when user manually selects
    // Re-enable auto-rotation after 10 seconds of inactivity
    setTimeout(() => setIsAutoRotating(true), 10000);
  };

  const currentSlide = carWashSlides[activeIndex];

  return (
    <div className="flex flex-col h-full bg-background-dark text-white relative overflow-hidden items-center">
      {/* Auto-Rotating Background Images */}
      {carWashSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-700 pointer-events-none ${index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ backgroundImage: `url("${slide.url}")` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-background-dark z-0"></div>
        </div>
      ))}

      {/* Content Container */}
      <div className="w-full max-w-md h-full flex flex-col items-center relative z-10 px-6 py-12 md:py-8 justify-between">

        {/* Top Section: Small Logo + App Name */}
        <div className="w-full flex flex-col items-center pt-2">
          {/* Logo */}
          <div className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl mb-3 ring-2 md:ring-4 ring-blue-600/40 bg-white">
            <img src="/logo.png" alt="My Carwash app" className="w-full h-full object-contain p-1" />
          </div>

          {/* App Title */}
          <h1 className="text-xl md:text-2xl font-bold text-center tracking-tight text-white/80 drop-shadow-2xl">
            My Carwash app
          </h1>
        </div>

        {/* Middle Section: Prominent Service Information (Takes ~50% of height) */}
        <div className="flex-1 w-full flex flex-col justify-center items-center text-center px-2">
          <p className="text-3xl md:text-4xl font-black text-blue-400 drop-shadow-lg mb-6 transition-all duration-500 leading-tight">
            {currentSlide.title}
          </p>
          <p className="text-lg md:text-2xl text-white drop-shadow-lg leading-relaxed max-w-sm mx-auto transition-all duration-500 opacity-95 font-medium">
            {currentSlide.desc}
          </p>
        </div>

        {/* Bottom Section: Buttons */}
        <div className="w-full flex flex-col items-center">
          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => navigate(Screen.REGISTER)}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl text-white font-bold text-lg transition-all shadow-xl shadow-blue-600/30 active:scale-[0.98] flex items-center justify-center"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate(Screen.LOGIN)}
              className="w-full h-14 bg-slate-800/60 hover:bg-slate-700/60 rounded-2xl text-white font-semibold text-lg transition-all backdrop-blur-md border border-white/5 active:scale-[0.98] flex items-center justify-center"
            >
              I have an account
            </button>
            <button onClick={() => navigate(Screen.WASHER_REGISTRATION)} className="text-sm text-slate-400 font-medium py-3 hover:text-white transition-colors">
              Looking for work? <span className="text-blue-400 underline">Join our Team</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export const AuthScreens: React.FC<AuthProps> = ({ screen, navigate }) => {
  if (screen === Screen.ONBOARDING) {
    return (
      <>
        <OnboardingScreen navigate={navigate} onOpenChat={() => { }} />
      </>
    );
  }

  if (screen === Screen.LOGIN) {
    return (
      <>
        <LoginScreen navigate={navigate} />
      </>
    );
  }

  if (screen === Screen.REGISTER) {
    return (
      <>
        <RegisterScreen navigate={navigate} />
      </>
    );
  }

  if (screen === Screen.RECOVER_PASSWORD) {
    return (
      <>
        <ForgotPasswordScreen navigate={navigate} />
      </>
    );
  }

  return null;
};
