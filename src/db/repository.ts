import { eq, desc } from 'drizzle-orm';
import { db } from './index.ts';
import {
  users,
  destinations,
  bookings,
  coupons,
  siteSettings,
  notifications,
  ItineraryDaySchema,
} from './schema.ts';
import {
  initialPackages,
  initialSiteSettings,
  initialCoupons,
  initialUsers,
  initialBookings,
  initialNotifications,
} from '../data/initialData.ts';
import type {
  TourPackage,
  Booking,
  User,
  Coupon,
  SiteSettings,
  AdminNotification,
  DifficultyLevel,
  TourCategory,
  BookingStatus,
  PaymentMethod,
} from '../types/index.ts';

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function mapRowToPackage(row: typeof destinations.$inferSelect): TourPackage {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    state: row.state,
    price: row.discountPrice || row.price,
    originalPrice: row.price,
    duration: row.duration,
    days: row.durationDays,
    difficulty: (row.difficulty as DifficultyLevel) || 'Moderate',
    category: (row.category as TourCategory) || 'Trek',
    rating: Number(row.rating) || 4.9,
    reviewCount: row.totalReviews || 100,
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description,
    shortDescription: row.shortDescription,
    altitude:
      row.itinerary && row.itinerary[0]?.altitude
        ? row.itinerary[0].altitude
        : '11,500 ft',
    bestSeason: 'May – Oct',
    groupSize: `Max ${row.maxSeats} Adventurers`,
    startEndLocation: row.pickupPoint || 'Delhi / Manali',
    maxSeats: row.maxSeats,
    availableSeats: row.availableSeats,
    featured: row.featured,
    trending: row.isBestSeller || row.featured,
    isActive: row.isActive,
    isBestSeller: row.isBestSeller,
    inclusions: Array.isArray(row.inclusions) ? row.inclusions : [],
    exclusions: Array.isArray(row.exclusions) ? row.exclusions : [],
    itinerary: Array.isArray(row.itinerary)
      ? row.itinerary.map((d) => ({
          day: d.day,
          title: d.title,
          description: d.description,
          meals: Array.isArray(d.meals) ? d.meals.join(', ') : 'Breakfast & Dinner',
          stay: d.accommodation || 'Hotel / Alpine Camp',
          altitude: d.altitude,
        }))
      : [],
    highlights: Array.isArray(row.inclusions) ? row.inclusions.slice(0, 4) : [],
  };
}

function mapPackageToRow(pkg: TourPackage): typeof destinations.$inferInsert {
  const itineraryData: ItineraryDaySchema[] = (pkg.itinerary || []).map((d) => ({
    day: d.day,
    title: d.title,
    description: d.description,
    meals: d.meals ? d.meals.split(',').map((s) => s.trim()) : ['Breakfast', 'Dinner'],
    accommodation: d.stay || 'Alpine Camp / Boutique Stay',
    altitude: d.altitude || pkg.altitude,
  }));

  return {
    id: pkg.id,
    title: pkg.title,
    slug: slugify(pkg.title),
    location: pkg.location,
    state: pkg.state || 'Himachal Pradesh',
    category: pkg.category,
    price: pkg.originalPrice || pkg.price,
    discountPrice: pkg.price,
    duration: pkg.duration,
    durationDays: pkg.days || 5,
    durationNights: Math.max(1, (pkg.days || 5) - 1),
    maxSeats: pkg.maxSeats || 20,
    availableSeats: pkg.availableSeats ?? 12,
    difficulty: pkg.difficulty,
    shortDescription: pkg.shortDescription || pkg.description.slice(0, 140),
    description: pkg.description,
    itinerary: itineraryData,
    inclusions: pkg.inclusions || [],
    exclusions: pkg.exclusions || [],
    images: pkg.images || [],
    featured: Boolean(pkg.featured),
    isBestSeller: Boolean(pkg.isBestSeller ?? pkg.trending),
    isActive: pkg.isActive !== false,
    rating: pkg.rating || 4.9,
    totalReviews: pkg.reviewCount || 85,
    mapCoordinates: { lat: 32.2432, lng: 77.1892 },
    pickupPoint: pkg.startEndLocation || 'Delhi / Manali',
    nextAvailableDates: ['2025-05-15', '2025-06-01', '2025-06-15'],
    createdBy: 'admin@adventureontheway.com',
  };
}

function mapRowToBooking(row: typeof bookings.$inferSelect): Booking {
  return {
    id: row.id,
    packageId: row.packageId,
    packageTitle: row.packageTitle,
    packageImage: row.packageImage,
    userId: row.userId,
    userName: row.customerName,
    userEmail: row.customerEmail,
    userPhone: row.customerPhone,
    travelDate: row.travelDate,
    adults: row.adults,
    children: row.children,
    basePrice: row.baseAmount,
    discountAmount: row.discountAmount,
    couponCode: row.couponCode || undefined,
    totalAmount: row.totalAmount,
    advanceAmount: row.paidAmount,
    balanceAmount: row.pendingAmount,
    paymentMethod: (row.paymentMethod as PaymentMethod) || 'UPI',
    paymentStatus:
      (row.paymentStatus as Booking['paymentStatus']) || 'Pending Verification',
    transactionId: row.utrNumber || undefined,
    bookingStatus: (row.status as BookingStatus) || 'Pending Verification',
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString().split('T')[0]
        : String(row.createdAt),
    idProofType: row.idProofType,
    idProofNumber: row.idProofNumber,
    specialRequests: row.specialRequests || undefined,
  };
}

function mapBookingToRow(b: Booking): typeof bookings.$inferInsert {
  return {
    id: b.id,
    packageId: b.packageId,
    packageTitle: b.packageTitle,
    packageImage: b.packageImage,
    packageDuration: '6D / 5N',
    userId: b.userId,
    customerName: b.userName,
    customerEmail: b.userEmail,
    customerPhone: b.userPhone,
    idProofType: b.idProofType || 'Aadhaar Card',
    idProofNumber: b.idProofNumber || 'XXXX-XXXX-8291',
    specialRequests: b.specialRequests || '',
    travelDate: b.travelDate,
    adults: b.adults,
    children: b.children,
    baseAmount: b.basePrice,
    discountAmount: b.discountAmount,
    taxAmount: 0,
    totalAmount: b.totalAmount,
    paidAmount: b.advanceAmount,
    pendingAmount: b.balanceAmount,
    couponCode: b.couponCode || null,
    paymentMethod: b.paymentMethod,
    paymentStatus: b.paymentStatus,
    utrNumber: b.transactionId || null,
    status: b.bookingStatus,
  };
}

function mapRowToUser(row: typeof users.$inferSelect): User {
  return {
    id: row.uid,
    name: row.fullName,
    email: row.email,
    phone: row.phone,
    avatar:
      row.profileImageUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    role: row.role === 'admin' ? 'admin' : 'user',
    isBlocked: row.isBlocked,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString().split('T')[0]
        : String(row.createdAt),
  };
}

export async function ensureSeeded(): Promise<void> {
  try {
    const existingDestinations = await db.select().from(destinations).limit(1);
    if (existingDestinations.length === 0) {
      await db
        .insert(destinations)
        .values(initialPackages.map(mapPackageToRow))
        .onConflictDoNothing();
    }

    const existingSettings = await db.select().from(siteSettings).limit(1);
    if (existingSettings.length === 0) {
      await db
        .insert(siteSettings)
        .values({
          id: 1,
          brandName: initialSiteSettings.brandName,
          tagline: initialSiteSettings.tagline,
          primaryColor: initialSiteSettings.primaryColor,
          accentColor: initialSiteSettings.accentColor,
          heroBannerUrl: initialSiteSettings.heroBannerImage,
          heroHeadline: 'Your Next Adventure Starts Here',
          contactEmail: initialSiteSettings.contactEmail,
          contactPhone: initialSiteSettings.contactPhone,
          whatsappNumber: initialSiteSettings.whatsappNumber,
          whatsappLink: initialSiteSettings.whatsappLink,
          callLink: initialSiteSettings.callLink,
          officeAddress: initialSiteSettings.address,
          upiId: initialSiteSettings.upiId,
          instagramUrl: 'https://instagram.com/adventureontheway',
          facebookUrl: 'https://facebook.com/adventureontheway',
          youtubeUrl: 'https://youtube.com/@adventureontheway',
        })
        .onConflictDoNothing();
    }

    const existingCoupons = await db.select().from(coupons).limit(1);
    if (existingCoupons.length === 0) {
      await db
        .insert(coupons)
        .values(
          initialCoupons.map((c) => ({
            code: c.code,
            discountPercent: c.discountValue,
            maxDiscount: c.discountType === 'fixed' ? c.discountValue : 5000,
            minOrderValue: c.minBookingValue,
            description: c.description,
            active: c.active,
            expiryDate: '2026-12-31',
          }))
        )
        .onConflictDoNothing();
    }

    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length === 0) {
      await db
        .insert(users)
        .values(
          initialUsers.map((u) => ({
            uid: u.id,
            fullName: u.name,
            email: u.email,
            phone: u.phone,
            profileImageUrl: u.avatar,
            role: u.role,
            isBlocked: Boolean(u.isBlocked),
            totalBookings: 1,
            wishlist: ['spiti-valley-expedition', 'ladakh-bike-odyssey'],
          }))
        )
        .onConflictDoNothing();
    }

    const existingBookings = await db.select().from(bookings).limit(1);
    if (existingBookings.length === 0) {
      await db
        .insert(bookings)
        .values(initialBookings.map(mapBookingToRow))
        .onConflictDoNothing();
    }

    const existingNotes = await db.select().from(notifications).limit(1);
    if (existingNotes.length === 0) {
      await db
        .insert(notifications)
        .values(
          initialNotifications.map((n) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            read: n.read,
          }))
        )
        .onConflictDoNothing();
    }
  } catch (error) {
    console.error('Database seed check failed:', error);
    throw new Error('Database initialization failed. Please try again later.', {
      cause: error,
    });
  }
}

export async function getOrCreateUser(
  uid: string,
  email: string,
  fullName?: string,
  avatar?: string
): Promise<{ user: User; wishlist: string[] }> {
  try {
    const isAdminEmail =
      email.toLowerCase() === 'admin@adventureontheway.com' ||
      email.toLowerCase() === 'shobhasingh33824@gmail.com';
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        fullName: fullName || email.split('@')[0] || 'Adventurer',
        phone: '+91 94217 09258',
        profileImageUrl:
          avatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        role: isAdminEmail ? 'admin' : 'user',
        isBlocked: false,
        totalBookings: 0,
        wishlist: [],
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(fullName ? { fullName } : {}),
          ...(avatar ? { profileImageUrl: avatar } : {}),
        },
      })
      .returning();

    const row = result[0];
    return {
      user: mapRowToUser(row),
      wishlist: Array.isArray(row.wishlist) ? row.wishlist : [],
    };
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}

export async function getAllAppState() {
  try {
    await ensureSeeded();

    const [pkgRows, bookingRows, userRows, couponRows, settingRows, noteRows] =
      await Promise.all([
        db.select().from(destinations).orderBy(desc(destinations.createdAt)),
        db.select().from(bookings).orderBy(desc(bookings.createdAt)),
        db.select().from(users).orderBy(desc(users.createdAt)),
        db.select().from(coupons),
        db.select().from(siteSettings).limit(1),
        db.select().from(notifications).orderBy(desc(notifications.createdAt)),
      ]);

    const sRow = settingRows[0];
    const mappedSettings: SiteSettings = sRow
      ? {
          brandName: sRow.brandName,
          tagline: sRow.tagline,
          primaryColor: sRow.primaryColor,
          accentColor: sRow.accentColor,
          heroBannerImage: sRow.heroBannerUrl,
          contactEmail: sRow.contactEmail,
          contactPhone: sRow.contactPhone,
          upiId: sRow.upiId,
          whatsappNumber: sRow.whatsappNumber,
          whatsappLink: sRow.whatsappLink,
          callLink: sRow.callLink,
          address: sRow.officeAddress,
        }
      : initialSiteSettings;

    const mappedCoupons: Coupon[] = couponRows.map((c) => ({
      code: c.code,
      discountType: c.discountPercent > 100 ? 'fixed' : 'percentage',
      discountValue: c.discountPercent,
      minBookingValue: c.minOrderValue,
      description: c.description,
      active: c.active,
    }));

    const mappedNotes: AdminNotification[] = noteRows.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      time:
        n.createdAt instanceof Date
          ? n.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Just now',
      type: (n.type as AdminNotification['type']) || 'booking',
      read: n.read,
    }));

    return {
      packages: pkgRows.map(mapRowToPackage),
      bookings: bookingRows.map(mapRowToBooking),
      users: userRows.map(mapRowToUser),
      coupons: mappedCoupons,
      settings: mappedSettings,
      notifications: mappedNotes,
    };
  } catch (error) {
    console.error('Database query failed in getAllAppState:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}

export async function createDestinationInDb(pkg: TourPackage): Promise<TourPackage> {
  try {
    const rowValues = mapPackageToRow(pkg);
    const inserted = await db
      .insert(destinations)
      .values(rowValues)
      .onConflictDoUpdate({
        target: destinations.id,
        set: rowValues,
      })
      .returning();
    return mapRowToPackage(inserted[0]);
  } catch (error) {
    console.error('Database query failed in createDestinationInDb:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}

export async function updateDestinationInDb(
  id: string,
  pkg: TourPackage
): Promise<TourPackage> {
  try {
    const rowValues = mapPackageToRow(pkg);
    const updated = await db
      .update(destinations)
      .set(rowValues)
      .where(eq(destinations.id, id))
      .returning();
    return mapRowToPackage(updated[0]);
  } catch (error) {
    console.error('Database query failed in updateDestinationInDb:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}

export async function deleteDestinationFromDb(id: string): Promise<void> {
  try {
    await db.delete(destinations).where(eq(destinations.id, id));
  } catch (error) {
    console.error('Database query failed in deleteDestinationFromDb:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}

export async function createBookingInDb(booking: Booking): Promise<Booking> {
  try {
    const rowValues = mapBookingToRow(booking);
    const inserted = await db
      .insert(bookings)
      .values(rowValues)
      .onConflictDoUpdate({
        target: bookings.id,
        set: rowValues,
      })
      .returning();

    // Also add an admin notification in PostgreSQL
    await db
      .insert(notifications)
      .values({
        id: `notif-${Date.now()}`,
        type: 'booking',
        title: 'New Booking Received',
        message: `${booking.userName} booked ${booking.packageTitle} for ${booking.adults + booking.children} pax (₹${booking.totalAmount.toLocaleString('en-IN')}).`,
        read: false,
      })
      .onConflictDoNothing();

    return mapRowToBooking(inserted[0]);
  } catch (error) {
    console.error('Database query failed in createBookingInDb:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}

export async function updateBookingInDb(
  id: string,
  updates: Partial<{ status: string; paymentStatus: string }>
): Promise<void> {
  try {
    await db.update(bookings).set(updates).where(eq(bookings.id, id));
  } catch (error) {
    console.error('Database query failed in updateBookingInDb:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}

export async function upsertCouponInDb(coupon: Coupon): Promise<void> {
  try {
    await db
      .insert(coupons)
      .values({
        code: coupon.code,
        discountPercent: coupon.discountValue,
        maxDiscount: coupon.discountType === 'fixed' ? coupon.discountValue : 5000,
        minOrderValue: coupon.minBookingValue,
        description: coupon.description,
        active: coupon.active,
        expiryDate: '2026-12-31',
      })
      .onConflictDoUpdate({
        target: coupons.code,
        set: {
          discountPercent: coupon.discountValue,
          minOrderValue: coupon.minBookingValue,
          description: coupon.description,
          active: coupon.active,
        },
      });
  } catch (error) {
    console.error('Database query failed in upsertCouponInDb:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}

export async function deleteCouponFromDb(code: string): Promise<void> {
  try {
    await db.delete(coupons).where(eq(coupons.code, code));
  } catch (error) {
    console.error('Database query failed in deleteCouponFromDb:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}

export async function updateSiteSettingsInDb(
  newSettings: SiteSettings
): Promise<void> {
  try {
    await db
      .insert(siteSettings)
      .values({
        id: 1,
        brandName: newSettings.brandName,
        tagline: newSettings.tagline,
        primaryColor: newSettings.primaryColor,
        accentColor: newSettings.accentColor,
        heroBannerUrl: newSettings.heroBannerImage,
        heroHeadline: 'Your Next Adventure Starts Here',
        contactEmail: newSettings.contactEmail,
        contactPhone: newSettings.contactPhone,
        whatsappNumber: newSettings.whatsappNumber,
        whatsappLink: newSettings.whatsappLink,
        callLink: newSettings.callLink,
        officeAddress: newSettings.address,
        upiId: newSettings.upiId,
        instagramUrl: 'https://instagram.com/adventureontheway',
        facebookUrl: 'https://facebook.com/adventureontheway',
        youtubeUrl: 'https://youtube.com/@adventureontheway',
      })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: {
          brandName: newSettings.brandName,
          tagline: newSettings.tagline,
          primaryColor: newSettings.primaryColor,
          accentColor: newSettings.accentColor,
          heroBannerUrl: newSettings.heroBannerImage,
          contactEmail: newSettings.contactEmail,
          contactPhone: newSettings.contactPhone,
          whatsappNumber: newSettings.whatsappNumber,
          whatsappLink: newSettings.whatsappLink,
          callLink: newSettings.callLink,
          officeAddress: newSettings.address,
          upiId: newSettings.upiId,
        },
      });
  } catch (error) {
    console.error('Database query failed in updateSiteSettingsInDb:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}

export async function updateUserInDb(
  uid: string,
  updates: Partial<{
    fullName: string;
    phone: string;
    profileImageUrl: string;
    isBlocked: boolean;
    wishlist: string[];
  }>
): Promise<void> {
  try {
    await db.update(users).set(updates).where(eq(users.uid, uid));
  } catch (error) {
    console.error('Database query failed in updateUserInDb:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}
