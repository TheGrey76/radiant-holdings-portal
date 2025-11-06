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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 md:pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center border-b border-border pb-8 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              A Strategic Partnership to Unlock VettaFi's Growth in EMEA
            </h1>
            <p className="text-xl text-muted-foreground">
              A proposal for Peter Dietrich, Head of Sales for Index, Data, and Analytics
            </p>
          </div>

          {/* Vision Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-primary mb-6 border-b-2 border-primary pb-3">
              The Vision: Aligning with Your Global Strategy
            </h2>
            <div className="space-y-4 text-lg">
              <p className="text-foreground">
                We have observed VettaFi's strategic evolution, particularly the acquisition by TMX Group and the clear mandate for global expansion. Your "full-funnel" ecosystem—integrating indexing, data, and digital distribution—is a powerful differentiator that the European and Middle Eastern markets are ready for.
              </p>
              <p className="text-foreground">
                Our proposal is simple: <strong className="text-primary">we offer to be your strategic partner on the ground, transforming VettaFi's global vision into regional success.</strong> We provide the local expertise and established network to accelerate your entry and capture significant market share.
              </p>
            </div>
          </section>

          {/* Value Proposition Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-primary mb-6 border-b-2 border-primary pb-3">
              Our Value Proposition: Your Full-Funnel Partner in EMEA
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-xl">1. Immediate Market Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• Established relationships with asset managers, private banks, and financial institutions.</li>
                    <li>• Deep understanding of the key markets, from London and Zurich to Dubai and Riyadh.</li>
                    <li>• Ability to bypass entry barriers and accelerate time-to-revenue.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-xl">2. Local Regulatory & Market Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• In-depth knowledge of the UCITS framework and SFDR compliance requirements.</li>
                    <li>• Insight into local investor preferences and competitive dynamics.</li>
                    <li>• Capability to position VettaFi's products for maximum relevance and adoption.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-xl">3. Full Ecosystem Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• We don't just sell indexes; we enable your entire business model.</li>
                    <li>• We will help regional clients leverage VettaFi's data for product ideation and your distribution channels for asset gathering.</li>
                    <li>• Our goal is to create successful, long-term partnerships for VettaFi.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Opportunities Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-primary mb-6 border-b-2 border-primary pb-3">
              Actionable Opportunities: Where We Can Win Together
            </h2>
            <p className="text-lg mb-8 text-foreground">
              We have identified three high-impact thematic areas where VettaFi's indexes are perfectly aligned with current market demand in EMEA:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-xl">Defence & Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    With NATO members increasing spending, your <strong className="text-primary">European Future of Defence Index (ARMYS)</strong> is the ideal underlying for new UCITS ETFs. We can connect you with the right issuers immediately.
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-xl">AI & Technology</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your <strong className="text-primary">ROBO Global AI Index (THNQ)</strong> is a globally recognized brand. We can leverage this to capture demand from European investors and Middle Eastern sovereign funds diversifying into tech.
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-xl">Energy Transition & Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your <strong className="text-primary">Alerian (AMEI)</strong> and <strong className="text-primary">Nuclear (NUKZX)</strong> indexes offer a complete energy narrative. This is a powerful story for institutional investors focused on both current security and future transition.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-primary text-primary-foreground rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Let's Build the Future of VettaFi in EMEA
            </h2>
            <p className="text-lg mb-4">
              We are confident that a strategic partnership is the most effective way to achieve our mutual goals. We are ready to discuss the framework for a pilot project and define the next steps.
            </p>
            <p className="text-lg">
              Thank you for your time and consideration.
            </p>
          </section>

          {/* Footer Note */}
          <div className="text-center mt-12 text-sm text-muted-foreground">
            <p>Proposal prepared for VettaFi by Aries76</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VettaFiProposal;
