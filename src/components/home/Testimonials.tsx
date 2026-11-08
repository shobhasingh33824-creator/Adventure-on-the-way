import React, { useState, useEffect } from 'react';
import { initialReviews } from '../../data/initialData';
import { useApp } from '../../context/AppContext';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { t, settings } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide reviews every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % initialReviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % initialReviews.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + initialReviews.length) % initialReviews.length);

  const review = initialReviews[currentIndex];

  return (
    <section className="py-20 bg-zinc-900 text-white relative overflow-hidden">
      {/* Background Mountain silhouettes */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 1200 400" className="w-full h-full object-cover">
          <path d="M0 400L250 150L450 320L750 80L1000 280L1200 120V400H0Z" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
            Verified Guest Experiences
          </span>
          <h2 className="font-poppins font-black text-3xl sm:text-4xl">
            {t('reviewsTitle')}
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-amber-400 pt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
            <span className="text-xs font-bold text-zinc-300 ml-2">4.9 / 5 Overall Traveler Score</span>
          </div>
        </div>

        {/* Highlighted Review Card */}
        <div className="relative bg-zinc-800/80 backdrop-blur-xl border border-zinc-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <Quote className="w-12 h-12 text-[#FF6B35]/30 absolute top-6 right-8" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img
              src={review.userAvatar}
              alt={review.userName}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#FF6B35] shadow-xl shrink-0"
            />

            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <p className="text-base sm:text-lg text-zinc-200 font-medium italic leading-relaxed">
                "{review.comment}"
              </p>

              <div>
                <h4 className="font-poppins font-bold text-base text-white flex items-center justify-center sm:justify-start gap-2">
                  <span>{review.userName}</span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Trekker
                  </span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Expedition: <span className="text-[#FF6B35]">{review.tourName}</span> • {review.date}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-between sm:justify-end gap-2 mt-6 pt-6 border-t border-zinc-700/60">
            <div className="flex items-center gap-1.5">
              {initialReviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentIndex === idx ? 'w-6 bg-[#FF6B35]' : 'bg-zinc-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white transition"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white transition"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
