import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Calendar, Users, Compass, Sparkles, Phone, MessageCircle, ShieldCheck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { settings, handleHeroSearch, setActiveTab, t } = useApp();

  const [destinationInput, setDestinationInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [travellersInput, setTravellersInput] = useState(2);
  const [categoryInput] = useState('All');

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
    { label: 'Chardham Yatra (11D)', query: 'Chardham' },
    { label: 'Kedarnath Dham (5D)', query: 'Kedarnath' },
    { label: 'Aadi Kailash & Om Parvat', query: 'Aadi Kailash' },
    { label: 'Auli + Chopta + Tungnath', query: 'Auli' },
    { label: 'Mussoorie + Nainital', query: 'Mussoorie' },
    { label: 'Haridwar + Rishikesh', query: 'Haridwar' },
  ];

  return (
    <div className="relative w-full max-w-full min-h-[calc(100dvh-5.5rem)] lg:min-h-[82vh] flex items-center justify-center overflow-hidden">
      {/* Background Hero Image with Deep Contrast Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${settings.heroBannerImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-[#FFF8F0] dark:to-[#111111]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-14 text-center flex flex-col items-center">
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[#FFF8F0] text-[10px] sm:text-xs font-bold tracking-wide uppercase shadow-md mb-3 max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
          <span className="truncate">{settings.tagline}</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-poppins font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight drop-shadow-xl max-w-4xl">
          {t('heroTitle')}
        </h1>

        <p className="mt-2.5 text-xs sm:text-base md:text-lg text-zinc-200 max-w-2xl font-medium drop-shadow-md leading-relaxed">
          Uttarakhand&apos;s trusted travel company at <strong>4, Devpura, Haridwar</strong> — Chardham Yatra, Aadi Kailash Om Parvat, Kedarnath, Badrinath, Auli, Chopta &amp; Himalayan packages.
        </p>

        {/* Primary Action Row */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('destinations')}
            className="px-4 sm:px-5 py-2.5 rounded-xl font-poppins font-bold text-xs sm:text-sm text-white shadow-lg hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer"
            style={{ backgroundColor: settings.accentColor }}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>Explore Packages</span>
          </button>

          <a
            href={settings.whatsappLink || 'https://wa.me/919421709258?text=Hi%20Adventure%20On%20The%20Way!%20I%20want%20to%20book%20a%20trip.'}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 sm:px-4 py-2.5 rounded-xl font-poppins font-bold text-xs sm:text-sm bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a] transition flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>WhatsApp</span>
          </a>

          <a
            href={settings.callLink || 'tel:+919421709258'}
            className="px-3.5 sm:px-4 py-2.5 rounded-xl font-poppins font-bold text-xs sm:text-sm bg-white/95 text-zinc-900 shadow-lg hover:bg-white transition flex items-center gap-1.5"
          >
            <Phone className="w-4 h-4 text-[#FF6B35] shrink-0" />
            <span>+91 94217 09258</span>
          </a>
        </div>

        {/* Interactive Search Bar [Destination, Date, Travellers, Search] */}
        <div className="w-full max-w-4xl mt-6">
          <form
            onSubmit={onSearchSubmit}
            className="p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/40 dark:border-zinc-700 shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-left"
          >
            {/* Field 1: Destination */}
            <div className="col-span-2 lg:col-span-1 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 hover:border-[#FF6B35] transition min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-0.5">
                <MapPin className="w-3 h-3 text-[#FF6B35] shrink-0" />
                {t('destinations')}
              </label>
              <input
                type="text"
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
                placeholder={t('searchDestinationPlaceholder')}
                className="w-full min-w-0 bg-transparent text-xs sm:text-sm font-bold text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
              />
            </div>

            {/* Field 2: Date */}
            <div className="col-span-1 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 hover:border-[#FF6B35] transition min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-0.5">
                <Calendar className="w-3 h-3 text-emerald-500 shrink-0" />
                {t('date')}
              </label>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full min-w-0 bg-transparent text-xs sm:text-sm font-bold text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Field 3: Travellers */}
            <div className="col-span-1 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 hover:border-[#FF6B35] transition min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-0.5">
                <Users className="w-3 h-3 text-sky-500 shrink-0" />
                {t('travellers')}
              </label>
              <select
                value={travellersInput}
                onChange={(e) => setTravellersInput(Number(e.target.value))}
                className="w-full min-w-0 bg-transparent text-xs sm:text-sm font-bold text-zinc-900 dark:text-white focus:outline-none cursor-pointer truncate"
              >
                <option value={1} className="text-zinc-900">1 Solo Yatri</option>
                <option value={2} className="text-zinc-900">2 Travellers</option>
                <option value={4} className="text-zinc-900">4 Family</option>
                <option value={6} className="text-zinc-900">6 SUV Group</option>
                <option value={12} className="text-zinc-900">12+ Group</option>
              </select>
            </div>

            {/* Field 4: Search Button */}
            <div className="col-span-2 lg:col-span-1 flex items-center">
              <button
                type="submit"
                className="w-full h-full py-3 sm:py-4 px-5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm text-white shadow-xl hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: settings.accentColor }}
              >
                <Search className="w-4 h-4 shrink-0" />
                <span>{t('searchTours')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4">
          <span className="text-[11px] font-semibold text-zinc-200">Popular:</span>
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
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition border border-white/25 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
