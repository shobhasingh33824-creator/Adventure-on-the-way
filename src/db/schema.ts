import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export interface ItineraryDaySchema {
  day: number;
  title: string;
  description: string;
  meals: string[];
  accommodation: string;
  altitude?: string;
}

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').default('+91 94217 09258').notNull(),
  profileImageUrl: text('profile_image_url').default('').notNull(),
  role: text('role').default('user').notNull(),
  isBlocked: boolean('is_blocked').default(false).notNull(),
  totalBookings: integer('total_bookings').default(0).notNull(),
  wishlist: jsonb('wishlist').$type<string[]>().default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const destinations = pgTable('destinations', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  location: text('location').notNull(),
  state: text('state').default('Uttarakhand').notNull(),
  category: text('category').notNull(),
  price: integer('price').notNull(),
  discountPrice: integer('discount_price').notNull(),
  duration: text('duration').notNull(),
  durationDays: integer('duration_days').notNull(),
  durationNights: integer('duration_nights').notNull(),
  maxSeats: integer('max_seats').notNull(),
  availableSeats: integer('available_seats').notNull(),
  difficulty: text('difficulty').notNull(),
  shortDescription: text('short_description').notNull(),
  description: text('description').notNull(),
  itinerary: jsonb('itinerary').$type<ItineraryDaySchema[]>().notNull(),
  inclusions: jsonb('inclusions').$type<string[]>().notNull(),
  exclusions: jsonb('exclusions').$type<string[]>().notNull(),
  images: jsonb('images').$type<string[]>().notNull(),
  featured: boolean('featured').default(false).notNull(),
  isBestSeller: boolean('is_best_seller').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  rating: real('rating').default(4.9).notNull(),
  totalReviews: integer('total_reviews').default(100).notNull(),
  mapCoordinates: jsonb('map_coordinates')
    .$type<{ lat: number; lng: number }>()
    .notNull(),
  pickupPoint: text('pickup_point').default('Haridwar / Rishikesh').notNull(),
  nextAvailableDates: jsonb('next_available_dates')
    .$type<string[]>()
    .default([])
    .notNull(),
  createdBy: text('created_by').default('admin@adventureontheway.com').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  packageId: text('package_id').notNull(),
  packageTitle: text('package_title').notNull(),
  packageImage: text('package_image').notNull(),
  packageDuration: text('package_duration').notNull(),
  userId: text('user_id').notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  idProofType: text('id_proof_type').notNull(),
  idProofNumber: text('id_proof_number').notNull(),
  specialRequests: text('special_requests').default(''),
  travelDate: text('travel_date').notNull(),
  adults: integer('adults').notNull(),
  children: integer('children').default(0).notNull(),
  baseAmount: integer('base_amount').notNull(),
  discountAmount: integer('discount_amount').default(0).notNull(),
  taxAmount: integer('tax_amount').default(0).notNull(),
  totalAmount: integer('total_amount').notNull(),
  paidAmount: integer('paid_amount').notNull(),
  pendingAmount: integer('pending_amount').default(0).notNull(),
  couponCode: text('coupon_code'),
  paymentMethod: text('payment_method').notNull(),
  paymentStatus: text('payment_status').notNull(),
  utrNumber: text('utr_number'),
  paymentScreenshot: text('payment_screenshot').default(''),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const coupons = pgTable('coupons', {
  code: text('code').primaryKey(),
  discountPercent: integer('discount_percent').notNull(),
  maxDiscount: integer('max_discount').notNull(),
  minOrderValue: integer('min_order_value').notNull(),
  description: text('description').notNull(),
  active: boolean('active').default(true).notNull(),
  expiryDate: text('expiry_date').notNull(),
});

export const siteSettings = pgTable('site_settings', {
  id: integer('id').primaryKey().default(1),
  brandName: text('brand_name').notNull(),
  shortName: text('short_name').default('Adventure On The Way').notNull(),
  tagline: text('tagline').notNull(),
  aboutText: text('about_text')
    .default(
      'Adventure On The Way is one of the best travel companies to provide best tour packages of Uttarakhand - Chardham Yatra, Aadi Kailash Om Parvat Yatra, Mussoorie, Nainital and all Uttarakhand tour packages.'
    )
    .notNull(),
  primaryColor: text('primary_color').notNull(),
  accentColor: text('accent_color').notNull(),
  heroBannerUrl: text('hero_banner_url').notNull(),
  logoUrl: text('logo_url').default('').notNull(),
  heroHeadline: text('hero_headline').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  secondaryPhone: text('secondary_phone').default('+91 86687 40237').notNull(),
  whatsappNumber: text('whatsapp_number').notNull(),
  whatsappLink: text('whatsapp_link').notNull(),
  callLink: text('call_link').notNull(),
  secondaryCallLink: text('secondary_call_link').default('tel:+918668740237').notNull(),
  officeAddress: text('office_address').notNull(),
  upiId: text('upi_id').notNull(),
  instagramUrl: text('instagram_url').notNull(),
  instagramHandle: text('instagram_handle').default('@adventure_on_the_way').notNull(),
  instagramFollowers: text('instagram_followers').default('71,175 Followers').notNull(),
  openHours: text('open_hours').default('Open 24 Hours').notNull(),
  facebookUrl: text('facebook_url').notNull(),
  youtubeUrl: text('youtube_url').notNull(),
});

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  read: boolean('read').default(false).notNull(),
});

export const gallery = pgTable('gallery', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  title: text('title').notNull(),
  tourId: text('tour_id').default(''),
  tourName: text('tour_name').default(''),
  category: text('category').default('tour').notNull(),
  sizeKb: integer('size_kb').default(240).notNull(),
  width: integer('width').default(1200).notNull(),
  height: integer('height').default(800).notNull(),
  uploadedBy: text('uploaded_by').default('admin@adventureontheway.com').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const enquiries = pgTable('enquiries', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  destination: text('destination').notNull(),
  message: text('message').notNull(),
  status: text('status').default('New').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.uid],
  }),
  destination: one(destinations, {
    fields: [bookings.packageId],
    references: [destinations.id],
  }),
}));
