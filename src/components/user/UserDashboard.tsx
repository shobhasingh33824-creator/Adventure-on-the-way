import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PackageCard } from '../packages/PackageCard';
import { ImageUploadPicker } from '../common/ImageUploadPicker';
import {
  User,
  CalendarCheck,
  Heart,
  CreditCard,
  Settings,
  LogOut,
  Printer,
  Share2,
  Clock,
  Compass,
  ShieldCheck,
  Edit2,
  Save,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    logout,
    bookings,
    packages,
    wishlist,
    formatPrice,
    updateBookingStatus,
    updateUserProfile,
    setAuthModalOpen,
    setActiveTab,
    settings,
  } = useApp();

  const [activeTab, setActiveTabState] = useState<'bookings' | 'wishlist' | 'payments' | 'profile'>('bookings');
  const [bookingFilter, setBookingFilter] = useState<'All' | 'Confirmed' | 'Pending Verification' | 'Cancelled'>('All');

  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [emergencyContact, setEmergencyContact] = useState(currentUser?.emergencyContact || '');
  const [bio, setBio] = useState(currentUser?.bio || '');

  // If user is not logged in, prompt sign in
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div
          className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <User className="w-8 h-8 text-[#FF6B35]" />
        </div>
        <h2 className="font-poppins font-black text-2xl text-zinc-900 dark:text-white">
          Sign In to Access Your Expedition Portal
        </h2>
        <p className="text-zinc-500 text-sm max-w-md mx-auto">
          Track upcoming departures, download offline permits & QR passes, view your wishlist, and manage bookings.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition"
          style={{ backgroundColor: settings.accentColor }}
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // Filter user's personal bookings
  const userBookings = bookings.filter(
    (b) => b.userId === currentUser.id || b.userEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const filteredBookings =
    bookingFilter === 'All'
      ? userBookings
      : userBookings.filter((b) => b.bookingStatus === bookingFilter);

  // Wishlist packages
  const wishlistedPackages = packages.filter((p) => wishlist.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone, avatar: avatar || currentUser.avatar, emergencyContact, bio });
    setIsEditing(false);
  };

  const handlePrintBooking = () => {
    window.print();
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking? Refund policy terms will apply.')) {
      updateBookingStatus(bookingId, 'Cancelled');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-xl"
            />
            {currentUser.role === 'admin' && (
              <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-600 text-white shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="font-poppins font-black text-2xl text-zinc-900 dark:text-white">
                  {currentUser.name}
                </h1>
                <p className="text-xs text-zinc-500 font-medium">
                  {currentUser.email} • {currentUser.phone || 'Phone not set'}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2">
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </button>
                )}
                <button
                  onClick={logout}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xl">
              {currentUser.bio || 'Adrenaline seeker, landscape explorer, and mountain summit enthusiast.'}
            </p>

            {/* Quick counters */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs">
              <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full font-bold text-zinc-800 dark:text-zinc-200">
                ⛺ {userBookings.length} Expeditions Booked
              </span>
              <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full font-bold text-zinc-800 dark:text-zinc-200">
                ❤️ {wishlist.length} Saved in Wishlist
              </span>
              <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full font-bold">
                ✓ Verified Traveler
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-zinc-100 dark:border-zinc-800 mt-6 pt-4">
          {[
            { id: 'bookings', label: 'My Bookings', icon: CalendarCheck, count: userBookings.length },
            { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistedPackages.length },
            { id: 'payments', label: 'Payment History', icon: CreditCard },
            { id: 'profile', label: 'Edit Profile & Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabState(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
                style={isActive ? { backgroundColor: settings.primaryColor } : undefined}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: MY BOOKINGS ================= */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-poppins font-bold text-lg text-zinc-900 dark:text-white">
              Expedition Bookings
            </h3>
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold">
              {(['All', 'Confirmed', 'Pending Verification', 'Cancelled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setBookingFilter(st)}
                  className={`px-3 py-1 rounded-lg transition ${
                    bookingFilter === st
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <Compass className="w-12 h-12 mx-auto text-zinc-400" />
              <h4 className="font-bold text-base text-zinc-800 dark:text-zinc-200">
                No Bookings Found in This Section
              </h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Ready to conquer high passes and alpine trails? Explore our latest curated packages.
              </p>
              <button
                onClick={() => setActiveTab('destinations')}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md"
                style={{ backgroundColor: settings.accentColor }}
              >
                Browse Adventure Packages
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={b.packageImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=200'}
                      alt={b.packageTitle}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-[#FF6B35]">
                          {b.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            b.bookingStatus === 'Confirmed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : b.bookingStatus === 'Cancelled'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {b.paymentStatus} via {b.paymentMethod}
                        </span>
                      </div>

                      <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
                        {b.packageTitle}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
                          Date: {new Date(b.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span>•</span>
                        <span>{b.adults} Adults {b.children > 0 ? `, ${b.children} Children` : ''}</span>
                        <span>•</span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          Total: {formatPrice(b.totalAmount)}
                        </span>
                      </div>

                      {b.balanceAmount > 0 && (
                        <p className="text-[11px] font-semibold text-amber-600">
                          Due at Basecamp: {formatPrice(b.balanceAmount)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap md:flex-col items-end gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                    <button
                      onClick={handlePrintBooking}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 transition flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Ticket</span>
                    </button>

                    <button
                      onClick={() => {
                        const message = encodeURIComponent(`Hi, regarding my booking ${b.id} for ${b.packageTitle}...`);
                        window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Trip Lead WhatsApp</span>
                    </button>

                    {b.bookingStatus === 'Confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="text-xs font-semibold text-rose-500 hover:underline pt-1"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: WISHLIST ================= */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <h3 className="font-poppins font-bold text-lg text-zinc-900 dark:text-white">
            Saved Expeditions ({wishlistedPackages.length})
          </h3>

          {wishlistedPackages.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <Heart className="w-12 h-12 mx-auto text-zinc-400" />
              <h4 className="font-bold text-base text-zinc-800 dark:text-zinc-200">
                Your Wishlist is Empty
              </h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Explore our destinations and tap the heart icon to save your bucket-list getaways.
              </p>
              <button
                onClick={() => setActiveTab('destinations')}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md"
                style={{ backgroundColor: settings.accentColor }}
              >
                Browse Adventures
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: PAYMENT HISTORY ================= */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <h3 className="font-poppins font-bold text-lg text-zinc-900 dark:text-white">
            Transaction & Payment Records
          </h3>

          <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Transaction / UTR ID</th>
                    <th className="p-4">Booking Ref</th>
                    <th className="p-4">Tour Package</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {userBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                      <td className="p-4 font-mono font-bold text-zinc-900 dark:text-white">
                        {b.transactionId || 'UPI-REF-0938421'}
                      </td>
                      <td className="p-4 font-mono text-[#FF6B35] font-bold">{b.id}</td>
                      <td className="p-4 font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[180px]">
                        {b.packageTitle}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-semibold">
                          {b.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-zinc-900 dark:text-white">
                        {formatPrice(b.advanceAmount || b.totalAmount)}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-400">
                        {new Date(b.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: PROFILE SETTINGS ================= */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-poppins font-bold text-lg text-zinc-900 dark:text-white">
                Personal Information
              </h3>
              <p className="text-xs text-zinc-500">
                Update your contact details for expedition permit clearances.
              </p>
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 flex items-center gap-1.5 transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {isEditing && (
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <ImageUploadPicker
                  images={avatar ? [avatar] : [currentUser.avatar]}
                  onChange={(urls) => setAvatar(urls[0] || currentUser.avatar)}
                  singleMode={true}
                  category="profile"
                  tourName={`Profile Photo - ${currentUser.name}`}
                  label="📸 Change Profile Photo From Phone Gallery / Camera"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-zinc-700 dark:text-zinc-300">Full Name</label>
              <input
                type="text"
                value={name}
                disabled={!isEditing}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 disabled:opacity-60 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Email Address (Read-only)</label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full bg-zinc-100 dark:bg-zinc-800/50 opacity-60 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Mobile Phone</label>
                <input
                  type="tel"
                  value={phone}
                  disabled={!isEditing}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 disabled:opacity-60 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-700 dark:text-zinc-300">
                Emergency Contact (Name & Number)
              </label>
              <input
                type="text"
                value={emergencyContact}
                disabled={!isEditing}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Parent / Spouse phone number"
                className="w-full bg-zinc-50 dark:bg-zinc-800 disabled:opacity-60 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-white font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-700 dark:text-zinc-300">Adventurer Bio</label>
              <textarea
                rows={3}
                value={bio}
                disabled={!isEditing}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your trekking experience, favorite summits, or bucket list"
                className="w-full bg-zinc-50 dark:bg-zinc-800 disabled:opacity-60 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-white font-medium"
              />
            </div>

            {isEditing && (
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md flex items-center gap-2"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
