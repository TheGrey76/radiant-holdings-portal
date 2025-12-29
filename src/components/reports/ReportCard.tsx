import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";

interface ReportCardProps {
  report: Tables<"reports">;
  variant?: "default" | "featured";
}

export const ReportCard = ({ report, variant = "default" }: ReportCardProps) => {
  const isFeatured = variant === "featured";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 ${isFeatured ? 'md:col-span-2' : ''}`}>
        <div className="relative">
          {/* Cover Image */}
          {report.cover_image_url && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={report.cover_image_url}
                alt={report.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>
          )}
          
          {/* Price Badge */}
          <Badge 
            className="absolute top-4 right-4 bg-primary text-primary-foreground font-semibold px-3 py-1"
          >
            €{report.price_eur}
          </Badge>
          
          {/* Live Data Badge */}
          {report.has_live_data && (
            <Badge 
              variant="outline" 
              className="absolute top-4 left-4 border-green-500/50 text-green-400 bg-green-500/10"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
          )}
        </div>
        
        <CardContent className="p-6">
          {/* Category & Edition */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              {report.category}
            </Badge>
            {report.edition && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {report.edition}
              </span>
            )}
          </div>
          
          {/* Title & Subtitle */}
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {report.title}
          </h3>
          {report.subtitle && (
            <p className="text-sm text-muted-foreground mb-3">
              {report.subtitle}
            </p>
          )}
          
          {/* Description */}
          {report.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {report.description}
            </p>
          )}
          
          {/* Author */}
          <p className="text-xs text-muted-foreground mb-4">
            By {report.author}
          </p>
          
          {/* CTA */}
          <Link to={`/reports/${report.slug}`}>
            <Button className="w-full group/btn">
              View Report
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};
