import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, Clock, User } from 'lucide-react';

interface ReportHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  price: number;
  edition?: string;
  author?: string;
  hasLiveData?: boolean;
  coverImageUrl?: string;
  onPurchase?: () => void;
  isPurchased?: boolean;
  isLoading?: boolean;
}

const ReportHero = ({
  title,
  subtitle,
  description,
  price,
  edition,
  author = 'ARIES76 Research',
  hasLiveData = false,
  coverImageUrl,
  onPurchase,
  isPurchased = false,
  isLoading = false,
}: ReportHeroProps) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,165,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,165,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
              <Badge variant="outline" className="border-accent/50 text-accent bg-accent/10">
                <FileText className="w-3 h-3 mr-1" />
                Institutional Research
              </Badge>
              {hasLiveData && (
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Live Data
                </Badge>
              )}
              {edition && (
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                  <Clock className="w-3 h-3 mr-1" />
                  {edition}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-xl md:text-2xl text-zinc-400 mb-6">
                {subtitle}
              </p>
            )}

            {description && (
              <p className="text-zinc-500 mb-8 max-w-xl mx-auto lg:mx-0">
                {description}
              </p>
            )}

            {/* Author */}
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-8 text-zinc-400">
              <User className="w-4 h-4" />
              <span className="text-sm">{author}</span>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {isPurchased ? (
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <FileText className="w-5 h-5 mr-2" />
                  Read Full Report
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={onPurchase}
                  disabled={isLoading}
                  className="bg-accent hover:bg-accent/90 text-white font-semibold px-8"
                >
                  {isLoading ? (
                    'Processing...'
                  ) : (
                    <>
                      Get Access — €{price.toFixed(0)}
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>

          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[3/4] max-w-md mx-auto">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-2xl blur-2xl transform scale-105" />
              
              {/* Cover */}
              <div className="relative bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700/50 overflow-hidden shadow-2xl">
                {coverImageUrl ? (
                  <img 
                    src={coverImageUrl} 
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-6">
                      <FileText className="w-10 h-10 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    {subtitle && <p className="text-zinc-400 text-sm">{subtitle}</p>}
                    <div className="mt-8 text-lg font-bold tracking-widest text-zinc-500">
                      ARIES76
                    </div>
                  </div>
                )}
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  €{price.toFixed(0)}
                </div>
              </div>

              {/* Corner Accents */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-accent/50 rounded-tl-lg" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-accent/50 rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-accent/50 rounded-bl-lg" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-accent/50 rounded-br-lg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReportHero;
