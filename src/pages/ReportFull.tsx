import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ReportSection, SectionData } from '@/components/reports';
import { useReport, useReportAccess } from '@/hooks/useReports';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, ArrowLeft, FileText, TrendingUp, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ReportFull = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  
  const { report, sections, loading, error } = useReport(slug || '');
  const { hasAccess, loading: accessLoading } = useReportAccess(slug || '', verifiedEmail);

  // Check session storage for previously verified email
  useEffect(() => {
    const storedEmail = sessionStorage.getItem(`report_access_${slug}`);
    if (storedEmail) {
      setVerifiedEmail(storedEmail);
    }
  }, [slug]);

  // Handle Stripe success redirect
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const storedEmail = sessionStorage.getItem(`report_email_${slug}`);
    
    if (sessionId && storedEmail) {
      // Verify the purchase was completed
      const verifyPurchase = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('verify-report-purchase', {
            body: { sessionId, email: storedEmail, reportSlug: slug },
          });
          
          if (error) throw error;
          
          if (data?.verified) {
            sessionStorage.setItem(`report_access_${slug}`, storedEmail);
            setVerifiedEmail(storedEmail);
            toast.success('Purchase verified! Enjoy your report.');
          }
        } catch (err) {
          console.error('Verification error:', err);
        }
      };
      
      verifyPurchase();
    }
  }, [searchParams, slug]);

  const handleVerifyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsVerifying(true);
    try {
      const { data, error } = await supabase.rpc('check_report_access', {
        p_report_slug: slug,
        p_user_email: email,
      });

      if (error) throw error;

      if (data) {
        sessionStorage.setItem(`report_access_${slug}`, email);
        setVerifiedEmail(email);
        toast.success('Access verified!');
      } else {
        toast.error('No purchase found for this email. Please check or purchase the report.');
      }
    } catch (err) {
      console.error('Access check error:', err);
      toast.error('Failed to verify access. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-zinc-950 pt-20">
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-48 rounded-2xl bg-zinc-800 mb-8" />
            <div className="max-w-4xl mx-auto space-y-8">
              <Skeleton className="h-32 rounded-xl bg-zinc-800" />
              <Skeleton className="h-64 rounded-xl bg-zinc-800" />
              <Skeleton className="h-48 rounded-xl bg-zinc-800" />
            </div>
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

  // If not verified, show access gate
  if (!hasAccess && !accessLoading) {
    return (
      <>
        <Helmet>
          <title>Access {report.title} | ARIES76 Research</title>
        </Helmet>

        <Navbar />

        <main className="min-h-screen bg-zinc-950 flex items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md px-4"
          >
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-white text-xl">
                  Access Your Report
                </CardTitle>
                <p className="text-zinc-400 text-sm mt-2">
                  Enter the email you used to purchase <span className="text-white font-medium">{report.title}</span>
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerifyAccess} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    {isVerifying ? 'Verifying...' : 'Access Report'}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                  <p className="text-zinc-500 text-sm mb-3">
                    Haven't purchased yet?
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/reports/${slug}`)}
                    className="border-zinc-700 text-zinc-300"
                  >
                    View Report Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>

        <Footer />
      </>
    );
  }

  // Full report view
  return (
    <>
      <Helmet>
        <title>{report.title} | ARIES76 Research</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-zinc-950">
        {/* Report Header */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <div className="container mx-auto px-4 max-w-4xl">
            <Button
              variant="ghost"
              onClick={() => navigate('/reports')}
              className="text-zinc-400 hover:text-white mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Reports
            </Button>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline" className="border-accent/50 text-accent">
                <FileText className="w-3 h-3 mr-1" />
                {report.category}
              </Badge>
              {report.has_live_data && (
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Live Data
                </Badge>
              )}
              {report.edition && (
                <Badge variant="secondary" className="bg-zinc-800">
                  <Clock className="w-3 h-3 mr-1" />
                  {report.edition}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {report.title}
            </h1>

            {report.subtitle && (
              <p className="text-xl text-zinc-400 mb-6">{report.subtitle}</p>
            )}

            <div className="flex items-center gap-4 text-zinc-500 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {report.author}
              </div>
              {report.published_at && (
                <>
                  <div className="w-px h-4 bg-zinc-700" />
                  <div>
                    Published {new Date(report.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Report Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-16">
              {sections.map((section, index) => (
                <ReportSection
                  key={section.id}
                  section={section as unknown as SectionData}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="py-12 bg-zinc-900/50 border-t border-zinc-800">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <p className="text-zinc-500 text-sm">
              This report is for {verifiedEmail}. 
              Please do not share or redistribute without permission.
            </p>
            <p className="text-zinc-600 text-xs mt-2">
              © {new Date().getFullYear()} ARIES76. All rights reserved.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ReportFull;
