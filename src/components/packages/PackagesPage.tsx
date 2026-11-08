import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PackageCard } from './PackageCard';
import { DifficultyLevel, TourCategory } from '../../types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Compass,
  ArrowUpDown,
  Check,
} from 'lucide-react';

export const PackagesPage: React.FC = () => {
  const { packages, searchQuery, setSearchQuery, formatPrice, settings } = useApp();

  // Search keyword state (initialized from hero search query if set)
  const [keyword, setKeyword] = useState<string>(searchQuery.destination || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchQuery.category || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(45000);
  const [selectedDuration, setSelectedDuration] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'duration'>('featured');

  const categories: string[] = ['All', 'Trek', 'Bike Trip', 'Camping', 'Expedition', 'Family', 'Honeymoon', 'Water Sports'];
  const difficulties: string[] = ['All', 'Easy', 'Moderate', 'Challenging', 'Extreme'];
  const durations: string[] = ['All', '1-3 Days', '4-6 Days', '7+ Days'];

  // Reset all filters
  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setMaxPrice(45000);
    setSelectedDuration('All');
    setSortBy('featured');
    setSearchQuery({ destination: '', category: 'All', date: '', travellers: 2 });
  };

  // Filter and sort packages
  const filteredPackages = useMemo(() => {
    return packages
      .filter((pkg) => {
        // Only show active packages
        if (pkg.isActive === false) return false;

        // Keyword search (title, location, description, highlights)
        if (keyword.trim()) {
          const q = keyword.toLowerCase();
          const matchTitle = pkg.title.toLowerCase().includes(q);
          const matchLoc = pkg.location.toLowerCase().includes(q);
          const matchDesc = pkg.description.toLowerCase().includes(q);
          const matchHighlights = pkg.highlights.some((h) => h.toLowerCase().includes(q));
          if (!matchTitle && !matchLoc && !matchDesc && !matchHighlights) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && pkg.category !== selectedCategory) {
          return false;
        }

        // Difficulty filter
        if (selectedDifficulty !== 'All' && pkg.difficulty !== selectedDifficulty) {
          return false;
        }

        // Price filter
        if (pkg.price > maxPrice) {
          return false;
        }

        // Duration filter
        if (selectedDuration !== 'All') {
          if (selectedDuration === '1-3 Days' && pkg.days > 3) return false;
          if (selectedDuration === '4-6 Days' && (pkg.days < 4 || pkg.days > 6)) return false;
          if (selectedDuration === '7+ Days' && pkg.days < 7) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'duration') return b.days - a.days;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [packages, keyword, selectedCategory, selectedDifficulty, maxPrice, selectedDuration, sortBy]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-[#111111] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Banner Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            Curated Expedition Catalog
          </div>
          <h1 className="font-poppins font-black text-3xl sm:text-5xl text-zinc-900 dark:text-white">
            Find Your Next High Mountain Journey
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Compare 12+ multi-day Himalayan circuits, bike trips, and riverside camps with transparent per-person pricing.
          </p>
        </div>

        {/* Filter & Search Control Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
          {/* Top Row: Search Input & Sort Selector */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by destination (e.g. Spiti, Manali, Ladakh, Kashmir, Rishikesh)..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#FF6B35]"
              />
              {keyword && (
                <button
                  onClick={() => setKeyword('')}
                  className="absolute right-4 top-3.5 text-xs text-zinc-400 hover:text-zinc-700"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-between md:justify-end">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-500">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Longest Duration</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-1.5 text-xs font-semibold"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Filter Rows: Category & Difficulty & Price Slider */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs">
            {/* Category tabs */}
            <div className="space-y-2">
              <label className="font-bold uppercase tracking-wider text-zinc-400 block">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      selectedCategory === cat
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty tabs */}
            <div className="space-y-2">
              <label className="font-bold uppercase tracking-wider text-zinc-400 block">
                Difficulty Level
              </label>
              <div className="flex flex-wrap gap-1.5">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      selectedDifficulty === diff
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="uppercase tracking-wider text-zinc-400">Max Budget</span>
                <span className="text-[#FF6B35] font-black text-sm">
                  {formatPrice(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={4000}
                max={45000}
                step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#FF6B35] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>₹4,000</span>
                <span>₹25,000</span>
                <span>₹45,000+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count Header */}
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
          <span>
            Showing <strong className="text-zinc-900 dark:text-white">{filteredPackages.length}</strong> adventure packages
          </span>
          {(keyword || selectedCategory !== 'All' || selectedDifficulty !== 'All' || maxPrice < 45000) && (
            <span className="text-[#FF6B35]">Filtered by your preferences</span>
          )}
        </div>

        {/* Packages Grid or Empty State */}
        {filteredPackages.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <Compass className="w-16 h-16 mx-auto text-zinc-400" />
            <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
              No Expeditions Match Your Criteria
            </h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Try adjusting your price filter, selecting 'All' categories, or clearing your search keywords.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-md"
              style={{ backgroundColor: settings.accentColor }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
