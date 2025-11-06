import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';

const AUTHORIZED_EMAILS = ['peter.dietrich@tmx.com', 'edoardo.grigione@aries76.com'];

const VettaFiProposal = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      const accessEmail = sessionStorage.getItem("proposal_access_email");
      
      if (!accessEmail) {
        navigate("/confidential-proposal-access");
        setIsLoading(false);
        return;
      }

      if (AUTHORIZED_EMAILS.includes(accessEmail.toLowerCase())) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
      
      setIsLoading(false);
    };

    checkAccess();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
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

          {/* Partnership Economics */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Partnership Economics
              </h2>
            </div>
            <p className="text-base mb-10 text-muted-foreground leading-relaxed max-w-4xl">
              A transparent, performance-aligned partnership structure designed for mutual success.
            </p>

            {/* Understanding VettaFi's Business Model */}
            <div className="mb-10 bg-gradient-to-br from-primary/5 to-card p-8 rounded-lg border border-primary/20">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                Understanding VettaFi's Business Model
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                VettaFi generates revenue by licensing proprietary indexes to ETF issuers across global markets. When an ETF issuer (such as DWS, Invesco, or VanEck) creates an ETF that tracks a VettaFi index, they pay VettaFi a licensing fee—typically ranging from <strong className="text-foreground">3 to 8 basis points (0.03% - 0.08%)</strong> of assets under management, depending on index complexity and strategic value.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This creates a <strong className="text-foreground">scalable, capital-light, recurring revenue stream</strong> that grows directly with AUM, without requiring VettaFi to issue or manage investment products.
              </p>
            </div>

            {/* Aries76 Partnership Structure */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                Aries76 Partnership Structure
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Our compensation model balances VettaFi's need for predictable market development with Aries76's operational requirements, while maintaining strong performance alignment.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Component 1: Annual Retainer */}
                <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-card to-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="h-2 w-2 bg-primary rounded-full"></span>
                      1. Annual Strategic Retainer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-2xl font-bold text-foreground text-center">€120,000 - €180,000</p>
                      <p className="text-xs text-muted-foreground text-center mt-1">Fixed annual fee</p>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Fixed annual fee supporting dedicated EMEA market development</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Covers relationship management, market intelligence, client engagement, and strategic advisory</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Ensures priority access to Aries76's institutional network and focused partnership attention</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Provides VettaFi with predictable investment planning</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span><strong className="text-foreground">Payable quarterly in advance</strong></span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Component 2: Success-Based Commission */}
                <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-card to-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="h-2 w-2 bg-primary rounded-full"></span>
                      2. Success-Based Commission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-2xl font-bold text-foreground text-center">15-25%</p>
                      <p className="text-xs text-muted-foreground text-center mt-1">of Licensing Revenue</p>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Variable fee tied directly to VettaFi's licensing revenue from assets raised by Aries76</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Aligns incentives for maximum AUM growth and long-term partnership success</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Continues for the life of the assets, creating recurring value for both parties</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Provides unlimited upside potential as the partnership scales</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span><strong className="text-foreground">Calculated and paid quarterly based on actual AUM</strong></span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Key Partnership Advantages */}
              <div className="bg-gradient-to-br from-primary/5 to-card p-6 rounded-lg border border-primary/20">
                <h4 className="text-lg font-semibold text-foreground mb-4">Key Partnership Advantages</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span><strong className="text-foreground">No Fixed Headcount</strong> - Avoid €600K-900K/year in salaries for 2-3 EMEA sales directors</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span><strong className="text-foreground">No Long-Term Employment Risk</strong> - Flexible partnership vs. permanent hiring commitments</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span><strong className="text-foreground">Immediate Market Access</strong> - 500+ institutional relationships from Day 1</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span><strong className="text-foreground">Performance Alignment</strong> - Majority of compensation tied to measurable results</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span><strong className="text-foreground">Scalable Model</strong> - Proven distribution infrastructure across EMEA</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Investment Comparison */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                Investment Comparison
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-destructive/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="h-2 w-2 bg-destructive rounded-full"></span>
                      Building an In-House EMEA Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5">✗</span>
                        <span><strong className="text-foreground">Annual fixed costs:</strong> €900K - €1.3M (salaries, benefits, office, overhead)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5">✗</span>
                        <span><strong className="text-foreground">Time to first results:</strong> 24-36 months</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5">✗</span>
                        <span><strong className="text-foreground">Risk:</strong> No guarantee of AUM targets or ROI</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5">✗</span>
                        <span><strong className="text-foreground">Commitment:</strong> Long-term employment obligations</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-card to-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="h-2 w-2 bg-primary rounded-full"></span>
                      Aries76 Partnership
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span><strong className="text-foreground">Annual retainer:</strong> €120K - €180K + performance-based fees</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span><strong className="text-foreground">Time to first results:</strong> 6-12 months (qualified pipeline from Day 1)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span><strong className="text-foreground">Risk:</strong> Minimal—success fees only paid on actual results</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span><strong className="text-foreground">Commitment:</strong> Flexible partnership structure with mutual review points</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mt-6 italic">
                The partnership offers VettaFi a capital-efficient, low-risk path to establish meaningful presence in EMEA, with the flexibility to scale investment based on demonstrated results.
              </p>
            </div>

            {/* Example Economics */}
            <div className="mb-10 bg-gradient-to-br from-primary/5 to-card p-8 rounded-lg border border-primary/20">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                Example Economics
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                If the partnership generates <strong className="text-foreground">€500M in AUM by Year 2</strong> (conservative scenario):
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <Card className="border-primary/20">
                  <CardContent className="pt-6 text-center">
                    <p className="text-xs text-muted-foreground mb-2">VettaFi licensing revenue (at 5 bps)</p>
                    <p className="text-2xl font-bold text-foreground">€250,000/year</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="pt-6 text-center">
                    <p className="text-xs text-muted-foreground mb-2">Aries76 total compensation</p>
                    <p className="text-lg font-semibold text-foreground">€150K retainer + €50K success fee (20%)</p>
                    <p className="text-xl font-bold text-primary mt-1">= €200K</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                  <CardContent className="pt-6 text-center">
                    <p className="text-xs text-muted-foreground mb-2">VettaFi net annual profit</p>
                    <p className="text-2xl font-bold text-primary">€50,000</p>
                    <p className="text-xs text-muted-foreground mt-2 italic">and growing as AUM scales</p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                As AUM grows to €1B+, VettaFi's net profit scales proportionally while Aries76's retainer remains fixed, creating increasingly attractive economics for VettaFi.
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-card to-primary/5 p-6 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                Next Steps
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We are ready to discuss how to structure the partnership within this framework, tailored to VettaFi's strategic priorities and desired partnership scope. Specific terms (retainer level, commission percentage, performance milestones) can be finalized based on our mutual goals and expectations.
              </p>
            </div>

            {/* Partnership Compensation Framework */}
            <div className="mt-10">
              <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                    Partnership Compensation Framework
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Proposed Compensation Structure */}
                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-4">Proposed Compensation Structure</h4>
                      <div className="space-y-4">
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                          <p className="text-sm font-semibold text-foreground mb-2">Annual Strategic Retainer: €120,000 - €180,000</p>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span>Covers dedicated market development, relationship management, and strategic advisory</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span>Payable quarterly in advance</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span>Reviewed annually based on performance and market conditions</span>
                            </li>
                          </ul>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                          <p className="text-sm font-semibold text-foreground mb-2">Success-Based Commission: 15-25% of VettaFi Licensing Revenue</p>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span>Applied to all licensing revenue generated from institutional assets raised by Aries76</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span>Calculated and paid quarterly based on actual AUM and licensing fees</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span>Continues for the life of the assets (as long as AUM remains invested)</span>
                            </li>
                          </ul>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                          <p className="text-sm font-semibold text-foreground mb-2">Optional Performance Bonuses</p>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span>Milestone bonuses for exceeding agreed AUM targets</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span>New client introduction fees for strategic institutional relationships</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* VettaFi's Index Licensing Model */}
                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-3">VettaFi's Index Licensing Model</h4>
                      <p className="text-sm text-muted-foreground mb-3">For context, VettaFi's typical licensing economics include:</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span><strong className="text-foreground">Licensing fees:</strong> 3-8 basis points (0.03%-0.08%) depending on index complexity and competitive positioning</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span><strong className="text-foreground">Revenue scales directly</strong> with ETF assets under management</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span><strong className="text-foreground">Recurring annual revenue stream</strong> for the life of the investment products</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span><strong className="text-foreground">Capital-light model</strong> with high incremental margins</span>
                        </li>
                      </ul>
                    </div>

                    {/* Target Markets */}
                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-3">Target Markets</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Average ETF product size at maturity: €150-300M in EMEA markets</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Number of potential ETF launches: 4-6 products over initial 3-year period</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Focus on high-growth thematic areas: Defence, AI, Energy Transition</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Risk Analysis & Mitigation */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Risk Analysis & Mitigation Strategies
              </h2>
            </div>
            <p className="text-base mb-10 text-muted-foreground leading-relaxed max-w-4xl">
              Proactive identification of potential challenges and our mitigation approach:
            </p>

            <div className="space-y-6">
              {/* Risk 1 */}
              <Card className="border-destructive/20 hover:border-destructive/40 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold mt-0.5">1</span>
                    <span>Market Timing & Economic Downturn</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-destructive mb-2">Risk</p>
                      <p className="text-sm text-muted-foreground">
                        Economic volatility or market downturn could reduce investor appetite for thematic ETFs and delay product launches.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary mb-2">Mitigation</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>Focus on defensive themes (Defence, Energy Security) with structural demand</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>Diversified product pipeline across multiple sectors</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>Phased approach allows for pause/adjust based on market conditions</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk 2 */}
              <Card className="border-destructive/20 hover:border-destructive/40 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold mt-0.5">2</span>
                    <span>Competitive Pressure from Established Players</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-destructive mb-2">Risk</p>
                      <p className="text-sm text-muted-foreground">
                        MSCI, FTSE Russell, and other major index providers already have EMEA presence and brand recognition.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary mb-2">Mitigation</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>VettaFi's specialized thematic focus vs. broad-market competitors</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>Full-funnel ecosystem (data + distribution) creates switching costs</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>Aries76's established relationships provide competitive moat</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk 3 */}
              <Card className="border-destructive/20 hover:border-destructive/40 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold mt-0.5">3</span>
                    <span>Regulatory Complexity & Compliance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-destructive mb-2">Risk</p>
                      <p className="text-sm text-muted-foreground">
                        UCITS requirements, SFDR disclosures, and varying national regulations across EMEA markets add complexity.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary mb-2">Mitigation</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>Aries76's deep expertise in UCITS framework and local regulations</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>Partnership with experienced ETF issuers who handle compliance</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>VettaFi's proven methodology adaptable to European standards</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk 4 */}
              <Card className="border-destructive/20 hover:border-destructive/40 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold mt-0.5">4</span>
                    <span>Slower-than-Expected Client Adoption</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-destructive mb-2">Risk</p>
                      <p className="text-sm text-muted-foreground">
                        Sales cycles may be longer than projected, or conversion rates lower than assumed 30-40%.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary mb-2">Mitigation</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>Pre-qualified pipeline from existing Aries76 relationships</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>Pilot phase with conservative targets to validate assumptions</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>Flexible partnership structure allows for recalibration</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk 5 */}
              <Card className="border-destructive/20 hover:border-destructive/40 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold mt-0.5">5</span>
                    <span>Brand Recognition & Trust Building</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-destructive mb-2">Risk</p>
                      <p className="text-sm text-muted-foreground">
                        VettaFi is a new brand in EMEA; establishing credibility and trust will require time and marketing investment.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary mb-2">Mitigation</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>Leverage Aries76's brand and credibility for warm introductions</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>Showcase VettaFi's US track record and ROBO Global heritage</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">✓</span>
                          <span>Targeted thought leadership and education campaigns</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Overall Risk Assessment */}
            <Card className="mt-10 border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-2">Overall Risk Assessment: Moderate</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      While challenges exist, they are manageable through our phased approach, local expertise, and VettaFi's proven product offering. The partnership structure allows for validation at each stage before scaling investment. Our conservative projections and strong mitigation strategies position us for success even in challenging market conditions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Competitive Advantage Matrix */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 px-6 py-2 bg-primary/10 rounded-full">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">Competitive Edge</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Aries76 Outperforms Traditional Advisors
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                A comprehensive comparison highlighting our unique value proposition in the EMEA market
              </p>
            </div>

            <Card className="border-primary/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-6 font-semibold text-foreground min-w-[200px]">
                        Key Differentiator
                      </th>
                      <th className="text-center p-6 font-semibold text-primary border-l border-primary/20 bg-primary/5 min-w-[180px]">
                        Aries76
                      </th>
                      <th className="text-center p-6 font-semibold text-muted-foreground border-l border-border min-w-[180px]">
                        Traditional<br />Placement Agents
                      </th>
                      <th className="text-center p-6 font-semibold text-muted-foreground border-l border-border min-w-[180px]">
                        Large Investment<br />Banks
                      </th>
                      <th className="text-center p-6 font-semibold text-muted-foreground border-l border-border min-w-[180px]">
                        Boutique<br />Consultants
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* EMEA Network Depth */}
                    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-6">
                        <div className="font-semibold text-foreground mb-1">EMEA Network Depth</div>
                        <div className="text-sm text-muted-foreground">Direct relationships with key decision-makers</div>
                      </td>
                      <td className="text-center p-6 border-l border-primary/20 bg-primary/5">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 mb-2">
                          <span className="text-xl">★★★</span>
                        </div>
                        <p className="text-sm font-semibold text-primary">Exceptional</p>
                        <p className="text-xs text-muted-foreground mt-1">500+ GP/LP contacts</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Good</p>
                        <p className="text-xs text-muted-foreground mt-1">Region-specific</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Good</p>
                        <p className="text-xs text-muted-foreground mt-1">Broad but shallow</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Limited</p>
                        <p className="text-xs text-muted-foreground mt-1">Niche focus</p>
                      </td>
                    </tr>

                    {/* Index/ETF Expertise */}
                    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-6">
                        <div className="font-semibold text-foreground mb-1">Index/ETF Specialization</div>
                        <div className="text-sm text-muted-foreground">Deep knowledge of thematic index strategies</div>
                      </td>
                      <td className="text-center p-6 border-l border-primary/20 bg-primary/5">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 mb-2">
                          <span className="text-xl">★★★</span>
                        </div>
                        <p className="text-sm font-semibold text-primary">Expert</p>
                        <p className="text-xs text-muted-foreground mt-1">Specialized focus</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Basic</p>
                        <p className="text-xs text-muted-foreground mt-1">Not core focus</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Moderate</p>
                        <p className="text-xs text-muted-foreground mt-1">One of many products</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Variable</p>
                        <p className="text-xs text-muted-foreground mt-1">Depends on firm</p>
                      </td>
                    </tr>

                    {/* Cost Structure */}
                    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-6">
                        <div className="font-semibold text-foreground mb-1">Cost Efficiency</div>
                        <div className="text-sm text-muted-foreground">Transparent, success-based fees</div>
                      </td>
                      <td className="text-center p-6 border-l border-primary/20 bg-primary/5">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 mb-2">
                          <span className="text-xl">★★★</span>
                        </div>
                        <p className="text-sm font-semibold text-primary">Optimal</p>
                        <p className="text-xs text-muted-foreground mt-1">Performance-aligned</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Moderate</p>
                        <p className="text-xs text-muted-foreground mt-1">High upfront fees</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Expensive</p>
                        <p className="text-xs text-muted-foreground mt-1">Premium pricing</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Variable</p>
                        <p className="text-xs text-muted-foreground mt-1">Project-based</p>
                      </td>
                    </tr>

                    {/* Speed to Market */}
                    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-6">
                        <div className="font-semibold text-foreground mb-1">Speed to Market</div>
                        <div className="text-sm text-muted-foreground">Ability to deploy quickly and efficiently</div>
                      </td>
                      <td className="text-center p-6 border-l border-primary/20 bg-primary/5">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 mb-2">
                          <span className="text-xl">★★★</span>
                        </div>
                        <p className="text-sm font-semibold text-primary">Rapid</p>
                        <p className="text-xs text-muted-foreground mt-1">Immediate activation</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Moderate</p>
                        <p className="text-xs text-muted-foreground mt-1">6-12 months</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Slow</p>
                        <p className="text-xs text-muted-foreground mt-1">12-18 months</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Variable</p>
                        <p className="text-xs text-muted-foreground mt-1">Project-dependent</p>
                      </td>
                    </tr>

                    {/* Regulatory Knowledge */}
                    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-6">
                        <div className="font-semibold text-foreground mb-1">UCITS & EMEA Regulatory Expertise</div>
                        <div className="text-sm text-muted-foreground">Understanding of local compliance requirements</div>
                      </td>
                      <td className="text-center p-6 border-l border-primary/20 bg-primary/5">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 mb-2">
                          <span className="text-xl">★★★</span>
                        </div>
                        <p className="text-sm font-semibold text-primary">Deep</p>
                        <p className="text-xs text-muted-foreground mt-1">On-the-ground expertise</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Good</p>
                        <p className="text-xs text-muted-foreground mt-1">Regional knowledge</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Good</p>
                        <p className="text-xs text-muted-foreground mt-1">Legal teams available</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Limited</p>
                        <p className="text-xs text-muted-foreground mt-1">Outsourced</p>
                      </td>
                    </tr>

                    {/* Client Alignment */}
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="p-6">
                        <div className="font-semibold text-foreground mb-1">Client-Centric Approach</div>
                        <div className="text-sm text-muted-foreground">Dedicated focus and customized solutions</div>
                      </td>
                      <td className="text-center p-6 border-l border-primary/20 bg-primary/5">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 mb-2">
                          <span className="text-xl">★★★</span>
                        </div>
                        <p className="text-sm font-semibold text-primary">Exclusive</p>
                        <p className="text-xs text-muted-foreground mt-1">Full partnership focus</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Shared</p>
                        <p className="text-xs text-muted-foreground mt-1">Multiple clients</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Diluted</p>
                        <p className="text-xs text-muted-foreground mt-1">Large client base</p>
                      </td>
                      <td className="text-center p-6 border-l border-border">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
                          <span className="text-xl text-muted-foreground">★★</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Variable</p>
                        <p className="text-xs text-muted-foreground mt-1">Project-dependent</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Key Takeaways */}
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Specialized Focus</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlike generalist advisors, we exclusively focus on index licensing and ETF distribution in EMEA, ensuring unmatched expertise and dedication.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Relationship Capital</h3>
                  <p className="text-sm text-muted-foreground">
                    Our 500+ direct relationships with EMEA GPs and LPs provide immediate market access that would take years to build independently.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Rapid Deployment</h3>
                  <p className="text-sm text-muted-foreground">
                    We can activate client meetings within weeks, not months, accelerating VettaFi's go-to-market timeline and revenue generation.
                  </p>
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
