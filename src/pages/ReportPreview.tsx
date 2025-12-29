import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ReportHero, ReportSection, ReportPaywall, SectionData } from '@/components/reports';
import { useReport, useReportAccess } from '@/hooks/useReports';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

const ReportPreview = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  
  const { report, sections, loading, error } = useReport(slug || '');
  
  // Check if user already has access (from session storage)
  const storedEmail = sessionStorage.getItem(`report_access_${slug}`);
  const { hasAccess } = useReportAccess(slug || '', storedEmail);

  // Check for success from Stripe
  const success = searchParams.get('success');
  
  if (success === 'true' && slug) {
    // Redirect to full report after successful payment
    navigate(`/reports/${slug}/read`);
  }

  const handlePurchase = async (email: string) => {
    if (!report) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-report-checkout', {
        body: {
          reportId: report.id,
          reportSlug: report.slug,
          email,
          successUrl: `${window.location.origin}/reports/${report.slug}?success=true`,
          cancelUrl: `${window.location.origin}/reports/${report.slug}?canceled=true`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Store email for access verification
        sessionStorage.setItem(`report_email_${report.slug}`, email);
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Purchase error:', err);
      toast.error('Failed to initiate checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-zinc-950 pt-20">
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-[60vh] rounded-2xl bg-zinc-800" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !report) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Report Not Found</h1>
            <p className="text-zinc-400 mb-8">{error || 'This report does not exist or is not available.'}</p>
            <Button onClick={() => navigate('/reports')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reports
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // If user has access, redirect to full report
  if (hasAccess) {
    navigate(`/reports/${slug}/read`);
    return null;
  }

  // Separate preview and premium sections
  const previewSections = sections.filter(s => s.is_preview);
  const premiumSections = sections.filter(s => !s.is_preview);

  return (
    <>
      <Helmet>
        <title>{report.seo_title || report.title} | ARIES76 Research</title>
        <meta 
          name="description" 
          content={report.seo_description || report.description || `${report.title} - Premium institutional research from ARIES76`}
        />
        <meta property="og:title" content={report.title} />
        <meta property="og:description" content={report.description || ''} />
        {report.cover_image_url && <meta property="og:image" content={report.cover_image_url} />}
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-zinc-950">
        {/* Hero */}
        <ReportHero
          title={report.title}
          subtitle={report.subtitle || undefined}
          description={report.description || undefined}
          price={Number(report.price_eur)}
          edition={report.edition || undefined}
          author={report.author}
          hasLiveData={report.has_live_data}
          coverImageUrl={report.cover_image_url || undefined}
          onPurchase={() => document.getElementById('purchase-section')?.scrollIntoView({ behavior: 'smooth' })}
          isLoading={isLoading}
        />

        {/* Preview Sections */}
        {previewSections.length > 0 && (
          <section className="py-16 bg-zinc-950">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="space-y-12">
                {previewSections.map((section, index) => (
                  <ReportSection
                    key={section.id}
                    section={section as unknown as SectionData}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Blurred Premium Sections Preview */}
        {premiumSections.length > 0 && (
          <section className="py-16 bg-zinc-900/30">
            <div className="container mx-auto px-4 max-w-4xl">
              <h3 className="text-xl font-semibold text-white mb-8 text-center">
                Premium Content Preview
              </h3>
              <div className="space-y-8">
                {premiumSections.slice(0, 2).map((section, index) => (
                  <ReportSection
                    key={section.id}
                    section={section as unknown as SectionData}
                    index={index}
                    isBlurred
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Purchase Section */}
        <section id="purchase-section" className="py-20 bg-zinc-950">
          <div className="container mx-auto px-4 max-w-lg">
            <ReportPaywall
              title={report.title}
              price={Number(report.price_eur)}
              onPurchase={handlePurchase}
              isLoading={isLoading}
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ReportPreview;
