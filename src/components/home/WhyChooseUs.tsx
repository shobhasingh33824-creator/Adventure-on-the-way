import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Award, HeartHandshake, Headphones, Compass } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const { settings, t } = useApp();

  const features = [
    {
      icon: Award,
      title: 'Best Price Guarantee',
      desc: 'Direct ground operations. No middlemen commissions. All gear, meals & state permits included upfront.',
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      icon: Compass,
      title: 'Certified IMF Guides',
      desc: 'All our road captains and trek leaders are graduates of the Himalayan Mountaineering Institute (HMI).',
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      icon: ShieldCheck,
      title: '100% Safe Travel',
      desc: 'Dedicated backup vehicles, oxygen cylinders, pulse oximeters, and medical evacuation emergency ties.',
      color: 'text-[#FF6B35] bg-[#FF6B35]/10',
    },
    {
      icon: Headphones,
      title: '24x7 Ground Support',
      desc: 'Instant WhatsApp updates, weather alerts, satellite phones on remote high passes, and local base captains.',
      color: 'text-sky-500 bg-sky-500/10',
    },
  ];

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
            The Adventure on the Way Difference
          </span>
          <h2 className="font-poppins font-black text-3xl sm:text-4xl text-zinc-900 dark:text-white">
            {t('whyChooseUs')}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Engineered by veteran mountaineers and bikers for authentic, safe, and exhilarating expeditions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 space-y-4"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-poppins font-bold text-base text-zinc-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
