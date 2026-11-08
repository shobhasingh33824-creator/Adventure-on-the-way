import React from 'react';
import { Compass, Heart, Ticket, User as UserIcon, Mountain, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    wishlist,
    bookings,
    currentUser,
    setAuthModalOpen,
  } = useApp();

  const userBookingsCount = currentUser
    ? bookings.filter((b) => b.userId === currentUser.id).length
    : bookings.length;

  const wishlistCount = wishlist.length;

  const handleNav = (tab: 'home' | 'destinations' | 'user-dashboard' | 'admin') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileClick = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
      setActiveTab('user-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBookingsClick = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
      setActiveTab('user-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleWishlistClick = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
      setActiveTab('user-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#071F17]/95 backdrop-blur-xl border-t border-zinc-200 dark:border-emerald-900/60 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] no-print pb-safe"
    >
      <div className="grid grid-cols-6 items-center h-16 max-w-2xl mx-auto px-1">
        {/* 1. Home */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#FF6B35] font-semibold'
              : 'text-zinc-500 dark:text-emerald-200/70 hover:text-zinc-900 dark:hover:text-white'
          }`}
          aria-label="Home"
        >
          <div className="relative">
            <Mountain className="w-5 h-5 stroke-[2.2]" />
            {activeTab === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#FF6B35]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
        </button>

        {/* 2. Explore / Packages */}
        <button
          onClick={() => handleNav('destinations')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'destinations'
              ? 'text-[#FF6B35] font-semibold'
              : 'text-zinc-500 dark:text-emerald-200/70 hover:text-zinc-900 dark:hover:text-white'
          }`}
          aria-label="Explore Tours"
        >
          <div className="relative">
            <Compass className="w-5 h-5 stroke-[2.2]" />
            {activeTab === 'destinations' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#FF6B35]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Packages</span>
        </button>

        {/* 3. My Bookings / Trips */}
        <button
          onClick={handleBookingsClick}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all active:scale-95 cursor-pointer relative ${
            activeTab === 'user-dashboard' && !wishlistCount
              ? 'text-[#FF6B35] font-semibold'
              : 'text-zinc-500 dark:text-emerald-200/70 hover:text-zinc-900 dark:hover:text-white'
          }`}
          aria-label="My Bookings"
        >
          <div className="relative">
            <Ticket className="w-5 h-5 stroke-[2.2]" />
            {userBookingsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#FF6B35] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs">
                {userBookingsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">My Trips</span>
        </button>

        {/* 4. Wishlist */}
        <button
          onClick={handleWishlistClick}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all active:scale-95 cursor-pointer relative ${
            wishlistCount > 0 && activeTab === 'user-dashboard'
              ? 'text-[#FF6B35] font-semibold'
              : 'text-zinc-500 dark:text-emerald-200/70 hover:text-zinc-900 dark:hover:text-white'
          }`}
          aria-label="Saved Wishlist"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 stroke-[2.2] ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Wishlist</span>
        </button>

        {/* 5. Admin Portal (@admin) */}
        <button
          onClick={() => handleNav('admin')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'admin'
              ? 'text-emerald-500 font-bold'
              : 'text-zinc-500 dark:text-emerald-200/70 hover:text-zinc-900 dark:hover:text-white'
          }`}
          aria-label="Admin Portal"
        >
          <div className="relative">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            {activeTab === 'admin' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-emerald-500" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Admin</span>
        </button>

        {/* 6. Profile / Account */}
        <button
          onClick={handleProfileClick}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'user-dashboard'
              ? 'text-[#FF6B35] font-semibold'
              : 'text-zinc-500 dark:text-emerald-200/70 hover:text-zinc-900 dark:hover:text-white'
          }`}
          aria-label={currentUser ? 'User Profile' : 'Sign In'}
        >
          <div className="relative">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-[#FF6B35]"
              />
            ) : (
              <UserIcon className="w-5 h-5 stroke-[2.2]" />
            )}
            {currentUser && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-[#071F17]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight truncate max-w-[52px]">
            {currentUser ? currentUser.name.split(' ')[0] : 'Login'}
          </span>
        </button>
      </div>
    </nav>
  );
};
