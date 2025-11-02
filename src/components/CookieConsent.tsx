import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Cookie } from 'lucide-react';

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border shadow-lg animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">
                Utilizziamo i cookie
              </p>
              <p>
                Questo sito utilizza cookie tecnici e di terze parti (Google Analytics, LinkedIn Insight) 
                per migliorare l'esperienza utente e analizzare il traffico. 
                Continuando a navigare, accetti l'utilizzo dei cookie in conformità con la nostra{' '}
                <a href="/legal" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              className="flex-1 sm:flex-none"
            >
              Rifiuta
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="flex-1 sm:flex-none"
            >
              Accetta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
