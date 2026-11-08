import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, Mail, ArrowUp, X, Clock, MapPin } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  const { settings, setActiveTab, showToast } = useApp();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showCallChooser, setShowCallChooser] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    const url =
      settings.whatsappLink ||
      'https://wa.me/919421709258?text=Hi%20Adventure%20On%20The%20Way!%20I%20want%20to%20book%20a%20trip.';
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  const handleEmail = () => {
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Reach our Haridwar Yatra Desk directly via the contact form!', 'info');
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end gap-2.5 sm:gap-3 no-print">
      {/* Dual Phone Number Chooser Card */}
      {showCallChooser && (
        <div className="mb-1 w-72 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Open Now • 24 Hours
              </span>
            </div>
            <button
              onClick={() => setShowCallChooser(false)}
              className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs font-bold text-zinc-900 dark:text-white mb-1">
            Call Om Travels &amp; Adventure On The Way
          </p>
          <p className="text-[11px] text-zinc-500 flex items-center gap-1 mb-3">
            <MapPin className="w-3 h-3 text-[#FF6B35] shrink-0" />
            4, Devpura, Haridwar, Uttarakhand
          </p>

          <div className="space-y-2">
            <a
              href="tel:+919421709258"
              onClick={() => setShowCallChooser(false)}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-2xl bg-[#0B3D2E] hover:bg-[#082d22] text-white text-xs font-bold transition shadow-sm"
            >
              <div>
                <div className="text-[10px] text-emerald-300 font-medium">
                  Primary / WhatsApp Desk
                </div>
                <div className="text-sm">+91 94217 09258</div>
              </div>
              <Phone className="w-4 h-4 text-[#FF6B35]" />
            </a>

            <a
              href="tel:+918668740237"
              onClick={() => setShowCallChooser(false)}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-2xl bg-[#FF6B35] hover:bg-[#e85a25] text-white text-xs font-bold transition shadow-sm"
            >
              <div>
                <div className="text-[10px] text-orange-100 font-medium">
                  Secondary Yatra Desk
                </div>
                <div className="text-sm">+91 86687 40237</div>
              </div>
              <Phone className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      )}

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-11 h-11 rounded-full bg-zinc-900/80 dark:bg-zinc-800/80 text-white flex items-center justify-center shadow-lg hover:bg-zinc-950 transition-all backdrop-blur-md transform hover:scale-105 border border-zinc-700"
          title="Back to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Quick Email Inquiry */}
      <button
        onClick={handleEmail}
        className="group relative w-12 h-12 rounded-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 flex items-center justify-center shadow-xl border border-zinc-200 dark:border-zinc-700 hover:border-[#FF6B35] transition-all transform hover:scale-105"
        title="Email Yatra Desk (hello@adventureontheway.com)"
        aria-label="Email inquiry"
      >
        <Mail className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
        <span className="absolute right-14 bg-zinc-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-md">
          hello@adventureontheway.com
        </span>
      </button>

      {/* Call Button (Orange #FF6B35 - Opens chooser for +91 94217 09258 & +91 86687 40237) */}
      <button
        onClick={() => setShowCallChooser((prev) => !prev)}
        className="group relative w-12 h-12 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shadow-xl hover:bg-[#e85822] transition-all transform hover:scale-105 border border-orange-400/40"
        title="Call +91 94217 09258 / +91 86687 40237"
        aria-label="Call support"
      >
        <Phone className="w-5 h-5 text-white" />
        <span className="absolute right-14 bg-zinc-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-md">
          Call: +91 94217 09258 / +91 86687 40237
        </span>
      </button>

      {/* WhatsApp Button (Green #25D366) */}
      <button
        onClick={handleWhatsApp}
        className="group relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:bg-[#20ba59] transition-all transform hover:scale-110"
        title="Chat on WhatsApp (+91 94217 09258)"
        aria-label="WhatsApp chat"
      >
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-current relative z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.04 6.77C8.84 6.77 8.52 6.84 8.26 7.12C8 7.4 7.28 8.08 7.28 9.46C7.28 10.84 8.28 12.17 8.42 12.35C8.56 12.53 10.38 15.34 13.17 16.54C13.83 16.83 14.35 17 14.75 17.13C15.41 17.34 16.02 17.31 16.5 17.24C17.03 17.16 18.14 16.57 18.37 15.91C18.6 15.26 18.6 14.7 18.53 14.59C18.46 14.47 18.29 14.4 18.04 14.28C17.79 14.15 16.57 13.55 16.34 13.47C16.12 13.39 15.95 13.34 15.79 13.59C15.62 13.84 15.15 14.4 15.01 14.57C14.86 14.73 14.72 14.75 14.47 14.62C14.22 14.5 13.42 14.24 12.47 13.39C11.74 12.73 11.24 11.92 11.1 11.67C10.96 11.42 11.08 11.29 11.21 11.16C11.32 11.05 11.46 10.87 11.59 10.72C11.71 10.57 11.76 10.45 11.84 10.28C11.92 10.12 11.88 9.97 11.82 9.85C11.76 9.72 11.26 8.5 11.05 8C10.85 7.5 10.65 7.58 10.49 7.57C10.34 7.57 10.17 7.56 10 7.56C9.84 7.56 9.57 7.62 9.35 7.86C9.13 8.1 8.5 8.7 8.5 9.94C8.5 11.18 9.4 12.38 9.53 12.55C9.66 12.72 11.34 15.34 13.9 16.44C14.51 16.7 14.99 16.86 15.36 16.98C15.98 17.18 16.54 17.15 16.99 17.08C17.48 17 18.51 16.45 18.73 15.84C18.94 15.23 18.94 14.71 18.88 14.6C18.81 14.49 18.65 14.43 18.41 14.31" />
        </svg>
        <span className="absolute right-16 bg-zinc-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-md">
          WhatsApp: +91 94217 09258
        </span>
      </button>
    </div>
  );
};
