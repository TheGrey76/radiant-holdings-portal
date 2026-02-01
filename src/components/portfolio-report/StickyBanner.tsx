import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Target } from 'lucide-react';
import { MiniScanModal } from './MiniScanModal';

interface StickyBannerProps {
  show?: boolean;
  scrollThreshold?: number;
}

export const StickyBanner: React.FC<StickyBannerProps> = ({ 
  show = true,
  scrollThreshold = 500 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showMiniScan, setShowMiniScan] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;
      
      const scrollY = window.scrollY;
      setIsVisible(scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold, isDismissed]);

  if (!show || isDismissed || !isVisible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-gradient-to-r from-primary to-orange-500 text-white py-3 px-4 shadow-lg">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 shrink-0" />
              <p className="text-sm md:text-base font-medium">
                <span className="hidden sm:inline">🔍 Want to know how BTC fits YOUR portfolio? </span>
                <span className="sm:hidden">How does BTC fit YOUR portfolio?</span>
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 whitespace-nowrap"
                onClick={() => setShowMiniScan(true)}
              >
                Get Free Analysis →
              </Button>
              <Button 
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setIsDismissed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <MiniScanModal open={showMiniScan} onOpenChange={setShowMiniScan} />
    </>
  );
};

export default StickyBanner;
