import { eq, desc } from 'drizzle-orm';
import { db } from './index.ts';
import {
  users,
  destinations,
  bookings,
  coupons,
  siteSettings,
  notifications,
  gallery,
  enquiries,
  ItineraryDaySchema,
} from './schema.ts';
import {
  initialPackages,
  initialSiteSettings,
  initialCoupons,
  initialUsers,
  initialBookings,
  initialNotifications,
  initialGallery,
  initialEnquiries,
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
  GalleryItem,
  Enquiry,
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
    category: (row.category as TourCategory) || 'Chardham',
    rating: Number(row.rating) || 4.9,
    reviewCount: row.totalReviews || 100,
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description,
    shortDescription: row.shortDescription,
    altitude:
      row.itinerary && row.itinerary[0]?.altitude
        ? row.itinerary[0].altitude
        : '11,755 ft',
    bestSeason: 'May – Nov',
    groupSize: `Max ${row.maxSeats} Yatris`,
    startEndLocation: row.pickupPoint || 'Haridwar (4, Devpura)',
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
          stay: d.accommodation || 'Deluxe Hotel / Swiss Camp',
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
    accommodation: d.stay || 'Deluxe Hotel / Camp',
    altitude: d.altitude || pkg.altitude,
  }));

  return {
    id: pkg.id,
    title: pkg.title,
    slug: slugify(pkg.title),
    location: pkg.location,
    state: pkg.state || 'Uttarakhand',
    category: pkg.category,
    price: pkg.originalPrice || pkg.price,
    discountPrice: pkg.price,
    duration: pkg.duration,
    durationDays: pkg.days || 5,
    durationNights: Math.max(1, (pkg.days || 5) - 1),
    maxSeats: pkg.maxSeats || 20,
    availableSeats: pkg.availableSeats ?? 8,
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
    totalReviews: pkg.reviewCount || 120,
    mapCoordinates: { lat: 29.9457, lng: 78.1642 },
    pickupPoint: pkg.startEndLocation || 'Haridwar (4, Devpura)',
    nextAvailableDates: ['2026-05-10', '2026-05-20', '2026-06-01'],
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
    paymentScreenshot: row.paymentScreenshot || undefined,
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
    packageDuration: '11D / 10N',
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
    paymentScreenshot: b.paymentScreenshot || '',
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
    role: row.role === 'admin' ? 'admin' : row.role === 'staff' ? 'staff' : 'user',
    isBlocked: row.isBlocked,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString().split('T')[0]
        : String(row.createdAt),
  };
}

export async function ensureSeeded(): Promise<void> {
  try {
    // Ensure the 12 real Uttarakhand & Himalayan destinations exist in PostgreSQL
    const chardhamCheck = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, 'chardham-yatra-uttarakhand'))
      .limit(1);

    if (chardhamCheck.length === 0) {
      // Replace any older demo destinations with the 12 real Uttarakhand destinations
      await db.delete(destinations);
      await db
        .insert(destinations)
        .values(initialPackages.map(mapPackageToRow))
        .onConflictDoNothing();
    }

    // Ensure site_settings has the exact Om Travels & Adventure On The Way Haridwar data
    const existingSettings = await db.select().from(siteSettings).limit(1);
    if (
      existingSettings.length === 0 ||
      existingSettings[0].brandName !== 'Om Travels & Adventure On The Way'
    ) {
      await db
        .insert(siteSettings)
        .values({
          id: 1,
          brandName: initialSiteSettings.brandName,
          shortName: initialSiteSettings.shortName || 'Adventure On The Way',
          tagline: initialSiteSettings.tagline,
          aboutText: initialSiteSettings.aboutText || '',
          primaryColor: initialSiteSettings.primaryColor,
          accentColor: initialSiteSettings.accentColor,
          heroBannerUrl: initialSiteSettings.heroBannerImage,
          logoUrl: initialSiteSettings.logoUrl || '',
          heroHeadline: 'Haridwar se Himalaya Tak – Live The Adventure',
          contactEmail: initialSiteSettings.contactEmail,
          contactPhone: initialSiteSettings.contactPhone,
          secondaryPhone: initialSiteSettings.secondaryPhone,
          whatsappNumber: initialSiteSettings.whatsappNumber,
          whatsappLink: initialSiteSettings.whatsappLink,
          callLink: initialSiteSettings.callLink,
          secondaryCallLink: initialSiteSettings.secondaryCallLink,
          officeAddress: initialSiteSettings.address,
          upiId: initialSiteSettings.upiId,
          instagramUrl: initialSiteSettings.instagramUrl,
          instagramHandle: initialSiteSettings.instagramHandle,
          instagramFollowers: initialSiteSettings.instagramFollowers,
          openHours: initialSiteSettings.openHours,
          facebookUrl: 'https://facebook.com/adventureontheway',
          youtubeUrl: 'https://youtube.com/@adventureontheway',
        })
        .onConflictDoUpdate({
          target: siteSettings.id,
          set: {
            brandName: initialSiteSettings.brandName,
            shortName: initialSiteSettings.shortName || 'Adventure On The Way',
            tagline: initialSiteSettings.tagline,
            aboutText: initialSiteSettings.aboutText || '',
            contactPhone: initialSiteSettings.contactPhone,
            secondaryPhone: initialSiteSettings.secondaryPhone,
            officeAddress: initialSiteSettings.address,
            instagramUrl: initialSiteSettings.instagramUrl,
            instagramHandle: initialSiteSettings.instagramHandle,
            instagramFollowers: initialSiteSettings.instagramFollowers,
            openHours: initialSiteSettings.openHours,
          },
        });
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
            wishlist: ['chardham-yatra-uttarakhand', 'aadi-kailash-om-parvat-yatra'],
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

    const existingGallery = await db.select().from(gallery).limit(1);
    if (existingGallery.length === 0) {
      await db
        .insert(gallery)
        .values(
          initialGallery.map((g) => ({
            id: g.id,
            url: g.url,
            title: g.title,
            tourId: g.tourId || '',
            tourName: g.tourName || '',
            category: g.category,
            sizeKb: g.sizeKb,
            width: g.width,
            height: g.height,
            uploadedBy: g.uploadedBy,
          }))
        )
        .onConflictDoNothing();
    }

    const existingEnquiries = await db.select().from(enquiries).limit(1);
    if (existingEnquiries.length === 0) {
      await db
        .insert(enquiries)
        .values(
          initialEnquiries.map((e) => ({
            id: e.id,
            name: e.name,
            phone: e.phone,
            email: e.email,
            destination: e.destination,
            message: e.message,
            status: e.status,
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
        fullName: fullName || email.split('@')[0] || 'Yatri',
        phone: '+91 94217 09258',
        profileImageUrl:
          avatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        role: isAdminEmail ? 'admin' : 'user',
        isBlocked: false,
        totalBookings: 0,
        wishlist: ['chardham-yatra-uttarakhand'],
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

    const [
      pkgRows,
      bookingRows,
      userRows,
      couponRows,
      settingRows,
      noteRows,
      galleryRows,
      enquiryRows,
    ] = await Promise.all([
      db.select().from(destinations).orderBy(desc(destinations.createdAt)),
      db.select().from(bookings).orderBy(desc(bookings.createdAt)),
      db.select().from(users).orderBy(desc(users.createdAt)),
      db.select().from(coupons),
      db.select().from(siteSettings).limit(1),
      db.select().from(notifications).orderBy(desc(notifications.createdAt)),
      db.select().from(gallery).orderBy(desc(gallery.createdAt)),
      db.select().from(enquiries).orderBy(desc(enquiries.createdAt)),
    ]);

    const sRow = settingRows[0];
    const mappedSettings: SiteSettings = sRow
      ? {
          brandName: sRow.brandName,
          shortName: sRow.shortName || 'Adventure On The Way',
          tagline: sRow.tagline,
          aboutText: sRow.aboutText,
          primaryColor: sRow.primaryColor,
          accentColor: sRow.accentColor,
          heroBannerImage: sRow.heroBannerUrl,
          logoUrl: sRow.logoUrl || '',
          contactEmail: sRow.contactEmail,
          contactPhone: sRow.contactPhone,
          secondaryPhone: sRow.secondaryPhone || '+91 86687 40237',
          upiId: sRow.upiId,
          whatsappNumber: sRow.whatsappNumber,
          whatsappLink: sRow.whatsappLink,
          callLink: sRow.callLink,
          secondaryCallLink: sRow.secondaryCallLink || 'tel:+918668740237',
          address: sRow.officeAddress,
          instagramUrl: sRow.instagramUrl || 'https://instagram.com/adventure_on_the_way',
          instagramHandle: sRow.instagramHandle || '@adventure_on_the_way',
          instagramFollowers: sRow.instagramFollowers || '71,175 Followers',
          openHours: sRow.openHours || 'Open 24 Hours',
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

    const mappedGallery: GalleryItem[] = galleryRows.map((g) => ({
      id: g.id,
      url: g.url,
      title: g.title,
      tourId: g.tourId || '',
      tourName: g.tourName || '',
      category: (g.category as GalleryItem['category']) || 'tour',
      sizeKb: g.sizeKb,
      width: g.width,
      height: g.height,
      uploadedBy: g.uploadedBy,
      createdAt:
        g.createdAt instanceof Date
          ? g.createdAt.toISOString().split('T')[0]
          : String(g.createdAt),
    }));

    const mappedEnquiries: Enquiry[] = enquiryRows.map((e) => ({
      id: e.id,
      name: e.name,
      phone: e.phone,
      email: e.email,
      destination: e.destination,
      message: e.message,
      status: (e.status as Enquiry['status']) || 'New',
      createdAt:
        e.createdAt instanceof Date
          ? e.createdAt.toISOString().split('T')[0]
          : String(e.createdAt),
    }));

    return {
      packages: pkgRows.map(mapRowToPackage),
      bookings: bookingRows.map(mapRowToBooking),
      users: userRows.map(mapRowToUser),
      coupons: mappedCoupons,
      settings: mappedSettings,
      notifications: mappedNotes,
      gallery: mappedGallery,
      enquiries: mappedEnquiries,
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

    await db
      .insert(notifications)
      .values({
        id: `notif-${Date.now()}`,
        type: 'booking',
        title: 'New Booking Received',
        message: `${booking.userName} booked ${booking.packageTitle} for ${booking.adults + booking.children} Yatris (₹${booking.totalAmount.toLocaleString('en-IN')}).`,
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
        shortName: newSettings.shortName || 'Adventure On The Way',
        tagline: newSettings.tagline,
        aboutText: newSettings.aboutText || '',
        primaryColor: newSettings.primaryColor,
        accentColor: newSettings.accentColor,
        heroBannerUrl: newSettings.heroBannerImage,
        logoUrl: newSettings.logoUrl || '',
        heroHeadline: 'Haridwar se Himalaya Tak – Live The Adventure',
        contactEmail: newSettings.contactEmail,
        contactPhone: newSettings.contactPhone,
        secondaryPhone: newSettings.secondaryPhone || '+91 86687 40237',
        whatsappNumber: newSettings.whatsappNumber,
        whatsappLink: newSettings.whatsappLink,
        callLink: newSettings.callLink,
        secondaryCallLink: newSettings.secondaryCallLink || 'tel:+918668740237',
        officeAddress: newSettings.address,
        upiId: newSettings.upiId,
        instagramUrl: newSettings.instagramUrl || 'https://instagram.com/adventure_on_the_way',
        instagramHandle: newSettings.instagramHandle || '@adventure_on_the_way',
        instagramFollowers: newSettings.instagramFollowers || '71,175 Followers',
        openHours: newSettings.openHours || 'Open 24 Hours',
        facebookUrl: 'https://facebook.com/adventureontheway',
        youtubeUrl: 'https://youtube.com/@adventureontheway',
      })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: {
          brandName: newSettings.brandName,
          shortName: newSettings.shortName || 'Adventure On The Way',
          tagline: newSettings.tagline,
          aboutText: newSettings.aboutText || '',
          primaryColor: newSettings.primaryColor,
          accentColor: newSettings.accentColor,
          heroBannerUrl: newSettings.heroBannerImage,
          logoUrl: newSettings.logoUrl || '',
          contactEmail: newSettings.contactEmail,
          contactPhone: newSettings.contactPhone,
          secondaryPhone: newSettings.secondaryPhone || '+91 86687 40237',
          whatsappNumber: newSettings.whatsappNumber,
          whatsappLink: newSettings.whatsappLink,
          callLink: newSettings.callLink,
          secondaryCallLink: newSettings.secondaryCallLink || 'tel:+918668740237',
          officeAddress: newSettings.address,
          upiId: newSettings.upiId,
          instagramUrl: newSettings.instagramUrl || 'https://instagram.com/adventure_on_the_way',
          instagramHandle: newSettings.instagramHandle || '@adventure_on_the_way',
          instagramFollowers: newSettings.instagramFollowers || '71,175 Followers',
          openHours: newSettings.openHours || 'Open 24 Hours',
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
    role: string;
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

export async function createGalleryItemInDb(item: GalleryItem): Promise<GalleryItem> {
  try {
    const inserted = await db
      .insert(gallery)
      .values({
        id: item.id,
        url: item.url,
        title: item.title,
        tourId: item.tourId || '',
        tourName: item.tourName || '',
        category: item.category || 'tour',
        sizeKb: item.sizeKb || 220,
        width: item.width || 1200,
        height: item.height || 800,
        uploadedBy: item.uploadedBy || 'admin@adventureontheway.com',
      })
      .onConflictDoUpdate({
        target: gallery.id,
        set: {
          url: item.url,
          title: item.title,
          tourId: item.tourId || '',
          tourName: item.tourName || '',
          category: item.category || 'tour',
        },
      })
      .returning();

    const g = inserted[0];
    return {
      id: g.id,
      url: g.url,
      title: g.title,
      tourId: g.tourId || '',
      tourName: g.tourName || '',
      category: (g.category as GalleryItem['category']) || 'tour',
      sizeKb: g.sizeKb,
      width: g.width,
      height: g.height,
      uploadedBy: g.uploadedBy,
      createdAt:
        g.createdAt instanceof Date
          ? g.createdAt.toISOString().split('T')[0]
          : String(g.createdAt),
    };
  } catch (error) {
    console.error('Database query failed in createGalleryItemInDb:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}

export async function deleteGalleryItemFromDb(id: string): Promise<void> {
  try {
    await db.delete(gallery).where(eq(gallery.id, id));
  } catch (error) {
    console.error('Database query failed in deleteGalleryItemFromDb:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}

export async function createEnquiryInDb(enq: Enquiry): Promise<Enquiry> {
  try {
    const inserted = await db
      .insert(enquiries)
      .values({
        id: enq.id,
        name: enq.name,
        phone: enq.phone,
        email: enq.email,
        destination: enq.destination,
        message: enq.message,
        status: enq.status || 'New',
      })
      .returning();
    const r = inserted[0];
    return {
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email,
      destination: r.destination,
      message: r.message,
      status: (r.status as Enquiry['status']) || 'New',
      createdAt:
        r.createdAt instanceof Date
          ? r.createdAt.toISOString().split('T')[0]
          : String(r.createdAt),
    };
  } catch (error) {
    console.error('Database query failed in createEnquiryInDb:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}

export async function updateEnquiryStatusInDb(
  id: string,
  status: Enquiry['status']
): Promise<void> {
  try {
    await db.update(enquiries).set({ status }).where(eq(enquiries.id, id));
  } catch (error) {
    console.error('Database query failed in updateEnquiryStatusInDb:', error);
    throw new Error('Database query failed. Please try again later.', {
      cause: error,
    });
  }
}
