import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TourPackage,
  DifficultyLevel,
  TourCategory,
  ItineraryDay,
  GalleryItem,
} from '../../types';
import { ImageUploadPicker } from '../common/ImageUploadPicker';
import { saveOfflineTourDraft, getOfflineTourDrafts } from '../../lib/imageUpload';
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
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Compass,
  Save,
  Search,
  Bell,
  Clock,
  PieChart,
  Share2,
  Printer,
  Moon,
  Sun,
  X,
  Image as ImageIcon,
  MessageSquare,
  Smartphone,
  Star,
  ExternalLink,
  WifiOff,
  Camera,
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
    gallery,
    deleteGalleryItem,
    setGalleryCoverForTour,
    enquiries,
    updateEnquiryStatus,
    settings,
    updateSettings,
    formatPrice,
    showToast,
    currentUser,
    login,
    logout,
    setActiveTab,
    darkMode,
    toggleDarkMode,
  } = useApp();

  // Admin Gate Login State (Strictly empty by default — requires typing @admin and ADMIN123)
  const [adminGateId, setAdminGateId] = useState('');
  const [adminGatePass, setAdminGatePass] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [currentTab, setCurrentTab] = useState<
    | 'dashboard'
    | 'destinations'
    | 'gallery'
    | 'bookings'
    | 'payments'
    | 'enquiries'
    | 'users'
    | 'offers'
    | 'settings'
  >('dashboard');

  // Search in admin tables
  const [destSearchTerm, setDestSearchTerm] = useState('');
  const [destCategoryFilter, setDestCategoryFilter] = useState<string>('All');
  const [destStatusFilter, setDestStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Gallery Manager Filters & State
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('All');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [assignTourId, setAssignTourId] = useState<string>(packages[0]?.id || '');
  const [bulkUploadedUrls, setBulkUploadedUrls] = useState<string[]>([]);

  // Payment Screenshot Preview Modal
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);

  // Post-Publish Social Share Modal
  const [publishedTourShare, setPublishedTourShare] = useState<{
    title: string;
    price: number;
    duration: string;
    location: string;
  } | null>(null);

  // Notifications dropdown open state
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Timeframe for dashboard chart (7D, 1M, 1Y)
  const [chartTimeframe, setChartTimeframe] = useState<'7D' | '1M' | '1Y'>('1M');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  // ================= Destination Form Modal State =================
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [editingDestId, setEditingDestId] = useState<string | null>(null);
  const [mobileWizardStep, setMobileWizardStep] = useState<1 | 2 | 3>(1);
  const [useQuick3StepMode, setUseQuick3StepMode] = useState<boolean>(false);

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
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200',
  ]);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [altitude, setAltitude] = useState('3,583m');
  const [bestSeason, setBestSeason] = useState('May - Nov');
  const [groupSize, setGroupSize] = useState('12 - 18 Yatris');
  const [startEndLocation, setStartEndLocation] = useState('4, Devpura, Haridwar');
  const [highlightsInput, setHighlightsInput] = useState(
    'VIP Darshan Assistance, Ganga Aarti Haridwar, Pure Veg Meals, Experienced Hill Driver'
  );
  const [inclusionsInput, setInclusionsInput] = useState(
    'Breakfast & Dinner, Haridwar Pickup & Drop, Hotel & Swiss Camps, Yatra Registration'
  );
  const [exclusionsInput, setExclusionsInput] = useState(
    'Helicopter Tickets, Pony/Palki, Lunch, Personal Expenses'
  );
  const [isFeatured, setIsFeatured] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(true);
  const [isActive, setIsActive] = useState(true);

  // Dynamic Day-by-Day Itinerary Builder
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([
    {
      day: 1,
      title: 'Haridwar Pickup & Drive to Guptkashi / Barkot',
      description: 'Meet at 4, Devpura, Haridwar office. Scenic Himalayan drive along River Ganga & Alaknanda.',
      meals: 'Dinner',
      stay: 'Deluxe Mountain View Hotel',
    },
    {
      day: 2,
      title: 'Temple Darshan & High-Altitude Trek',
      description: 'Early morning departure for holy shrine darshan with full guide support.',
      meals: 'Breakfast, Dinner',
      stay: 'Swiss Deluxe Camp / Hotel',
    },
    {
      day: 3,
      title: 'Return Drive to Rishikesh & Haridwar Drop',
      description: 'Morning prayers, sightseeing at Devprayag Sangam, and evening drop at Haridwar.',
      meals: 'Breakfast',
      stay: 'Tour Ends',
    },
  ]);

  // Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minBookingValue, setMinBookingValue] = useState<number>(5000);
  const [couponDesc, setCouponDesc] = useState('');

  // UI Customizer State
  const [tempSettings, setTempSettings] = useState(settings);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (!assignTourId && packages.length > 0) {
      setAssignTourId(packages[0].id);
    }
  }, [packages, assignTourId]);

  // ================= Analytics & Memoized Filters (Must run before any early return) =================
  const confirmedBookings = bookings.filter((b) => b.bookingStatus !== 'Cancelled');
  const allTimeRevenue = confirmedBookings.reduce(
    (sum, b) => sum + (b.advanceAmount || b.totalAmount),
    0
  );
  const todayRevenue = Math.round(allTimeRevenue * 0.18);
  const monthRevenue = Math.round(allTimeRevenue * 0.72);

  const pendingPaymentsCount = bookings.filter(
    (b) => b.paymentStatus === 'Pending Verification'
  ).length;
  const pendingPaymentsAmount = bookings
    .filter((b) => b.paymentStatus === 'Pending Verification')
    .reduce((sum, b) => sum + (b.advanceAmount || b.totalAmount), 0);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;
  const offlineDraftsCount = getOfflineTourDrafts().length;

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

  // Filtered gallery items
  const filteredGallery = useMemo(() => {
    return gallery.filter((item) => {
      if (galleryCategoryFilter !== 'All' && item.category !== galleryCategoryFilter) {
        return false;
      }
      if (gallerySearch.trim()) {
        const q = gallerySearch.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchTour = (item.tourName || '').toLowerCase().includes(q);
        if (!matchTitle && !matchTour) return false;
      }
      return true;
    });
  }, [gallery, galleryCategoryFilter, gallerySearch]);

  // Strict Admin access gate check: Only users who explicitly logged in with @admin and ADMIN123 can view
  if (!currentUser || currentUser.role !== 'admin' || currentUser.email !== '@admin') {
    const handleGateSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const enteredId = adminGateId.trim();
      const enteredPass = adminGatePass.trim();

      if (enteredId === '@admin' && enteredPass === 'ADMIN123') {
        setAdminLoginError('');
        login(enteredId, enteredPass);
        setAdminGateId('');
        setAdminGatePass('');
      } else {
        setAdminLoginError('Access Denied: Incorrect Admin ID or Password.');
        showToast('Access Denied: Please enter the valid Admin ID and Password.', 'error');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-100 dark:bg-[#0c0c0e]">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-[#0B3D2E] text-white mx-auto flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8 text-[#FF6B35]" />
          </div>
          <div>
            <h2 className="font-poppins font-black text-xl sm:text-2xl text-zinc-900 dark:text-white">
              Om Travels & Adventure On The Way
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Restricted Super Admin Portal • 4, Devpura, Haridwar
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-2">
              🔒 Authorized Administrator Login Required
            </p>
          </div>

          {adminLoginError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold">
              {adminLoginError}
            </div>
          )}

          <form onSubmit={handleGateSubmit} className="space-y-3.5 text-left" autoComplete="off">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Admin Login ID *
              </label>
              <input
                type="text"
                required
                value={adminGateId}
                onChange={(e) => {
                  setAdminGateId(e.target.value);
                  if (adminLoginError) setAdminLoginError('');
                }}
                placeholder="Enter Admin ID"
                autoComplete="off"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Admin Password *
              </label>
              <input
                type="password"
                required
                value={adminGatePass}
                onChange={(e) => {
                  setAdminGatePass(e.target.value);
                  if (adminLoginError) setAdminLoginError('');
                }}
                placeholder="Enter Admin Password"
                autoComplete="new-password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-bold text-xs text-white shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <ShieldCheck className="w-4 h-4 text-[#FF6B35]" />
              <span>Verify & Enter Admin Control Center</span>
            </button>
          </form>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Destination Form Actions
  const handleOpenAddDestination = (quickMode = false) => {
    setEditingDestId(null);
    setUseQuick3StepMode(quickMode);
    setMobileWizardStep(1);
    setTitle('');
    setLocation('Uttarakhand (Haridwar - Kedarnath - Badrinath)');
    setPrice(14500);
    setOriginalPrice(18500);
    setDays(5);
    setNights(4);
    setDifficulty('Moderate');
    setCategory('Trek');
    setMaxSeats(20);
    setAvailableSeats(14);
    setImageUrls([]);
    setShortDescription(
      'Sacred Himalayan darshan, scenic river confluences, comfortable stays, and Haridwar pickup & drop.'
    );
    setDescription(
      'Complete guided Uttarakhand Yatra & adventure package by Om Travels & Adventure On The Way (4, Devpura, Haridwar). Includes verified hill vehicles, hygienic meals, and 24x7 support.'
    );
    setAltitude('3,583m');
    setBestSeason('May - Nov');
    setGroupSize('12 - 18 Travellers');
    setStartEndLocation('4, Devpura, Haridwar');
    setHighlightsInput('Haridwar Pickup & Drop, Temple Darshan, Scenic Mountains, Pure Veg Meals');
    setInclusionsInput('Accommodation, Breakfast & Dinner, Sightseeing Vehicle, Yatra Registration');
    setExclusionsInput('Helicopter Tickets, Personal Expenses, Pony/Palki');
    setIsFeatured(true);
    setIsBestSeller(true);
    setIsActive(true);
    setItineraryDays([
      {
        day: 1,
        title: 'Haridwar Departure & Scenic Himalayan Drive',
        description: 'Morning pickup from Haridwar railway station / 4 Devpura office. Drive via Devprayag Sangam.',
        meals: 'Dinner',
        stay: 'Deluxe Mountain Hotel',
      },
      {
        day: 2,
        title: 'Main Shrine / Summit Exploration',
        description: 'Early morning trek or drive to main destination with guide assistance.',
        meals: 'Breakfast, Dinner',
        stay: 'Swiss Tents / Hotel',
      },
      {
        day: 3,
        title: 'Return Drive to Haridwar',
        description: 'Morning prayers and scenic return journey to Haridwar.',
        meals: 'Breakfast',
      },
    ]);
    setIsDestModalOpen(true);
  };

  const handleOpenEditDestination = (pkg: TourPackage) => {
    setEditingDestId(pkg.id);
    setUseQuick3StepMode(false);
    setMobileWizardStep(1);
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
    setImageUrls(pkg.images.length > 0 ? pkg.images : []);
    setShortDescription(pkg.shortDescription);
    setDescription(pkg.description);
    setAltitude(pkg.altitude || '3,200m');
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
            {
              day: 1,
              title: 'Arrival & Briefing at Haridwar',
              description: 'Meet at 4, Devpura, Haridwar and depart for the Himalayas.',
              meals: 'Dinner',
              stay: 'Mountain Hotel',
            },
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
        title: `Day ${nextDayNum}: Himalayan Exploration & Sightseeing`,
        description: 'Guided excursion to scenic viewpoints and temples. Hot dinner at camp/hotel.',
        meals: 'Breakfast, Dinner',
        stay: 'Deluxe Hotel / Camp',
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

  const buildPackagePayload = () => {
    const highlightsArr = highlightsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const inclusionsArr = inclusionsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const exclusionsArr = exclusionsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const validImages = imageUrls.filter((url) => url.trim().length > 0);

    return {
      title: title || 'New Uttarakhand Yatra Package',
      location: location || 'Uttarakhand',
      state: location.split(',')[1]?.trim() || 'Uttarakhand',
      price,
      originalPrice: originalPrice > price ? originalPrice : Math.round(price * 1.25),
      duration: `${days} Days / ${nights} Nights`,
      days,
      difficulty,
      category,
      maxSeats,
      availableSeats,
      images:
        validImages.length > 0
          ? validImages
          : ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200'],
      shortDescription:
        shortDescription ||
        'Guided Himalayan Yatra & adventure package from Haridwar with meals, stay, and transport.',
      description:
        description ||
        'Book with Om Travels & Adventure On The Way (4, Devpura, Haridwar) for a safe, memorable Himalayan journey.',
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
      reviewCount: 24,
      trending: isFeatured,
    };
  };

  const handleSaveOfflineDraft = () => {
    const payload = buildPackagePayload();
    saveOfflineTourDraft(payload);
    showToast('Saved to Offline Mountain Drafts! Will auto-sync when online.', 'info');
    setIsDestModalOpen(false);
  };

  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();
    const packagePayload = buildPackagePayload();

    if (!navigator.onLine) {
      saveOfflineTourDraft(packagePayload);
      showToast('Offline Mode: Tour saved locally and will auto-sync when network returns!', 'info');
      setIsDestModalOpen(false);
      return;
    }

    if (editingDestId) {
      updatePackage(editingDestId, packagePayload);
    } else {
      addPackage(packagePayload);
      setPublishedTourShare({
        title: packagePayload.title,
        price: packagePayload.price,
        duration: packagePayload.duration,
        location: packagePayload.location,
      });
    }

    setIsDestModalOpen(false);
  };

  const handleBulkAssignToTour = () => {
    if (bulkUploadedUrls.length === 0) {
      showToast('Please select photos from your Gallery first.', 'error');
      return;
    }
    const targetTour = packages.find((p) => p.id === assignTourId);
    if (targetTour) {
      const mergedImages = [...targetTour.images, ...bulkUploadedUrls];
      updatePackage(targetTour.id, { images: mergedImages });
      showToast(
        `Added ${bulkUploadedUrls.length} photos to "${targetTour.title}"!`,
        'success'
      );
      setBulkUploadedUrls([]);
    } else {
      showToast('Uploaded photos saved to master gallery!', 'success');
      setBulkUploadedUrls([]);
    }
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    addCoupon({
      code: couponCode.trim().toUpperCase(),
      discountType,
      discountValue,
      minBookingValue,
      description:
        couponDesc ||
        `${discountValue}${discountType === 'percentage' ? '%' : '₹'} off on Yatra & Adventure bookings!`,
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
        <div>
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <ShieldCheck className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div>
                <h2 className="font-poppins font-black text-sm tracking-tight text-zinc-900 dark:text-white">
                  Om Travels Admin
                </h2>
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  4, Devpura, Haridwar
                </span>
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              title="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>
          </div>

          {/* Quick Mobile 3-Step Publisher CTA inside Sidebar */}
          <div className="px-4 pt-4">
            <button
              onClick={() => handleOpenAddDestination(true)}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#e85822] text-white font-poppins font-bold text-xs shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition"
            >
              <Camera className="w-4 h-4" />
              <span>📸 Quick 3-Step Tour + Gallery Upload</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs font-bold">
            {[
              { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
              {
                id: 'destinations',
                label: 'Manage Destinations',
                icon: MapPin,
                count: packages.length,
              },
              {
                id: 'gallery',
                label: 'Photo Gallery Manager',
                icon: ImageIcon,
                count: gallery.length,
              },
              {
                id: 'bookings',
                label: 'Manage Bookings',
                icon: CalendarCheck,
                count: bookings.length,
              },
              {
                id: 'payments',
                label: 'UPI & Screenshots',
                icon: CreditCard,
                count: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined,
              },
              {
                id: 'enquiries',
                label: 'Customer Enquiries',
                icon: MessageSquare,
                count: newEnquiriesCount > 0 ? newEnquiriesCount : enquiries.length,
              },
              { id: 'users', label: 'Manage Users', icon: Users, count: allUsers.length },
              { id: 'offers', label: 'Offers & Coupons', icon: Tag, count: coupons.length },
              { id: 'settings', label: 'Logo, Banner & Settings', icon: Palette },
            ].map((item) => {
              const Icon = item.icon;
              const isActiveTab = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition ${
                    isActiveTab
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${isActiveTab ? 'text-[#FF6B35]' : 'text-zinc-400'}`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        isActiveTab
                          ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900 font-black'
                          : (item.id === 'payments' && pendingPaymentsCount > 0) ||
                            (item.id === 'enquiries' && newEnquiriesCount > 0)
                          ? 'bg-[#FF6B35] text-white font-bold'
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
          {offlineDraftsCount > 0 && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-bold flex items-center gap-2">
              <WifiOff className="w-4 h-4 shrink-0" />
              <span>{offlineDraftsCount} Offline Tour Draft(s) Queued</span>
            </div>
          )}

          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                {currentUser.name} (@admin)
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold truncate">
                ID: @admin • +91 94217 09258
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className="py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-bold text-zinc-700 dark:text-zinc-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#FF6B35]" />
              <span>Website</span>
            </button>
            <button
              onClick={() => logout()}
              className="py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-500/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Lock Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar - Responsive across Mobile, Tablet, and Desktop with NO hidden buttons */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#141417]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="min-w-0">
            <h1 className="font-poppins font-black text-base sm:text-xl text-zinc-900 dark:text-white capitalize">
              {currentTab === 'dashboard' && 'Executive Performance Dashboard'}
              {currentTab === 'destinations' && 'Manage Uttarakhand & Himalayan Tours'}
              {currentTab === 'gallery' && 'Device Gallery & Tour Photo Manager'}
              {currentTab === 'bookings' && 'Customer Bookings & Yatra Manifests'}
              {currentTab === 'payments' && 'UPI (9421709258@upi) & Screenshot Verification'}
              {currentTab === 'enquiries' && 'Customer Callback & Custom Yatra Enquiries'}
              {currentTab === 'users' && 'Registered Travellers & Yatris'}
              {currentTab === 'offers' && 'Promo Offers & Discount Coupons'}
              {currentTab === 'settings' && 'Logo, Hero Banner & Haridwar Office Settings'}
            </h1>
            <p className="text-[11px] sm:text-xs text-zinc-400">
              Admin ID: <strong className="text-emerald-500">@admin</strong> • <strong className="text-zinc-700 dark:text-zinc-200">+91 94217 09258 / +91 86687 40237</strong> • UPI: <strong className="text-[#FF6B35]">9421709258@upi</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCurrentTab('gallery')}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-[#FF6B35]" />
              <span>Gallery ({gallery.length})</span>
            </button>

            <button
              onClick={() => handleOpenAddDestination(true)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>3-Step Quick Add</span>
            </button>

            <button
              onClick={() => handleOpenAddDestination(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5 hover:opacity-95 transition cursor-pointer"
              style={{ backgroundColor: settings.accentColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Add New Tour</span>
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
              {/* Quick Action Banner for Mobile / Desktop Admin */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B3D2E] to-[#135c45] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-black uppercase tracking-wider">
                    📸 Direct Phone Gallery & Camera Upload Ready
                  </span>
                  <h2 className="font-poppins font-black text-xl sm:text-2xl">
                    Add New Yatra / Tour Photos Straight From Your Phone
                  </h2>
                  <p className="text-xs text-emerald-100 max-w-xl">
                    Tap below to pick photos from your Android / iPhone gallery or snap a live camera photo. Auto-compresses to fast WebP under 500KB!
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleOpenAddDestination(true)}
                    className="px-5 py-3 rounded-2xl bg-[#FF6B35] hover:bg-[#e85822] text-white font-bold text-xs shadow-lg flex items-center gap-2 transition"
                  >
                    <Camera className="w-4 h-4" />
                    <span>3-Step Mobile Tour Publisher</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('gallery')}
                    className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 transition"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Open Gallery Manager</span>
                  </button>
                </div>
              </div>

              {/* TOP CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4% Yatra season surge
                  </p>
                </div>

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

                <div className="p-5 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Active Tours</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-poppins font-black text-2xl text-zinc-900 dark:text-white">
                    {packages.length}
                  </h3>
                  <p className="text-[10px] text-zinc-400">
                    {gallery.length} Photos in Gallery
                  </p>
                </div>

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
                    {formatPrice(pendingPaymentsAmount)} awaiting verify
                  </p>
                </div>
              </div>

              {/* GRAPHS: Revenue Chart + Bookings per Destination Pie */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
                        Yatra & Adventure Revenue Trajectory ({chartTimeframe})
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Confirmed bookings across Uttarakhand & Himalayan circuits
                      </p>
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
                      >
                        {chartType === 'bar' ? 'Line' : 'Bar'}
                      </button>
                    </div>
                  </div>

                  <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-zinc-100 dark:border-zinc-800">
                    {[
                      { label: 'Week 1', val: 58, rev: '₹2.4L' },
                      { label: 'Week 2', val: 76, rev: '₹3.9L' },
                      { label: 'Week 3', val: 91, rev: '₹5.2L' },
                      { label: 'Week 4', val: 85, rev: '₹4.7L' },
                      { label: 'This Week', val: 98, rev: '₹6.4L' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-mono font-bold text-[#FF6B35] opacity-0 group-hover:opacity-100 transition">
                          {item.rev}
                        </span>
                        <div
                          className="w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110"
                          style={{
                            height: `${item.val}%`,
                            backgroundColor:
                              idx === 4 ? settings.accentColor : settings.primaryColor,
                          }}
                        />
                        <span className="text-[11px] font-semibold text-zinc-500">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bookings per Destination Pie */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
                      Top Uttarakhand Packages
                    </h4>
                    <PieChart className="w-4 h-4 text-zinc-400" />
                  </div>

                  <div className="relative w-36 h-36 mx-auto">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#0B3D2E"
                        strokeWidth="5"
                        strokeDasharray="38 62"
                        strokeDashoffset="0"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#FF6B35"
                        strokeWidth="5"
                        strokeDasharray="27 73"
                        strokeDashoffset="-38"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="5"
                        strokeDasharray="20 80"
                        strokeDashoffset="-65"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#f59e0b"
                        strokeWidth="5"
                        strokeDasharray="15 85"
                        strokeDashoffset="-85"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-poppins font-black text-lg text-zinc-900 dark:text-white leading-none">
                        {bookings.length}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-semibold uppercase">Yatras</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs pt-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0B3D2E]" />
                        <span>Chardham Yatra (11D)</span>
                      </span>
                      <span className="font-bold">38%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
                        <span>Kedarnath & Do Dham</span>
                      </span>
                      <span className="font-bold">27%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Aadi Kailash Om Parvat</span>
                      </span>
                      <span className="font-bold">20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Auli, Chopta & Mussoorie</span>
                      </span>
                      <span className="font-bold">15%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT BOOKINGS TABLE */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
                      Recent Bookings Stream
                    </h4>
                    <p className="text-xs text-zinc-400">Real-time PostgreSQL database records</p>
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
                        <th className="p-3.5">Guest</th>
                        <th className="p-3.5">Package</th>
                        <th className="p-3.5">Travel Date</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Payment</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {bookings.slice(0, 10).map((b) => (
                        <tr key={b.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                          <td className="p-3.5 font-mono font-bold text-[#FF6B35]">{b.id}</td>
                          <td className="p-3.5">
                            <span className="font-bold text-zinc-900 dark:text-white block">
                              {b.userName}
                            </span>
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
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
                      Uttarakhand & Himalayan Tour Packages ({packages.length})
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Upload photos directly from your mobile gallery or camera. All changes save to PostgreSQL.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleOpenAddDestination(true)}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5 transition"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>3-Step Mobile Add</span>
                    </button>
                    <button
                      onClick={() => handleOpenAddDestination(false)}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg flex items-center gap-2 hover:opacity-95 transition"
                      style={{ backgroundColor: settings.accentColor }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>ADD NEW PLACE</span>
                    </button>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="relative">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={destSearchTerm}
                      onChange={(e) => setDestSearchTerm(e.target.value)}
                      placeholder="Search Chardham, Kedarnath, Aadi Kailash..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>

                  <select
                    value={destCategoryFilter}
                    onChange={(e) => setDestCategoryFilter(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Trek">Trek / Yatra</option>
                    <option value="Expedition">Expedition</option>
                    <option value="Family">Family</option>
                    <option value="Camping">Camping</option>
                    <option value="Bike Trip">Bike Trip</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Water Sports">Water Sports</option>
                  </select>

                  <select
                    value={destStatusFilter}
                    onChange={(e) => setDestStatusFilter(e.target.value as any)}
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none"
                  >
                    <option value="All">All Status (Active + Inactive)</option>
                    <option value="Active">Active Only</option>
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
                        <th className="p-4">Photos</th>
                        <th className="p-4">Seats Left</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {filteredDestinations.map((pkg) => {
                        const isLive = pkg.isActive !== false;
                        return (
                          <tr key={pkg.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    pkg.images[0] ||
                                    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=150'
                                  }
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

                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-bold text-[11px] block w-fit">
                                {pkg.category}
                              </span>
                              <span className="text-[10px] text-zinc-400 mt-1 block">
                                {pkg.difficulty}
                              </span>
                            </td>

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

                            <td className="p-4">
                              <button
                                onClick={() => handleOpenEditDestination(pkg)}
                                className="px-2.5 py-1 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] font-bold text-[11px] flex items-center gap-1 hover:bg-[#FF6B35]/20 transition"
                              >
                                <Camera className="w-3 h-3" />
                                <span>{pkg.images.length} Photos</span>
                              </button>
                            </td>

                            <td className="p-4">
                              <span
                                className={`font-mono font-bold text-xs ${
                                  pkg.availableSeats <= 4
                                    ? 'text-rose-500 font-black'
                                    : 'text-emerald-500'
                                }`}
                              >
                                {pkg.availableSeats} / {pkg.maxSeats}
                              </span>
                            </td>

                            <td className="p-4">
                              <button
                                onClick={() => togglePackageStatus(pkg.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition ${
                                  isLive
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border border-zinc-300 dark:border-zinc-700'
                                }`}
                              >
                                {isLive ? (
                                  <Eye className="w-3 h-3" />
                                ) : (
                                  <EyeOff className="w-3 h-3" />
                                )}
                                <span>{isLive ? 'Active' : 'Hidden'}</span>
                              </button>
                            </td>

                            <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleOpenEditDestination(pkg)}
                                className="px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 transition font-bold text-xs"
                              >
                                <Edit className="w-3.5 h-3.5 inline mr-1" />
                                Edit / Add Photos
                              </button>

                              <button
                                onClick={() => duplicatePackage(pkg.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:bg-sky-100 transition font-bold text-xs"
                              >
                                <Copy className="w-3.5 h-3.5 inline mr-1" />
                                Duplicate
                              </button>

                              {confirmDeleteId === pkg.id ? (
                                <span className="inline-flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      deletePackage(pkg.id);
                                      setConfirmDeleteId(null);
                                    }}
                                    className="px-2.5 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition cursor-pointer"
                                  >
                                    Confirm Delete
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="px-2 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold text-xs cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </span>
                              ) : (
                                <button
                                  onClick={() => setConfirmDeleteId(pkg.id)}
                                  className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                                  title="Delete Tour Package"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
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

          {/* ================= SECTION 2B: SEPARATE GALLERY MANAGER TAB ================= */}
          {currentTab === 'gallery' && (
            <div className="space-y-6">
              {/* Bulk Upload Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white flex items-center gap-2">
                      <Camera className="w-5 h-5 text-[#FF6B35]" />
                      <span>Bulk Device Gallery & Camera Uploader</span>
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Select up to 20 photos at once from your phone gallery or camera, auto-compress to WebP (&lt;500KB), and assign to any tour package.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={assignTourId}
                      onChange={(e) => setAssignTourId(e.target.value)}
                      className="py-2.5 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white"
                    >
                      {packages.map((p) => (
                        <option key={p.id} value={p.id}>
                          Assign to: {p.title}
                        </option>
                      ))}
                    </select>

                    {bulkUploadedUrls.length > 0 && (
                      <button
                        type="button"
                        onClick={handleBulkAssignToTour}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition whitespace-nowrap"
                      >
                        ✓ Attach {bulkUploadedUrls.length} Photos to Tour
                      </button>
                    )}
                  </div>
                </div>

                <ImageUploadPicker
                  images={bulkUploadedUrls}
                  onChange={setBulkUploadedUrls}
                  maxImages={20}
                  category="tour"
                  tourId={assignTourId}
                  tourName={packages.find((p) => p.id === assignTourId)?.title || 'Tour Gallery'}
                  label="📸 Bulk Select 10–20 Photos From Phone Gallery or Camera"
                />
              </div>

              {/* Master Gallery Library Grid */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
                      Uploaded Media Library ({filteredGallery.length} Photos)
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Click any photo for Full Preview, Copy Link, Set as Tour Cover, or Delete
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={gallerySearch}
                        onChange={(e) => setGallerySearch(e.target.value)}
                        placeholder="Search by tour name..."
                        className="pl-8 pr-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white"
                      />
                    </div>

                    <select
                      value={galleryCategoryFilter}
                      onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                      className="py-2 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white"
                    >
                      <option value="All">All Categories</option>
                      <option value="tour">Tour Photos</option>
                      <option value="payment">Payment Screenshots</option>
                      <option value="banner">Hero Banners</option>
                      <option value="logo">Logos</option>
                      <option value="profile">User Profiles</option>
                    </select>
                  </div>
                </div>

                {filteredGallery.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-400">
                    No photos match your filter. Use the Bulk Uploader above to add photos from your device gallery!
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredGallery.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedGalleryItem(item)}
                        className="group relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 aspect-4/3 cursor-pointer shadow-xs hover:shadow-xl transition"
                      >
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 flex flex-col justify-end p-3 text-white">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B35]">
                            {item.category}
                          </span>
                          <p className="text-xs font-bold truncate">
                            {item.tourName || item.title}
                          </p>
                          {item.sizeKb ? (
                            <span className="text-[9px] text-zinc-300">{item.sizeKb} KB • WebP</span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    Confirm reservations, view payment screenshots, and send 1-tap WhatsApp tickets.
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
                        <th className="p-4">Payment / Proof</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                          <td className="p-4 font-mono font-bold text-[#FF6B35]">{b.id}</td>
                          <td className="p-4">
                            <span className="font-bold text-zinc-900 dark:text-white block">
                              {b.userName}
                            </span>
                            <span className="text-zinc-400 text-[10px] block">{b.userPhone}</span>
                            <span className="text-zinc-400 text-[10px] block">{b.userEmail}</span>
                          </td>
                          <td className="p-4 font-semibold text-zinc-800 dark:text-zinc-200 max-w-[170px] truncate">
                            {b.packageTitle}
                          </td>
                          <td className="p-4">
                            <span className="font-mono block">{b.travelDate}</span>
                            <span className="text-[10px] text-zinc-400">
                              {b.adults} Adults {b.children > 0 ? `, ${b.children} Children` : ''}
                            </span>
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
                            {b.paymentScreenshot && (
                              <button
                                onClick={() => setPreviewScreenshotUrl(b.paymentScreenshot!)}
                                className="mt-1 text-[10px] font-bold text-[#FF6B35] hover:underline flex items-center gap-1"
                              >
                                <ImageIcon className="w-3 h-3" />
                                <span>View Screenshot</span>
                              </button>
                            )}
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
                                const msg = encodeURIComponent(
                                  `Namaste ${b.userName}! Your booking ${b.id} for ${b.packageTitle} on ${b.travelDate} with Om Travels & Adventure On The Way (Haridwar) is Confirmed!`
                                );
                                window.open(
                                  `https://wa.me/91${b.userPhone.replace(/[^0-9]/g, '').slice(-10)}?text=${msg}`,
                                  '_blank'
                                );
                              }}
                              className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                              title="Send Confirmation on WhatsApp"
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
                    UPI & Screenshot Payment Clearances
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Official UPI ID: <strong className="text-[#FF6B35]">9421709258@upi</strong>. Inspect uploaded payment screenshots and verify UTR references.
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
                        <th className="p-4">Guest</th>
                        <th className="p-4">Method & Screenshot</th>
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
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-bold">
                                {b.paymentMethod}
                              </span>
                              {b.paymentScreenshot && (
                                <button
                                  onClick={() => setPreviewScreenshotUrl(b.paymentScreenshot!)}
                                  className="px-2 py-0.5 rounded bg-[#FF6B35]/10 text-[#FF6B35] font-bold text-[10px] hover:bg-[#FF6B35]/20"
                                >
                                  📸 View Proof
                                </button>
                              )}
                            </div>
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

          {/* ================= SECTION 4B: CUSTOMER ENQUIRIES TAB ================= */}
          {currentTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs">
                <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
                  Customer Enquiries & Custom Yatra Leads ({enquiries.length})
                </h3>
                <p className="text-xs text-zinc-500">
                  Direct enquiries submitted from the Contact Page. Reply instantly via WhatsApp.
                </p>
              </div>

              <div className="rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Destination Interest</th>
                        <th className="p-4">Message / Requirements</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {enquiries.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-zinc-400">
                            No enquiries yet.
                          </td>
                        </tr>
                      ) : (
                        enquiries.map((enq) => (
                          <tr key={enq.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                            <td className="p-4">
                              <span className="font-bold text-zinc-900 dark:text-white block">
                                {enq.name}
                              </span>
                              <span className="text-zinc-400 text-[10px] block">{enq.phone}</span>
                              {enq.email && (
                                <span className="text-zinc-400 text-[10px] block">{enq.email}</span>
                              )}
                            </td>
                            <td className="p-4 font-bold text-[#FF6B35]">{enq.destination}</td>
                            <td className="p-4 max-w-xs text-zinc-600 dark:text-zinc-300">
                              {enq.message}
                            </td>
                            <td className="p-4">
                              <select
                                value={enq.status}
                                onChange={(e) =>
                                  updateEnquiryStatus(enq.id, e.target.value as any)
                                }
                                className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-bold text-xs"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Converted">Converted</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => {
                                  updateEnquiryStatus(enq.id, 'Contacted');
                                  const text = encodeURIComponent(
                                    `Namaste ${enq.name}! This is Om Travels & Adventure On The Way (Haridwar) regarding your enquiry for ${enq.destination}.`
                                  );
                                  window.open(
                                    `https://wa.me/91${enq.phone.replace(/[^0-9]/g, '').slice(-10)}?text=${text}`,
                                    '_blank'
                                  );
                                }}
                                className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white font-bold text-xs inline-flex items-center gap-1.5"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Reply on WhatsApp</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
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
                                <span className="font-bold text-zinc-900 dark:text-white">
                                  {u.name}
                                </span>
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
                  Promotional Coupons & Special Yatra Discount Codes
                </h3>
                <p className="text-xs text-zinc-500">
                  Create discount codes for Chardham, Kedarnath, and group bookings.
                </p>
              </div>

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
                    placeholder="e.g. CHARDHAM20"
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
                      {c.discountType === 'percentage'
                        ? `${c.discountValue}% OFF`
                        : `₹${c.discountValue} FLAT OFF`}
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

          {/* ================= SECTION 7: THEME, LOGO, BANNER & BRAND SETTINGS ================= */}
          {currentTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
                    Logo, Hero Banner & Haridwar Business Settings
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Upload your custom Logo or Hero Banner from your phone gallery and manage Haridwar contact numbers.
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold text-xs text-white shadow-lg flex items-center gap-1.5"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings to Database</span>
                </button>
              </div>

              {/* Gallery Uploaders for Logo & Hero Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <h4 className="font-poppins font-bold text-sm text-zinc-900 dark:text-white">
                    1. Change Hero Banner From Phone Gallery
                  </h4>
                  <ImageUploadPicker
                    images={tempSettings.heroBannerImage ? [tempSettings.heroBannerImage] : []}
                    onChange={(urls) =>
                      setTempSettings({
                        ...tempSettings,
                        heroBannerImage: urls[0] || tempSettings.heroBannerImage,
                      })
                    }
                    singleMode={true}
                    category="banner"
                    tourName="Home Page Hero Banner"
                    label="📸 Upload New Hero Banner From Gallery"
                  />
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <h4 className="font-poppins font-bold text-sm text-zinc-900 dark:text-white">
                    2. Change Brand Logo From Phone Gallery
                  </h4>
                  <ImageUploadPicker
                    images={tempSettings.logoUrl ? [tempSettings.logoUrl] : []}
                    onChange={(urls) =>
                      setTempSettings({
                        ...tempSettings,
                        logoUrl: urls[0] || '',
                      })
                    }
                    singleMode={true}
                    category="logo"
                    tourName="Brand Logo"
                    label="📸 Upload Custom Logo From Gallery"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Palette */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Brand Palette & Identity
                  </h4>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                      Full Brand Name
                    </label>
                    <input
                      type="text"
                      value={tempSettings.brandName}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, brandName: e.target.value })
                      }
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 font-bold text-zinc-900 dark:text-white"
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

                  <div className="space-y-2">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                      Primary Brand Color ({tempSettings.primaryColor})
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
                      <input
                        type="color"
                        value={tempSettings.accentColor}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, accentColor: e.target.value })
                        }
                        className="w-12 h-10 rounded-xl cursor-pointer bg-transparent border border-zinc-300 dark:border-zinc-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Client Contact Details */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#141417] border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Haridwar Office & Payment Details
                  </h4>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                      Official UPI ID
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                        Primary Phone / WhatsApp
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
                        Secondary Phone
                      </label>
                      <input
                        type="text"
                        value={tempSettings.secondaryPhone || '+91 86687 40237'}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            secondaryPhone: e.target.value,
                          })
                        }
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                      Office Address
                    </label>
                    <input
                      type="text"
                      value={tempSettings.address}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, address: e.target.value })
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

      {/* ================= MODAL: ADD / EDIT DESTINATION (WITH 3-STEP MOBILE WIZARD & DEVICE GALLERY UPLOAD) ================= */}
      {isDestModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
          <div
            className="relative w-full max-w-4xl bg-white dark:bg-[#141417] rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[94vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-poppins font-black text-lg text-zinc-900 dark:text-white">
                  {editingDestId
                    ? 'Edit Tour & Upload Gallery Photos'
                    : useQuick3StepMode
                    ? `📸 3-Step Mobile Tour Publisher (Step ${mobileWizardStep} of 3)`
                    : 'Create New Tour Package'}
                </h3>
                <p className="text-xs text-zinc-400">
                  Upload photos directly from your phone Gallery or Camera
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUseQuick3StepMode(!useQuick3StepMode)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-[#FF6B35]"
                >
                  {useQuick3StepMode ? 'Switch to Full Editor' : '⚡ Switch to 3-Step Mobile Mode'}
                </button>
                <button
                  onClick={() => setIsDestModalOpen(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 3-Step Mobile Progress Bar when in Quick Mode */}
            {useQuick3StepMode && (
              <div className="bg-zinc-100 dark:bg-zinc-900 px-6 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-bold">
                {[
                  { s: 1, label: '1. Basic Info' },
                  { s: 2, label: '2. Photos From Gallery' },
                  { s: 3, label: '3. Price & Publish' },
                ].map((st) => (
                  <button
                    key={st.s}
                    type="button"
                    onClick={() => setMobileWizardStep(st.s as 1 | 2 | 3)}
                    className={`px-3 py-1 rounded-lg transition ${
                      mobileWizardStep === st.s
                        ? 'bg-[#FF6B35] text-white'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSaveDestination} className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* STEP 1 (or Full Mode): Basic Info */}
              {(!useQuick3StepMode || mobileWizardStep === 1) && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">
                        Tour / Yatra Name *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Kedarnath Dham Special 5D/4N Yatra"
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">
                        Location / Route *
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Haridwar - Guptkashi - Kedarnath, Uttarakhand"
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 font-bold text-zinc-900 dark:text-white"
                      >
                        <option value="Trek">Trek / Yatra</option>
                        <option value="Expedition">Expedition</option>
                        <option value="Family">Family</option>
                        <option value="Camping">Camping</option>
                        <option value="Bike Trip">Bike Trip</option>
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
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">Days</label>
                      <input
                        type="number"
                        value={days}
                        min={1}
                        onChange={(e) => {
                          const d = Number(e.target.value);
                          setDays(d);
                          setNights(Math.max(0, d - 1));
                        }}
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
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">
                      Short Tagline Description *
                    </label>
                    <input
                      type="text"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 2 (or Full Mode): DEVICE GALLERY & CAMERA UPLOAD SYSTEM */}
              {(!useQuick3StepMode || mobileWizardStep === 2) && (
                <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/90 border-2 border-[#FF6B35]/30 space-y-4">
                  <ImageUploadPicker
                    images={imageUrls}
                    onChange={setImageUrls}
                    maxImages={10}
                    category="tour"
                    tourId={editingDestId || undefined}
                    tourName={title || 'New Tour Package'}
                    label="📸 Tour Photos (Pick up to 10 Photos from Phone Gallery or Camera — First Photo is Cover)"
                  />
                </div>
              )}

              {/* STEP 3 (or Full Mode): PRICING, ITINERARY & PUBLISH */}
              {(!useQuick3StepMode || mobileWizardStep === 3) && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">
                        Offer Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 font-black text-emerald-600 dark:text-emerald-400"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">
                        Original Price (₹)
                      </label>
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(Number(e.target.value))}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">
                        Max Seats
                      </label>
                      <input
                        type="number"
                        value={maxSeats}
                        onChange={(e) => setMaxSeats(Number(e.target.value))}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-zinc-700 dark:text-zinc-300">
                        Available Seats
                      </label>
                      <input
                        type="number"
                        value={availableSeats}
                        onChange={(e) => setAvailableSeats(Number(e.target.value))}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {!useQuick3StepMode && (
                    <>
                      <div className="space-y-1">
                        <label className="font-bold text-zinc-700 dark:text-zinc-300">
                          Full Detailed Overview
                        </label>
                        <textarea
                          rows={2}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-white"
                        />
                      </div>

                      {/* DYNAMIC ITINERARY BUILDER */}
                      <div className="space-y-3 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-poppins font-bold text-sm text-zinc-900 dark:text-white">
                              Day-by-Day Itinerary ({itineraryDays.length} Days)
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddItineraryDay}
                            className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-white bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800 flex items-center gap-1.5"
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
                                onChange={(e) =>
                                  handleItineraryDayChange(idx, 'title', e.target.value)
                                }
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-xs font-bold text-zinc-900 dark:text-white"
                              />

                              <textarea
                                rows={2}
                                value={dayItem.description}
                                onChange={(e) =>
                                  handleItineraryDayChange(idx, 'description', e.target.value)
                                }
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-xs text-zinc-900 dark:text-white"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Toggles */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex flex-wrap items-center justify-between gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800 dark:text-zinc-200">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 accent-[#FF6B35]"
                      />
                      <span>Featured on Home</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800 dark:text-zinc-200">
                      <input
                        type="checkbox"
                        checked={isBestSeller}
                        onChange={(e) => setIsBestSeller(e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                      />
                      <span>Best Seller Badge</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800 dark:text-zinc-200">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 accent-emerald-500"
                      />
                      <span>Active & Live</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Modal Footer CTA */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handleSaveOfflineDraft}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5"
                >
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Save Offline Draft</span>
                </button>

                <div className="flex items-center gap-2">
                  {useQuick3StepMode && mobileWizardStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setMobileWizardStep((mobileWizardStep - 1) as 1 | 2 | 3)}
                      className="px-4 py-2.5 rounded-xl font-bold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800"
                    >
                      ← Back
                    </button>
                  )}

                  {useQuick3StepMode && mobileWizardStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setMobileWizardStep((mobileWizardStep + 1) as 1 | 2 | 3)}
                      className="px-6 py-3 rounded-xl font-bold text-white shadow-lg"
                      style={{ backgroundColor: settings.accentColor }}
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-7 py-3 rounded-xl font-bold text-white shadow-xl hover:shadow-2xl transition"
                      style={{ backgroundColor: settings.accentColor }}
                    >
                      {editingDestId ? 'Save & Update Tour Live' : '🚀 Publish Tour Live'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= FULL PREVIEW MODAL FOR GALLERY ITEM ================= */}
      {selectedGalleryItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedGalleryItem(null)}
        >
          <div
            className="max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black aspect-16/10">
              <img
                src={selectedGalleryItem.url}
                alt={selectedGalleryItem.title}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedGalleryItem(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#FF6B35]">
                    {selectedGalleryItem.category}
                  </span>
                  <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
                    {selectedGalleryItem.tourName || selectedGalleryItem.title}
                  </h4>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(selectedGalleryItem.url);
                    showToast('Image URL / Data link copied!', 'success');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 font-bold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
              </div>

              {/* Set as Cover for Any Tour */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <select
                  value={assignTourId}
                  onChange={(e) => setAssignTourId(e.target.value)}
                  className="flex-1 py-2 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-semibold text-zinc-900 dark:text-white"
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setGalleryCoverForTour(assignTourId, selectedGalleryItem.url);
                    setSelectedGalleryItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FF6B35] text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Set as Cover Photo</span>
                </button>

                <button
                  onClick={() => {
                    deleteGalleryItem(selectedGalleryItem.id);
                    setSelectedGalleryItem(null);
                  }}
                  className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PAYMENT SCREENSHOT PREVIEW MODAL ================= */}
      {previewScreenshotUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewScreenshotUrl(null)}
        >
          <div className="max-w-lg w-full bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                Customer Uploaded UPI Payment Screenshot
              </h4>
              <button onClick={() => setPreviewScreenshotUrl(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewScreenshotUrl}
              alt="Payment Proof"
              className="w-full max-h-[75vh] object-contain rounded-2xl bg-black"
            />
          </div>
        </div>
      )}

      {/* ================= POST-PUBLISH WHATSAPP STATUS & INSTAGRAM SHARE MODAL ================= */}
      {publishedTourShare && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
              Tour Published Live! 🎉
            </h3>
            <p className="text-xs text-zinc-500">
              <strong>{publishedTourShare.title}</strong> ({publishedTourShare.duration}) is now live on Om Travels & Adventure On The Way. Share it directly on WhatsApp Status or Instagram!
            </p>
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  const text = encodeURIComponent(
                    `🏔️ *NEW YATRA / TOUR PACKAGE LAUNCHED!* 🏔️\n\n` +
                      `✨ *${publishedTourShare.title}*\n` +
                      `📍 ${publishedTourShare.location}\n` +
                      `⏳ ${publishedTourShare.duration}\n` +
                      `💰 Special Offer: *${formatPrice(publishedTourShare.price)}*\n\n` +
                      `📞 Call/WhatsApp Om Travels (Haridwar): +91 94217 09258 / +91 86687 40237\n` +
                      `🌐 Book Now: ${window.location.origin}`
                  );
                  window.open(`https://wa.me/?text=${text}`, '_blank');
                }}
                className="w-full py-3 rounded-2xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>Share New Tour on WhatsApp Status / Groups</span>
              </button>

              <a
                href="https://instagram.com/adventure_on_the_way"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Post on Instagram (@adventure_on_the_way)</span>
              </a>

              <button
                onClick={() => setPublishedTourShare(null)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
