import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingActions } from './components/common/FloatingActions';
import { ToastContainer } from './components/common/ToastContainer';
import { HeroSection } from './components/home/HeroSection';
import { TrendingSlider } from './components/home/TrendingSlider';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { FeaturedPackages } from './components/home/FeaturedPackages';
import { Testimonials } from './components/home/Testimonials';
import { TravelStories } from './components/home/TravelStories';
import { PackagesPage } from './components/packages/PackagesPage';
import { PackageDetailModal } from './components/packages/PackageDetailModal';
import { BookingModal } from './components/booking/BookingModal';
import { AuthModal } from './components/auth/AuthModal';
import { UserDashboard } from './components/user/UserDashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { AboutPage } from './components/about/AboutPage';
import { ContactPage } from './components/contact/ContactPage';
import { PWAInstallPrompt } from './components/common/PWAInstallPrompt';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { MobileBottomNav } from './components/common/MobileBottomNav';

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedPackage,
    setSelectedPackage,
    bookingModalPackage,
    setBookingModalPackage,
  } = useApp();

  // Handle /admin route check
  useEffect(() => {
    if (
      window.location.pathname === '/admin' ||
      window.location.hash === '#admin' ||
      window.location.search.includes('admin=true')
    ) {
      setActiveTab('admin');
    }
  }, [setActiveTab]);

  // If Admin Tab is active, render the dedicated separate Admin Layout with Sidebar
  if (activeTab === 'admin') {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-[#0c0c0e] text-zinc-900 dark:text-zinc-100 selection:bg-[#FF6B35] selection:text-white">
        <AdminPanel />
        <ToastContainer />
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] dark:bg-[#111111] text-[#111111] dark:text-[#FFF8F0] transition-colors selection:bg-[#FF6B35] selection:text-white">
      {/* PWA Install Banner */}
      <PWAInstallPrompt />

      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Public Page Rendering with bottom padding on mobile for MakeMyTrip style bottom bar */}
      <main className="flex-1 pb-16 md:pb-0">
        {activeTab === 'home' && (
          <>
            <HeroSection />
            <TrendingSlider />
            <WhyChooseUs />
            <FeaturedPackages />
            <Testimonials />
            <TravelStories />
          </>
        )}

        {activeTab === 'destinations' && <PackagesPage />}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'user-dashboard' && <UserDashboard />}
      </main>

      {/* Global Modals */}
      {selectedPackage && (
        <PackageDetailModal
          pkg={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}

      {bookingModalPackage && (
        <BookingModal
          pkg={bookingModalPackage}
          onClose={() => setBookingModalPackage(null)}
        />
      )}

      <AuthModal />
      <ToastContainer />
      <FloatingActions />
      <OfflineIndicator />

      {/* Mobile Bottom Navigation Bar (MakeMyTrip Style) */}
      <MobileBottomNav />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
