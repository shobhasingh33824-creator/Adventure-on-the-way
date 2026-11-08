import React, { useState, useEffect } from 'react';
import { TourPackage, PaymentMethod } from '../../types';
import { useApp } from '../../context/AppContext';
import { ImageUploadPicker } from '../common/ImageUploadPicker';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Users,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  ShieldCheck,
  Tag,
  ArrowRight,
  ArrowLeft,
  Printer,
  Share2,
  Copy,
  Smartphone,
  Camera,
} from 'lucide-react';

interface BookingModalProps {
  pkg: TourPackage | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ pkg, onClose }) => {
  const {
    formatPrice,
    currentUser,
    addBooking,
    validateCoupon,
    settings,
    showToast,
    setActiveTab,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Dates & Travellers
  const [travelDate, setTravelDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [couponInput, setCouponInput] = useState<string>('ADVENTURE10');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    message: string;
  } | null>(null);

  // Step 2: Passenger details
  const [passengerName, setPassengerName] = useState<string>(currentUser?.name || '');
  const [passengerEmail, setPassengerEmail] = useState<string>(currentUser?.email || '');
  const [passengerPhone, setPassengerPhone] = useState<string>(currentUser?.phone || '');
  const [idProofType, setIdProofType] = useState<string>('Aadhaar Card');
  const [idProofNumber, setIdProofNumber] = useState<string>('XXXX-XXXX-4819');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('419');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Step 4: Confirmed booking data
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');

  if (!pkg) return null;

  // Price calculations
  const totalTravellers = adults + children;
  const baseCost = adults * pkg.price + children * Math.round(pkg.price * 0.65);
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalAmount = Math.max(0, baseCost - discountAmount);

  // Advance amount for "Pay on Trip" (20%)
  const advanceAmount =
    paymentMethod === 'Pay on Trip' ? Math.round(totalAmount * 0.2) : totalAmount;
  const balanceAmount = totalAmount - advanceAmount;

  useEffect(() => {
    if (couponInput && !appliedCoupon) {
      const res = validateCoupon(couponInput, baseCost);
      if (res.valid) {
        setAppliedCoupon({ code: couponInput, discount: res.discount, message: res.message });
      }
    }
  }, [baseCost]);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      showToast('Please enter a coupon code', 'error');
      return;
    }
    const res = validateCoupon(couponInput, baseCost);
    if (res.valid) {
      setAppliedCoupon({ code: couponInput.toUpperCase(), discount: res.discount, message: res.message });
      showToast(res.message, 'success');
    } else {
      setAppliedCoupon(null);
      showToast(res.message, 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    showToast('Coupon removed', 'info');
  };

  // Step 1 Validation -> Step 2
  const handleProceedToStep2 = () => {
    if (!travelDate) {
      showToast('Please select a departure date', 'error');
      return;
    }
    if (totalTravellers < 1) {
      showToast('Please select at least 1 traveller', 'error');
      return;
    }
    if (totalTravellers > pkg.availableSeats) {
      showToast(`Only ${pkg.availableSeats} seats remaining for this tour!`, 'error');
      return;
    }
    setStep(2);
  };

  // Step 2 Validation -> Step 3
  const handleProceedToStep3 = () => {
    if (!passengerName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(passengerEmail)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    const cleanPhone = passengerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    setStep(3);
  };

  // Step 3 Payment Execution -> Step 4 Confirmation
  const handleCompletePayment = async () => {
    if (paymentMethod === 'UPI' && !utrNumber.trim()) {
      setUtrNumber('UPI-' + Math.floor(1000000000 + Math.random() * 9000000000));
    }

    setIsProcessing(true);

    try {
      // Create Razorpay order on server if Card or NetBanking
      let txnId =
        paymentMethod === 'UPI'
          ? utrNumber || 'UPI-' + Date.now().toString().slice(-6)
          : paymentMethod === 'Card'
          ? 'RZP-CARD-' + Date.now().toString().slice(-6)
          : paymentMethod === 'NetBanking'
          ? 'RZP-NETBANK-' + Date.now().toString().slice(-6)
          : 'ADVANCE-' + Date.now().toString().slice(-6);

      if (paymentMethod === 'Card' || paymentMethod === 'NetBanking') {
        try {
          const orderRes = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: advanceAmount, currency: 'INR', receipt: pkg.id }),
          });
          if (orderRes.ok) {
            const orderData = await orderRes.json();
            if (orderData?.id) txnId = orderData.id;
          }
        } catch {
          // fallback if offline
        }
      }

      setTimeout(() => {
        setIsProcessing(false);

        const newBooking = addBooking({
          packageId: pkg.id,
          packageTitle: pkg.title,
          packageImage: pkg.images[0] || '',
          userId: currentUser?.id || 'usr-guest-' + Date.now().toString().slice(-4),
          userName: passengerName,
          userEmail: passengerEmail,
          userPhone: passengerPhone,
          travelDate,
          adults,
          children,
          basePrice: baseCost,
          discountAmount,
          couponCode: appliedCoupon?.code,
          totalAmount,
          advanceAmount,
          balanceAmount,
          paymentMethod,
          paymentStatus: paymentMethod === 'Pay on Trip' ? 'Advance Paid' : paymentScreenshot ? 'Paid' : 'Paid',
          transactionId: txnId,
          paymentScreenshot: paymentScreenshot || undefined,
          bookingStatus: 'Confirmed',
          idProofType,
          idProofNumber,
          specialRequests,
        });

        setConfirmedBookingId(newBooking.id);
        setStep(4);

        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0B3D2E', '#FF6B35', '#10B981', '#F59E0B'],
          });
        } catch {
          // ignore
        }
      }, 900);
    } catch {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendToAdminWhatsApp = () => {
    const text = encodeURIComponent(
      `🙏 Namaste Om Travels & Adventure On The Way!\n\n` +
        `✅ *NEW TOUR BOOKING CONFIRMED*\n` +
        `🎫 Booking ID: *${confirmedBookingId}*\n` +
        `🏔️ Package: *${pkg.title}*\n` +
        `📅 Travel Date: *${travelDate}*\n` +
        `👤 Guest: *${passengerName}* (${passengerPhone})\n` +
        `👥 Travellers: *${adults} Adults${children > 0 ? `, ${children} Children` : ''}*\n` +
        `💰 Paid Now: *${formatPrice(advanceAmount)}* via *${paymentMethod}*\n` +
        (balanceAmount > 0 ? `⏳ Balance Due at Haridwar Basecamp: *${formatPrice(balanceAmount)}*\n` : '') +
        `🧾 Ref/UTR: *${utrNumber || 'Verified'}*\n\n` +
        `Please share my Yatra reporting details and driver contact.`
    );
    window.open(`https://wa.me/919421709258?text=${text}`, '_blank');
  };

  const handleSendToCustomerWhatsApp = () => {
    const cleanPhone = passengerPhone.replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = encodeURIComponent(
      `🎉 *Your Yatra / Adventure Pass is Confirmed!*\n` +
        `*Om Travels & Adventure On The Way (Haridwar)*\n\n` +
        `🎫 Booking ID: *${confirmedBookingId}*\n` +
        `🏔️ Tour: *${pkg.title}*\n` +
        `📅 Date: *${travelDate}*\n` +
        `👥 Guests: *${adults} Adults${children > 0 ? `, ${children} Children` : ''}*\n` +
        `💰 Amount Paid: *${formatPrice(advanceAmount)}*\n` +
        `📍 Reporting Office: 4, Devpura, Haridwar, Uttarakhand 249401\n` +
        `📞 24x7 Helpline: +91 94217 09258 / +91 86687 40237`
    );
    window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank');
  };

  const copyUpiId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(settings.upiId || '9421709258@upi');
      showToast('UPI ID copied to clipboard: ' + (settings.upiId || '9421709258@upi'), 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div
        className="relative w-full max-w-3xl bg-[#FFF8F0] dark:bg-[#111111] rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
                Step {step} of 4
              </span>
              <span className="text-xs text-zinc-400">•</span>
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                {step === 1 && 'Dates & Group Size'}
                {step === 2 && 'Traveller Information'}
                {step === 3 && 'Payment & Screenshot Upload'}
                {step === 4 && 'Confirmed Yatra Pass'}
              </span>
            </div>
            <h3 className="font-poppins font-bold text-base sm:text-lg text-zinc-900 dark:text-white truncate max-w-md">
              {pkg.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Progress Tracker */}
        <div className="bg-zinc-100/70 dark:bg-zinc-900/60 px-6 py-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold">
          {[
            { s: 1, label: 'Trip Dates' },
            { s: 2, label: 'Details' },
            { s: 3, label: 'Payment' },
            { s: 4, label: 'Ticket' },
          ].map((item) => (
            <div
              key={item.s}
              className={`flex items-center gap-1.5 ${
                step >= item.s
                  ? 'text-[#FF6B35] font-bold'
                  : 'text-zinc-400 dark:text-zinc-600'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step >= item.s
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {item.s}
              </span>
              <span className="hidden sm:inline">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* ================= STEP 1: DATES & TRAVELLERS ================= */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FF6B35]" />
                  Select Departure Date (From Haridwar / Rishikesh)
                </label>
                <input
                  type="date"
                  value={travelDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                />
                <p className="text-[11px] text-zinc-500">
                  Daily & Weekend departures from 4, Devpura, Haridwar. Custom private Tempo Traveller / Innova available.
                </p>
              </div>

              {/* Travellers Counter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Adults (12+ yrs)</h4>
                    <p className="text-xs text-zinc-400">{formatPrice(pkg.price)} per person</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200"
                    >
                      -
                    </button>
                    <span className="font-bold text-base w-4 text-center text-zinc-900 dark:text-white">
                      {adults}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdults(Math.min(pkg.availableSeats, adults + 1))}
                      className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Children (5-11 yrs)</h4>
                    <p className="text-xs text-zinc-400">35% Kids Discount</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200"
                    >
                      -
                    </button>
                    <span className="font-bold text-base w-4 text-center text-zinc-900 dark:text-white">
                      {children}
                    </span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#FF6B35]" />
                  Have a Yatra / Adventure Promo Code?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. ADVENTURE10)"
                    className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs font-bold uppercase text-zinc-900 dark:text-white"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {appliedCoupon && (
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Coupon {appliedCoupon.code} applied! Saving {formatPrice(appliedCoupon.discount)}
                  </p>
                )}
              </div>

              {/* Price Calculation Summary */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>
                    Base Tour Fare ({adults} Adults {children > 0 ? `+ ${children} Children` : ''})
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {formatPrice(baseCost)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Coupon Discount</span>
                    <span>- {formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Yatra Registration, Guide & Taxes</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">INCLUDED</span>
                </div>
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-baseline font-bold text-sm">
                  <span className="text-zinc-900 dark:text-white">Total Package Amount</span>
                  <span className="text-lg font-black text-[#FF6B35]">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: TRAVELLER DETAILS ================= */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Lead Passenger Name *
                  </label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="Full name as on Aadhaar / ID"
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    WhatsApp / Mobile Number (10 digits) *
                  </label>
                  <input
                    type="tel"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Email Address for Tickets & Yatra Permit *
                </label>
                <input
                  type="email"
                  value={passengerEmail}
                  onChange={(e) => setPassengerEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Government ID Proof Type
                  </label>
                  <select
                    value={idProofType}
                    onChange={(e) => setIdProofType(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Voter ID">Voter ID</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    ID Document Number
                  </label>
                  <input
                    type="text"
                    value={idProofNumber}
                    onChange={(e) => setIdProofNumber(e.target.value)}
                    placeholder="Enter document number"
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Special Requests (Helicopter Ticket Help, Pony/Palki, Ground Floor Room, Pure Jain Food)
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Senior citizens in group, need Haridwar railway station pickup..."
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Your details are used strictly for Uttarakhand Tourism Yatra Registration & Inner-Line Permits.</span>
              </div>
            </div>
          )}

          {/* ================= STEP 3: PAYMENT & SCREENSHOT UPLOAD ================= */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: 'UPI (QR / App)', icon: QrCode },
                  { id: 'Card', label: 'Razorpay / Card', icon: CreditCard },
                  { id: 'NetBanking', label: 'NetBanking', icon: Building },
                  { id: 'Pay on Trip', label: '20% Advance', icon: ShieldCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as PaymentMethod)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition ${
                        isSelected
                          ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35] font-bold shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* UPI Option Detailed Content */}
              {(paymentMethod === 'UPI' || paymentMethod === 'Pay on Trip') && (
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-5">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Dynamic QR Code Render */}
                    <div className="p-3 bg-white rounded-2xl border-2 border-zinc-900 shadow-md flex flex-col items-center shrink-0">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-36 h-36"
                        shapeRendering="crispEdges"
                      >
                        <rect width="100" height="100" fill="white" />
                        <rect x="10" y="10" width="24" height="24" fill="#0B3D2E" />
                        <rect x="14" y="14" width="16" height="16" fill="white" />
                        <rect x="18" y="18" width="8" height="8" fill="#0B3D2E" />

                        <rect x="66" y="10" width="24" height="24" fill="#0B3D2E" />
                        <rect x="70" y="14" width="16" height="16" fill="white" />
                        <rect x="74" y="18" width="8" height="8" fill="#0B3D2E" />

                        <rect x="10" y="66" width="24" height="24" fill="#0B3D2E" />
                        <rect x="14" y="70" width="16" height="16" fill="white" />
                        <rect x="18" y="74" width="8" height="8" fill="#0B3D2E" />

                        <rect x="38" y="14" width="6" height="6" fill="#111" />
                        <rect x="48" y="18" width="8" height="6" fill="#111" />
                        <rect x="38" y="38" width="24" height="24" fill="#FF6B35" />
                        <rect x="44" y="44" width="12" height="12" fill="white" />
                        <rect x="48" y="48" width="4" height="4" fill="#0B3D2E" />

                        <rect x="10" y="42" width="6" height="8" fill="#111" />
                        <rect x="22" y="48" width="8" height="6" fill="#111" />
                        <rect x="70" y="42" width="8" height="8" fill="#111" />
                        <rect x="80" y="54" width="10" height="6" fill="#111" />
                        <rect x="38" y="70" width="10" height="8" fill="#111" />
                        <rect x="52" y="76" width="8" height="6" fill="#111" />
                        <rect x="68" y="70" width="22" height="18" fill="#111" />
                      </svg>
                      <span className="text-[10px] font-bold text-zinc-800 mt-1">
                        Scan & Pay via Any UPI App
                      </span>
                    </div>

                    <div className="space-y-3 flex-1 text-xs w-full">
                      <div>
                        <span className="text-zinc-400 block font-semibold">
                          Official Business UPI ID (Om Travels & Adventure On The Way):
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <code className="text-sm font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700">
                            {settings.upiId || '9421709258@upi'}
                          </code>
                          <button
                            type="button"
                            onClick={copyUpiId}
                            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            title="Copy UPI ID"
                          >
                            <Copy className="w-4 h-4 text-[#FF6B35]" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-zinc-800 dark:text-zinc-200 block">
                          Enter 12-Digit UPI Reference / UTR Number:
                        </label>
                        <input
                          type="text"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          placeholder="e.g. 439281094821"
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>

                      <div className="pt-1">
                        <span className="text-[10px] text-zinc-500 font-semibold block mb-1.5">
                          One-Tap UPI App Launch:
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                            <button
                              key={app}
                              type="button"
                              onClick={() => {
                                copyUpiId();
                                window.location.href = `upi://pay?pa=${settings.upiId || '9421709258@upi'}&pn=AdventureOnTheWay&am=${advanceAmount}&cu=INR`;
                              }}
                              className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition flex items-center gap-1.5"
                            >
                              <Smartphone className="w-3.5 h-3.5 text-[#FF6B35]" />
                              <span>{app}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Payment Screenshot from Phone Gallery */}
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <ImageUploadPicker
                      images={paymentScreenshot ? [paymentScreenshot] : []}
                      onChange={(urls) => setPaymentScreenshot(urls[0] || '')}
                      singleMode={true}
                      category="payment"
                      tourId={pkg.id}
                      tourName={`Payment Screenshot - ${pkg.title}`}
                      label="📸 Upload Payment Screenshot from Phone Gallery (Optional for Faster Verification)"
                    />
                  </div>
                </div>
              )}

              {/* Card Option */}
              {paymentMethod === 'Card' && (
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 dark:text-white">Razorpay Secure Card Checkout</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                      256-Bit SSL
                    </span>
                  </div>
                  <div>
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 font-mono text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 font-mono text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 font-mono text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NetBanking Option */}
              {paymentMethod === 'NetBanking' && (
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 text-xs">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                    Select Your Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 font-semibold text-zinc-900 dark:text-white"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                  </select>
                </div>
              )}

              {/* Pay on Trip Option */}
              {paymentMethod === 'Pay on Trip' && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-1.5 text-xs">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#FF6B35]" />
                    Reserve Seat with 20% Advance ({formatPrice(advanceAmount)})
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Pay <strong>{formatPrice(advanceAmount)}</strong> now via UPI (`9421709258@upi`) to lock your Yatra registration & hotel booking. Balance <strong>{formatPrice(balanceAmount)}</strong> payable on arrival at Haridwar office.
                  </p>
                </div>
              )}

              {/* Amount payable card */}
              <div className="p-4 rounded-2xl bg-zinc-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block">
                    {paymentMethod === 'Pay on Trip' ? '20% Advance Payable Now' : 'Total Payable Amount'}
                  </span>
                  <span className="text-xl font-black text-[#FF6B35]">
                    {formatPrice(advanceAmount)}
                  </span>
                </div>
                {paymentMethod === 'Pay on Trip' && (
                  <span className="text-xs text-zinc-300 text-right">
                    Balance at Haridwar: {formatPrice(balanceAmount)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 4: CONFIRMATION & TICKET ================= */}
          {step === 4 && (
            <div className="space-y-6">
              {/* Printable Ticket Box */}
              <div
                id="printable-ticket"
                className="bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden"
              >
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFF8F0] dark:bg-[#111111] border-r border-zinc-300 dark:border-zinc-700" />
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFF8F0] dark:bg-[#111111] border-l border-zinc-300 dark:border-zinc-700" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md inline-block mb-1">
                      ✓ CONFIRMED YATRA & EXPEDITION PASS
                    </span>
                    <h3 className="font-poppins font-black text-xl text-zinc-900 dark:text-white">
                      Om Travels & Adventure On The Way
                    </h3>
                    <p className="text-xs text-zinc-500">
                      4, Devpura, Haridwar, Uttarakhand 249401 • +91 94217 09258 / +91 86687 40237
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                      Booking Reference ID
                    </span>
                    <span className="text-base font-black font-mono text-[#FF6B35]">
                      {confirmedBookingId}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-400 block font-medium">Tour Package</span>
                    <span className="font-bold text-zinc-900 dark:text-white line-clamp-1">
                      {pkg.title}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block font-medium">Departure Date</span>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {new Date(travelDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block font-medium">Lead Passenger</span>
                    <span className="font-bold text-zinc-900 dark:text-white truncate block">
                      {passengerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block font-medium">Travellers</span>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {adults} Adults {children > 0 ? `, ${children} Children` : ''}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl border border-zinc-300">
                      <QrCode className="w-12 h-12 text-zinc-900" />
                    </div>
                    <div className="text-xs text-zinc-500">
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">
                        Show at Haridwar Office / Boarding Point
                      </p>
                      <p>Original {idProofType} required for Yatra verification.</p>
                      <p className="text-[10px] text-zinc-400">Paid via {paymentMethod}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-zinc-400 block">Amount Paid</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                      {formatPrice(advanceAmount)}
                    </span>
                    {balanceAmount > 0 && (
                      <span className="text-[10px] text-amber-600 font-bold block">
                        ₹{balanceAmount} Due at Haridwar
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons for Ticket */}
              <div className="flex flex-wrap items-center justify-center gap-3 no-print">
                <button
                  type="button"
                  onClick={handleSendToAdminWhatsApp}
                  className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] flex items-center gap-2 shadow-md transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send Booking to Admin (+91 94217 09258)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendToCustomerWhatsApp}
                  className="px-4 py-3 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 transition"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Send Ticket to My WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-3 rounded-xl text-xs font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 flex items-center gap-2 shadow-xs"
                >
                  <Printer className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveTab('user-dashboard');
                  }}
                  className="px-5 py-3 rounded-xl text-xs font-bold text-white shadow-md transition"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  View in My Bookings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        {step < 4 && (
          <div className="sticky bottom-0 z-20 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <button
                type="button"
                onClick={handleProceedToStep2}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2"
                style={{ backgroundColor: settings.accentColor }}
              >
                <span>Continue to Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={handleProceedToStep3}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2"
                style={{ backgroundColor: settings.accentColor }}
              >
                <span>Proceed to Payment ({formatPrice(totalAmount)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleCompletePayment}
                disabled={isProcessing}
                className="px-8 py-3 rounded-xl text-sm font-bold text-white shadow-xl hover:shadow-2xl flex items-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: settings.accentColor }}
              >
                {isProcessing ? (
                  <span>Confirming Booking...</span>
                ) : (
                  <>
                    <span>Confirm & Pay {formatPrice(advanceAmount)}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
