import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.aside
          aria-label="Offline Mode Notification"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:right-auto md:left-6 z-50 flex items-center gap-3 bg-[#111111]/95 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border border-amber-500/30 text-xs md:text-sm font-medium"
        >
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <WifiOff className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <p className="font-semibold text-amber-300">Offline Mode Active</p>
            <p className="text-[11px] text-zinc-300">Viewing cached tours & saved itineraries.</p>
          </div>
        </motion.aside>
      )}

      {showReconnected && (
        <motion.aside
          aria-label="Reconnected Notification"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:right-auto md:left-6 z-50 flex items-center gap-3 bg-[#0B3D2E]/95 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-400/30 text-xs md:text-sm font-medium"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Wifi className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-emerald-300">Back Online</p>
            <p className="text-[11px] text-emerald-100/80">Synchronized live package availability.</p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
