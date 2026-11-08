import React from 'react';
import { TourPackage } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Clock,
  Star,
  Heart,
  Users,
  Compass,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface PackageCardProps {
  pkg: TourPackage;
  onSelect?: () => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onSelect }) => {
  const {
    formatPrice,
    toggleWishlist,
    isWishlisted,
    setBookingModalPackage,
    setSelectedPackage,
    settings,
  } = useApp();

  const discountPercent = Math.round(
    ((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100
  );

  const difficultyColors = {
    Easy: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    Moderate: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
    Challenging: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30',
    Extreme: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    } else {
      setSelectedPackage(pkg);
    }
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookingModalPackage(pkg);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(pkg.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-16/10 overflow-hidden bg-zinc-800">
        <img
          src={pkg.images[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800'}
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {discountPercent > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#FF6B35] text-white shadow-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                {discountPercent}% OFF
              </span>
            )}
            {pkg.isBestSeller && (
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-md flex items-center gap-1">
                ★ BESTSELLER
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white backdrop-blur-md shadow-xs">
              {pkg.category}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
              isWishlisted(pkg.id)
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-200 hover:text-rose-500 hover:bg-white'
            }`}
            title="Save to Wishlist"
          >
            <Heart
              className={`w-4 h-4 transition ${
                isWishlisted(pkg.id) ? 'fill-current' : ''
              }`}
            />
          </button>
        </div>

        {/* Bottom Image Stats (Location & Duration) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold drop-shadow-md">
          <div className="flex items-center gap-1 truncate max-w-[65%]">
            <MapPin className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
            <span className="truncate">{pkg.location}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{pkg.duration}</span>
          </div>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Rating, Reviews & Difficulty */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center text-amber-500 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                <span>{pkg.rating.toFixed(1)}</span>
              </div>
              <span className="text-zinc-400 text-xs">({pkg.reviewCount})</span>
            </div>

            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                difficultyColors[pkg.difficulty] || difficultyColors.Moderate
              }`}
            >
              {pkg.difficulty}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-poppins font-bold text-base text-zinc-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#FF6B35] transition-colors">
            {pkg.title}
          </h3>

          {/* Short Description */}
          <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 mt-2 leading-relaxed">
            {pkg.shortDescription}
          </p>

          {/* Highlights pills */}
          {pkg.highlights && pkg.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {pkg.highlights.slice(0, 2).map((h, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded"
                >
                  ✓ {h}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Price & Booking Action */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
              Starting From
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-zinc-900 dark:text-white">
                {formatPrice(pkg.price)}
              </span>
              {pkg.originalPrice > pkg.price && (
                <span className="text-xs text-zinc-400 line-through">
                  {formatPrice(pkg.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-500">per adventurer</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCardClick}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              title="View full day-wise itinerary"
            >
              Details
            </button>
            <button
              type="button"
              onClick={handleBookNow}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-1"
              style={{ backgroundColor: settings.accentColor }}
            >
              <span>Book</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Seats urgency meter */}
        {pkg.availableSeats <= 6 && (
          <div className="bg-amber-500/10 rounded-lg px-2.5 py-1 flex items-center justify-between text-[11px] font-semibold text-amber-700 dark:text-amber-400">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Only {pkg.availableSeats} seats left for this season!
            </span>
            <span className="text-[10px] underline">Fast Selling</span>
          </div>
        )}
      </div>
    </div>
  );
};
