import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, ShieldCheck, Heart, Users, Award, Mountain, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, setActiveTab } = useApp();

  const leaders = [
    {
      name: 'Col. Ranjit Singh (Retd.)',
      role: 'Head of High-Altitude Safety & Evacuation',
      exp: '28 Years High Altitude Experience',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
    },
    {
      name: 'Pema Dolkar',
      role: 'Chief Mountaineering Lead (HMI Darjeeling Gold Medalist)',
      exp: 'Summited 14+ Himalayan Peaks',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400',
    },
    {
      name: 'Samarth Rawat',
      role: 'Director of Motorcycle Expeditions',
      exp: '50+ Leh-Manali & Spiti Circuits',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-[#111111] py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-bold uppercase tracking-wider">
            <Mountain className="w-4 h-4" />
            Our Mission & DNA
          </div>
          <h1 className="font-poppins font-black text-3xl sm:text-5xl text-zinc-900 dark:text-white">
            Born in the High Himalayas. Built for Real Explorers.
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
            "{settings.tagline}" is more than a slogan. It is a commitment that every trek, bike pass, and camp night will push your horizons while preserving nature.
          </p>
        </div>

        {/* Narrative & Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <h3 className="font-poppins font-bold text-xl text-zinc-900 dark:text-white">
              Why We Started Adventure on the Way
            </h3>
            <p>
              In 2018, our founders—a group of certified mountaineering instructors and adventure bikers—realized that commercial tourism had watered down the wilderness experience. Large tour aggregators packed 50 people into buses, cut safety corners on high passes, and left plastic behind.
            </p>
            <p>
              We established <strong>{settings.brandName}</strong> with a strict charter: small cohorts (max 14-16 adventurers), genuine IMF certified guides, top-tier four-season mountain equipment, satellite emergency backups, and an unyielding <em>Leave No Trace</em> sustainability pledge.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="font-poppins font-black text-2xl text-[#FF6B35]">15,000+</span>
                <p className="text-xs text-zinc-400 font-semibold mt-1">Adventurers Guided</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="font-poppins font-black text-2xl text-emerald-500">100%</span>
                <p className="text-xs text-zinc-400 font-semibold mt-1">Safety Record</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 aspect-4/3">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200"
              alt="Himalayan Basecamp"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 text-white">
              <p className="text-xs font-semibold">
                Camp 1 at Spiti Valley — 4,200m above sea level under a crystal-clear Milky Way.
              </p>
            </div>
          </div>
        </div>

        {/* Pillars / Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
              No Compromise On Safety
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Every trek carries portable hyperbaric bags, oxygen cylinders, pulse oximeters, and first-aid kits verified by military doctors.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
              Empowering Mountain Locals
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              85% of our staff—cooks, mule handlers, driving captains, and porters—are native to Himachal, Ladakh, and Uttarakhand.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
              Leave No Trace Eco-Pledge
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              We bring down 100% of non-biodegradable waste from every high-altitude campsite. We protect the valleys we cherish.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
              Leadership Team
            </span>
            <h3 className="font-poppins font-black text-2xl sm:text-3xl text-zinc-900 dark:text-white">
              Meet the Expedition Commanders
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaders.map((lead, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm flex flex-col"
              >
                <img
                  src={lead.image}
                  alt={lead.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6 space-y-1">
                  <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
                    {lead.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#FF6B35]">{lead.role}</p>
                  <p className="text-xs text-zinc-400 pt-1">{lead.exp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="p-8 sm:p-12 rounded-3xl text-center text-white space-y-4 shadow-xl"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <h3 className="font-poppins font-black text-2xl sm:text-3xl">
            Ready to Live The Adventure?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-200 max-w-lg mx-auto">
            Book online in under 2 minutes with flexible 20% advance token payment or instant UPI QR clearance.
          </p>
          <button
            onClick={() => {
              setActiveTab('destinations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-3 rounded-2xl font-bold text-sm bg-[#FF6B35] hover:bg-[#e85822] transition shadow-lg inline-flex items-center gap-2"
          >
            <span>Explore Tour Packages</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
