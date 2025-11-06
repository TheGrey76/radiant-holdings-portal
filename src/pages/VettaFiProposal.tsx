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
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">Confidential Proposal</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              A Strategic Partnership to Unlock<br />
              <span className="text-primary">VettaFi's Growth in EMEA</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              For Peter Dietrich, Global Head of Index Sales
            </p>
          </div>

          {/* Vision Section */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                The Vision: Aligning with Your Global Strategy
              </h2>
            </div>
            <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 md:p-10">
                <div className="space-y-6 text-base leading-relaxed">
                  <p className="text-foreground/90">
                    We have observed VettaFi's strategic evolution, particularly the acquisition by TMX Group and the clear mandate for global expansion. Your "full-funnel" ecosystem—integrating indexing, data, and digital distribution—is a powerful differentiator that the European and Middle Eastern markets are ready for.
                  </p>
                  <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                    <p className="text-foreground font-semibold text-lg">
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
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Our Value Proposition: Your Full-Funnel Partner in EMEA
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-primary/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-card to-primary/5">
                <CardHeader className="pb-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <CardTitle className="text-xl">Immediate Market Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-sm text-muted-foreground">
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
                  <CardTitle className="text-xl">Local Regulatory & Market Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-sm text-muted-foreground">
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
                  <CardTitle className="text-xl">Full Ecosystem Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-sm text-muted-foreground">
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
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Actionable Opportunities: Where We Can Win Together
              </h2>
            </div>
            <p className="text-base mb-10 text-muted-foreground leading-relaxed max-w-4xl">
              We have identified three high-impact thematic areas where VettaFi's indexes are perfectly aligned with current market demand in EMEA:
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-primary/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Defence & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    With NATO members increasing spending, your <strong className="text-foreground">European Future of Defence Index (ARMYS)</strong> is the ideal underlying for new UCITS ETFs.
                  </p>
                  <p className="text-sm text-foreground font-semibold">
                    We can connect you with the right issuers immediately.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">AI & Technology</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your <strong className="text-foreground">ROBO Global AI Index (THNQ)</strong> is a globally recognized brand.
                  </p>
                  <p className="text-sm text-foreground font-semibold">
                    We can leverage this to capture demand from European investors and Middle Eastern sovereign funds diversifying into tech.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Energy Transition & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your <strong className="text-foreground">Alerian (AMEI)</strong> and <strong className="text-foreground">Nuclear (NUKZX)</strong> indexes offer a complete energy narrative.
                  </p>
                  <p className="text-sm text-foreground font-semibold">
                    A powerful story for institutional investors focused on both current security and future transition.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Partnership Roadmap Timeline */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Partnership Roadmap
              </h2>
            </div>
            <p className="text-base mb-10 text-muted-foreground leading-relaxed max-w-4xl">
              A phased approach to building a successful partnership:
            </p>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 hidden md:block"></div>
              
              <div className="space-y-8">
                {/* Phase 1 */}
                <div className="relative flex gap-6 md:gap-8">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center shadow-lg ring-4 ring-background">
                      <span className="text-primary-foreground font-bold text-lg">Q4</span>
                    </div>
                  </div>
                  <Card className="flex-grow border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="text-lg">Phase 1: Discovery & Alignment</CardTitle>
                        <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">2025 Q4</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex gap-3">
                          <span className="text-primary mt-1">•</span>
                          <span>Initial partnership framework discussion and mutual goals alignment</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary mt-1">•</span>
                          <span>Market assessment and opportunity sizing for priority markets</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary mt-1">•</span>
                          <span>Define KPIs and success metrics for pilot phase</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Phase 2 */}
                <div className="relative flex gap-6 md:gap-8">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 bg-primary/80 rounded-full flex items-center justify-center shadow-lg ring-4 ring-background">
                      <span className="text-primary-foreground font-bold text-lg">Q1</span>
                    </div>
                  </div>
                  <Card className="flex-grow border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="text-lg">Phase 2: Pilot Launch</CardTitle>
                        <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">2026 Q1</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex gap-3">
                          <span className="text-primary mt-1">•</span>
                          <span>Launch pilot program focusing on 1-2 priority indexes (Defence, AI, or Energy)</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary mt-1">•</span>
                          <span>Introduce VettaFi to 5-8 pre-qualified institutional clients</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary mt-1">•</span>
                          <span>Coordinate initial product structuring discussions with ETF issuers</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Phase 3 */}
                <div className="relative flex gap-6 md:gap-8">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 bg-primary/60 rounded-full flex items-center justify-center shadow-lg ring-4 ring-background">
                      <span className="text-primary-foreground font-bold text-lg">Q2</span>
                    </div>
                  </div>
                  <Card className="flex-grow border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="text-lg">Phase 3: Scale & Expand</CardTitle>
                        <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">2026 Q2-Q3</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex gap-3">
                          <span className="text-primary mt-1">•</span>
                          <span>Review pilot results and refine go-to-market strategy</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary mt-1">•</span>
                          <span>Expand index coverage and client outreach across EMEA</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary mt-1">•</span>
                          <span>Launch full-funnel ecosystem integration (data, distribution, analytics)</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Phase 4 */}
                <div className="relative flex gap-6 md:gap-8">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 bg-primary/40 rounded-full flex items-center justify-center shadow-lg ring-4 ring-background">
                      <span className="text-primary-foreground font-bold text-lg">Q4</span>
                    </div>
                  </div>
                  <Card className="flex-grow border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="text-lg">Phase 4: Strategic Partnership</CardTitle>
                        <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">2026 Q4+</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex gap-3">
                          <span className="text-primary mt-1">•</span>
                          <span>Establish VettaFi as a recognized leader in EMEA thematic indexes</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary mt-1">•</span>
                          <span>Formalize long-term partnership structure and revenue-sharing model</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary mt-1">•</span>
                          <span>Explore co-development opportunities for EMEA-specific index products</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Financial Projections */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Financial Projections & ROI
              </h2>
            </div>
            <p className="text-base mb-10 text-muted-foreground leading-relaxed max-w-4xl">
              Conservative estimates based on current EMEA market dynamics and VettaFi's competitive positioning:
            </p>

            {/* Key Metrics Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-card to-primary/5">
                <CardHeader className="text-center pb-3">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">Target AUM (3 Years)</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-bold text-primary mb-2">€500M+</p>
                  <p className="text-xs text-muted-foreground">Across VettaFi index-based products</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-card to-primary/5">
                <CardHeader className="text-center pb-3">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">Est. Annual Revenue</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-bold text-primary mb-2">$2.5M+</p>
                  <p className="text-xs text-muted-foreground">From licensing fees at maturity</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-card to-primary/5">
                <CardHeader className="text-center pb-3">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">Break-even Timeline</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-bold text-primary mb-2">12-18M</p>
                  <p className="text-xs text-muted-foreground">Months from partnership launch</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Projections */}
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Year-by-Year Growth Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Year 1 */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">Year 1 (2026)</p>
                        <p className="text-sm text-muted-foreground">Foundation & Early Traction</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">€75-100M AUM</p>
                        <p className="text-xs text-muted-foreground">Est. $375K-500K revenue</p>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full" style={{width: '20%'}}></div>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>2-3 ETF launches using VettaFi indexes</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>10-15 institutional clients introduced to VettaFi ecosystem</span>
                      </li>
                    </ul>
                  </div>

                  {/* Year 2 */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">Year 2 (2027)</p>
                        <p className="text-sm text-muted-foreground">Acceleration & Market Penetration</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">€250-300M AUM</p>
                        <p className="text-xs text-muted-foreground">Est. $1.25-1.5M revenue</p>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full" style={{width: '50%'}}></div>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>5-7 active products across multiple themes</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>Expansion into Middle East sovereign wealth funds</span>
                      </li>
                    </ul>
                  </div>

                  {/* Year 3 */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">Year 3 (2028)</p>
                        <p className="text-sm text-muted-foreground">Maturity & Ecosystem Leadership</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">€500M+ AUM</p>
                        <p className="text-xs text-muted-foreground">Est. $2.5M+ revenue</p>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full" style={{width: '100%'}}></div>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>10+ active ETFs and structured products</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>Full-funnel ecosystem adoption (data, analytics, distribution)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>Co-development of EMEA-specific thematic indexes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ROI Highlights */}
            <div className="mt-10 grid md:grid-cols-2 gap-6">
              <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                    Key Value Drivers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">✓</span>
                      <span><strong className="text-foreground">Zero upfront investment</strong> - Performance-based partnership model</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">✓</span>
                      <span><strong className="text-foreground">Fast time-to-market</strong> - Immediate access to qualified pipeline</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">✓</span>
                      <span><strong className="text-foreground">Scalable model</strong> - Proven distribution network across EMEA</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">✓</span>
                      <span><strong className="text-foreground">Brand positioning</strong> - Establish VettaFi as EMEA thematic leader</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                    Success Assumptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Average index licensing fee: 5-7 bps on AUM</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Average product size: €50-75M at maturity</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Client conversion rate: 30-40% from qualified pipeline</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span>Market conditions: Continued thematic investing demand</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80"></div>
            <div className="relative text-primary-foreground p-12 md:p-16 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Let's Build the Future of VettaFi in EMEA
              </h2>
              <div className="max-w-3xl mx-auto space-y-6 text-base md:text-lg">
                <p className="leading-relaxed">
                  We are confident that a strategic partnership is the most effective way to achieve our mutual goals. We are ready to discuss the framework for a pilot project and define the next steps.
                </p>
                <p className="text-lg font-semibold">
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
