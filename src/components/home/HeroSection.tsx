import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Calendar, Users, Compass, Sparkles, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { settings, handleHeroSearch, t } = useApp();

  const [destinationInput, setDestinationInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [travellersInput, setTravellersInput] = useState(2);
  const [categoryInput, setCategoryInput] = useState('All');

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleHeroSearch({
      destination: destinationInput,
      category: categoryInput,
      date: dateInput,
      travellers: travellersInput,
    });
  };

  const quickSearches = [
    { label: 'Spiti 4x4', query: 'Spiti' },
    { label: 'Ladakh Bike Odyssey', query: 'Ladakh' },
    { label: 'Manali Solang', query: 'Manali' },
    { label: 'Rishikesh Rapids', query: 'Rishikesh' },
    { label: 'Kashmir Great Lakes', query: 'Kashmir' },
  ];

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background Hero Image with Deep Contrast Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url(${settings.heroBannerImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-[#FFF8F0] dark:to-[#111111]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[#FFF8F0] text-xs sm:text-sm font-bold tracking-wide uppercase shadow-lg mb-6 animate-pulse">
          <Sparkles className="w-4 h-4 text-[#FF6B35]" />
          <span>{settings.tagline}</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-poppins font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-none drop-shadow-xl max-w-4xl">
          {t('heroTitle')}
        </h1>

        <p className="mt-5 text-base sm:text-xl text-zinc-200 max-w-2xl font-medium drop-shadow-md leading-relaxed">
          Curated high-altitude Himalayan treks, motorcycle expeditions, and riverside wilderness glamping. Transparent prices. Zero hidden costs.
        </p>

        {/* Interactive Search Bar [Destination, Date, Travellers, Search] */}
        <div className="w-full max-w-4xl mt-10">
          <form
            onSubmit={onSearchSubmit}
            className="p-3 sm:p-4 rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/40 dark:border-zinc-700 shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left"
          >
            {/* Field 1: Destination */}
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 hover:border-[#FF6B35] transition">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />
                {t('destinations')}
              </label>
              <input
                type="text"
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
                placeholder={t('searchDestinationPlaceholder')}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
              />
            </div>

            {/* Field 2: Date */}
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 hover:border-[#FF6B35] transition">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                {t('date')}
              </label>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Field 3: Travellers */}
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 hover:border-[#FF6B35] transition">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-sky-500" />
                {t('travellers')}
              </label>
              <select
                value={travellersInput}
                onChange={(e) => setTravellersInput(Number(e.target.value))}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-zinc-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value={1} className="text-zinc-900">1 Solo Adventurer</option>
                <option value={2} className="text-zinc-900">2 Travellers (Duo)</option>
                <option value={4} className="text-zinc-900">4 Adventurers (Squad)</option>
                <option value={8} className="text-zinc-900">8+ Large Group</option>
              </select>
            </div>

            {/* Field 4: Search Button */}
            <div className="flex items-center">
              <button
                type="submit"
                className="w-full h-full py-4 px-6 rounded-2xl font-bold text-sm text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: settings.accentColor }}
              >
                <Search className="w-4 h-4" />
                <span>{t('searchTours')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <span className="text-xs font-semibold text-zinc-300">Popular Expeditions:</span>
          {quickSearches.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setDestinationInput(item.query);
                handleHeroSearch({
                  destination: item.query,
                  category: 'All',
                  date: '',
                  travellers: 2,
                });
              }}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition border border-white/20"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
