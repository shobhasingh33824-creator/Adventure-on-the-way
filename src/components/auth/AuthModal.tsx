import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  KeyRound,
  CheckCircle,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    login,
    loginWithGoogle,
    loginAsDemoUser,
    loginAsAdmin,
    settings,
    showToast,
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // OTP Simulation
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const generatedMockOtp = '849201';

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // If regular admin credentials
    if (
      (email.trim().toLowerCase() === 'admin@adventureontheway.com' && password === 'Admin@123') ||
      (email.trim().toLowerCase() === 'admin@adventure.com' && password === 'admin123')
    ) {
      login(email, password);
      return;
    }

    // Trigger OTP flow for real simulation feel
    setShowOtpScreen(true);
    showToast(`Simulation OTP sent to ${email}! (Code: ${generatedMockOtp})`, 'info');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() === generatedMockOtp || otpCode.trim().length >= 4) {
      login(email, password || 'password123');
      setShowOtpScreen(false);
    } else {
      showToast(`Invalid OTP. Use the demo code: ${generatedMockOtp}`, 'error');
    }
  };

  const handleAutoFillOtp = () => {
    setOtpCode(generatedMockOtp);
    showToast('Demo OTP auto-filled!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in">
      <div
        className="relative w-full max-w-md bg-[#FFF8F0] dark:bg-[#111111] rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setAuthModalOpen(false);
            setShowOtpScreen(false);
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Branding Header */}
        <div className="text-center space-y-1 mb-6">
          <div
            className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg mb-3"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <Sparkles className="w-6 h-6 text-[#FF6B35]" />
          </div>
          <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
            {showOtpScreen
              ? 'Verify Your Account'
              : mode === 'signin'
              ? 'Welcome Adventurer'
              : 'Join The Expedition'}
          </h3>
          <p className="text-xs text-zinc-500">
            {showOtpScreen
              ? `We sent a 6-digit login token to ${email}`
              : "Don't Just Travel, Live The Adventure"}
          </p>
        </div>

        {/* OTP Screen */}
        {showOtpScreen ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between">
              <span>Demo Security Code: <strong>{generatedMockOtp}</strong></span>
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="text-xs underline font-bold text-[#FF6B35]"
              >
                Auto-fill Code
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#FF6B35]" />
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                placeholder="• • • • • •"
                className="w-full text-center tracking-widest text-lg font-mono font-bold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
              style={{ backgroundColor: settings.accentColor }}
            >
              <span>Verify & Continue</span>
              <CheckCircle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowOtpScreen(false)}
              className="w-full text-center text-xs text-zinc-500 hover:underline pt-1"
            >
              Back to Email Login
            </button>
          </form>
        ) : (
          /* Normal Sign In / Sign Up Form */
          <div className="space-y-5">
            {/* Mode Tabs */}
            <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800/80 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-2 rounded-lg transition ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 rounded-lg transition ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                New Adventurer
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Rohan Varma"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Phone Number (10 digits)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="explorer@adventure.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 mt-2"
                style={{ backgroundColor: settings.accentColor }}
              >
                <span>{mode === 'signin' ? 'Sign In / Request OTP' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Social & Google Login */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
                <span className="bg-[#FFF8F0] dark:bg-[#111111] px-3 text-zinc-400">
                  Or Instant Sign In With
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-2.5 shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Quick Demo Access Bar */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block text-center">
                Instant Demo Access (1-Click)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={loginAsDemoUser}
                  className="py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 font-bold text-xs transition"
                >
                  👤 Demo Traveler
                </button>
                <button
                  type="button"
                  onClick={loginAsAdmin}
                  className="py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs transition flex items-center justify-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Demo Admin</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
