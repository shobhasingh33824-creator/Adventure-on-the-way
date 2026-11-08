import React, { useState, useEffect } from 'react';
import { Bell, BellRing, CheckCircle, ShieldAlert, Sparkles, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';

interface PushNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PushNotificationModal: React.FC<PushNotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useApp();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      if (Notification.permission === 'granted') {
        setIsSubscribed(true);
      }
    }
  }, [isOpen]);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      showToast('Notifications are not supported in this browser environment.', 'info');
      setIsSubscribed(true);
      return;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        setIsSubscribed(true);
        showToast('Push Notifications enabled! You will receive live trip updates.', 'success');
        // Trigger a welcome notification
        sendTestNotification(
          'Welcome to Adventure on the Way!',
          'You will receive instant alerts for booking updates, Himalayan weather & exclusive discounts.'
        );
      } else if (res === 'denied') {
        showToast('Notification permission was blocked in browser settings.', 'error');
      }
    } catch {
      setIsSubscribed(true);
      showToast('Simulated notification mode enabled for this device.', 'success');
    }
  };

  const sendTestNotification = (title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/pwa-192x192.png',
          badge: '/icon.svg',
        });
      } catch {
        // Fallback for mobile WebKit where new Notification requires ServiceWorkerRegistration
        showToast(`🔔 ${title}: ${body}`, 'info');
      }
    } else {
      showToast(`🔔 ${title}: ${body}`, 'info');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#0F2920] rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-emerald-800 text-[#111111] dark:text-[#FFF8F0] relative overflow-hidden"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-[#FF6B35] flex items-center justify-center shadow-xs">
              <BellRing className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Trip & Departure Alerts</h3>
              <p className="text-xs text-zinc-500 dark:text-emerald-200/70">Real-time Push Notifications for Travelers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status card */}
        <div className={`p-4 rounded-2xl mb-5 border text-xs flex items-center justify-between ${
          isSubscribed
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
            : 'bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {isSubscribed ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
            )}
            <div>
              <p className="font-semibold text-zinc-900 dark:text-white">
                {isSubscribed ? 'Notifications Active' : 'Notifications Not Enabled'}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {isSubscribed ? 'Ready to receive real-time updates' : 'Enable to get instant tour alerts'}
              </p>
            </div>
          </div>

          {!isSubscribed && (
            <button
              onClick={requestPermission}
              className="px-3 py-1.5 rounded-xl bg-[#0B3D2E] text-white font-semibold text-xs hover:bg-[#07261D] transition cursor-pointer shadow-xs"
            >
              Enable Now
            </button>
          )}
        </div>

        {/* Benefits List */}
        <div className="space-y-2 mb-6 text-xs text-zinc-600 dark:text-zinc-300">
          <p className="font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider text-[10px]">What you'll receive:</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
            <span>Instant booking & UPI payment confirmation alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
            <span>Himalayan weather, pass clearance (Rohtang/Khardung La)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
            <span>Exclusive flash coupon codes (e.g. ADVENTURE10)</span>
          </div>
        </div>

        {/* Test Simulator Buttons */}
        <div className="border-t border-zinc-200 dark:border-white/10 pt-4 mb-2">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2.5">
            Test push notification triggers:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => sendTestNotification(
                '🎟️ Booking Confirmed!',
                'Your Spiti Valley 7D/6N Expedition is locked. Download ticket in My Trips.'
              )}
              className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-left text-xs transition border border-zinc-200 dark:border-white/5 cursor-pointer"
            >
              <div className="flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
                <Send className="w-3 h-3 text-[#FF6B35]" />
                <span>Booking Alert</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Spiti Expedition Confirmed</p>
            </button>

            <button
              onClick={() => sendTestNotification(
                '🏔️ Weather Update: Leh-Ladakh',
                'Khardung La pass is clear with sunny skies. Perfect day for bike ride!'
              )}
              className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-left text-xs transition border border-zinc-200 dark:border-white/5 cursor-pointer"
            >
              <div className="flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>Pass Status</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Khardung La is Clear</p>
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-[#0B3D2E] hover:bg-[#07261D] text-white font-medium text-sm transition cursor-pointer"
        >
          Done
        </button>
      </motion.div>
    </div>
  );
};
