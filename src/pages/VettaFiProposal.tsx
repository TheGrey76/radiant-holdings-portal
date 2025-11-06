import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const AUTHORIZED_EMAILS = ['peter.dietrich@tmx.com', 'edoardo.grigione@aries76.com'];

const VettaFiProposal = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error('Accesso richiesto');
          navigate('/auth');
          return;
        }

        if (!AUTHORIZED_EMAILS.includes(session.user.email || '')) {
          toast.error('Accesso negato - Area riservata');
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-28">
          <Card className="max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <ShieldAlert className="h-16 w-16 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Accesso Negato</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Questa pagina è riservata esclusivamente a utenti autorizzati.
              </p>
              <p className="text-sm text-muted-foreground">
                Per informazioni, contattare info@aries76.com
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <Navbar />
      <main className="flex-grow pt-28 md:pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center pb-12 mb-16 border-b border-primary/20">
            <div className="inline-block mb-6 px-6 py-2 bg-primary/10 rounded-full">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">Confidential Proposal</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              A Strategic Partnership to Unlock<br />
              <span className="text-primary">VettaFi's Growth in EMEA</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              For Peter Dietrich, Head of Sales for Index, Data, and Analytics
            </p>
          </div>

          {/* Vision Section */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                The Vision: Aligning with Your Global Strategy
              </h2>
            </div>
            <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 md:p-10">
                <div className="space-y-6 text-lg leading-relaxed">
                  <p className="text-foreground/90">
                    We have observed VettaFi's strategic evolution, particularly the acquisition by TMX Group and the clear mandate for global expansion. Your "full-funnel" ecosystem—integrating indexing, data, and digital distribution—is a powerful differentiator that the European and Middle Eastern markets are ready for.
                  </p>
                  <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                    <p className="text-foreground font-semibold text-xl">
                      Our proposal is simple: <span className="text-primary">we offer to be your strategic partner on the ground</span>, transforming VettaFi's global vision into regional success. We provide the local expertise and established network to accelerate your entry and capture significant market share.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Value Proposition Section */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Our Value Proposition: Your Full-Funnel Partner in EMEA
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-primary/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-card to-primary/5">
                <CardHeader className="pb-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <CardTitle className="text-2xl">Immediate Market Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Established relationships with asset managers, private banks, and financial institutions</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Deep understanding of key markets, from London and Zurich to Dubai and Riyadh</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Ability to bypass entry barriers and accelerate time-to-revenue</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-card to-primary/5">
                <CardHeader className="pb-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <CardTitle className="text-2xl">Local Regulatory & Market Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>In-depth knowledge of the UCITS framework and SFDR compliance requirements</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Insight into local investor preferences and competitive dynamics</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Capability to position VettaFi's products for maximum relevance and adoption</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-card to-primary/5">
                <CardHeader className="pb-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <CardTitle className="text-2xl">Full Ecosystem Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>We don't just sell indexes; we enable your entire business model</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Help regional clients leverage VettaFi's data for product ideation and distribution channels</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Create successful, long-term partnerships for VettaFi</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Opportunities Section */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Actionable Opportunities: Where We Can Win Together
              </h2>
            </div>
            <p className="text-xl mb-10 text-muted-foreground leading-relaxed max-w-4xl">
              We have identified three high-impact thematic areas where VettaFi's indexes are perfectly aligned with current market demand in EMEA:
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-primary/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Defence & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    With NATO members increasing spending, your <strong className="text-foreground">European Future of Defence Index (ARMYS)</strong> is the ideal underlying for new UCITS ETFs.
                  </p>
                  <p className="text-foreground font-semibold">
                    We can connect you with the right issuers immediately.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">AI & Technology</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Your <strong className="text-foreground">ROBO Global AI Index (THNQ)</strong> is a globally recognized brand.
                  </p>
                  <p className="text-foreground font-semibold">
                    We can leverage this to capture demand from European investors and Middle Eastern sovereign funds diversifying into tech.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Energy Transition & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Your <strong className="text-foreground">Alerian (AMEI)</strong> and <strong className="text-foreground">Nuclear (NUKZX)</strong> indexes offer a complete energy narrative.
                  </p>
                  <p className="text-foreground font-semibold">
                    A powerful story for institutional investors focused on both current security and future transition.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80"></div>
            <div className="relative text-primary-foreground p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Let's Build the Future of VettaFi in EMEA
              </h2>
              <div className="max-w-3xl mx-auto space-y-6 text-lg md:text-xl">
                <p className="leading-relaxed">
                  We are confident that a strategic partnership is the most effective way to achieve our mutual goals. We are ready to discuss the framework for a pilot project and define the next steps.
                </p>
                <p className="text-xl font-semibold">
                  Thank you for your time and consideration.
                </p>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <div className="text-center mt-16 pt-8 border-t border-border">
            <p className="text-muted-foreground">
              Confidential proposal prepared for VettaFi by <span className="font-semibold text-foreground">Aries76</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              November 2025
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VettaFiProposal;
