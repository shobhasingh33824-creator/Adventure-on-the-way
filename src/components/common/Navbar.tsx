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
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Circular Brown Emblem Logo from Screenshot (Mountains + Adventure Jeep + Dashed Road) */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden border-2 border-white dark:border-amber-200/80 ring-2 ring-[#3B2314] bg-[#3B2314] transition-transform duration-300 hover:scale-105 shrink-0">
        {settings.logoUrl ? (
          <img
            src={settings.logoUrl}
            alt={settings.brandName}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Dark Brown Circle & White Inner Ring */}
            <circle cx="60" cy="60" r="58" fill="#3B2314" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="60" cy="60" r="52" stroke="#D7B377" strokeWidth="1" strokeOpacity="0.6" />

            {/* Top Arched Text: TOURS & TRAVELS */}
            <path id="topArc" d="M 22,54 A 38,38 0 1,1 98,54" fill="none" />
            <text
              fill="#FFF8F0"
              fontSize="7.5"
              fontWeight="800"
              letterSpacing="1.6"
              textAnchor="middle"
            >
              <textPath href="#topArc" startOffset="50%">
                TOURS &amp; TRAVELS
              </textPath>
            </text>

            {/* Snow-Capped Himalayan Mountains */}
            <polygon points="16,72 42,32 64,72" fill="#5A3821" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="42,32 50,45 44,43 42,48 38,43 34,45" fill="#FFFFFF" />

            <polygon points="44,72 68,28 96,72" fill="#4A2C18" stroke="#FFFFFF" strokeWidth="1.8" />
            <polygon points="68,28 78,44 71,41 68,47 64,41 58,44" fill="#FFFFFF" />

            <polygon points="74,72 92,42 106,72" fill="#5A3821" stroke="#FFFFFF" strokeWidth="1.4" />
            <polygon points="92,42 97,51 92,49 87,51" fill="#FFFFFF" />

            {/* Curved Dashed Mountain Road */}
            <path
              d="M 12 73 Q 60 85 108 73"
              stroke="#23140B"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 12 73 Q 60 85 108 73"
              stroke="#FFFFFF"
              strokeWidth="1.4"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />

            {/* Teal/Green Adventure Jeep with Roof Luggage */}
            <g transform="translate(43, 52)">
              {/* Roof luggage rack */}
              <rect x="6" y="0" width="20" height="5" rx="1.5" fill="#FF6B35" stroke="#FFF" strokeWidth="0.8" />
              <rect x="11" y="-3" width="10" height="3.5" rx="1" fill="#FBBF24" />
              {/* Jeep cabin & body */}
              <path
                d="M4 12 L8 5 L26 5 L30 12 L34 13 L34 20 L2 20 L2 12 Z"
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth="1.2"
              />
              {/* Windshield & windows */}
              <polygon points="9,7 16,7 16,12 6,12" fill="#E0F2FE" />
              <rect x="18" y="7" width="8" height="5" fill="#E0F2FE" />
              {/* Headlights */}
              <circle cx="33" cy="15" r="1.8" fill="#FEF08A" />
              {/* Wheels */}
              <circle cx="9" cy="20" r="4" fill="#111111" stroke="#FFFFFF" strokeWidth="1.2" />
              <circle cx="26" cy="20" r="4" fill="#111111" stroke="#FFFFFF" strokeWidth="1.2" />
            </g>

            {/* Bottom Emblem Banner: ADVENTURE ON THE WAY */}
            <text
              x="60"
              y="95"
              fill="#FFFFFF"
              fontSize="11"
              fontWeight="900"
              fontFamily="Poppins, sans-serif"
              letterSpacing="0.8"
              textAnchor="middle"
            >
              ADVENTURE
            </text>
            <text
              x="60"
              y="104"
              fill="#FBBF24"
              fontSize="6.5"
              fontWeight="800"
              letterSpacing="1.2"
              textAnchor="middle"
            >
              ★ ON THE WAY ★
            </text>
          </svg>
        )}
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase text-[#FF6B35] leading-none truncate">
          OM TRAVELS • HARIDWAR
        </span>
        <span
          className={`font-poppins font-extrabold text-sm sm:text-base lg:text-lg tracking-tight leading-tight truncate ${
            isLight ? 'text-white' : 'text-zinc-900 dark:text-white'
          }`}
        >
          Adventure On The Way
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
    <>
      {/* Slim Non-Sticky Top Contact Bar (Scrolls away naturally so it never blocks the screen) */}
      <div className="bg-[#0B3D2E] text-white text-[11px] py-1.5 px-3 sm:px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Open 24 Hours
            </span>
            <span className="text-white/30">·</span>
            <span className="text-zinc-200">4, Devpura, Haridwar</span>
          </div>
          <div className="flex items-center gap-3 font-semibold">
            <a
              href={settings.callLink || 'tel:+919421709258'}
              className="hover:text-[#FF6B35] transition"
            >
              +91 94217 09258
            </a>
            <span className="text-white/30">·</span>
            <a
              href={settings.secondaryCallLink || 'tel:+918668740237'}
              className="hover:text-[#FF6B35] transition"
            >
              +91 86687 40237
            </a>
          </div>
        </div>
      </div>

      {/* Single-Row Compact Sticky Header (Only ~60px tall on mobile, never wraps) */}
      <header className="sticky top-0 z-40 w-full bg-[#FFF8F0]/95 dark:bg-[#111111]/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer shrink-0 min-w-0"
          >
            <Logo />
          </div>

          {/* Desktop Center Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60'
                  }`}
                  style={isActive ? { backgroundColor: settings.primaryColor } : undefined}
                >
                  {link.label}
                </button>
              );
            })}

            <button
              onClick={() => handleNavClick('admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition cursor-pointer"
              title="Super Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right Action Controls (Single Unwrapped Row) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Currency & Language on Desktop */}
            <div className="hidden md:flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  currency === 'INR'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                    : 'text-zinc-500'
                }`}
              >
                ₹
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                    : 'text-zinc-500'
                }`}
              >
                $
              </button>
            </div>

            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="hidden md:inline-flex px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              {language === 'en' ? 'EN/हिं' : 'हिं/EN'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700" />
              )}
            </button>

            {/* User Auth (Desktop & Tablet) */}
            {currentUser ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 pl-2 pr-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 transition shadow-xs cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 max-w-[70px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl py-2 z-50"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {currentUser.email}
                      </p>
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

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-2"
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
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span>Login</span>
              </button>
            )}

            {/* Primary Book Now CTA Button */}
            <button
              onClick={() => handleNavClick('destinations')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-95 transition cursor-pointer"
              style={{ backgroundColor: settings.accentColor }}
            >
              <span>{t('bookNow')}</span>
            </button>

            {/* Mobile/Tablet Menu Drawer Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Clean Expandable Mobile/Tablet Menu Drawer (All features organized neatly on demand) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFF8F0] dark:bg-[#141417] border-b border-zinc-200 dark:border-zinc-800 px-4 py-4 space-y-4 shadow-2xl max-h-[80vh] overflow-y-auto">
            {/* Navigation Grid */}
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition ${
                    activeTab === link.id
                      ? 'text-white'
                      : 'text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800'
                  }`}
                  style={activeTab === link.id ? { backgroundColor: settings.primaryColor } : undefined}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('user-dashboard')}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-left bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 flex items-center justify-between"
              >
                <span>My Trips & Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#FF6B35] text-white text-[10px]">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNavClick('admin')}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-left bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Portal</span>
              </button>
            </div>

            {/* Quick Preferences & Tools Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                {/* Currency */}
                <button
                  onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                >
                  Currency: {currency === 'INR' ? '₹ INR' : '$ USD'}
                </button>

                {/* Language */}
                <button
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                >
                  {language === 'en' ? 'EN / हिंदी' : 'हिंदी / EN'}
                </button>

                {/* Trip Alerts */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setNotificationModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-amber-600 dark:text-amber-400 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Alerts</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {!isInstalled && !isStandalone && (
                  <button
                    onClick={() => handlePWAInstall()}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Install App</span>
                  </button>
                )}

                {!currentUser ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center gap-1"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Login / Sign Up</span>
                  </button>
                ) : (
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  >
                    Sign Out ({currentUser.name.split(' ')[0]})
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Push Notification Manager Modal */}
        <PushNotificationModal
          isOpen={notificationModalOpen}
          onClose={() => setNotificationModalOpen(false)}
        />
      </header>
    </>
  );
};
