import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TourPackage, Coupon, BookingStatus, DifficultyLevel, TourCategory, ItineraryDay } from '../../types';
import {
  LayoutDashboard,
  MapPin,
  CalendarCheck,
  Users,
  CreditCard,
  Tag,
  Palette,
  Plus,
  Trash2,
  Edit,
  Copy,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Compass,
  ArrowUpRight,
  Save,
  Search,
  Bell,
  Clock,
  ChevronRight,
  Filter,
  BarChart3,
  PieChart,
  Flame,
  Phone,
  Share2,
  Printer,
  Moon,
  Sun,
  X,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    packages,
    addPackage,
    updatePackage,
    deletePackage,
    duplicatePackage,
    togglePackageStatus,
    bookings,
    updateBookingStatus,
    verifyPayment,
    allUsers,
    toggleBlockUser,
    notifications,
    markNotificationRead,
    clearNotifications,
    coupons,
    addCoupon,
    deleteCoupon,
    settings,
    updateSettings,
    formatPrice,
    showToast,
    currentUser,
    loginAsAdmin,
    setActiveTab,
    darkMode,
    toggleDarkMode,
  } = useApp();

  const [currentTab, setCurrentTab] = useState<
    'dashboard' | 'destinations' | 'bookings' | 'payments' | 'users' | 'offers' | 'settings'
  >('dashboard');

  // Search in admin tables
  const [destSearchTerm, setDestSearchTerm] = useState('');
  const [destCategoryFilter, setDestCategoryFilter] = useState<string>('All');
  const [destStatusFilter, setDestStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Notifications dropdown open state
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Timeframe for dashboard chart (7D, 1M, 1Y)
  const [chartTimeframe, setChartTimeframe] = useState<'7D' | '1M' | '1Y'>('1M');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  // ================= Destination Form Modal State =================
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [editingDestId, setEditingDestId] = useState<string | null>(null);

  // Form Fields for Add/Edit Destination
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(14999);
  const [originalPrice, setOriginalPrice] = useState(19999);
  const [days, setDays] = useState(5);
  const [nights, setNights] = useState(4);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Moderate');
  const [category, setCategory] = useState<TourCategory>('Trek');
  const [maxSeats, setMaxSeats] = useState(20);
  const [availableSeats, setAvailableSeats] = useState(12);
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
  ]);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [altitude, setAltitude] = useState('3,200m');
  const [bestSeason, setBestSeason] = useState('May - Oct');
  const [groupSize, setGroupSize] = useState('8 - 14 Travellers');
  const [startEndLocation, setStartEndLocation] = useState('Manali Volvo Station');
  const [highlightsInput, setHighlightsInput] = useState('Stargazing Camp, Scenic High Pass, Bonfire Night');
  const [inclusionsInput, setInclusionsInput] = useState('Breakfast & Dinner, Mountain Guide, Tents, Forest Permits');
  const [exclusionsInput, setExclusionsInput] = useState('Lunch, Personal gear, Travel Insurance');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(true);
  const [isActive, setIsActive] = useState(true);

  // Dynamic Day-by-Day Itinerary Builder
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([
    { day: 1, title: 'Arrival & Acclimatization', description: 'Briefing, orientation hike, and evening welcome dinner.', meals: 'Dinner', stay: 'Heritage Alpine Resort' },
    { day: 2, title: 'Ascent to High Basecamp', description: 'Trek through pine trails and alpine streams into the amphitheater camp.', meals: 'Breakfast, Dinner', stay: 'Alpine Dome Tents' },
    { day: 3, title: 'Summit Push & Sunset Vista', description: 'Early morning climb for panoramic Himalayan sunrise. Celebration bonfire.', meals: 'Breakfast, Dinner', stay: 'Alpine Dome Tents' },
  ]);

  // Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minBookingValue, setMinBookingValue] = useState<number>(5000);
  const [couponDesc, setCouponDesc] = useState('');

  // UI Customizer State
  const [tempSettings, setTempSettings] = useState(settings);

  // Admin access gate check
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-[#0B3D2E] text-white mx-auto flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8 text-[#FF6B35]" />
          </div>
          <div>
            <h2 className="font-poppins font-black text-2xl text-zinc-900 dark:text-white">
              Administrator Access Portal
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Sign in with administrative credentials:
            </p>
            <div className="mt-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-left text-xs space-y-1 font-mono">
              <p>Email: <strong className="text-[#FF6B35]">admin@adventureontheway.com</strong></p>
              <p>Password: <strong className="text-emerald-500">Admin@123</strong></p>
            </div>
          </div>
          <button
            onClick={loginAsAdmin}
            className="w-full py-3.5 rounded-2xl font-bold text-xs text-white shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Launch Super Admin Control Center</span>
          </button>
        </div>
      </div>
    );
  }

  // ================= Analytics Calculations =================
  const confirmedBookings = bookings.filter((b) => b.bookingStatus !== 'Cancelled');
  const allTimeRevenue = confirmedBookings.reduce(
    (sum, b) => sum + (b.advanceAmount || b.totalAmount),
    0
  );

  // Today's Revenue (approx 20% of sample or bookings created today)
  const todayRevenue = Math.round(allTimeRevenue * 0.18);
  // This Month's Revenue
  const monthRevenue = Math.round(allTimeRevenue * 0.72);

  const pendingPaymentsCount = bookings.filter(
    (b) => b.paymentStatus === 'Pending Verification'
  ).length;

  const pendingPaymentsAmount = bookings
    .filter((b) => b.paymentStatus === 'Pending Verification')
    .reduce((sum, b) => sum + (b.advanceAmount || b.totalAmount), 0);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Filtered destinations
  const filteredDestinations = useMemo(() => {
    return packages.filter((pkg) => {
      if (destSearchTerm.trim()) {
        const q = destSearchTerm.toLowerCase();
        const matchTitle = pkg.title.toLowerCase().includes(q);
        const matchLoc = pkg.location.toLowerCase().includes(q);
        if (!matchTitle && !matchLoc) return false;
      }
      if (destCategoryFilter !== 'All' && pkg.category !== destCategoryFilter) {
        return false;
      }
      if (destStatusFilter === 'Active' && pkg.isActive === false) return false;
      if (destStatusFilter === 'Inactive' && pkg.isActive !== false) return false;
      return true;
    });
  }, [packages, destSearchTerm, destCategoryFilter, destStatusFilter]);

  // Destination Form Actions
  const handleOpenAddDestination = () => {
    setEditingDestId(null);
    setTitle('');
    setLocation('Manali, Himachal Pradesh');
    setPrice(14999);
    setOriginalPrice(19999);
    setDays(5);
    setNights(4);
    setDifficulty('Moderate');
    setCategory('Trek');
    setMaxSeats(20);
    setAvailableSeats(14);
    setImageUrls([
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    ]);
    setShortDescription('Glacial waterfalls, alpine pine trails, and stargazing dome camps.');
    setDescription('Curated high mountain route with professional mountaineers, four-season expedition dome tents, and all mountain permits.');
    setAltitude('3,400m');
    setBestSeason('May - Nov');
    setGroupSize('8 - 14 Travellers');
    setStartEndLocation('Manali Basecamp');
    setHighlightsInput('Alpine Stargazing, High Mountain Ridge, Bonfire BBQ Night');
    setInclusionsInput('All hot buffet meals, Certified IMF guide, Alpine tents, Forest permits');
    setExclusionsInput('Airfare, Personal gear rental, Tips');
    setIsFeatured(true);
    setIsBestSeller(true);
    setIsActive(true);
    setItineraryDays([
      { day: 1, title: 'Arrival & Basecamp Briefing', description: 'Check-in, orientation hike, medical check and evening welcome dinner.', meals: 'Dinner', stay: 'Apple Valley Resort' },
      { day: 2, title: 'Trek to Glacier Camp', description: 'Scenic pine forest hike along cascading mountain streams into high meadows.', meals: 'Breakfast, Dinner', stay: 'Swiss Dome Tents' },
      { day: 3, title: 'Summit Push & Sunset Vista', description: 'Early morning climb for panoramic Himalayan sunrise. Celebration bonfire.', meals: 'Breakfast, Dinner', stay: 'Swiss Dome Tents' },
      { day: 4, title: 'Descent to Base Roadhead', description: 'Return hike, souvenir shopping and evening departure.', meals: 'Breakfast' },
    ]);
    setIsDestModalOpen(true);
  };

  const handleOpenEditDestination = (pkg: TourPackage) => {
    setEditingDestId(pkg.id);
    setTitle(pkg.title);
    setLocation(pkg.location);
    setPrice(pkg.price);
    setOriginalPrice(pkg.originalPrice);
    setDays(pkg.days);
    setNights(Math.max(1, pkg.days - 1));
    setDifficulty(pkg.difficulty);
    setCategory(pkg.category);
    setMaxSeats(pkg.maxSeats);
    setAvailableSeats(pkg.availableSeats);
    setImageUrls(pkg.images.length > 0 ? pkg.images : ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200']);
    setShortDescription(pkg.shortDescription);
    setDescription(pkg.description);
    setAltitude(pkg.altitude || '3,000m');
    setBestSeason(pkg.bestSeason);
    setGroupSize(pkg.groupSize);
    setStartEndLocation(pkg.startEndLocation);
    setHighlightsInput(pkg.highlights.join(', '));
    setInclusionsInput(pkg.inclusions.join(', '));
    setExclusionsInput(pkg.exclusions.join(', '));
    setIsFeatured(pkg.featured ?? true);
    setIsBestSeller(pkg.isBestSeller ?? true);
    setIsActive(pkg.isActive !== false);
    setItineraryDays(
      pkg.itinerary && pkg.itinerary.length > 0
        ? pkg.itinerary
        : [
            { day: 1, title: 'Arrival & Briefing', description: 'Orientation and dinner', meals: 'Dinner', stay: 'Base Lodge' },
            { day: 2, title: 'Stage 1 Expedition', description: 'Mountain trail hike', meals: 'Breakfast, Dinner', stay: 'Alpine Tents' },
          ]
    );
    setIsDestModalOpen(true);
  };

  const handleAddItineraryDay = () => {
    const nextDayNum = itineraryDays.length + 1;
    setItineraryDays([
      ...itineraryDays,
      {
        day: nextDayNum,
        title: `Day ${nextDayNum}: Scenic Mountain Trek Stage`,
        description: 'Explore breathtaking high-altitude terrain with our lead guide. Hot meals and debrief.',
        meals: 'Breakfast, Dinner',
        stay: 'Expedition Tents',
      },
    ]);
    setDays(nextDayNum);
    setNights(Math.max(1, nextDayNum - 1));
  };

  const handleRemoveItineraryDay = (index: number) => {
    if (itineraryDays.length <= 1) {
      showToast('Itinerary must have at least 1 day.', 'error');
      return;
    }
    const updated = itineraryDays
      .filter((_, i) => i !== index)
      .map((item, idx) => ({ ...item, day: idx + 1 }));
    setItineraryDays(updated);
    setDays(updated.length);
    setNights(Math.max(1, updated.length - 1));
  };

  const handleItineraryDayChange = (index: number, field: keyof ItineraryDay, value: string) => {
    const updated = [...itineraryDays];
    (updated[index] as any)[field] = value;
    setItineraryDays(updated);
  };

  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();

    const highlightsArr = highlightsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const inclusionsArr = inclusionsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const exclusionsArr = exclusionsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const validImages = imageUrls.filter((url) => url.trim().length > 0);

    const packagePayload = {
      title,
      location,
      state: location.split(',')[1]?.trim() || 'Himachal Pradesh',
      price,
      originalPrice,
      duration: `${days} Days / ${nights} Nights`,
      days,
      difficulty,
      category,
      maxSeats,
      availableSeats,
      images: validImages.length > 0 ? validImages : ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200'],
      shortDescription,
      description,
      altitude,
      bestSeason,
      groupSize,
      startEndLocation,
      highlights: highlightsArr,
      inclusions: inclusionsArr,
      exclusions: exclusionsArr,
      itinerary: itineraryDays,
      featured: isFeatured,
      isBestSeller,
      isActive,
      rating: 4.9,
      reviewCount: 1,
      trending: isFeatured,
    };

    if (editingDestId) {
      updatePackage(editingDestId, packagePayload);
    } else {
      addPackage(packagePayload);
    }

    setIsDestModalOpen(false);
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    addCoupon({
      code: couponCode.trim().toUpperCase(),
      discountType,
      discountValue,
      minBookingValue,
      description: couponDesc || `${discountValue}${discountType === 'percentage' ? '%' : '₹'} off on bookings!`,
      active: true,
    });

    setCouponCode('');
    setCouponDesc('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(tempSettings);
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-[#0c0c0e] text-zinc-900 dark:text-zinc-100 flex flex-col lg:flex-row transition-colors">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="w-full lg:w-72 bg-white dark:bg-[#141417] border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shrink-0 no-print">
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <ShieldCheck className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div>
                <h2 className="font-poppins font-black text-sm tracking-tight text-zinc-900 dark:text-white">
                  Super Admin
                </h2>
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync Active
                </span>
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs font-bold">
            {[
              { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
              { id: 'destinations', label: 'Manage Destinations', icon: MapPin, count: packages.length },
              { id: 'bookings', label: 'Manage Bookings', icon: CalendarCheck, count: bookings.length },
              { id: 'payments', label: 'UPI & Payments', icon: CreditCard, count: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined },
              { id: 'users', label: 'Manage Users', icon: Users, count: allUsers.length },
              { id: 'offers', label: 'Offers & Coupons', icon: Tag, count: coupons.length },
              { id: 'settings', label: 'Theme & Brand Settings', icon: Palette },
            ].map((item) => {
              const Icon = item.icon;
              const isActiveTab = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition ${
                    isActiveTab
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActiveTab ? 'text-[#FF6B35]' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        isActiveTab
                          ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900 font-black'
                          : item.id === 'payments' && pendingPaymentsCount > 0
                          ? 'bg-amber-500 text-white font-bold animate-pulse'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Admin Profile & Return */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-zinc-400 truncate">
                admin@adventureontheway.com
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('home')}
            className="w-full py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-bold text-zinc-700 dark:text-zinc-200 transition flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#FF6B35]" />
            <span>Return to Public Website</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#141417]/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between gap-4 no-print">
          <div>
            <h1 className="font-poppins font-black text-xl text-zinc-900 dark:text-white capitalize">
              {currentTab === 'dashboard' && 'Executive Performance Dashboard'}
              {currentTab === 'destinations' && 'Manage Destinations & Tour Places'}
              {currentTab === 'bookings' && 'Customer Bookings & Manifests'}
              {currentTab === 'payments' && 'UPI & Payment Verifications'}
              {currentTab === 'users' && 'Registered Adventurers & Travelers'}
              {currentTab === 'offers' && 'Promo Offers & Discount Coupons'}
              {currentTab === 'settings' && 'Theme, Brand & Communication Channels'}
            </h1>
            <p className="text-xs text-zinc-400">
              Client Helpline: <strong className="text-zinc-700 dark:text-zinc-200">+91 94217 09258</strong> • UPI: <strong className="text-zinc-700 dark:text-zinc-200">9421709258@upi</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Add Place CTA */}
            <button
              onClick={handleOpenAddDestination}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 hover:opacity-95 transition"
              style={{ backgroundColor: settings.accentColor }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New Place</span>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF6B35] text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-4 z-50 animate-in fade-in space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                      Live Operations Alerts ({notifications.length})
                    </span>
                    <button
                      onClick={clearNotifications}
                      className="text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-zinc-400 text-center py-4">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 rounded-2xl border text-xs cursor-pointer transition ${
                            n.read
                              ? 'bg-zinc-50 dark:bg-zinc-800/40 border-transparent text-zinc-500'
                              : 'bg-amber-500/10 border-amber-500/30 text-zinc-800 dark:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold mb-0.5">
                            <span className={n.read ? 'text-zinc-500' : 'text-[#FF6B35]'}>
                              {n.title}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-normal">{n.time}</span>
                          </div>
                          <p className="text-[11px] leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1 overflow-y-auto">
          {/* ================= SECTION 1: SUPER ADVANCED DASHBOARD ================= */}
          {currentTab === 'dashboard' && (
            <div className="space-y-8">
              {/* TOP CARDS: Revenue, Bookings, Users, Places, Pending */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Today's Revenue */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Today's Revenue</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-poppins font-black text-2xl text-zinc-900 dark:text-white">
                    {formatPrice(todayRevenue)}
                  </h3>
                  <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs yesterday
                  </p>
                </div>

                {/* 2. This Month's Revenue */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">This Month</span>
                    <div className="w-8 h-8 rounded-xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-poppins font-black text-2xl text-zinc-900 dark:text-white">
                    {formatPrice(monthRevenue)}
                  </h3>
                  <p className="text-[10px] text-zinc-400">
                    All-Time: <strong>{formatPrice(allTimeRevenue)}</strong>
                  </p>
                </div>

                {/* 3. Total Bookings */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Bookings</span>
                    <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                      <CalendarCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-poppins font-black text-2xl text-zinc-900 dark:text-white">
                    {bookings.length}
                  </h3>
                  <p className="text-[10px] text-sky-500 font-bold">
                    {confirmedBookings.length} Confirmed departures
                  </p>
                </div>

                {/* 4. Total Destinations */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Places</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-poppins font-black text-2xl text-zinc-900 dark:text-white">
                    {packages.length}
                  </h3>
                  <p className="text-[10px] text-zinc-400">
                    {packages.filter((p) => p.isActive !== false).length} Active Live on Home
                  </p>
                </div>

                {/* 5. Pending Payments */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Pending UPI</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-poppins font-black text-2xl text-amber-500">
                    {pendingPaymentsCount}
                  </h3>
                  <p className="text-[10px] text-amber-600 font-bold">
                    {formatPrice(pendingPaymentsAmount)} awaiting review
                  </p>
                </div>
              </div>

              {/* GRAPHS: Revenue Chart + Bookings per Destination Pie */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Graph */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
                        Revenue Trajectory ({chartTimeframe})
                      </h4>
                      <p className="text-xs text-zinc-400">Income from confirmed expeditions</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-xl text-xs font-semibold">
                        {(['7D', '1M', '1Y'] as const).map((tf) => (
                          <button
                            key={tf}
                            onClick={() => setChartTimeframe(tf)}
                            className={`px-3 py-1 rounded-lg transition ${
                              chartTimeframe === tf
                                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                                : 'text-zinc-500'
                            }`}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setChartType(chartType === 'bar' ? 'line' : 'bar')}
                        className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 text-xs font-bold"
                        title="Toggle Line/Bar chart"
                      >
                        {chartType === 'bar' ? 'Line' : 'Bar'}
                      </button>
                    </div>
                  </div>

                  {/* Interactive Chart Visual */}
                  <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-zinc-100 dark:border-zinc-800">
                    {[
                      { label: 'Week 1', val: 55, rev: '₹1.8L' },
                      { label: 'Week 2', val: 78, rev: '₹3.4L' },
                      { label: 'Week 3', val: 92, rev: '₹4.9L' },
                      { label: 'Week 4', val: 86, rev: '₹4.1L' },
                      { label: 'Today', val: 98, rev: '₹5.6L' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-mono font-bold text-[#FF6B35] opacity-0 group-hover:opacity-100 transition">
                          {item.rev}
                        </span>
                        <div
                          className="w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110"
                          style={{
                            height: `${item.val}%`,
                            backgroundColor: idx === 4 ? settings.accentColor : settings.primaryColor,
                          }}
                        />
                        <span className="text-[11px] font-semibold text-zinc-500">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                    <span>Average per adventurer: ₹17,850</span>
                    <span className="text-emerald-500 font-bold">● High Altitude Season Surge Active</span>
                  </div>
                </div>

                {/* Bookings per Destination (Pie/Donut Chart Simulation) */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
                      Bookings by Destination
                    </h4>
                    <PieChart className="w-4 h-4 text-zinc-400" />
                  </div>

                  {/* Circular Pie Chart SVG */}
                  <div className="relative w-36 h-36 mx-auto">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      {/* Segment 1: Spiti (35%) */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#0B3D2E"
                        strokeWidth="5"
                        strokeDasharray="35 65"
                        strokeDashoffset="0"
                      />
                      {/* Segment 2: Ladakh (28%) */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#FF6B35"
                        strokeWidth="5"
                        strokeDasharray="28 72"
                        strokeDashoffset="-35"
                      />
                      {/* Segment 3: Manali (20%) */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="5"
                        strokeDasharray="20 80"
                        strokeDashoffset="-63"
                      />
                      {/* Segment 4: Kashmir & Others (17%) */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#f59e0b"
                        strokeWidth="5"
                        strokeDasharray="17 83"
                        strokeDashoffset="-83"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-poppins font-black text-lg text-zinc-900 dark:text-white leading-none">
                        {bookings.length}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-semibold uppercase">Trips</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-2 text-xs pt-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0B3D2E]" />
                        <span>Spiti Valley Circuit</span>
                      </span>
                      <span className="font-bold">35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
                        <span>Leh Ladakh Bike Ride</span>
                      </span>
                      <span className="font-bold">28%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Manali Solang Valley</span>
                      </span>
                      <span className="font-bold">20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Kashmir & Honeymoon</span>
                      </span>
                      <span className="font-bold">17%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT BOOKINGS TABLE: Latest 10 Bookings */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
                      Recent Bookings Stream (Latest 10)
                    </h4>
                    <p className="text-xs text-zinc-400">Manage real-time customer registrations</p>
                  </div>

                  <button
                    onClick={() => setCurrentTab('bookings')}
                    className="text-xs font-bold text-[#FF6B35] hover:underline"
                  >
                    View All Bookings →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Booking Ref</th>
                        <th className="p-3.5">Adventurer</th>
                        <th className="p-3.5">Package</th>
                        <th className="p-3.5">Travel Date</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Payment</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {bookings.slice(0, 10).map((b) => (
                        <tr key={b.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                          <td className="p-3.5 font-mono font-bold text-[#FF6B35]">{b.id}</td>
                          <td className="p-3.5">
                            <span className="font-bold text-zinc-900 dark:text-white block">{b.userName}</span>
                            <span className="text-zinc-400 text-[10px]">{b.userPhone}</span>
                          </td>
                          <td className="p-3.5 font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[170px]">
                            {b.packageTitle}
                          </td>
                          <td className="p-3.5 font-mono">{b.travelDate}</td>
                          <td className="p-3.5 font-bold">{formatPrice(b.totalAmount)}</td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                b.paymentStatus === 'Paid'
                                  ? 'bg-emerald-500/10 text-emerald-500'
                                  : 'bg-amber-500/10 text-amber-500'
                              }`}
                            >
                              {b.paymentMethod} ({b.paymentStatus})
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                b.bookingStatus === 'Confirmed'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : b.bookingStatus === 'Cancelled'
                                  ? 'bg-rose-500/10 text-rose-500'
                                  : 'bg-amber-500/10 text-amber-500'
                              }`}
                            >
                              {b.bookingStatus}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                            {b.paymentStatus !== 'Paid' && (
                              <button
                                onClick={() => verifyPayment(b.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700"
                              >
                                Approve UPI
                              </button>
                            )}
                            {b.bookingStatus !== 'Confirmed' && (
                              <button
                                onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                                className="px-2.5 py-1 rounded-lg bg-zinc-900 text-white dark:bg-zinc-700 font-bold text-[10px]"
                              >
                                Confirm
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 2: MANAGE DESTINATIONS / PLACES ================= */}
          {currentTab === 'destinations' && (
            <div className="space-y-6">
              {/* Header Bar with Search & Filters */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
                      Destinations & Tour Packages Catalog
                    </h3>
                    <p className="text-xs text-zinc-500">
                      When you add or edit a place, changes appear <strong>instantly on the Home page & Packages catalog</strong>.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddDestination}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg flex items-center gap-2 hover:opacity-95 transition"
                    style={{ backgroundColor: settings.accentColor }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD NEW PLACE</span>
                  </button>
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="relative">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={destSearchTerm}
                      onChange={(e) => setDestSearchTerm(e.target.value)}
                      placeholder="Search place name or location..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>

                  <select
                    value={destCategoryFilter}
                    onChange={(e) => setDestCategoryFilter(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Trek">Trek</option>
                    <option value="Bike Trip">Bike Trip</option>
                    <option value="Camping">Camping</option>
                    <option value="Expedition">Expedition</option>
                    <option value="Family">Family</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Water Sports">Water Sports</option>
                  </select>

                  <select
                    value={destStatusFilter}
                    onChange={(e) => setDestStatusFilter(e.target.value as any)}
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none"
                  >
                    <option value="All">All Status (Active + Inactive)</option>
                    <option value="Active">Active Only (Visible to Guests)</option>
                    <option value="Inactive">Hidden / Drafts</option>
                  </select>
                </div>
              </div>

              {/* Destinations Table */}
              <div className="rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Place / Tour</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Seats Left</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions (Edit / Duplicate / Hide / Delete)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {filteredDestinations.map((pkg) => {
                        const isLive = pkg.isActive !== false;
                        return (
                          <tr key={pkg.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                            {/* Place Name & Thumbnail */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={pkg.images[0] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=150'}
                                  alt={pkg.title}
                                  className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-poppins font-bold text-sm text-zinc-900 dark:text-white line-clamp-1">
                                      {pkg.title}
                                    </span>
                                    {pkg.isBestSeller && (
                                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                        BESTSELLER
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-zinc-400 text-xs block">
                                    {pkg.location} • {pkg.duration}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Category & Difficulty */}
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-bold text-[11px] block w-fit">
                                {pkg.category}
                              </span>
                              <span className="text-[10px] text-zinc-400 mt-1 block">
                                {pkg.difficulty}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="p-4">
                              <span className="font-poppins font-black text-sm text-zinc-900 dark:text-white block">
                                {formatPrice(pkg.price)}
                              </span>
                              {pkg.originalPrice > pkg.price && (
                                <span className="text-[10px] text-zinc-400 line-through">
                                  {formatPrice(pkg.originalPrice)}
                                </span>
                              )}
                            </td>

                            {/* Seats Left */}
                            <td className="p-4">
                              <span
                                className={`font-mono font-bold text-xs ${
                                  pkg.availableSeats <= 4 ? 'text-rose-500 font-black' : 'text-emerald-500'
                                }`}
                              >
                                {pkg.availableSeats} / {pkg.maxSeats} Left
                              </span>
                              <div className="w-24 bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
                                <div
                                  className="h-full bg-emerald-500"
                                  style={{
                                    width: `${Math.round((pkg.availableSeats / pkg.maxSeats) * 100)}%`,
                                  }}
                                />
                              </div>
                            </td>

                            {/* Status (Active / Inactive Toggle) */}
                            <td className="p-4">
                              <button
                                onClick={() => togglePackageStatus(pkg.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition ${
                                  isLive
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border border-zinc-300 dark:border-zinc-700'
                                }`}
                                title="Click to toggle Active/Inactive"
                              >
                                {isLive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                <span>{isLive ? 'Active' : 'Hidden'}</span>
                              </button>
                            </td>

                            {/* 4 Working Action Buttons: Edit, Duplicate, Hide, Delete */}
                            <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEditDestination(pkg)}
                                className="px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 transition font-bold text-xs"
                                title="Edit this place"
                              >
                                <Edit className="w-3.5 h-3.5 inline mr-1" />
                                Edit
                              </button>

                              {/* Duplicate */}
                              <button
                                onClick={() => duplicatePackage(pkg.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:bg-sky-100 transition font-bold text-xs"
                                title="Duplicate Place"
                              >
                                <Copy className="w-3.5 h-3.5 inline mr-1" />
                                Duplicate
                              </button>

                              {/* Hide / Show */}
                              <button
                                onClick={() => togglePackageStatus(pkg.id)}
                                className={`px-2.5 py-1.5 rounded-xl transition font-bold text-xs ${
                                  isLive
                                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 hover:bg-amber-100'
                                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100'
                                }`}
                                title={isLive ? 'Hide from public catalog' : 'Make visible to public'}
                              >
                                {isLive ? 'Hide' : 'Unhide'}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to permanently delete "${pkg.title}"?`)) {
                                    deletePackage(pkg.id);
                                  }
                                }}
                                className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition"
                                title="Permanently Delete Place"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 3: MANAGE BOOKINGS ================= */}
          {currentTab === 'bookings' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
                    Master Bookings & Passenger Manifest
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Review and confirm guest reservations, manage payments, and generate manifests.
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center gap-1.5 hover:bg-zinc-200"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Passenger Manifest</span>
                </button>
              </div>

              <div className="rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Booking Ref</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Tour Package</th>
                        <th className="p-4">Date & Pax</th>
                        <th className="p-4">Paid / Total</th>
                        <th className="p-4">Payment Method</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                          <td className="p-4 font-mono font-bold text-[#FF6B35]">{b.id}</td>
                          <td className="p-4">
                            <span className="font-bold text-zinc-900 dark:text-white block">{b.userName}</span>
                            <span className="text-zinc-400 text-[10px] block">{b.userPhone}</span>
                            <span className="text-zinc-400 text-[10px] block">{b.userEmail}</span>
                          </td>
                          <td className="p-4 font-semibold text-zinc-800 dark:text-zinc-200 max-w-[170px] truncate">
                            {b.packageTitle}
                          </td>
                          <td className="p-4">
                            <span className="font-mono block">{b.travelDate}</span>
                            <span className="text-[10px] text-zinc-400">{b.adults} Adults {b.children > 0 ? `, ${b.children} Children` : ''}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-black text-zinc-900 dark:text-white block">
                              {formatPrice(b.advanceAmount || b.totalAmount)}
                            </span>
                            {b.balanceAmount > 0 && (
                              <span className="text-[10px] text-amber-500 font-bold block">
                                Due: {formatPrice(b.balanceAmount)}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-bold text-[10px]">
                              {b.paymentMethod}
                            </span>
                            <span className="text-[10px] text-zinc-400 block mt-0.5">
                              {b.transactionId || 'Ref Pending'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                b.bookingStatus === 'Confirmed'
                                  ? 'bg-emerald-500/10 text-emerald-600'
                                  : b.bookingStatus === 'Cancelled'
                                  ? 'bg-rose-500/10 text-rose-600'
                                  : 'bg-amber-500/10 text-amber-600'
                              }`}
                            >
                              {b.bookingStatus}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => {
                                const msg = encodeURIComponent(`Hi ${b.userName}, regarding your expedition booking ${b.id} with Adventure on the Way...`);
                                window.open(`https://wa.me/91${b.userPhone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
                              }}
                              className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                              title="Chat on WhatsApp"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            {b.bookingStatus !== 'Confirmed' && (
                              <button
                                onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px]"
                              >
                                Confirm
                              </button>
                            )}

                            {b.bookingStatus !== 'Cancelled' && (
                              <button
                                onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 font-bold text-[10px]"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 4: MANAGE PAYMENTS & UPI ================= */}
          {currentTab === 'payments' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
                    UPI & Bank Gateway Payment Clearances
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Target UPI ID: <strong className="text-[#FF6B35]">9421709258@upi</strong>. Verify UTR references from PhonePe, Google Pay, and Paytm.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-4">UTR Reference / Trans ID</th>
                        <th className="p-4">Booking Ref</th>
                        <th className="p-4">Adventurer</th>
                        <th className="p-4">Payment Method</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Verification Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                          <td className="p-4 font-mono font-bold text-zinc-900 dark:text-white">
                            {b.transactionId || 'UPI-REF-PENDING'}
                          </td>
                          <td className="p-4 font-mono text-[#FF6B35] font-bold">{b.id}</td>
                          <td className="p-4 font-medium">{b.userName}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-bold">
                              {b.paymentMethod}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-zinc-900 dark:text-white">
                            {formatPrice(b.advanceAmount || b.totalAmount)}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                b.paymentStatus === 'Paid'
                                  ? 'bg-emerald-500/10 text-emerald-600'
                                  : 'bg-amber-500/10 text-amber-500'
                              }`}
                            >
                              {b.paymentStatus}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {b.paymentStatus !== 'Paid' ? (
                              <button
                                onClick={() => verifyPayment(b.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs"
                              >
                                ✓ Verify & Confirm
                              </button>
                            ) : (
                              <span className="text-xs text-emerald-600 font-bold">Verified ✓</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 5: MANAGE USERS ================= */}
          {currentTab === 'users' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs">
                <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
                  User Accounts Directory ({allUsers.length})
                </h3>
                <p className="text-xs text-zinc-500">
                  Manage traveler profiles, permissions, and security block status.
                </p>
              </div>

              <div className="rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Registered Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {allUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.avatar}
                                alt={u.name}
                                className="w-9 h-9 rounded-full object-cover"
                              />
                              <div>
                                <span className="font-bold text-zinc-900 dark:text-white">{u.name}</span>
                                <span className="text-zinc-400 text-[10px] block">{u.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 font-mono">{u.phone}</td>
                          <td className="p-4 text-zinc-400">{u.createdAt}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                u.isBlocked
                                  ? 'bg-rose-500/10 text-rose-600'
                                  : 'bg-emerald-500/10 text-emerald-600'
                              }`}
                            >
                              {u.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => toggleBlockUser(u.id)}
                                className={`px-3 py-1 rounded-xl text-[10px] font-bold transition ${
                                  u.isBlocked
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 hover:bg-rose-100'
                                }`}
                              >
                                {u.isBlocked ? 'Unblock User' : 'Block User'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 6: MANAGE OFFERS & COUPONS ================= */}
          {currentTab === 'offers' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs">
                <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
                  Promotional Coupons & Special Discount Codes
                </h3>
                <p className="text-xs text-zinc-500">
                  Create discount codes for high-altitude expeditions and seasonal sales.
                </p>
              </div>

              {/* Add Coupon Form */}
              <form
                onSubmit={handleAddCoupon}
                className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs grid grid-cols-1 sm:grid-cols-5 gap-3 items-end text-xs"
              >
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. HIMALAYA20"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 font-bold uppercase text-zinc-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat INR (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Discount Value ({discountType === 'percentage' ? '%' : '₹'})
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Min Booking Value (₹)
                  </label>
                  <input
                    type="number"
                    value={minBookingValue}
                    onChange={(e) => setMinBookingValue(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl font-bold text-xs text-white shadow-md flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </form>

              {/* Coupons List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-5 rounded-2xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-base text-[#FF6B35] bg-[#FF6B35]/10 px-2.5 py-1 rounded-md">
                        {c.code}
                      </span>
                      <button
                        onClick={() => deleteCoupon(c.code)}
                        className="text-zinc-400 hover:text-rose-500 transition p-1"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                    </p>
                    <p className="text-[11px] text-zinc-500">{c.description}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      Min booking order: ₹{c.minBookingValue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 7: THEME & BRAND SETTINGS ================= */}
          {currentTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
                    Live UI Customizer & Client Details
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Changes update live in LocalStorage and take immediate effect across public website.
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg flex items-center gap-1.5"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Changes Live</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Palette */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Brand Palette & Visual Theme
                  </h4>

                  <div className="space-y-2">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                      Primary Brand Color (Current: {tempSettings.primaryColor})
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={tempSettings.primaryColor}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, primaryColor: e.target.value })
                        }
                        className="w-12 h-10 rounded-xl cursor-pointer bg-transparent border border-zinc-300 dark:border-zinc-700"
                      />
                      <div className="flex items-center gap-2">
                        {[
                          { name: 'Deep Forest', hex: '#0B3D2E' },
                          { name: 'Alpine Indigo', hex: '#1E293B' },
                          { name: 'Dark Slate', hex: '#0F172A' },
                          { name: 'Desert Ochre', hex: '#854D0E' },
                        ].map((p) => (
                          <button
                            type="button"
                            key={p.hex}
                            onClick={() =>
                              setTempSettings({ ...tempSettings, primaryColor: p.hex })
                            }
                            className="w-6 h-6 rounded-full border-2 border-white shadow-xs"
                            style={{ backgroundColor: p.hex }}
                            title={p.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                      Accent Color (Buttons & Badges: {tempSettings.accentColor})
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={tempSettings.accentColor}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, accentColor: e.target.value })
                        }
                        className="w-12 h-10 rounded-xl cursor-pointer bg-transparent border border-zinc-300 dark:border-zinc-700"
                      />
                      <div className="flex items-center gap-2">
                        {[
                          { name: 'Sunset Orange', hex: '#FF6B35' },
                          { name: 'Golden Sun', hex: '#D97706' },
                          { name: 'Crimson Peak', hex: '#E11D48' },
                          { name: 'Emerald High', hex: '#059669' },
                        ].map((p) => (
                          <button
                            type="button"
                            key={p.hex}
                            onClick={() =>
                              setTempSettings({ ...tempSettings, accentColor: p.hex })
                            }
                            className="w-6 h-6 rounded-full border-2 border-white shadow-xs"
                            style={{ backgroundColor: p.hex }}
                            title={p.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                      Hero Banner Image URL
                    </label>
                    <input
                      type="text"
                      value={tempSettings.heroBannerImage}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, heroBannerImage: e.target.value })
                      }
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Client Contact Details */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Client Details & Payments (Active Everywhere)
                  </h4>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                      Official UPI ID (Displays in QR Code & Checkout)
                    </label>
                    <input
                      type="text"
                      value={tempSettings.upiId}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, upiId: e.target.value })
                      }
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 font-mono font-bold text-[#FF6B35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={tempSettings.contactPhone}
                      onChange={(e) =>
                        setTempSettings({
                          ...tempSettings,
                          contactPhone: e.target.value,
                          whatsappNumber: e.target.value.replace(/[^0-9]/g, ''),
                        })
                      }
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={tempSettings.contactEmail}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, contactEmail: e.target.value })
                      }
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                      Company Tagline
                    </label>
                    <input
                      type="text"
                      value={tempSettings.tagline}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, tagline: e.target.value })
                      }
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}
        </main>
      </div>

      {/* ================= COMPREHENSIVE MODAL: ADD / EDIT DESTINATION ================= */}
      {isDestModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in">
          <div
            className="relative w-full max-w-4xl bg-white dark:bg-[#141417] rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[94vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-poppins font-black text-lg text-zinc-900 dark:text-white">
                  {editingDestId ? 'Edit Destination Package' : 'Create New Destination Package'}
                </h3>
                <p className="text-xs text-zinc-400">
                  Instant real-time update to Home & Tour Packages catalog
                </p>
              </div>

              <button
                onClick={() => setIsDestModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveDestination} className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Place Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Place / Package Name *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Spiti Valley Ultimate 4x4 Circuit"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Location & State *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kaza, Spiti Valley, Himachal Pradesh"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>
              </div>

              {/* Category, Difficulty, Pricing */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 font-bold text-zinc-900 dark:text-white"
                  >
                    <option value="Trek">Trek</option>
                    <option value="Bike Trip">Bike Trip</option>
                    <option value="Camping">Camping</option>
                    <option value="Expedition">Expedition</option>
                    <option value="Family">Family</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Water Sports">Water Sports</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 font-bold text-zinc-900 dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Package Price (₹) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 font-black text-emerald-600 dark:text-emerald-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Discount Strike Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-500"
                  />
                </div>
              </div>

              {/* Duration & Seats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Days</label>
                  <input
                    type="number"
                    value={days}
                    min={1}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Nights</label>
                  <input
                    type="number"
                    value={nights}
                    min={0}
                    onChange={(e) => setNights(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Max Capacity Seats</label>
                  <input
                    type="number"
                    value={maxSeats}
                    onChange={(e) => setMaxSeats(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Seats Available Now</label>
                  <input
                    type="number"
                    value={availableSeats}
                    onChange={(e) => setAvailableSeats(Number(e.target.value))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">
                  Short Tagline Description *
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Paragliding in Solang, river rafting on Beas, and alpine camping near Old Manali."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">
                  Full Detailed Overview
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                />
              </div>

              {/* Images (Multiple Image URLs) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Place Images (High-Resolution URLs)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrls([
                        ...imageUrls,
                        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
                      ])
                    }
                    className="text-xs font-bold text-[#FF6B35] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Image URL</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => {
                          const updated = [...imageUrls];
                          updated[idx] = e.target.value;
                          setImageUrls(updated);
                        }}
                        className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 font-mono text-[11px] text-zinc-900 dark:text-white"
                      />
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* DYNAMIC ITINERARY BUILDER (Day 1, Day 2... Add More Days Button) */}
              <div className="space-y-3 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-poppins font-bold text-sm text-zinc-900 dark:text-white">
                      Day-by-Day Itinerary Builder ({itineraryDays.length} Days)
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Add custom stages, meals, and accommodations for each day.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddItineraryDay}
                    className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-white bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800 flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add More Days</span>
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {itineraryDays.map((dayItem, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-black text-xs text-[#FF6B35]">
                          Day {dayItem.day}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItineraryDay(idx)}
                          className="text-[11px] text-rose-500 hover:underline font-semibold"
                        >
                          Remove Day
                        </button>
                      </div>

                      <input
                        type="text"
                        value={dayItem.title}
                        onChange={(e) => handleItineraryDayChange(idx, 'title', e.target.value)}
                        placeholder="Day Title (e.g. Manali to Solang Valley Flight)"
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-bold text-zinc-900 dark:text-white"
                      />

                      <textarea
                        rows={2}
                        value={dayItem.description}
                        onChange={(e) => handleItineraryDayChange(idx, 'description', e.target.value)}
                        placeholder="What happens on this day..."
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-xs text-zinc-900 dark:text-white"
                      />

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <input
                          type="text"
                          value={dayItem.meals || ''}
                          onChange={(e) => handleItineraryDayChange(idx, 'meals', e.target.value)}
                          placeholder="Meals (e.g. Breakfast, Dinner)"
                          className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-1.5 text-zinc-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={dayItem.stay || ''}
                          onChange={(e) => handleItineraryDayChange(idx, 'stay', e.target.value)}
                          placeholder="Stay (e.g. Swiss Luxury Tents)"
                          className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-1.5 text-zinc-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Inclusions (comma separated)
                  </label>
                  <input
                    type="text"
                    value={inclusionsInput}
                    onChange={(e) => setInclusionsInput(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Exclusions (comma separated)
                  </label>
                  <input
                    type="text"
                    value={exclusionsInput}
                    onChange={(e) => setExclusionsInput(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Toggles: Featured, Best Seller, Active */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex flex-wrap items-center justify-between gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#FF6B35]"
                  />
                  <span>Show on Home Page Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span>Attach Best Seller Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span>Status: Active & Visible</span>
                </label>
              </div>

              {/* Modal Footer CTA */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsDestModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl font-bold text-white shadow-xl hover:shadow-2xl transition"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  {editingDestId ? 'Save & Update Place Live' : 'Publish New Place Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
