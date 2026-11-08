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
  Twitter,
  ShieldCheck,
  Award,
  Clock,
  Heart,
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
    showToast('Subscribed! Check your inbox for exclusive trek promo codes.', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#111111] text-zinc-300 pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-zinc-800 text-center">
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <ShieldCheck className="w-8 h-8 text-[#FF6B35]" />
            <h4 className="text-white font-bold text-sm">Certified IMF Guides</h4>
            <p className="text-xs text-zinc-400">Mountaineering certified instructors</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <Award className="w-8 h-8 text-[#FF6B35]" />
            <h4 className="text-white font-bold text-sm">Best Price Guarantee</h4>
            <p className="text-xs text-zinc-400">Direct operator transparent pricing</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <Clock className="w-8 h-8 text-[#FF6B35]" />
            <h4 className="text-white font-bold text-sm">24x7 Base Support</h4>
            <p className="text-xs text-zinc-400">Oxygen & satellite rescue ready</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <Heart className="w-8 h-8 text-[#FF6B35]" />
            <h4 className="text-white font-bold text-sm">15,000+ Happy Adventurers</h4>
            <p className="text-xs text-zinc-400">4.9/5 star verified trip rating</p>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Logo isLight />
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              {settings.tagline}. Leading adventure travel operator in India specializing in high-altitude Himalayan treks, bike expeditions, riverside camping, and wildlife safaris.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Get ₹1,500 Off Your First Expedition
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

          {/* Top Expeditions */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Top Expeditions
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('destinations');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Spiti Valley 4x4 Circuit
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
                  Leh Ladakh Royal Enfield Ride
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
                  Kashmir Great Lakes Trek
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
                  Rishikesh Rafting & Bungee
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
                  Kedarkantha Winter Snow Trek
                </button>
              </li>
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
                  {t('destinations')} & Packages
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
                  {t('contact')}
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
                  Track My Booking
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Contact Base
            </h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF6B35] shrink-0 mt-1" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FF6B35] shrink-0" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-white transition">
                  {settings.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF6B35] shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition">
                  {settings.contactEmail}
                </a>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-[#FF6B35] hover:text-white flex items-center justify-center transition"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
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
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-[#FF6B35] hover:text-white flex items-center justify-center transition"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & accepted payment icons */}
        <div className="pt-8 mt-4 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} {settings.brandName}. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-zinc-400 font-semibold mr-1">Secured Payments:</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold text-[10px]">BHIM UPI</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold text-[10px]">Google Pay</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold text-[10px]">PhonePe</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold text-[10px]">Paytm</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold text-[10px]">VISA / Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
