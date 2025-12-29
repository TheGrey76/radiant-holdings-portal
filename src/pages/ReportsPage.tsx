import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ReportCard } from "@/components/reports";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, TrendingUp } from "lucide-react";

const ReportsPage = () => {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["published-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <main className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px),
                                linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">
              <FileText className="w-3 h-3 mr-1" />
              Research Hub
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              ARIES76 Research Reports
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              In-depth analysis and strategic insights from our research team. 
              Data-driven reports with interactive charts and live market data.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Live Data Updates
              </span>
              <span className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-full">
                <FileText className="w-4 h-4 text-primary" />
                Interactive Charts
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reports Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : reports && reports.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report, index) => (
                <ReportCard 
                  key={report.id} 
                  report={report} 
                  variant={index === 0 ? "featured" : "default"}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Reports Available Yet
              </h3>
              <p className="text-muted-foreground">
                Our research team is working on new reports. Check back soon!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Looking for Custom Research?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Our team can create bespoke research reports tailored to your investment thesis and market focus.
            </p>
            <a 
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Our Team
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ReportsPage;
