export type DifficultyLevel = 'Easy' | 'Moderate' | 'Challenging' | 'Extreme';
export type TourCategory =
  | 'Chardham'
  | 'Yatra'
  | 'Trek'
  | 'Bike Trip'
  | 'Camping'
  | 'Expedition'
  | 'Family'
  | 'Water Sports'
  | 'Honeymoon'
  | 'Wildlife';

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string;
  stay?: string;
  altitude?: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  tourName: string;
  verified: boolean;
}

export interface TourPackage {
  id: string;
  title: string;
  location: string;
  state: string;
  price: number;
  originalPrice: number;
  duration: string;
  days: number;
  difficulty: DifficultyLevel;
  category: TourCategory;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  shortDescription: string;
  altitude?: string;
  bestSeason: string;
  groupSize: string;
  startEndLocation: string;
  maxSeats: number;
  availableSeats: number;
  featured: boolean;
  trending: boolean;
  isActive?: boolean;
  isBestSeller?: boolean;
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  highlights: string[];
}

export type BookingStatus = 'Pending Verification' | 'Confirmed' | 'Completed' | 'Cancelled';
export type PaymentMethod = 'UPI' | 'Razorpay' | 'Card' | 'NetBanking' | 'Pay on Trip';

export interface Booking {
  id: string;
  packageId: string;
  packageTitle: string;
  packageImage: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  travelDate: string;
  adults: number;
  children: number;
  basePrice: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Advance Paid' | 'Pending Verification' | 'Refunded';
  transactionId?: string;
  paymentScreenshot?: string;
  bookingStatus: BookingStatus;
  createdAt: string;
  idProofType?: string;
  idProofNumber?: string;
  specialRequests?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'user' | 'admin' | 'staff';
  isBlocked?: boolean;
  createdAt: string;
  emergencyContact?: string;
  bio?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minBookingValue: number;
  description: string;
  active: boolean;
}

export interface SiteSettings {
  brandName: string;
  shortName?: string;
  tagline: string;
  aboutText?: string;
  primaryColor: string;
  accentColor: string;
  heroBannerImage: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  secondaryPhone: string;
  upiId: string;
  whatsappNumber: string;
  whatsappLink: string;
  callLink: string;
  secondaryCallLink: string;
  address: string;
  instagramUrl: string;
  instagramHandle: string;
  instagramFollowers: string;
  openHours: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  tourId?: string;
  tourName?: string;
  category: 'tour' | 'logo' | 'banner' | 'payment' | 'profile' | 'blog';
  sizeKb: number;
  width: number;
  height: number;
  uploadedBy: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  destination: string;
  message: string;
  status: 'New' | 'Contacted' | 'Converted';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  readTime: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  author: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'booking' | 'payment' | 'seats' | 'user';
  read: boolean;
}

export type Currency = 'INR' | 'USD';
export type Language = 'en' | 'hi';
