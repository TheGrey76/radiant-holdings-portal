import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, ArrowRight } from 'lucide-react';

interface ReportCardProps {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  price: number;
  category?: string;
  coverImageUrl?: string;
  hasLiveData?: boolean;
  edition?: string;
}

const ReportCard = ({
  slug,
  title,
  subtitle,
  description,
  price,
  category = 'Research',
  coverImageUrl,
  hasLiveData = false,
  edition,
}: ReportCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden hover:border-accent/30 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {coverImageUrl ? (
          <img 
            src={coverImageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <FileText className="w-16 h-16 text-zinc-700" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="secondary" className="bg-zinc-900/80 text-zinc-300 backdrop-blur-sm">
            {category}
          </Badge>
          {hasLiveData && (
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 backdrop-blur-sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live
            </Badge>
          )}
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
          €{price.toFixed(0)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {edition && (
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
            {edition}
          </p>
        )}
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        
        {subtitle && (
          <p className="text-zinc-400 text-sm mb-3">{subtitle}</p>
        )}
        
        {description && (
          <p className="text-zinc-500 text-sm line-clamp-2 mb-4">{description}</p>
        )}

        <Link to={`/reports/${slug}`}>
          <Button 
            variant="outline" 
            className="w-full border-zinc-700 text-zinc-300 hover:bg-accent hover:text-white hover:border-accent group/btn"
          >
            View Report
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ReportCard;
