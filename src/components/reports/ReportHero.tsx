import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, User, FileText, ArrowRight, Lock } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface ReportHeroProps {
  report: Tables<"reports">;
  hasAccess?: boolean;
  onPurchase?: () => void;
  isLoading?: boolean;
}

export const ReportHero = ({ report, hasAccess = false, onPurchase, isLoading }: ReportHeroProps) => {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="secondary" className="text-sm">
                {report.category}
              </Badge>
              {report.edition && (
                <Badge variant="outline" className="text-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  {report.edition}
                </Badge>
              )}
              {report.has_live_data && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Live Data
                </Badge>
              )}
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              {report.title}
            </h1>
            
            {/* Subtitle */}
            {report.subtitle && (
              <p className="text-xl md:text-2xl text-muted-foreground mb-6">
                {report.subtitle}
              </p>
            )}
            
            {/* Description */}
            {report.description && (
              <p className="text-lg text-muted-foreground/80 mb-8 max-w-xl">
                {report.description}
              </p>
            )}
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {report.author}
              </span>
              {report.published_at && (
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {new Date(report.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </span>
              )}
            </div>
            
            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4">
              {hasAccess ? (
                <Button size="lg" className="text-lg px-8">
                  Read Full Report
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="text-lg px-8"
                    onClick={onPurchase}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Processing..."
                    ) : (
                      <>
                        Purchase for €{report.price_eur}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    Secure payment via Stripe
                  </p>
                </>
              )}
            </div>
          </motion.div>
          
          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {report.cover_image_url ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl transform rotate-3" />
                <img
                  src={report.cover_image_url}
                  alt={report.title}
                  className="relative rounded-2xl shadow-2xl border border-border/50 w-full"
                />
                
                {/* Price Badge Overlay */}
                <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg">
                  <span className="text-sm font-medium">Starting at</span>
                  <span className="text-3xl font-bold ml-2">€{report.price_eur}</span>
                </div>
              </div>
            ) : (
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-border/50">
                <FileText className="w-24 h-24 text-muted-foreground/50" />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
