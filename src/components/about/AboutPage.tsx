import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Heart,
  Award,
  Mountain,
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Instagram,
  CheckCircle2,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, setActiveTab } = useApp();

  const highlights = [
    'Chardham Yatra (Yamunotri, Gangotri, Kedarnath, Badrinath) Specialists',
    'Aadi Kailash & Om Parvat Yatra Inner-Line Permit & Kumaon Fleet',
    'Mussoorie, Nainital, Auli, Chopta, Valley of Flowers & Corbett Packages',
    '24x7 On-Ground Support Office at 4, Devpura, Haridwar (Near Railway Station)',
    '71,175+ Verified Followers Community on Instagram (@adventure_on_the_way)',
    'Verified Tempo Travellers, Innova Crysta, Helicopter Assistance & Deluxe Camps',
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-[#111111] py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-bold uppercase tracking-wider">
            <Mountain className="w-4 h-4" />
            Haridwar's Most Trusted Himalayan Tour Operator
          </div>
          <h1 className="font-poppins font-black text-3xl sm:text-5xl text-zinc-900 dark:text-white">
            Om Travels & Adventure On The Way
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
            "{settings.tagline}"
          </p>
        </div>

        {/* Narrative & Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Open 24 Hours • Headquartered in Haridwar, Uttarakhand</span>
            </div>

            <h3 className="font-poppins font-bold text-2xl text-zinc-900 dark:text-white">
              About Adventure On The Way
            </h3>

            <p className="text-sm leading-relaxed">
              {settings.aboutText ||
                'Adventure On The Way is one of the best travel companies to provide best tour packages of Uttarakhand - Chardham Yatra, Aadi Kailash Om Parvat Yatra, Mussoorie, Nainital and all Uttarakhand tour packages.'}
            </p>

            <div className="space-y-2.5 pt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B35] shrink-0 mt-0.5" />
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{item}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="font-poppins font-black text-xl sm:text-2xl text-[#FF6B35]">
                  71.1K+
                </span>
                <p className="text-[11px] text-zinc-400 font-semibold mt-1">Instagram Community</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="font-poppins font-black text-xl sm:text-2xl text-emerald-500">
                  25,000+
                </span>
                <p className="text-[11px] text-zinc-400 font-semibold mt-1">Happy Yatris Guided</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="font-poppins font-black text-xl sm:text-2xl text-amber-500">
                  24x7
                </span>
                <p className="text-[11px] text-zinc-400 font-semibold mt-1">Haridwar Support</p>
              </div>
            </div>
          </div>

          {/* Client Business Profile Showcase Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6">
            <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
              <img
                src="/assets/aistudio/Screenshot_20261108-104735_f720548e.png"
                alt="Om Travels & Adventure On The Way"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FF6B35]"
              />
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase">
                  ● Verified Travel Company
                </span>
                <h4 className="font-poppins font-black text-lg text-zinc-900 dark:text-white mt-1">
                  Om Travels & Adventure On The Way
                </h4>
                <p className="text-xs text-zinc-500">Haridwar, Devbhoomi Uttarakhand</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60">
                <MapPin className="w-4 h-4 text-[#FF6B35] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-900 dark:text-white block">
                    Registered Haridwar Office Address:
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-300">
                    4, Devpura, Haridwar, Uttarakhand 249401, India
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-900 dark:text-white block">
                    24x7 Yatra Booking Helplines:
                  </span>
                  <div className="flex flex-wrap gap-3 mt-1 font-bold text-[#FF6B35]">
                    <a href="tel:+919421709258" className="hover:underline">
                      +91 94217 09258 (Primary / WhatsApp)
                    </a>
                    <span>•</span>
                    <a href="tel:+918668740237" className="hover:underline">
                      +91 86687 40237 (Secondary)
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60">
                <Instagram className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-900 dark:text-white block">
                    Official Instagram Community:
                  </span>
                  <a
                    href="https://instagram.com/adventure_on_the_way"
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-600 dark:text-pink-400 font-bold hover:underline"
                  >
                    @adventure_on_the_way (71,175 Followers)
                  </a>
                </div>
              </div>
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
              Safe & Verified Himalayan Fleet
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Experienced hill drivers born in Uttarakhand, oxygen cylinders on high-altitude Yatras (Kedarnath & Aadi Kailash), and 24x7 Haridwar control room monitoring.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
              Authentic Devbhoomi Hospitality
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Hygienic pure vegetarian & Jain meals on Chardham routes, handpicked scenic hotels near temples, and dedicated care for senior citizens and families.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
              Transparent Pricing & Direct Booking
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Zero middleman commission. Book directly with our Haridwar head office via UPI (`9421709258@upi`) or 20% advance reservation token.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="p-8 sm:p-12 rounded-3xl text-center text-white space-y-4 shadow-xl"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <h3 className="font-poppins font-black text-2xl sm:text-3xl">
            Haridwar se Himalaya Tak — Ready for Your Next Yatra?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-200 max-w-lg mx-auto">
            Explore our 12+ Uttarakhand & Himalayan packages or talk to our Haridwar travel desk at +91 94217 09258.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setActiveTab('destinations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-3 rounded-2xl font-bold text-sm bg-[#FF6B35] hover:bg-[#e85822] transition shadow-lg inline-flex items-center gap-2"
            >
              <span>Explore All 12+ Tour Packages</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/919421709258?text=Hi%20Adventure%20On%20The%20Way!%20I%20want%20to%20plan%20a%20Yatra."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-2xl font-bold text-sm bg-white/10 hover:bg-white/20 border border-white/20 transition inline-flex items-center gap-2"
            >
              <span>Chat on WhatsApp (+91 94217 09258)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
