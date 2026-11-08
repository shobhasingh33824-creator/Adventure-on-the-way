import React, { useEffect, useState, useRef } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOfflineRef.current) {
        setShowReconnected(true);
        wasOfflineRef.current = false;
        const timer = setTimeout(() => setShowReconnected(false), 2500);
        return () => clearTimeout(timer);
      }
    };

    const handleOffline = () => {
      wasOfflineRef.current = true;
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
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          className="fixed bottom-20 md:bottom-6 left-4 z-50 inline-flex items-center gap-2 bg-zinc-900/95 text-amber-300 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-amber-500/30 text-xs font-semibold"
        >
          <WifiOff className="w-3.5 h-3.5 animate-pulse shrink-0" />
          <span>Offline Mode • Viewing cached tours</span>
        </motion.aside>
      )}

      {showReconnected && (
        <motion.aside
          aria-label="Reconnected Notification"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          className="fixed bottom-20 md:bottom-6 left-4 z-50 inline-flex items-center gap-2 bg-[#0B3D2E]/95 text-emerald-300 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-emerald-400/30 text-xs font-semibold"
        >
          <Wifi className="w-3.5 h-3.5 shrink-0" />
          <span>Back Online</span>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
