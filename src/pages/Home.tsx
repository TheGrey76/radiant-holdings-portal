import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HolidaySplash from '@/components/HolidaySplash';
import BitcoinReportBanner from '@/components/BitcoinReportBanner';
import HeroNetwork from '@/components/HeroNetwork';

const Home = () => {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('hasSeenHolidaySplash');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenHolidaySplash', 'true');
    setShowSplash(false);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <HolidaySplash onComplete={handleSplashComplete} />}
      </AnimatePresence>
      
      <div className="min-h-screen">
        {/* Bitcoin Report Banner */}
        <BitcoinReportBanner />
        
        {/* New Network Hero Section */}
        <HeroNetwork />
      </div>
    </>
  );
};

export default Home;
