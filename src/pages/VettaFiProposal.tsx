import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
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

          {/* Executive Summary */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Executive Summary
              </h2>
            </div>
            <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-card to-primary/5">
              <CardContent className="p-8 md:p-10">
                <div className="space-y-6 text-base leading-relaxed">
                  <p className="text-foreground/90">
                    Aries76 presents itself as a strategic partner for VettaFi's expansion across EMEA markets. 
                    With deep expertise in cross-border transactions, capital raising, and institutional investor relations, 
                    we offer VettaFi a proven pathway to unlock untapped growth opportunities in Southern Europe, Central 
                    and Eastern Europe, MENA, and Africa.
                  </p>
                  <p className="text-foreground/90">
                    Our comprehensive approach combines local market intelligence, established distribution networks, 
                    and regulatory expertise to position VettaFi's indexing, data, and media solutions within new investor 
                    segments—from private market managers to structured product issuers and regional wealth managers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* White Space in EMEA */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                White Space in EMEA
              </h2>
            </div>
            <p className="text-base mb-10 text-muted-foreground leading-relaxed max-w-4xl">
              While VettaFi has established presence in core European markets, significant untapped opportunities exist across the broader EMEA landscape. Aries76 has identified critical white space where VettaFi's full-funnel ecosystem can generate substantial value.
            </p>

            {/* Geographic White Space */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                Underserved Geographic Markets
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">Southern Europe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Italy, Spain, Portugal, and Greece represent a €3+ trillion wealth management market with limited exposure to thematic ETF strategies. These markets are dominated by traditional banking distribution channels where Aries76 has established relationships.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">Central & Eastern Europe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Poland, Czech Republic, Hungary, and Romania are experiencing rapid wealth accumulation, with growing institutional appetite for sophisticated index-based strategies. Current distribution is fragmented and requires local expertise.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">MENA Region</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      UAE, Saudi Arabia, Qatar, and Egypt offer access to sovereign wealth funds, family offices, and high-net-worth individuals actively seeking global thematic exposure. Cultural and regulatory nuances require specialized market knowledge.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">Sub-Saharan Africa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      South Africa, Nigeria, and Kenya are emerging hubs for institutional investment, with pension funds and asset managers seeking diversified index solutions. Market access requires trusted local partnerships.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Product & Compliance Gaps */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                Current Offering Limitations
              </h3>
              <div className="bg-gradient-to-br from-primary/5 to-card p-8 rounded-lg border border-primary/20">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Limited UCITS and SFDR-Compliant Products</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Many European clients require UCITS-compliant ETFs and SFDR-aligned indexes to meet regulatory mandates. Localizing VettaFi's indexes for European compliance opens significant distribution channels.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Minimal Presence in Retail Mass-Market Distribution</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        While institutional sales are critical, retail distribution via certificates, ETFs on regional exchanges, and digital wealth platforms represents a massive untapped revenue stream that requires specialized distribution expertise.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Language and Cultural Barriers</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Success in Southern Europe and MENA requires multilingual sales support, culturally adapted marketing materials, and deep understanding of local decision-making processes—areas where Aries76 excels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Aries76 as Strategic Distribution Partner */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Aries76 as Strategic Distribution Partner
              </h2>
            </div>
            <p className="text-base mb-10 text-muted-foreground leading-relaxed max-w-4xl">
              Aries76's core competency lies in bridging the gap between sophisticated financial products and underserved EMEA distribution channels. Our network and expertise enable VettaFi to capture white space opportunities with precision and speed.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                    Deep Market Penetration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    We deliver VettaFi's solutions directly into target markets through:
                  </p>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">500+ institutional relationships</strong> across private banks, asset managers, and family offices in Italy, Spain, Switzerland, UAE, and beyond</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">Direct access to decision-makers</strong> rather than gatekeepers, accelerating sales cycles</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">Regional distribution infrastructure</strong> enabling simultaneous multi-market launches</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                    Regulatory & Compliance Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    We navigate complex EMEA regulatory landscapes by providing:
                  </p>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">UCITS and SFDR compliance guidance</strong> for index adaptation and ETF structuring</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">Local regulatory intelligence</strong> on evolving ESG mandates, MiFID II requirements, and cross-border distribution rules</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">Product structuring advisory</strong> for certificates, notes, and hybrid instruments</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                    Full Ecosystem Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    We don't just sell indexes—we amplify VettaFi's entire value chain:
                  </p>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">Data & Analytics Distribution:</strong> Position VettaFi's research and data feeds within regional wealth management platforms</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">Media & Content Syndication:</strong> Leverage VettaFi's thought leadership content to educate EMEA investors and build brand authority</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">Co-Marketing Initiatives:</strong> Joint webinars, white papers, and conference participation to establish VettaFi as a EMEA market leader</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-card p-8 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-4">Why Aries76 is Uniquely Positioned</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Unlike traditional sales representatives or generic distribution platforms, Aries76 combines:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-semibold text-primary mb-2">Mediterranean Banking DNA</p>
                  <p className="text-xs text-muted-foreground">
                    Deep understanding of relationship-driven sales cultures in Southern Europe and MENA, where trust and personal connections drive business development.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary mb-2">Private Markets Expertise</p>
                  <p className="text-xs text-muted-foreground">
                    Experience working with GPs, LPs, and alternative asset managers who increasingly seek liquid thematic strategies for diversification and liquidity management.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary mb-2">Cross-Border Structuring</p>
                  <p className="text-xs text-muted-foreground">
                    Proven track record navigating multi-jurisdictional regulatory frameworks, tax optimization, and fund domiciliation strategies.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Added Value for VettaFi */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Added Value for VettaFi
              </h2>
            </div>
            <p className="text-base mb-10 text-muted-foreground leading-relaxed max-w-4xl">
              Partnering with Aries76 delivers tangible, measurable benefits that extend beyond traditional distribution relationships. We create strategic value across multiple dimensions of VettaFi's business.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Geographic Penetration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    <strong className="text-foreground">Immediate Access to High-Growth Markets:</strong>
                  </p>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Southern Europe (Italy, Spain): €3+ trillion wealth management market with limited thematic ETF penetration</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>MENA (UAE, Saudi Arabia, Qatar): Sovereign wealth funds and family offices actively seeking global thematic exposure</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>CEE (Poland, Czech Republic): Rapidly growing institutional investor base with appetite for sophisticated strategies</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Reduces time-to-market from years to months in underserved regions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">New AUM Flows</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    <strong className="text-foreground">Diversified Revenue Streams Beyond Traditional ETF Issuers:</strong>
                  </p>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Structured product issuers creating certificates on VettaFi indexes (€1+ trillion European market)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Private market fund managers using liquid thematic indexes for cash management and hedging</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Regional wealth managers and private banks distributing UCITS-compliant ETFs</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Recurring licensing revenue from long-term institutional mandates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Localized Educational Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    <strong className="text-foreground">Amplifying VettaFi's Thought Leadership in EMEA:</strong>
                  </p>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Translation and cultural adaptation of VettaFi research for Italian, Spanish, Arabic, and French markets</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Joint webinars and conferences positioning VettaFi as EMEA market thought leader</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>White papers and case studies tailored to regional investor preferences (e.g., SFDR alignment, energy security narratives)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Enhanced brand recognition and investor education, driving organic demand for VettaFi products</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Commercial Synergies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    <strong className="text-foreground">Leveraging VettaFi's Full Ecosystem (Indexes + Data + Media):</strong>
                  </p>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">Index Licensing:</strong> Direct revenue from ETF issuers and structured product creators</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">Data Subscriptions:</strong> Regional wealth platforms and asset managers subscribing to VettaFi data feeds for portfolio analytics</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">Media & Distribution:</strong> Content licensing to EMEA financial media and digital wealth platforms</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span><strong className="text-foreground">Cross-Selling Opportunities:</strong> Clients introduced for one service (e.g., indexes) naturally adopt additional VettaFi solutions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-card p-8 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                Quantifiable Impact
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary mb-2">6-12</p>
                  <p className="text-sm font-semibold text-foreground mb-1">Months to First Results</p>
                  <p className="text-xs text-muted-foreground">vs. 24-36 months building in-house EMEA team</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary mb-2">500+</p>
                  <p className="text-sm font-semibold text-foreground mb-1">Institutional Relationships</p>
                  <p className="text-xs text-muted-foreground">Immediate access vs. years of cold outreach</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary mb-2">3+</p>
                  <p className="text-sm font-semibold text-foreground mb-1">Revenue Streams Activated</p>
                  <p className="text-xs text-muted-foreground">Indexes, Data, Media—not just ETF licensing</p>
                </div>
              </div>
            </div>
          </section>

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
              A strategic framework designed for mutual success and aligned incentives.
            </p>

            {/* Understanding VettaFi's Business Model */}
            <div className="mb-10 bg-gradient-to-br from-primary/5 to-card p-8 rounded-lg border border-primary/20">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                Understanding VettaFi's Business Model
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                VettaFi generates revenue by licensing proprietary indexes to ETF issuers across global markets. When an ETF issuer (such as DWS, Invesco, or VanEck) creates an ETF that tracks a VettaFi index, they pay VettaFi a licensing fee based on assets under management.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                This creates a <strong className="text-foreground">scalable, capital-light, recurring revenue stream</strong> that grows directly with AUM, without requiring VettaFi to issue or manage investment products.
              </p>
            </div>

            {/* Partnership Structure */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                Partnership Structure
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Our compensation model balances VettaFi's need for predictable market development with Aries76's operational requirements, while maintaining strong performance alignment.
              </p>

              <h4 className="text-lg font-semibold text-foreground mb-4">Two-Component Approach:</h4>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Component 1: Annual Retainer */}
                <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-card to-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="h-2 w-2 bg-primary rounded-full"></span>
                      Annual Strategic Retainer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground">
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
                    </ul>
                  </CardContent>
                </Card>

                {/* Component 2: Success-Based Commission */}
                <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-card to-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="h-2 w-2 bg-primary rounded-full"></span>
                      Success-Based Commission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground">
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
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Key Partnership Advantages */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                Key Partnership Advantages
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span><strong className="text-foreground">Capital Efficiency</strong> - Avoid the fixed costs of building an in-house EMEA sales team</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span><strong className="text-foreground">Flexible Structure</strong> - Partnership model vs. permanent hiring commitments</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span><strong className="text-foreground">Immediate Market Access</strong> - Leverage 500+ institutional relationships from Day 1</span>
                  </li>
                </ul>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span><strong className="text-foreground">Performance Alignment</strong> - Compensation tied to measurable results</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span><strong className="text-foreground">Proven Infrastructure</strong> - Established distribution network across EMEA</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span><strong className="text-foreground">Risk Mitigation</strong> - Success fees only paid on actual revenue generation</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Strategic Value Beyond Economics */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                Strategic Value Beyond Economics
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                The Aries76 partnership delivers value that extends beyond direct financial returns:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="h-2 w-2 bg-primary rounded-full"></span>
                      Market Intelligence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Real-time feedback on product-market fit and competitive positioning</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Insights into EMEA investor preferences and emerging themes</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Intelligence on regulatory developments and compliance requirements</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="h-2 w-2 bg-primary rounded-full"></span>
                      Product Development Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Collaboration on EMEA-specific index customization (e.g., SFDR compliance)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Input on thematic areas with highest institutional demand</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Advisory on optimal product structuring for European markets</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="h-2 w-2 bg-primary rounded-full"></span>
                      Brand Building
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Leverage Aries76's credibility for warm introductions to key decision-makers</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Accelerated trust-building in a market where VettaFi is establishing presence</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Thought leadership and visibility through Aries76's institutional network</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="h-2 w-2 bg-primary rounded-full"></span>
                      Speed to Market
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Qualified pipeline from existing relationships vs. years of cold outreach</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Immediate engagement with decision-makers vs. gatekeepers</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Faster path from initial conversation to product launch</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
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
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5">✗</span>
                        <span><strong className="text-foreground">Significant annual fixed costs</strong> for salaries, benefits, office infrastructure</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5">✗</span>
                        <span><strong className="text-foreground">24-36 months</strong> to build relationships and achieve first results</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5">✗</span>
                        <span><strong className="text-foreground">No guarantee</strong> of AUM targets or ROI</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5">✗</span>
                        <span><strong className="text-foreground">Long-term employment obligations</strong> and severance risk</span>
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
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span><strong className="text-foreground">Predictable annual retainer</strong> plus performance-based fees</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span><strong className="text-foreground">6-12 months</strong> to first results with qualified pipeline from Day 1</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span><strong className="text-foreground">Minimal risk</strong>—success fees only paid on actual results</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span><strong className="text-foreground">Flexible partnership structure</strong> with mutual review points</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mt-6 italic">
                The partnership offers VettaFi a capital-efficient, low-risk path to establish meaningful presence in EMEA, with the flexibility to scale investment based on demonstrated results.
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-card to-primary/5 p-8 rounded-lg border border-primary/20">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="h-2 w-2 bg-primary rounded-full"></span>
                Next Steps
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Specific compensation terms, AUM targets, and performance milestones will be discussed during our initial conversation on November 14th, tailored to VettaFi's strategic priorities and budget parameters.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                Our goal is to structure a partnership that creates compelling value for VettaFi while enabling Aries76 to deliver exceptional results in the EMEA market.
              </p>
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
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 mt-8">
                  <div className="border-t border-primary-foreground/20 pt-6">
                    <p className="text-sm font-semibold mb-3">For further information, please contact:</p>
                    <a 
                      href="mailto:edoardo.grigione@aries76.com" 
                      className="inline-flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/90 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold">edoardo.grigione@aries76.com</span>
                    </a>
                    <p className="text-sm mt-4 opacity-90">
                      Edoardo Grigione, Managing Partner, Aries76
                    </p>
                  </div>
                </div>
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
    </div>
  );
};

export default VettaFiProposal;
