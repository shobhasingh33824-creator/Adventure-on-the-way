import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Heart,
  Moon,
  Sun,
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
  CalendarCheck,
  ChevronDown,
  Sparkles,
  Bell,
  Download,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PushNotificationModal } from './PushNotificationModal';

export const Logo: React.FC<{ className?: string; isLight?: boolean }> = ({
  className = '',
  isLight = false,
}) => {
  const { settings } = useApp();

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Mountain + Road Custom SVG Graphic */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md relative overflow-hidden transition-transform duration-300 hover:scale-105 shrink-0"
        style={{
          background: `linear-gradient(135deg, ${settings.primaryColor} 0%, #173f32 100%)`,
        }}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-7 h-7 text-[#FFF8F0]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mountain Peaks */}
          <path
            d="M8 28L17 12L24 23L27 18L33 28H8Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          {/* Snowcaps */}
          <path
            d="M17 12L19.5 16.5L17 18L14.5 16.5L17 12Z"
            fill="#FFFFFF"
          />
          <path
            d="M27 18L29 21.5L27 22.5L25 21.5L27 18Z"
            fill="#FFFFFF"
          />
          {/* Winding Road through mountains with Sunset Orange accent */}
          <path
            d="M20 23C20 23 18.5 29 11 36H29C23 31 22 25 20 23Z"
            fill="#FF6B35"
          />
          {/* Center Road Dash */}
          <path
            d="M20 26L19 29M20 32L19 35"
            stroke="#FFF8F0"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-poppins font-extrabold text-lg sm:text-xl tracking-tight leading-none ${
            isLight ? 'text-white' : 'text-zinc-900 dark:text-white'
          }`}
        >
          {settings.brandName}
        </span>
        <span
          className={`text-[10px] sm:text-[11px] font-medium tracking-wider uppercase mt-0.5 ${
            isLight ? 'text-zinc-200' : 'text-[#FF6B35] font-semibold'
          }`}
        >
          Live The Adventure
        </span>
      </div>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const {
    darkMode,
    toggleDarkMode,
    currency,
    setCurrency,
    language,
    setLanguage,
    activeTab,
    setActiveTab,
    wishlist,
    currentUser,
    logout,
    setAuthModalOpen,
    t,
    settings,
    showToast,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const { isInstalled, isStandalone, hasNativePrompt, install } = usePWAInstall();

  const handlePWAInstall = async () => {
    if (hasNativePrompt) {
      const outcome = await install();
      if (outcome === 'accepted') {
        showToast('App installed to your device home screen!', 'success');
      }
    } else {
      showToast('To install, open browser menu and tap Add to Home Screen', 'info');
    }
  };

  const navLinks = [
    { id: 'home', label: t('home') },
    { id: 'destinations', label: t('destinations') },
    { id: 'about', label: t('about') },
    { id: 'contact', label: t('contact') },
  ];

  const handleNavClick = (tabId: any) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFF8F0]/90 dark:bg-[#111111]/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer shrink-0"
        >
          <Logo />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative ${
                  isActive
                    ? 'text-white'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60'
                }`}
                style={
                  isActive
                    ? { backgroundColor: settings.primaryColor }
                    : undefined
                }
              >
                {link.label}
              </button>
            );
          })}

          <button
            onClick={() => handleNavClick('admin')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition shadow-2xs"
            title="Super Admin Portal (/admin)"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Switcher */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2 py-1 rounded transition-colors ${
                currency === 'INR'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="Currency: Indian Rupee"
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded transition-colors ${
                currency === 'USD'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="Currency: US Dollar"
            >
              $ USD
            </button>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="hidden sm:inline-flex px-2 py-1 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            title="Toggle Language"
          >
            {language === 'en' ? 'EN / हिंदी' : 'हिंदी / EN'}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-zinc-700" />
            )}
          </button>

          {/* Push Notification / Alerts Bell */}
          <button
            onClick={() => setNotificationModalOpen(true)}
            className="relative p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            title="Trip Alerts & Weather Updates"
            aria-label="Trip alerts"
          >
            <Bell className="w-5 h-5 text-amber-500 hover:text-amber-600 transition" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B35] animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B35]" />
          </button>

          {/* Wishlist Button with Counter */}
          <button
            onClick={() => handleNavClick('user-dashboard')}
            className="relative p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 text-rose-500" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF6B35] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* PWA Install Button (Desktop) */}
          {!isInstalled && !isStandalone && (
            <button
              onClick={() => handlePWAInstall()}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition cursor-pointer"
              title="Install Adventure on the Way App"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Install App</span>
            </button>
          )}

          {/* User Auth or Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-white dark:bg-zinc-900 transition shadow-xs"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-300 dark:border-zinc-600"
                />
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 max-w-[80px] truncate hidden md:inline">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Signed in as
                    </p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {currentUser.email}
                    </p>
                    {currentUser.role === 'admin' && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        <ShieldCheck className="w-3 h-3" /> Administrator
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleNavClick('user-dashboard')}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2.5"
                  >
                    <CalendarCheck className="w-4 h-4 text-[#FF6B35]" />
                    My Bookings & Profile
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Admin Control Panel
                    </button>
                  )}

                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <User className="w-4 h-4 text-[#FF6B35]" />
              <span>{t('loginSignup')}</span>
            </button>
          )}

          {/* Book Now Primary Button */}
          <button
            onClick={() => handleNavClick('destinations')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            style={{ backgroundColor: settings.accentColor }}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('bookNow')}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFF8F0] dark:bg-[#111111] border-b border-zinc-200 dark:border-zinc-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition ${
                  activeTab === link.id
                    ? 'text-white'
                    : 'text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800/80'
                }`}
                style={
                  activeTab === link.id
                    ? { backgroundColor: settings.primaryColor }
                    : undefined
                }
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-semibold text-zinc-500">Language:</span>
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-xs font-bold text-[#FF6B35] underline"
            >
              {language === 'en' ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}
            </button>
          </div>

          <button
            onClick={() => handleNavClick('destinations')}
            className="w-full py-3 rounded-xl text-center text-sm font-bold text-white shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: settings.accentColor }}
          >
            <Compass className="w-4 h-4" />
            <span>Explore All 12+ Adventure Packages</span>
          </button>
        </div>
      )}

      {/* Push Notification Manager Modal */}
      <PushNotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
      />
    </header>
  );
};
