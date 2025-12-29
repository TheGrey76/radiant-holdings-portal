import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Filter } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ReportCard } from '@/components/reports';
import { useReports } from '@/hooks/useReports';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const categories = [
  { id: 'all', label: 'All Reports' },
  { id: 'research', label: 'Research' },
  { id: 'market', label: 'Market Analysis' },
  { id: 'strategy', label: 'Strategy' },
];

const ReportsCatalog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { reports, loading, error } = useReports(
    selectedCategory !== 'all' ? selectedCategory : undefined
  );

  return (
    <>
      <Helmet>
        <title>Research Reports | ARIES76 Capital Intelligence</title>
        <meta 
          name="description" 
          content="Access premium institutional research reports from ARIES76. In-depth analysis with live data on markets, investments, and strategic insights."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-zinc-950">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge variant="outline" className="border-accent/50 text-accent bg-accent/10 mb-6">
                <FileText className="w-3 h-3 mr-1" />
                ARIES76 Research Hub
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Institutional Research{' '}
                <span className="text-accent">Reports</span>
              </h1>

              <p className="text-xl text-zinc-400 mb-8">
                Premium analysis with live data integration. Make informed decisions 
                with our institutional-grade research.
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Live Data Updates
                </div>
                <div className="w-px h-4 bg-zinc-700" />
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent" />
                  Institutional Quality
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-y border-zinc-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <Filter className="w-5 h-5 text-zinc-500 flex-shrink-0" />
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={
                    selectedCategory === cat.id
                      ? 'bg-accent text-white'
                      : 'border-zinc-700 text-zinc-400 hover:text-white'
                  }
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Reports Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/3] rounded-2xl bg-zinc-800" />
                    <Skeleton className="h-6 w-3/4 bg-zinc-800" />
                    <Skeleton className="h-4 w-full bg-zinc-800" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-400">{error}</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Reports Available
                </h3>
                <p className="text-zinc-500">
                  Check back soon for new research publications.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reports.map((report) => (
                  <ReportCard
                    key={report.id}
                    slug={report.slug}
                    title={report.title}
                    subtitle={report.subtitle || undefined}
                    description={report.description || undefined}
                    price={Number(report.price_eur)}
                    category={report.category}
                    coverImageUrl={report.cover_image_url || undefined}
                    hasLiveData={report.has_live_data}
                    edition={report.edition || undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ReportsCatalog;
