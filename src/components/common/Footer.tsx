import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Navbar';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Instagram,
  Youtube,
  Facebook,
  ShieldCheck,
  Award,
  Clock,
  Heart,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setActiveTab, showToast, t } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Subscribed! Use code CHARDHAM2000 for ₹2,000 OFF.', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#111111] text-zinc-300 pt-16 pb-20 md:pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Instagram 71,175 Followers Community Banner */}
        <div className="mb-12 rounded-3xl bg-gradient-to-r from-[#2b170c] via-[#0B3D2E] to-[#1a1110] p-6 sm:p-8 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5 shrink-0 shadow-lg">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-1">
                <span>71,175 Followers</span>
                <span>•</span>
                <span>Verified Travel Community</span>
              </div>
              <h3 className="text-white font-poppins font-extrabold text-lg sm:text-2xl">
                Follow {settings.instagramHandle || '@adventure_on_the_way'} on Instagram
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
                Daily live darshan updates from Kedarnath, Badrinath, Aadi Kailash &amp; Haridwar HQ!
              </p>
            </div>
          </div>

          <a
            href={settings.instagramUrl || 'https://instagram.com/adventure_on_the_way'}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-[#FF6B35] hover:bg-[#e85a25] text-white font-bold text-sm flex items-center gap-2 shadow-xl transition shrink-0"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow @adventure_on_the_way (71.1K)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Top Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-zinc-800 text-center">
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <ShieldCheck className="w-8 h-8 text-[#FF6B35]" />
            <h4 className="text-white font-bold text-sm">Uttarakhand Regd.</h4>
            <p className="text-xs text-zinc-400">Official Haridwar Tour Operator</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <Award className="w-8 h-8 text-[#FF6B35]" />
            <h4 className="text-white font-bold text-sm">Best Price Direct</h4>
            <p className="text-xs text-zinc-400">Own Fleet &amp; Verified Hotels</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <Clock className="w-8 h-8 text-emerald-400" />
            <h4 className="text-white font-bold text-sm">Open 24 Hours</h4>
            <p className="text-xs text-emerald-400 font-semibold">Open Now • 4, Devpura, Haridwar</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <Heart className="w-8 h-8 text-[#FF6B35]" />
            <h4 className="text-white font-bold text-sm">71,175+ Community</h4>
            <p className="text-xs text-zinc-400">4.9/5 Star Verified Yatri Rating</p>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Logo isLight />
            <p className="text-xs sm:text-sm text-zinc-300 font-semibold">
              {settings.tagline}
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
              {settings.aboutText ||
                'Adventure On The Way is one of the best travel companies to provide best tour packages of Uttarakhand - Chardham Yatra, Aadi Kailash Om Parvat Yatra, Mussoorie, Nainital and all Uttarakhand tour packages.'}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Get ₹2,000 Off Chardham &amp; Uttarakhand Packages
              </label>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B35] flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-[#FF6B35] hover:bg-[#e85822] transition shrink-0 flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Uttarakhand Packages */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Uttarakhand Yatras
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              {[
                'Chardham Yatra (11 Days)',
                'Do Dham Yatra (7 Days)',
                'Aadi Kailash Om Parvat (10 Days)',
                'Kedarnath Yatra (5 Days)',
                'Badrinath Yatra (4 Days)',
                'Auli + Chopta + Tungnath',
                'Mussoorie + Nainital',
                'Valley of Flowers Trek',
              ].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      setActiveTab('destinations');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#FF6B35] transition text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  {t('home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('destinations');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  All 12 Uttarakhand Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  {t('about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Haridwar Office Map &amp; Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('user-dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  My Bookings &amp; Tickets
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Admin &amp; Gallery Portal (/admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Real Haridwar Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Haridwar Head Office
            </h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF6B35] shrink-0 mt-1" />
                <span>4, Devpura, Haridwar, Uttarakhand 249401, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FF6B35] shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+919421709258" className="text-white font-semibold hover:text-[#FF6B35] transition">
                    +91 94217 09258 (Primary / WhatsApp)
                  </a>
                  <a href="tel:+918668740237" className="text-zinc-300 hover:text-[#FF6B35] transition">
                    +91 86687 40237 (Secondary)
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF6B35] shrink-0" />
                <a href="mailto:hello@adventureontheway.com" className="hover:text-white transition">
                  hello@adventureontheway.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-emerald-400">
                  Open Now • Open 24 Hours
                </span>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com/adventure_on_the_way"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-[#FF6B35] text-white text-xs font-bold flex items-center gap-1.5 transition"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>71,175 Followers</span>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-[#FF6B35] hover:text-white flex items-center justify-center transition"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-[#FF6B35] hover:text-white flex items-center justify-center transition"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Embedded Google Map for 4, Devpura, Haridwar */}
        <div className="mb-8 rounded-2xl overflow-hidden border border-zinc-800 h-48 relative">
          <iframe
            title="Om Travels & Adventure On The Way - 4, Devpura, Haridwar"
            src="https://www.google.com/maps?q=4,+Devpura,+Haridwar,+Uttarakhand+249401&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Bottom copyright & accepted payment icons */}
        <div className="pt-6 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} Om Travels &amp; Adventure On The Way (4, Devpura, Haridwar). All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-zinc-400 font-semibold mr-1">UPI ID: 9421709258@upi</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold text-[10px]">Razorpay</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold text-[10px]">BHIM UPI</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold text-[10px]">Google Pay</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold text-[10px]">PhonePe</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold text-[10px]">Paytm</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
