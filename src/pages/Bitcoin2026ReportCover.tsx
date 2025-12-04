import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp } from 'lucide-react';

const Bitcoin2026ReportCover = () => {
  const coverRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (!coverRef.current) return;
    
    const canvas = await html2canvas(coverRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });
    
    const link = document.createElement('a');
    link.download = 'bitcoin-2026-report-cover.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-8 gap-8">
      <h1 className="text-2xl font-bold text-white">Bitcoin 2026 Report - Cover Image</h1>
      <p className="text-zinc-400">Clicca il pulsante per scaricare l'immagine (1024x1024px)</p>
      
      {/* Cover Design - 1024x1024 for Stripe */}
      <div
        ref={coverRef}
        className="relative overflow-hidden"
        style={{ width: '512px', height: '512px' }}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f2847] to-[#0a1628]" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,165,0,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,165,0,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px'
          }}
        />
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl" />
        
        {/* Chart Line */}
        <svg className="absolute bottom-20 left-0 right-0 h-32 opacity-30" viewBox="0 0 512 128" preserveAspectRatio="none">
          <path
            d="M0,100 Q50,90 100,85 T200,70 T300,40 T400,50 T512,20"
            fill="none"
            stroke="url(#chartGradient)"
            strokeWidth="3"
          />
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="1" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
          {/* Badge */}
          <div className="mb-4 px-4 py-1.5 bg-orange-500/20 border border-orange-500/40 rounded-full">
            <span className="text-orange-400 text-xs font-semibold tracking-widest uppercase">
              Institutional Research
            </span>
          </div>
          
          {/* Bitcoin Icon */}
          <div className="mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-white text-4xl font-bold">₿</span>
          </div>
          
          {/* Title */}
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
            Bitcoin 2026
          </h1>
          
          {/* Subtitle */}
          <p className="text-zinc-400 text-lg mb-6 max-w-xs">
            A Macro-Liquidity Framework for Institutional Positioning
          </p>
          
          {/* Stats Row */}
          <div className="flex items-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">XI</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wide">Chapters</div>
            </div>
            <div className="w-px h-10 bg-zinc-700" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-emerald-400">
                <TrendingUp className="w-5 h-5" />
                3
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wide">Scenarios</div>
            </div>
            <div className="w-px h-10 bg-zinc-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">2026</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wide">Outlook</div>
            </div>
          </div>
          
          {/* Branding */}
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center">
            <div className="text-lg font-bold tracking-[0.3em] text-white/90">
              ARIES76
            </div>
            <div className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
              Capital Intelligence
            </div>
          </div>
        </div>
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-orange-500/30" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-orange-500/30" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-orange-500/30" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-orange-500/30" />
      </div>
      
      <Button onClick={downloadImage} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
        <Download className="w-5 h-5 mr-2" />
        Scarica Immagine PNG
      </Button>
      
      <p className="text-zinc-500 text-sm">
        L'immagine verrà scaricata a 1024x1024px (2x scale)
      </p>
    </div>
  );
};

export default Bitcoin2026ReportCover;
