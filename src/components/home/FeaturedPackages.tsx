import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PackageCard } from '../packages/PackageCard';
import { TourCategory } from '../../types';
import { Compass, ArrowRight } from 'lucide-react';

export const FeaturedPackages: React.FC = () => {
  const { packages, setActiveTab, t, settings } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Trek', 'Bike Trip', 'Camping', 'Family', 'Honeymoon', 'Water Sports'];

  const livePackages = packages.filter((p) => p.isActive !== false);

  const filteredPackages =
    selectedCategory === 'All'
      ? livePackages.slice(0, 6)
      : livePackages.filter((p) => p.category === selectedCategory).slice(0, 6);

  return (
    <section className="py-20 bg-[#FFF8F0] dark:bg-[#111111] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Category Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
              Curated Itineraries
            </span>
            <h2 className="font-poppins font-black text-3xl sm:text-4xl text-zinc-900 dark:text-white">
              {t('featuredPackages')}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-lg">
              Handcrafted tours with verified hotels, luxury Swiss dome tents, and all mountain permits.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
                }`}
                style={
                  selectedCategory === cat ? { backgroundColor: settings.primaryColor } : undefined
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {/* Bottom CTA to View All */}
        <div className="text-center pt-6">
          <button
            onClick={() => {
              setActiveTab('destinations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <Compass className="w-4 h-4 text-[#FF6B35]" />
            <span>Explore All 12+ Expedition Packages</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
