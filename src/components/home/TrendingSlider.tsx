import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Star, Clock, Flame, ArrowRight } from 'lucide-react';

export const TrendingSlider: React.FC = () => {
  const { packages, formatPrice, setSelectedPackage, setBookingModalPackage, setActiveTab, t, settings } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  const trendingPackages = packages.filter((p) => p.trending && p.isActive !== false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-[#FFF8F0] dark:bg-[#111111] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
                Most Booked Adventures
              </span>
            </div>
            <h2 className="font-poppins font-black text-2xl sm:text-3xl text-zinc-900 dark:text-white">
              {t('trendingDestinations')}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mt-1">
              High-demand circuits with guaranteed weekend departures and certified trek leaders.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 transition shadow-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 transition shadow-xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Slider */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {trendingPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className="group min-w-[280px] sm:min-w-[320px] max-w-[320px] rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer shrink-0"
            >
              {/* Image banner */}
              <div className="relative aspect-16/10 overflow-hidden bg-zinc-800">
                <img
                  src={pkg.images[0]}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 bg-[#FF6B35] text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Flame className="w-3 h-3" /> TRENDING
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs font-semibold">
                  <span className="truncate max-w-[70%]">{pkg.location}</span>
                  <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-[11px] backdrop-blur-xs">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" />
                      <span>{pkg.rating.toFixed(1)}</span>
                      <span className="text-zinc-400 font-normal ml-1">({pkg.reviewCount})</span>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-500">{pkg.difficulty}</span>
                  </div>

                  <h3 className="font-poppins font-bold text-sm text-zinc-900 dark:text-white line-clamp-1 group-hover:text-[#FF6B35] transition">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mt-1">
                    {pkg.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">From</span>
                    <span className="text-base font-black text-zinc-900 dark:text-white">
                      {formatPrice(pkg.price)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBookingModalPackage(pkg);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition"
                    style={{ backgroundColor: settings.accentColor }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
