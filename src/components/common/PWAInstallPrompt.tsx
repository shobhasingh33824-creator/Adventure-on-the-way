import React, { useState, useEffect } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useApp } from '../../context/AppContext';

export const PWAInstallPrompt: React.FC = () => {
  const { hasNativePrompt, isInstalled, isStandalone, isIOS, install } = usePWAInstall();
  const { showToast } = useApp();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in current session
    const dismissed = sessionStorage.getItem('aotw_pwa_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('aotw_pwa_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (hasNativePrompt) {
      const outcome = await install();
      if (outcome === 'accepted') {
        showToast('Adventure on the Way is now on your home screen for instant access!', 'success');
      }
    } else {
      // Browser doesn't support beforeinstallprompt (e.g. desktop safari/firefox)
      setShowIOSGuide(true);
    }
  };

  // If already installed or dismissed, do not show the sticky floating prompt
  if (isInstalled || isStandalone || isDismissed) {
    return null;
  }

  return (
    <>
      <aside aria-label="Install App Banner">
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-[#0B3D2E] via-[#0E4A38] to-[#125843] text-white px-4 py-2.5 text-xs sm:text-sm border-b border-emerald-700/50 relative z-30 shadow-md"
        >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B35] flex items-center justify-center shrink-0 shadow-sm text-white">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="font-semibold text-emerald-200">Get the Mobile App: </span>
              <span className="text-zinc-100 hidden sm:inline">Install for faster bookings, offline ticket access & instant trip notifications!</span>
              <span className="text-zinc-100 sm:hidden">Install for offline tickets & alerts!</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF6B35] hover:bg-[#ff7d4d] text-white text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition hover:bg-white/10"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
      </aside>

      {/* iOS / Manual Installation Instructions Modal */}
      <AnimatePresence>
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-[#0F2920] rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-emerald-800 text-[#111111] dark:text-[#FFF8F0] relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0B3D2E] text-white flex items-center justify-center shadow-md">
                    <Smartphone className="w-6 h-6 text-[#FF6B35]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Install "Adventure on the Way"</h3>
                    <p className="text-xs text-zinc-500 dark:text-emerald-200/70">PWA for Android, iPhone, iPad & Desktop</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Benefits */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl p-3.5 mb-5 border border-emerald-200 dark:border-emerald-800/50 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Ultra-fast MakeMyTrip style mobile experience</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Access booking passes and vouchers offline</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Instant 1-tap launch from your home screen</span>
                </div>
              </div>

              {/* Instructions steps */}
              <div className="space-y-3.5 text-sm mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-emerald-300/80">
                  {isIOS ? 'How to install on iOS Safari:' : 'Install instructions:'}
                </p>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-100">Step 1: Tap Share</p>
                    <p className="text-zinc-500 dark:text-zinc-400">In Safari toolbar at the bottom or top of screen</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-[#FF6B35] flex items-center justify-center shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-100">Step 2: Add to Home Screen</p>
                    <p className="text-zinc-500 dark:text-zinc-400">Scroll down and select "Add to Home Screen"</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-100">Step 3: Launch anytime</p>
                    <p className="text-zinc-500 dark:text-zinc-400">Open the app directly like a native iOS / Android app!</p>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#0B3D2E] hover:bg-[#07261D] text-white font-medium text-sm transition shadow-sm cursor-pointer"
              >
                Got it, Thanks!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
