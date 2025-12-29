import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Check, ArrowRight, Shield, CreditCard, RefreshCw } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface ReportPaywallProps {
  report: Tables<"reports">;
  onPurchase: () => void;
  isLoading?: boolean;
  previewSectionsCount?: number;
}

export const ReportPaywall = ({ 
  report, 
  onPurchase, 
  isLoading = false,
  previewSectionsCount = 2
}: ReportPaywallProps) => {
  const benefits = [
    "Full access to all report sections",
    "Interactive charts and data visualizations",
    "Downloadable PDF version",
    "Live data updates (where applicable)",
    "Access from any device",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative py-16"
    >
      {/* Gradient fade from content */}
      <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto border-primary/30 bg-gradient-to-br from-card to-primary/5 overflow-hidden">
          {/* Header */}
          <div className="bg-primary/10 border-b border-primary/20 p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Unlock Full Report Access
            </h3>
            <p className="text-muted-foreground">
              You've previewed {previewSectionsCount} sections. Purchase to continue reading.
            </p>
          </div>
          
          <CardContent className="p-8">
            {/* Price */}
            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-foreground">€{report.price_eur}</span>
                <span className="text-muted-foreground">one-time</span>
              </div>
              {report.has_live_data && (
                <Badge className="mt-3 bg-green-500/20 text-green-400 border-green-500/50">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Includes Live Data Updates
                </Badge>
              )}
            </div>
            
            {/* Benefits */}
            <div className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
            
            {/* CTA */}
            <Button 
              size="lg" 
              className="w-full text-lg h-14 group"
              onClick={onPurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Purchase Now
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Secure Payment
              </span>
              <span className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                Powered by Stripe
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
