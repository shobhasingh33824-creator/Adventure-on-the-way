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
  Instagram,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, packages, addEnquiry, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tourInterest, setTourInterest] = useState(
    packages[0]?.title || 'Chardham Yatra (Yamunotri, Gangotri, Kedarnath, Badrinath)'
  );
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast('Please fill out your name, phone number, and message.', 'error');
      return;
    }

    setIsSubmitting(true);
    addEnquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || 'yatri@adventureontheway.com',
      destination: tourInterest,
      message: message.trim(),
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 500);
  };

  const handleWhatsApp = () => {
    const a = document.createElement('a');
    a.href =
      settings.whatsappLink ||
      'https://wa.me/919421709258?text=Hi%20Adventure%20On%20The%20Way!%20I%20want%20to%20book%20a%20trip.';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-[#111111] py-12 sm:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Open Now • Open 24 Hours • Haridwar Head Office
          </div>
          <h1 className="font-poppins font-black text-3xl sm:text-5xl text-zinc-900 dark:text-white">
            Om Travels &amp; Adventure On The Way
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Visit us at <strong>4, Devpura, Haridwar, Uttarakhand 249401</strong> or call our 24×7 Yatra Desk for Chardham Yatra, Aadi Kailash Om Parvat, Mussoorie, Nainital &amp; all Uttarakhand tour packages.
          </p>
        </div>

        {/* Contact Grid: Form + Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Enquiry Form Saved to PostgreSQL */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <h2 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
              Send a Yatra / Tour Enquiry
            </h2>

            {isSent && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Enquiry Saved to Haridwar Yatra Desk!</h4>
                  <p>
                    Our Haridwar coordinator (+91 94217 09258 / +91 86687 40237) has received your enquiry and will call or WhatsApp you shortly.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajeshwar Sharma"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    WhatsApp / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 94217 09258"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yatri@gmail.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Select Yatra / Tour Package
                  </label>
                  <select
                    value={tourInterest}
                    onChange={(e) => setTourInterest(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-zinc-900 dark:text-white focus:outline-none"
                  >
                    {packages.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title} ({p.duration})
                      </option>
                    ))}
                    <option value="Custom Uttarakhand Tempo Traveller / Innova Booking">
                      Custom Uttarakhand Tempo Traveller / Innova Booking
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">
                  Travel Dates, Group Size &amp; Requirements *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your arrival date at Haridwar, number of Yatris/travelers, and hotel/vehicle preference..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3.5 text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[52px] py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: settings.accentColor }}
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting ? 'Submitting to Database...' : 'Submit Yatra Enquiry'}
                </span>
              </button>
            </form>
          </div>

          {/* Right Column: Real Haridwar Contact Details & Google Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-poppins font-black text-lg text-zinc-900 dark:text-white">
                  Haridwar Head Office
                </h3>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
                  Open 24 Hours
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0B3D2E]/10 text-[#0B3D2E] dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">
                      Office Address
                    </span>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                      4, Devpura, Haridwar, Uttarakhand 249401, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-zinc-900 dark:text-white block">
                      24×7 Booking &amp; WhatsApp Numbers
                    </span>
                    <a
                      href="tel:+919421709258"
                      className="block font-bold text-[#0B3D2E] dark:text-emerald-400 hover:underline"
                    >
                      📞 +91 94217 09258 (Primary / WhatsApp)
                    </a>
                    <a
                      href="tel:+918668740237"
                      className="block font-bold text-[#FF6B35] hover:underline"
                    >
                      📞 +91 86687 40237 (Secondary Desk)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 flex items-center justify-center shrink-0">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">
                      Official Instagram (71,175 Followers)
                    </span>
                    <a
                      href="https://instagram.com/adventure_on_the_way"
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-600 dark:text-pink-400 font-semibold hover:underline"
                    >
                      @adventure_on_the_way • 71.1K Followers
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">
                      Official Email &amp; UPI ID
                    </span>
                    <a
                      href="mailto:hello@adventureontheway.com"
                      className="text-zinc-600 dark:text-zinc-400 hover:text-sky-500 transition block"
                    >
                      hello@adventureontheway.com
                    </a>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      UPI ID: 9421709258@upi
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">
                      Timing
                    </span>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                      Open Now • Open 24 Hours (Monday – Sunday)
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="py-3 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-[#20ba59] transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp +91 94217 09258</span>
                </button>
                <a
                  href="tel:+918668740237"
                  className="py-3 rounded-xl bg-[#FF6B35] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-[#e85a25] transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call +91 86687 40237</span>
                </a>
              </div>
            </div>

            {/* Real Google Map Embed for 4, Devpura, Haridwar */}
            <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm bg-zinc-900 h-64 relative">
              <iframe
                title="Om Travels & Adventure On The Way - 4, Devpura, Haridwar"
                src="https://www.google.com/maps?q=4,+Devpura,+Haridwar,+Uttarakhand+249401&output=embed"
                width="100%"
                height="100%"
                className="border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-2 left-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-zinc-800 dark:text-zinc-200 shadow-sm">
                📍 4, Devpura, Haridwar, Uttarakhand 249401
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
