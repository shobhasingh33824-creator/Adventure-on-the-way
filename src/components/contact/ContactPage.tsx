import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Shield,
  HelpCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tourInterest, setTourInterest] = useState('Spiti Valley Ultimate 4x4 Circuit');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      showToast('Your message has been received! Our trip lead will contact you within 2 hours.', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1000);
  };

  const handleWhatsApp = () => {
    window.open(
      settings.whatsappLink ||
        'https://wa.me/919421709258?text=Hi%20Adventure%20on%20the%20Way!%20I%20want%20to%20book%20a%20trip.',
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-[#111111] py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
            24x7 Basecamp Support
          </span>
          <h1 className="font-poppins font-black text-3xl sm:text-5xl text-zinc-900 dark:text-white">
            Connect with Our Expedition Captains
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Have questions regarding fitness, acclimatization, gear packing, or custom group departures? We are here to guide you.
          </p>
        </div>

        {/* Contact Grid: Form + Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <h2 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
              Send an Expedition Inquiry
            </h2>

            {isSent && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Inquiry Dispatched Successfully!</h4>
                  <p>A certified mountain trip coordinator has been notified and will call or message you shortly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Your Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ankit Sharma"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">WhatsApp / Mobile Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="adventurer@gmail.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Tour of Interest</label>
                  <select
                    value={tourInterest}
                    onChange={(e) => setTourInterest(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-white focus:outline-none"
                  >
                    <option value="Spiti Valley Ultimate 4x4 Circuit">Spiti Valley Ultimate 4x4 Circuit</option>
                    <option value="Leh-Ladakh Royal Enfield Motorcycle Odyssey">Leh-Ladakh Motorcycle Odyssey</option>
                    <option value="Manali High Altitude & Solang Valley">Manali High Altitude & Solang</option>
                    <option value="Rishikesh White Water Rapids & Glamping">Rishikesh Rafting & Glamping</option>
                    <option value="Kashmir Great Lakes Alpine Wilderness">Kashmir Great Lakes Trek</option>
                    <option value="Kedarkantha Winter Snow Summit Trek">Kedarkantha Snow Trek</option>
                    <option value="Custom Private Corporate Expedition">Custom Corporate / Group Expedition</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Message / Questions *</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us your tentative travel dates, group size, or questions about fitness..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: settings.accentColor }}
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Request...' : 'Send Inquiry Message'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Contact Details & Google Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-xs">
              <h3 className="font-poppins font-black text-lg text-zinc-900 dark:text-white">
                Base Operations HQ
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0B3D2E]/10 text-[#0B3D2E] dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">HQ Address</span>
                    <p className="text-zinc-500 mt-0.5">{settings.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">Direct Phone</span>
                    <a href={`tel:${settings.contactPhone}`} className="text-zinc-500 hover:text-[#FF6B35] transition">
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">Official Email</span>
                    <a href={`mailto:${settings.contactEmail}`} className="text-zinc-500 hover:text-sky-500 transition">
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">Operational Hours</span>
                    <p className="text-zinc-500 mt-0.5">Monday – Sunday: 7:00 AM – 10:00 PM IST</p>
                    <p className="text-zinc-400 text-[10px]">Active field expeditions have 24/7 radio support</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full py-3 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-[#20ba59] transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat Immediately on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Google Map Embed Container */}
            <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm bg-zinc-900 h-64 relative">
              <iframe
                title="Adventure on the Way Basecamp Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13540.354146059288!2d77.178822!3d32.2396325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39048708107f9c2d%3A0x633516550710ec1f!2sMall%20Rd%2C%20Manali%2C%20Himachal%20Pradesh%20175131!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.2)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-zinc-800 dark:text-zinc-200 shadow-sm">
                📍 Manali Base Station & Briefing Center
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
