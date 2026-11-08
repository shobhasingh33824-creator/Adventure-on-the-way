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
    const cleanId = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check Admin credentials first: ID ( @admin ) PASSWORD ( ADMIN123 )
    if (
      cleanId === '@admin' ||
      cleanId === 'admin' ||
      cleanId === 'admin@adventureontheway.com'
    ) {
      if (
        cleanPass === 'ADMIN123' ||
        cleanPass.toUpperCase() === 'ADMIN123' ||
        cleanPass === 'Admin@123'
      ) {
        login(email, password);
        return;
      } else {
        showToast('Invalid Admin Password! Use ID: @admin and PASSWORD: ADMIN123', 'error');
        return;
      }
    }

    if (!email.trim()) {
      showToast('Please enter your Email or Admin ID (@admin).', 'error');
      return;
    }

    // Trigger OTP flow for customer login
    setShowOtpScreen(true);
    showToast(`OTP sent to ${email}! (Code: ${generatedMockOtp})`, 'info');
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

  const handleFillAdminCredentials = () => {
    setMode('signin');
    setEmail('@admin');
    setPassword('ADMIN123');
    showToast('Admin ID (@admin) & Password (ADMIN123) filled!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in">
      <div
        className="relative w-full max-w-md bg-[#FFF8F0] dark:bg-[#111111] rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setAuthModalOpen(false);
            setShowOtpScreen(false);
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Branding Header */}
        <div className="text-center space-y-1 mb-5">
          <div
            className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg mb-2"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <Sparkles className="w-6 h-6 text-[#FF6B35]" />
          </div>
          <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
            {showOtpScreen
              ? 'Verify Your Account'
              : mode === 'signin'
              ? 'Sign In / Admin Login'
              : 'Join Om Travels'}
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
              <span>
                Security Code: <strong>{generatedMockOtp}</strong>
              </span>
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
              Back to Login
            </button>
          </form>
        ) : (
          /* Normal Sign In / Sign Up Form */
          <div className="space-y-4">
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
                Sign In / Admin
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
                New Traveler
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
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
                  Login ID or Email Address (Admin ID: <span className="text-[#FF6B35]">@admin</span>)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="@admin or explorer@adventure.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Password (Admin Password: <span className="text-emerald-600 dark:text-emerald-400">ADMIN123</span>)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ADMIN123 or your password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 mt-2"
                style={{ backgroundColor: settings.accentColor }}
              >
                <span>{mode === 'signin' ? 'Login Now' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Admin Credentials Quick Fill Box */}
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2 text-xs">
              <div className="font-mono text-[11px]">
                <span className="font-bold text-zinc-700 dark:text-zinc-200">Admin ID: </span>
                <strong className="text-[#FF6B35]">@admin</strong>
                <span className="mx-1.5 text-zinc-400">|</span>
                <span className="font-bold text-zinc-700 dark:text-zinc-200">Pass: </span>
                <strong className="text-emerald-600 dark:text-emerald-400">ADMIN123</strong>
              </div>
              <button
                type="button"
                onClick={handleFillAdminCredentials}
                className="px-2.5 py-1 rounded-lg bg-[#0B3D2E] text-white font-bold text-[10px] shrink-0 hover:opacity-90"
              >
                Auto-Fill
              </button>
            </div>

            {/* Social & Google Login */}
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

            {/* Quick 1-Click Access Bar */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
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
                  <span>Admin (@admin)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
