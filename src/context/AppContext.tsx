import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import { syncOfflineDraftsToDatabase } from '../lib/imageUpload';
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
  GalleryItem,
  Enquiry,
} from '../types';
import {
  initialPackages,
  initialSiteSettings,
  initialCoupons,
  initialUsers,
  initialBookings,
  initialNotifications,
  initialGallery,
  initialEnquiries,
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
  addPackage: (pkg: Omit<TourPackage, 'id'>) => TourPackage;
  updatePackage: (id: string, pkg: Partial<TourPackage>) => void;
  deletePackage: (id: string) => void;
  duplicatePackage: (id: string) => void;
  togglePackageStatus: (id: string) => void;
  selectedPackage: TourPackage | null;
  setSelectedPackage: (pkg: TourPackage | null) => void;

  // Gallery Manager
  gallery: GalleryItem[];
  addGalleryItems: (items: GalleryItem[]) => void;
  deleteGalleryItem: (id: string) => void;
  setGalleryCoverForTour: (tourId: string, imageUrl: string) => void;

  // Enquiries
  enquiries: Enquiry[];
  addEnquiry: (data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateEnquiryStatus: (id: string, status: Enquiry['status']) => void;

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
  heroTitle: {
    en: 'Haridwar se Himalaya Tak – Live The Adventure',
    hi: 'हरिद्वार से हिमालय तक – रोमांच को जियो',
  },
  heroSubtitle: {
    en: "Don't Just Travel, Live The Adventure - Haridwar se Himalaya Tak",
    hi: 'सिर्फ यात्रा मत करो, रोमांच को जियो - हरिद्वार से हिमालय तक',
  },
  searchDestinationPlaceholder: {
    en: 'Where to? (Chardham, Kedarnath, Aadi Kailash, Auli, Mussoorie)',
    hi: 'कहाँ जाना है? (चारधाम, केदारनाथ, आदि कैलाश, औली)',
  },
  date: { en: 'Date', hi: 'तारीख' },
  travellers: { en: 'Travellers', hi: 'यात्री' },
  searchTours: { en: 'Search Yatra & Tours', hi: 'यात्रा खोजें' },
  trendingDestinations: {
    en: 'Most Popular Uttarakhand Yatras & Tours',
    hi: 'सबसे लोकप्रिय उत्तराखंड यात्राएं',
  },
  whyChooseUs: {
    en: 'Why Choose Om Travels & Adventure On The Way',
    hi: 'ओम ट्रैवल्स और एडवेंचर ऑन द वे क्यों चुनें?',
  },
  featuredPackages: {
    en: 'Uttarakhand Chardham & Himalayan Packages',
    hi: 'उत्तराखंड चारधाम और हिमालय पैकेज',
  },
  storiesTitle: { en: 'Yatra Guides & Travel Stories', hi: 'यात्रा गाइड और अनुभव' },
  reviewsTitle: { en: 'Verified Yatri & Traveler Reviews', hi: 'सत्यापित यात्रियों की समीक्षाएं' },
  myBookings: { en: 'My Bookings', hi: 'मेरी बुकिंग्स' },
  adminPanel: { en: 'Admin Portal', hi: 'एडमिन पोर्टल' },
  loginSignup: { en: 'Login / Sign Up', hi: 'लॉग इन / साइन अप' },
  viewDetails: { en: 'View Details', hi: 'विवरण देखें' },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const [packages, setPackages] = useState<TourPackage[]>(initialPackages);
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
  const [bookingModalPackage, setBookingModalPackage] = useState<TourPackage | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [wishlist, setWishlist] = useState<string[]>([
    'chardham-yatra-uttarakhand',
    'aadi-kailash-om-parvat-yatra',
  ]);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
  const [notifications, setNotifications] = useState<AdminNotification[]>(initialNotifications);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

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

  const fetchDatabaseState = async () => {
    try {
      const res = await fetch('/api/state');
      if (!res.ok) return;
      const data = await res.json();
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
      if (Array.isArray(data.gallery)) {
        setGallery(data.gallery);
      }
      if (Array.isArray(data.enquiries)) {
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      console.error('Error fetching state from API:', err);
    }
  };

  useEffect(() => {
    fetchDatabaseState();

    const handleOnline = async () => {
      const synced = await syncOfflineDraftsToDatabase();
      if (synced > 0) {
        showToast(
          `Back online! Synced ${synced} offline draft photo(s)/tour(s) to database.`,
          'success'
        );
        fetchDatabaseState();
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((err) => console.error('Failed to persist settings:', err));
    showToast('Brand & Theme settings saved to database!', 'success');
  };

  const handleHeroSearch = (query: SearchQuery) => {
    setSearchQuery(query);
    setActiveTab('destinations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addPackage = (newPkgData: Omit<TourPackage, 'id'>): TourPackage => {
    const id =
      newPkgData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
      '-' +
      Date.now().toString().slice(-4);
    const createdPackage: TourPackage = {
      ...newPkgData,
      id,
      isActive: newPkgData.isActive !== false,
      isBestSeller: newPkgData.isBestSeller ?? false,
    };
    setPackages((prev) => [createdPackage, ...prev]);
    fetch('/api/destinations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createdPackage),
    }).catch((err) => console.error('Failed to persist package:', err));
    showToast('Tour Published Successfully ✅', 'success');
    return createdPackage;
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
    showToast('Tour package updated in database!', 'success');
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    fetch(`/api/destinations/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to delete package from DB:', err));
    showToast('Tour package removed from database.', 'info');
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

  // Gallery Management
  const addGalleryItems = (items: GalleryItem[]) => {
    setGallery((prev) => [...items, ...prev]);
  };

  const deleteGalleryItem = (id: string) => {
    const target = gallery.find((g) => g.id === id);
    setGallery((prev) => prev.filter((g) => g.id !== id));
    fetch(`/api/gallery/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to delete gallery item:', err));

    // Also remove from associated tour's images[] if present
    if (target?.url) {
      setPackages((prev) =>
        prev.map((pkg) => {
          if (pkg.images.includes(target.url) && pkg.images.length > 1) {
            const updatedPkg = {
              ...pkg,
              images: pkg.images.filter((img) => img !== target.url),
            };
            fetch(`/api/destinations/${encodeURIComponent(pkg.id)}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedPkg),
            }).catch(() => {});
            return updatedPkg;
          }
          return pkg;
        })
      );
    }
    showToast('Photo removed from Gallery & Storage.', 'info');
  };

  const setGalleryCoverForTour = (tourId: string, imageUrl: string) => {
    setPackages((prev) =>
      prev.map((pkg) => {
        if (pkg.id === tourId) {
          const filtered = pkg.images.filter((img) => img !== imageUrl);
          const updatedPkg = {
            ...pkg,
            images: [imageUrl, ...filtered],
          };
          fetch(`/api/destinations/${encodeURIComponent(pkg.id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPkg),
          }).catch((err) => console.error('Failed to set tour cover:', err));
          showToast(`Set as main Cover Photo for "${pkg.title}"!`, 'success');
          return updatedPkg;
        }
        return pkg;
      })
    );
  };

  // Enquiries
  const addEnquiry = (data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => {
    const newEnq: Enquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEnquiries((prev) => [newEnq, ...prev]);
    fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEnq),
    }).catch((err) => console.error('Failed to save enquiry:', err));
    showToast('Enquiry sent to Om Travels Haridwar HQ! We will call you shortly.', 'success');
  };

  const updateEnquiryStatus = (id: string, status: Enquiry['status']) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
    fetch(`/api/enquiries/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((err) => console.error('Failed to update enquiry status:', err));
    showToast(`Enquiry marked as ${status}`, 'info');
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

    showToast(`Booking ${newBooking.id} confirmed & saved to database!`, 'success');
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
    const cleanId = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (
      (cleanId === '@admin' ||
        cleanId === 'admin' ||
        cleanId === 'admin@adventureontheway.com' ||
        cleanId === 'admin@adventure.com') &&
      (cleanPass === 'ADMIN123' ||
        cleanPass.toUpperCase() === 'ADMIN123' ||
        cleanPass === 'Admin@123')
    ) {
      const adminUser: User = {
        id: 'usr-admin-1',
        name: 'Om Travels Admin (@admin)',
        email: '@admin',
        phone: '+91 94217 09258',
        avatar: '/assets/aistudio/Screenshot_20261108-104735_f720548e.png',
        role: 'admin',
        createdAt: '2025-01-01',
      };
      setCurrentUser(adminUser);
      setAuthModalOpen(false);
      showToast('Welcome, Admin (@admin)! Launching Super Admin Control Center.', 'success');
      setActiveTab('admin');
      return true;
    }

    const found = allUsers.find((u) => u.email.toLowerCase() === cleanId);
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
      name: email.replace('@', '').split('@')[0].toUpperCase() || 'ADVENTURER',
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
    showToast(`Logged in as Yatri: ${demoUser.name}`, 'success');
  };

  const loginAsAdmin = () => {
    login('@admin', 'ADMIN123');
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
        gallery,
        addGalleryItems,
        deleteGalleryItem,
        setGalleryCoverForTour,
        enquiries,
        addEnquiry,
        updateEnquiryStatus,
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
