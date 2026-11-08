import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import {
  TourPackage,
  Booking,
  User,
  Coupon,
  SiteSettings,
  Currency,
  Language,
  BookingStatus,
  AdminNotification,
} from '../types';
import {
  initialPackages,
  initialSiteSettings,
  initialCoupons,
  initialUsers,
  initialBookings,
  initialNotifications,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface SearchQuery {
  destination: string;
  category: string;
  date: string;
  travellers: number;
}

interface AppContextType {
  // Theme & Settings
  darkMode: boolean;
  toggleDarkMode: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  formatPrice: (amountInInr: number) => string;
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  t: (key: string) => string;

  // Navigation
  activeTab: 'home' | 'destinations' | 'about' | 'contact' | 'user-dashboard' | 'admin';
  setActiveTab: (tab: 'home' | 'destinations' | 'about' | 'contact' | 'user-dashboard' | 'admin') => void;

  // Search state
  searchQuery: SearchQuery;
  setSearchQuery: (q: SearchQuery) => void;
  handleHeroSearch: (query: SearchQuery) => void;

  // Packages
  packages: TourPackage[];
  addPackage: (pkg: Omit<TourPackage, 'id'>) => void;
  updatePackage: (id: string, pkg: Partial<TourPackage>) => void;
  deletePackage: (id: string) => void;
  duplicatePackage: (id: string) => void;
  togglePackageStatus: (id: string) => void;
  selectedPackage: TourPackage | null;
  setSelectedPackage: (pkg: TourPackage | null) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (packageId: string) => void;
  isWishlisted: (packageId: string) => boolean;

  // Bookings
  bookings: Booking[];
  addBooking: (bookingData: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  verifyPayment: (id: string) => void;
  bookingModalPackage: TourPackage | null;
  setBookingModalPackage: (pkg: TourPackage | null) => void;

  // Auth & Users
  currentUser: User | null;
  login: (email: string, pass: string) => boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoUser: () => void;
  loginAsAdmin: () => void;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<User>) => void;
  allUsers: User[];
  toggleBlockUser: (id: string) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;

  // Admin Notifications
  notifications: AdminNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  validateCoupon: (code: string, amount: number) => { valid: boolean; discount: number; message: string };

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations: Record<string, { en: string; hi: string }> = {
  home: { en: 'Home', hi: 'होम' },
  destinations: { en: 'Destinations', hi: 'मंजिलें' },
  packages: { en: 'Tour Packages', hi: 'टूर पैकेज' },
  about: { en: 'About Us', hi: 'हमारे बारे में' },
  contact: { en: 'Contact', hi: 'संपर्क करें' },
  bookNow: { en: 'Book Now', hi: 'अभी बुक करें' },
  heroTitle: { en: 'Your Next Adventure Starts Here', hi: 'आपका अगला रोमांच यहाँ शुरू होता है' },
  heroSubtitle: { en: "Don't Just Travel, Live The Adventure", hi: 'सिर्फ यात्रा मत करो, रोमांच को जियो' },
  searchDestinationPlaceholder: { en: 'Where to? (e.g. Manali, Spiti, Ladakh)', hi: 'कहाँ जाना है? (जैसे मनाली, स्पीति)' },
  date: { en: 'Date', hi: 'तारीख' },
  travellers: { en: 'Travellers', hi: 'यात्री' },
  searchTours: { en: 'Search Adventures', hi: 'रोमांच खोजें' },
  trendingDestinations: { en: 'Trending Expeditions', hi: 'ट्रेंडिंग यात्राएं' },
  whyChooseUs: { en: 'Why Adventure on the Way', hi: 'हमारा ही चयन क्यों?' },
  featuredPackages: { en: 'Handcrafted Tour Packages', hi: 'हैंडक्राफ़्टेड टूर पैकेज' },
  storiesTitle: { en: 'Expedition Stories & Guides', hi: 'यात्रा वृतांत और अनुभव' },
  reviewsTitle: { en: 'Stories From Real Adventurers', hi: 'असली साहसी यात्रियों की समीक्षाएं' },
  myBookings: { en: 'My Bookings', hi: 'मेरी बुकिंग्स' },
  adminPanel: { en: 'Admin Portal', hi: 'एडमिन पोर्टल' },
  loginSignup: { en: 'Login / Sign Up', hi: 'लॉग इन / साइन अप' },
  viewDetails: { en: 'View Details', hi: 'विवरण देखें' },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store Firebase ID Token strictly in memory (never in localStorage)
  const authTokenRef = useRef<string | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currency, setCurrencyState] = useState<Currency>('INR');
  const [language, setLanguageState] = useState<Language>('en');
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [activeTab, setActiveTab] = useState<'home' | 'destinations' | 'about' | 'contact' | 'user-dashboard' | 'admin'>('home');

  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    destination: '',
    category: 'All',
    date: '',
    travellers: 2,
  });

  const [packages, setPackages] = useState<TourPackage[]>(
    initialPackages.map((p) => ({
      ...p,
      isActive: true,
      isBestSeller: p.rating >= 4.9,
    }))
  );
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
  const [bookingModalPackage, setBookingModalPackage] = useState<TourPackage | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([
    'spiti-valley-expedition',
    'ladakh-bike-odyssey',
  ]);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
  const [notifications, setNotifications] = useState<AdminNotification[]>(initialNotifications);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (auth.currentUser) {
      const freshToken = await auth.currentUser.getIdToken();
      authTokenRef.current = freshToken;
    }
    if (authTokenRef.current) {
      headers['Authorization'] = `Bearer ${authTokenRef.current}`;
    }
    return headers;
  };

  // Load application state from PostgreSQL database on mount
  useEffect(() => {
    let active = true;
    async function fetchDatabaseState() {
      try {
        const res = await fetch('/api/state');
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        if (Array.isArray(data.packages) && data.packages.length > 0) {
          setPackages(data.packages);
        }
        if (Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        }
        if (Array.isArray(data.users) && data.users.length > 0) {
          setAllUsers(data.users);
        }
        if (Array.isArray(data.coupons) && data.coupons.length > 0) {
          setCoupons(data.coupons);
        }
        if (data.settings) {
          setSettings(data.settings);
        }
        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error('Error fetching state from API:', err);
      }
    }
    fetchDatabaseState();
    return () => {
      active = false;
    };
  }, []);

  // Listen to Firebase Auth state changes and synchronize user profile in PostgreSQL
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        authTokenRef.current = null;
        return;
      }
      try {
        const idToken = await firebaseUser.getIdToken();
        authTokenRef.current = idToken;

        const res = await fetch('/api/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            name: firebaseUser.displayName,
            avatar: firebaseUser.photoURL,
          }),
        });
        if (res.ok) {
          const synced = await res.json();
          if (synced.user) {
            setCurrentUser(synced.user);
            setAllUsers((prev) => {
              const exists = prev.some((u) => u.id === synced.user.id);
              return exists
                ? prev.map((u) => (u.id === synced.user.id ? synced.user : u))
                : [synced.user, ...prev];
            });
          }
          if (Array.isArray(synced.wishlist) && synced.wishlist.length > 0) {
            setWishlist(synced.wishlist);
          }
        }
      } catch (error) {
        console.error('Error syncing Firebase user with PostgreSQL:', error);
      }
    });
    return () => unsubscribe();
  }, []);

  // Apply dark mode to HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Apply custom primary color to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
  }, [settings]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const setCurrency = (c: Currency) => setCurrencyState(c);
  const setLanguage = (l: Language) => setLanguageState(l);

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].en;
    }
    return key;
  };

  const formatPrice = (amountInInr: number): string => {
    if (currency === 'USD') {
      const usdAmount = Math.round(amountInInr / 85);
      return `$${usdAmount.toLocaleString('en-US')}`;
    }
    return `₹${amountInInr.toLocaleString('en-IN')}`;
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((err) => console.error('Failed to persist settings:', err));
    showToast('Theme & Brand settings saved to database!', 'success');
  };

  const handleHeroSearch = (query: SearchQuery) => {
    setSearchQuery(query);
    setActiveTab('destinations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Packages management persisted to PostgreSQL
  const addPackage = (newPkgData: Omit<TourPackage, 'id'>) => {
    const id =
      newPkgData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
      '-' +
      Date.now().toString().slice(-4);
    const createdPackage: TourPackage = {
      ...newPkgData,
      id,
      isActive: true,
      isBestSeller: newPkgData.isBestSeller ?? false,
    };
    setPackages((prev) => [createdPackage, ...prev]);
    fetch('/api/destinations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createdPackage),
    }).catch((err) => console.error('Failed to persist package:', err));
    showToast(
      `Package "${createdPackage.title}" saved to PostgreSQL & published live!`,
      'success'
    );
  };

  const updatePackage = (id: string, updatedFields: Partial<TourPackage>) => {
    setPackages((prev) =>
      prev.map((pkg) => {
        if (pkg.id === id) {
          const updatedPkg = { ...pkg, ...updatedFields };
          fetch(`/api/destinations/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPkg),
          }).catch((err) => console.error('Failed to update package in DB:', err));
          return updatedPkg;
        }
        return pkg;
      })
    );
    showToast('Package updated in database!', 'success');
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    fetch(`/api/destinations/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to delete package from DB:', err));
    showToast('Package removed from database.', 'info');
  };

  const duplicatePackage = (id: string) => {
    const target = packages.find((p) => p.id === id);
    if (!target) return;
    const clonedId = target.id + '-copy-' + Date.now().toString().slice(-4);
    const clonedPkg: TourPackage = {
      ...target,
      id: clonedId,
      title: `${target.title} (Copy)`,
      isActive: true,
    };
    setPackages((prev) => [clonedPkg, ...prev]);
    fetch('/api/destinations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clonedPkg),
    }).catch((err) => console.error('Failed to duplicate package in DB:', err));
    showToast(`Package duplicated as "${clonedPkg.title}"!`, 'success');
  };

  const togglePackageStatus = (id: string) => {
    setPackages((prev) =>
      prev.map((pkg) => {
        if (pkg.id === id) {
          const newStatus = pkg.isActive === false ? true : false;
          const updatedPkg = { ...pkg, isActive: newStatus };
          fetch(`/api/destinations/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPkg),
          }).catch((err) => console.error('Failed to toggle package status:', err));
          showToast(
            `"${pkg.title}" is now ${newStatus ? 'ACTIVE (Visible to guests)' : 'HIDDEN (Draft/Inactive)'}`,
            newStatus ? 'success' : 'info'
          );
          return updatedPkg;
        }
        return pkg;
      })
    );
  };

  const toggleWishlist = async (packageId: string) => {
    const nextWishlist = wishlist.includes(packageId)
      ? wishlist.filter((id) => id !== packageId)
      : [...wishlist, packageId];

    setWishlist(nextWishlist);
    showToast(
      wishlist.includes(packageId) ? 'Removed from your Wishlist' : 'Saved to your Wishlist!',
      wishlist.includes(packageId) ? 'info' : 'success'
    );

    if (currentUser && authTokenRef.current) {
      try {
        const headers = await getAuthHeaders();
        await fetch(`/api/users/${encodeURIComponent(currentUser.id)}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ wishlist: nextWishlist }),
        });
      } catch (err) {
        console.error('Failed to sync wishlist to DB:', err);
      }
    }
  };

  const isWishlisted = (packageId: string) => wishlist.includes(packageId);

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      ...bookingData,
      id: `AOTW-2026-${randNum}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBookings((prev) => [newBooking, ...prev]);

    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking),
    }).catch((err) => console.error('Failed to persist booking:', err));

    // Deduct available seats & persist destination seat count
    setPackages((prev) =>
      prev.map((pkg) => {
        if (pkg.id === bookingData.packageId) {
          const bookedSeats = bookingData.adults + bookingData.children;
          const updatedPkg = {
            ...pkg,
            availableSeats: Math.max(0, pkg.availableSeats - bookedSeats),
          };
          fetch(`/api/destinations/${encodeURIComponent(pkg.id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPkg),
          }).catch((err) => console.error('Failed to update seats:', err));
          return updatedPkg;
        }
        return pkg;
      })
    );

    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Booking Received',
      message: `${bookingData.userName} booked ${bookingData.packageTitle} (Ref: ${newBooking.id})`,
      time: 'Just now',
      type: 'booking',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Booking ${newBooking.id} confirmed & stored in database!`, 'success');
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, bookingStatus: status } : b))
    );
    fetch(`/api/bookings/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((err) => console.error('Failed to update booking status:', err));
    showToast(`Booking ${id} status changed to ${status}`, 'info');
  };

  const verifyPayment = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, paymentStatus: 'Paid', bookingStatus: 'Confirmed' }
          : b
      )
    );
    fetch(`/api/bookings/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus: 'Paid', status: 'Confirmed' }),
    }).catch((err) => console.error('Failed to verify payment:', err));
    showToast(`UPI payment verified for booking ${id}!`, 'success');
  };

  // Real Firebase Google Sign-In via signInWithPopup
  const loginWithGoogle = async () => {
    try {
      const credential = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await credential.user.getIdToken();
      authTokenRef.current = idToken;

      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: credential.user.displayName,
          avatar: credential.user.photoURL,
        }),
      });

      if (res.ok) {
        const synced = await res.json();
        if (synced.user) {
          setCurrentUser(synced.user);
        }
      }
      setAuthModalOpen(false);
      showToast(
        `Signed in with Google as ${credential.user.displayName || credential.user.email}!`,
        'success'
      );
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      showToast(
        error?.message || 'Google Sign-In could not be completed. Please try again.',
        'error'
      );
    }
  };

  const login = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();

    if (
      (cleanEmail === 'admin@adventureontheway.com' && pass === 'Admin@123') ||
      (cleanEmail === 'admin@adventure.com' && pass === 'admin123')
    ) {
      const adminUser: User = {
        id: 'usr-admin-1',
        name: 'Adventure Commander (Admin)',
        email: 'admin@adventureontheway.com',
        phone: '+91 94217 09258',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
        role: 'admin',
        createdAt: '2026-01-01',
      };
      setCurrentUser(adminUser);
      setAuthModalOpen(false);
      showToast('Welcome, Administrator! Launching Super Admin Control Center.', 'success');
      setActiveTab('admin');
      return true;
    }

    const found = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (found) {
      if (found.isBlocked) {
        showToast('Your account is currently disabled. Please contact support.', 'error');
        return false;
      }
      setCurrentUser(found);
      setAuthModalOpen(false);
      showToast(`Welcome back, ${found.name}!`, 'success');
      return true;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      phone: '+91 94217 09258',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      role: 'user',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setAuthModalOpen(false);
    showToast(`Account created! Welcome, ${newUser.name}!`, 'success');
    return true;
  };

  const loginAsDemoUser = () => {
    const demoUser = allUsers.find((u) => u.role === 'user') || initialUsers[1];
    setCurrentUser(demoUser);
    setAuthModalOpen(false);
    showToast(`Logged in as Traveler: ${demoUser.name}`, 'success');
  };

  const loginAsAdmin = () => {
    login('admin@adventureontheway.com', 'Admin@123');
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Error signing out of Firebase:', e);
    }
    authTokenRef.current = null;
    setCurrentUser(null);
    if (activeTab === 'admin' || activeTab === 'user-dashboard') {
      setActiveTab('home');
    }
    showToast('Logged out successfully.', 'info');
  };

  const updateUserProfile = async (profile: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...profile };
    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

    if (authTokenRef.current) {
      try {
        const headers = await getAuthHeaders();
        await fetch(`/api/users/${encodeURIComponent(currentUser.id)}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            fullName: updated.name,
            phone: updated.phone,
            profileImageUrl: updated.avatar,
          }),
        });
      } catch (err) {
        console.error('Failed to update user profile in DB:', err);
      }
    }
    showToast('Profile information updated!', 'success');
  };

  const toggleBlockUser = async (id: string) => {
    const target = allUsers.find((u) => u.id === id);
    const nextBlocked = target ? !target.isBlocked : true;
    setAllUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isBlocked: nextBlocked } : u))
    );
    if (authTokenRef.current) {
      try {
        const headers = await getAuthHeaders();
        await fetch(`/api/users/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ isBlocked: nextBlocked }),
        });
      } catch (err) {
        console.error('Failed to update user block status:', err);
      }
    }
    showToast('User status updated.', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('All notifications cleared.', 'info');
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev.filter((c) => c.code !== coupon.code)]);
    fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon),
    }).catch((err) => console.error('Failed to save coupon to DB:', err));
    showToast(`Coupon ${coupon.code} saved to database!`, 'success');
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    fetch(`/api/coupons/${encodeURIComponent(code)}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to delete coupon from DB:', err));
    showToast(`Coupon ${code} removed.`, 'info');
  };

  const validateCoupon = (code: string, amount: number) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === cleanCode && c.active);
    if (!found) {
      return { valid: false, discount: 0, message: 'Invalid or expired coupon code' };
    }
    if (amount < found.minBookingValue) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum booking value of ₹${found.minBookingValue} required for this coupon`,
      };
    }
    let discount = 0;
    if (found.discountType === 'percentage') {
      discount = Math.round((amount * found.discountValue) / 100);
    } else {
      discount = found.discountValue;
    }
    return { valid: true, discount, message: `Coupon applied: ${found.description}` };
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        currency,
        setCurrency,
        language,
        setLanguage,
        formatPrice,
        settings,
        updateSettings,
        t,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        handleHeroSearch,
        packages,
        addPackage,
        updatePackage,
        deletePackage,
        duplicatePackage,
        togglePackageStatus,
        selectedPackage,
        setSelectedPackage,
        wishlist,
        toggleWishlist,
        isWishlisted,
        bookings,
        addBooking,
        updateBookingStatus,
        verifyPayment,
        bookingModalPackage,
        setBookingModalPackage,
        currentUser,
        login,
        loginWithGoogle,
        loginAsDemoUser,
        loginAsAdmin,
        logout,
        updateUserProfile,
        allUsers,
        toggleBlockUser,
        authModalOpen,
        setAuthModalOpen,
        notifications,
        markNotificationRead,
        clearNotifications,
        coupons,
        addCoupon,
        deleteCoupon,
        validateCoupon,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
