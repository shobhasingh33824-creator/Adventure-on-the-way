import React, { useState } from 'react';
import { TourPackage } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  MapPin,
  Clock,
  Star,
  Users,
  Compass,
  CheckCircle,
  XCircle,
  Calendar,
  Mountain,
  Shield,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface PackageDetailModalProps {
  pkg: TourPackage | null;
  onClose: () => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  pkg,
  onClose,
}) => {
  const {
    formatPrice,
    toggleWishlist,
    isWishlisted,
    setBookingModalPackage,
    settings,
    showToast,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openDay, setOpenDay] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'inclusions' | 'map' | 'reviews'>('itinerary');

  if (!pkg) return null;

  const discountPercent = Math.round(
    ((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100
  );

  const handleBookNow = () => {
    onClose();
    setBookingModalPackage(pkg);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tour link copied to clipboard!', 'success');
    } else {
      showToast('Share link: ' + pkg.title, 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in">
      <div
        className="relative w-full max-w-5xl bg-[#FFF8F0] dark:bg-[#111111] rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Title and Close Button */}
        <div className="sticky top-0 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#FF6B35] text-white shrink-0">
              {pkg.category}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white truncate font-poppins">
              {pkg.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleWishlist(pkg.id)}
              className={`p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 transition ${
                isWishlisted(pkg.id)
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted(pkg.id) ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Share Tour"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 sm:aspect-21/9 rounded-2xl overflow-hidden bg-zinc-900 shadow-md">
              <img
                src={pkg.images[activeImageIndex] || pkg.images[0]}
                alt={pkg.title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span>{pkg.location}</span>
              </div>
            </div>

            {/* Thumbnail row */}
            {pkg.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {pkg.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-[#FF6B35] scale-95 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
              <Clock className="w-5 h-5 mx-auto text-[#FF6B35] mb-1" />
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Duration</span>
              <span className="text-xs font-bold text-zinc-900 dark:text-white">{pkg.duration}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
              <Mountain className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Max Altitude</span>
              <span className="text-xs font-bold text-zinc-900 dark:text-white">{pkg.altitude || '2,500m'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
              <Shield className="w-5 h-5 mx-auto text-amber-500 mb-1" />
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Difficulty</span>
              <span className="text-xs font-bold text-zinc-900 dark:text-white">{pkg.difficulty}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
              <Calendar className="w-5 h-5 mx-auto text-sky-500 mb-1" />
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Best Season</span>
              <span className="text-xs font-bold text-zinc-900 dark:text-white">{pkg.bestSeason}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
              <Users className="w-5 h-5 mx-auto text-purple-500 mb-1" />
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Group Size</span>
              <span className="text-xs font-bold text-zinc-900 dark:text-white">{pkg.groupSize}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
              <Compass className="w-5 h-5 mx-auto text-indigo-500 mb-1" />
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Starting Point</span>
              <span className="text-xs font-bold text-zinc-900 dark:text-white truncate block">
                {pkg.startEndLocation}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-poppins font-bold text-lg text-zinc-900 dark:text-white">
              Expedition Overview
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
              {pkg.description}
            </p>
          </div>

          {/* Highlights */}
          {pkg.highlights && pkg.highlights.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <h4 className="font-poppins font-bold text-sm text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#FF6B35]" />
                Key Highlights & Experiences
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pkg.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs Navigation: Itinerary / Inclusions / Map / Reviews */}
          <div className="border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`px-4 py-2.5 font-bold text-sm border-b-2 transition ${
                activeTab === 'itinerary'
                  ? 'border-[#FF6B35] text-[#FF6B35]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Day-by-Day Itinerary ({pkg.itinerary?.length || pkg.days} Days)
            </button>
            <button
              onClick={() => setActiveTab('inclusions')}
              className={`px-4 py-2.5 font-bold text-sm border-b-2 transition ${
                activeTab === 'inclusions'
                  ? 'border-[#FF6B35] text-[#FF6B35]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Inclusions & Exclusions
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2.5 font-bold text-sm border-b-2 transition ${
                activeTab === 'map'
                  ? 'border-[#FF6B35] text-[#FF6B35]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Route Map
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2.5 font-bold text-sm border-b-2 transition ${
                activeTab === 'reviews'
                  ? 'border-[#FF6B35] text-[#FF6B35]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Reviews ({pkg.rating.toFixed(1)} ★)
            </button>
          </div>

          {/* TAB 1: Day-Wise Itinerary Accordion */}
          {activeTab === 'itinerary' && (
            <div className="space-y-3">
              {pkg.itinerary && pkg.itinerary.length > 0 ? (
                pkg.itinerary.map((dayItem) => {
                  const isOpen = openDay === dayItem.day;
                  return (
                    <div
                      key={dayItem.day}
                      className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 transition"
                    >
                      <button
                        onClick={() => setOpenDay(isOpen ? 0 : dayItem.day)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-8 h-8 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0"
                            style={{ backgroundColor: settings.primaryColor }}
                          >
                            D{dayItem.day}
                          </span>
                          <span className="font-poppins font-bold text-sm text-zinc-900 dark:text-white">
                            {dayItem.title}
                          </span>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-zinc-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-zinc-400" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 space-y-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          <p>{dayItem.description}</p>
                          {(dayItem.meals || dayItem.stay || dayItem.altitude) && (
                            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                              {dayItem.meals && (
                                <span className="bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
                                  🍽️ Meals: {dayItem.meals}
                                </span>
                              )}
                              {dayItem.stay && (
                                <span className="bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
                                  ⛺ Stay: {dayItem.stay}
                                </span>
                              )}
                              {dayItem.altitude && (
                                <span className="bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
                                  🏔️ Altitude: {dayItem.altitude}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-zinc-500">Day-wise itinerary will be shared upon booking confirmation.</p>
              )}
            </div>
          )}

          {/* TAB 2: Inclusions & Exclusions */}
          {activeTab === 'inclusions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-3">
                <h4 className="font-poppins font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  What's Included
                </h4>
                <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 space-y-3">
                <h4 className="font-poppins font-bold text-sm text-rose-900 dark:text-rose-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  What's Excluded
                </h4>
                <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                  {pkg.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Interactive Route Map Visual */}
          {activeTab === 'map' && (
            <div className="p-6 rounded-2xl bg-zinc-900 text-white space-y-4 border border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-poppins font-bold text-sm">Expedition Route & Terrain Map</h4>
                  <p className="text-xs text-zinc-400">Circuit: {pkg.startEndLocation} ➔ {pkg.location}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-bold">
                  GPS Tracked Trail
                </span>
              </div>

              {/* Graphical Topographic Map Illustration */}
              <div className="relative h-64 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center p-4">
                <svg className="w-full h-full" viewBox="0 0 600 240">
                  {/* Topo lines */}
                  <path d="M 0 180 Q 150 120 300 170 T 600 140" fill="none" stroke="#27272a" strokeWidth="2" />
                  <path d="M 0 130 Q 180 80 320 120 T 600 90" fill="none" stroke="#27272a" strokeWidth="2" />
                  <path d="M 0 80 Q 200 40 400 70 T 600 40" fill="none" stroke="#27272a" strokeWidth="2" />

                  {/* Route line */}
                  <path
                    d="M 50 190 Q 180 160 250 110 T 420 80 T 550 50"
                    fill="none"
                    stroke="#FF6B35"
                    strokeWidth="4"
                    strokeDasharray="6,6"
                  />

                  {/* Waypoints */}
                  <g transform="translate(50, 190)">
                    <circle r="8" fill="#0B3D2E" stroke="#ffffff" strokeWidth="2" />
                    <text y="22" textAnchor="middle" fill="#a1a1aa" fontSize="10">Base Camp</text>
                  </g>
                  <g transform="translate(250, 110)">
                    <circle r="8" fill="#FF6B35" stroke="#ffffff" strokeWidth="2" />
                    <text y="22" textAnchor="middle" fill="#a1a1aa" fontSize="10">High Pass</text>
                  </g>
                  <g transform="translate(420, 80)">
                    <circle r="8" fill="#eab308" stroke="#ffffff" strokeWidth="2" />
                    <text y="22" textAnchor="middle" fill="#a1a1aa" fontSize="10">Glacier Lake</text>
                  </g>
                  <g transform="translate(550, 50)">
                    <circle r="10" fill="#10b981" stroke="#ffffff" strokeWidth="3" />
                    <text y="24" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="11">Summit</text>
                  </g>
                </svg>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>📍 Offline topography maps provided to all trip leaders</span>
                <span className="text-[#FF6B35] font-semibold">Elevation gain: +1,240m</span>
              </div>
            </div>
          )}

          {/* TAB 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-center pr-4 border-r border-zinc-200 dark:border-zinc-800">
                  <span className="text-3xl font-black text-zinc-900 dark:text-white font-poppins">
                    {pkg.rating.toFixed(1)}
                  </span>
                  <div className="flex items-center justify-center text-amber-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-1 block">
                    {pkg.reviewCount} Reviews
                  </span>
                </div>
                <div className="flex-1 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center justify-between">
                    <span>Guide & Safety</span>
                    <span className="font-bold text-zinc-900 dark:text-white">4.9 / 5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Camp Comfort & Food</span>
                    <span className="font-bold text-zinc-900 dark:text-white">4.8 / 5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Value for Money</span>
                    <span className="font-bold text-zinc-900 dark:text-white">5.0 / 5</span>
                  </div>
                </div>
              </div>

              {/* Sample Review */}
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
                      alt="Traveler"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-zinc-900 dark:text-white">
                        Vipul Sen (Solo Traveler)
                      </h5>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        ✓ Verified Adventurer
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-500 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  "Exceeded every expectation. The tents were spacious and weather-proof, the meals were hot and nourishing after 6 hours of trekking, and our guide knew the terrain like the back of his hand!"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Booking CTA */}
        <div className="sticky bottom-0 z-20 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Total Package Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                {formatPrice(pkg.price)}
              </span>
              {pkg.originalPrice > pkg.price && (
                <span className="text-xs text-zinc-400 line-through">
                  {formatPrice(pkg.originalPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <span className="text-[11px] text-zinc-500">Includes all taxes, permits & guide fee</span>
          </div>

          <button
            onClick={handleBookNow}
            className="px-6 sm:px-8 py-3 rounded-2xl font-bold text-sm text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            style={{ backgroundColor: settings.accentColor }}
          >
            <span>Proceed to Book</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
