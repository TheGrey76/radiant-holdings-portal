import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Target, Brain, Globe2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WhyChooseAries = () => {
  const navigate = useNavigate();

  const competitors = [
    {
      firm: "Aries76 Ltd",
      location: "London | Budapest",
      tagline: "Boutique Precision, Global Reach, AI Intelligence",
      points: [
        "Proprietary AI-powered investor intelligence platform to optimize LP targeting and fundraising performance.",
        "Senior-only execution model: no delegation, no layers — each mandate is founder-led.",
        "Proven cross-border fundraising record (over €200M raised) with deep insight into European and global investor ecosystems."
      ],
      highlight: true,
      footer: "Positioned as the next-generation capital formation firm for private markets."
    },
    {
      firm: "Campbell Lutyens",
      location: "London | New York | Hong Kong",
      tagline: "Legacy Scale, Traditional Processes",
      points: [
        "Global secondary and fundraising leader with institutional credibility.",
        "Focus on large-cap mandates, often limiting flexibility for mid-market GPs.",
        "Heavy structure and standardized processes can reduce personalization and agility."
      ],
      highlight: false,
      footer: "Aries76 offers same institutional discipline with faster decision cycles, advanced data tools, and tailored execution."
    },
    {
      firm: "REDE Partners",
      location: "London | Continental Europe",
      tagline: "Established European Network",
      points: [
        "Strong relationships across European LPs, primarily focused on fund placement.",
        "Standardized approach to fundraising, limited technological integration.",
        "Limited geographic diversification beyond Europe."
      ],
      highlight: false,
      footer: "Aries76 matches the LP access of Rede with AI-driven analytics, ESG-integrated narratives, and multi-jurisdictional reach."
    },
    {
      firm: "GS Equity Partners",
      location: "Emerging Markets",
      tagline: "Wide Network, Limited Focus",
      points: [
        "Broad institutional network but spread across unrelated asset classes.",
        "Less specialization in alternative markets and illiquid strategies.",
        "Lacks a proprietary data infrastructure or fundraising intelligence layer."
      ],
      highlight: false,
      footer: "Aries76 focuses on private markets depth over breadth, combining data, insight, and personal relationships."
    }
  ];

  const differentiators = [
    {
      icon: Target,
      title: "Boutique Precision",
      description: "Tailored, partner-led execution for each client. No hand-offs, no layers. Every mandate is designed and managed directly by senior advisors."
    },
    {
      icon: Brain,
      title: "AI & Data-Driven Fundraising",
      description: "Aries76 integrates proprietary AI systems to optimize investor mapping, engagement, and conversion. A forward-looking approach that sets a new standard for placement intelligence."
    },
    {
      icon: Globe2,
      title: "Cross-Border Execution",
      description: "With presence across London, Zurich, Milan, and Budapest, Aries76 connects European and global capital with real-economy and digital innovation opportunities."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Aries76",
    "description": "Precision capital formation through technology and partnership",
    "url": "https://aries76.com",
    "founder": {
      "@type": "Person",
      "name": "Edoardo Grigione",
      "jobTitle": "Founder & Strategic Advisor"
    },
    "areaServed": ["UK", "EU", "Switzerland", "MENA"],
    "knowsAbout": [
      "Private Equity",
      "Capital Formation",
      "Investor Targeting",
      "Cross-Border Structuring",
      "AI-Driven Analytics"
    ]
  };

  const comparisonJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Fund Placement Firms Comparison",
    "description": "Comparison of Aries76 with leading capital formation firms",
    "itemListElement": competitors.map((comp, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Organization",
        "name": comp.firm,
        "description": comp.tagline
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Why Choose Aries76 | Precision Capital Formation</title>
        <meta name="description" content="Discover how Aries76 redefines capital formation through precision, technology, and partnership. Compare our boutique approach with global advisors." />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(comparisonJsonLd)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary-deep))] via-primary to-accent/30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Why Choose Aries76?
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              We redefine capital formation through precision, technology, and partnership.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-foreground mb-6 leading-relaxed">
              Aries76 stands apart in a competitive fundraising landscape.
              While global advisors like Campbell Lutyens, Rede Partners, or GS Equity offer scale, 
              Aries76 delivers something rarer: <strong>execution with precision, agility, and innovation</strong>.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We combine two decades of private markets experience with proprietary AI-driven analytics 
              to enhance investor targeting and fundraising efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* Competitive Advantage Matrix */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-primary">
              The Aries76 Advantage
            </h2>
            <p className="text-xl text-center text-muted-foreground mb-16">
              Redefining Fund Placement in the Age of Intelligence
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {competitors.map((comp, idx) => (
                <Card 
                  key={idx} 
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    comp.highlight 
                      ? 'border-2 border-accent shadow-lg shadow-accent/20' 
                      : 'border border-primary/20 hover:border-accent/50'
                  }`}
                >
                  {comp.highlight && (
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold">
                      Our Advantage
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-primary mb-1">
                        {comp.firm}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {comp.location}
                      </p>
                      <p className={`text-sm font-semibold italic ${
                        comp.highlight ? 'text-accent' : 'text-foreground/80'
                      }`}>
                        {comp.tagline}
                      </p>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <ul className="space-y-3 mb-4">
                      {comp.points.map((point, pidx) => (
                        <li key={pidx} className="text-sm text-muted-foreground leading-relaxed flex items-start">
                          <span className={`mr-2 mt-1 flex-shrink-0 ${
                            comp.highlight ? 'text-accent' : 'text-primary'
                          }`}>•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {comp.footer && (
                      <>
                        <Separator className="my-4" />
                        <p className={`text-xs italic ${
                          comp.highlight ? 'text-accent font-medium' : 'text-muted-foreground'
                        }`}>
                          → {comp.footer}
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Aries76 Different */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-primary">
              What Makes Aries76 Different
            </h2>
            <div className="text-lg text-foreground leading-relaxed space-y-4">
              <p>
                <strong>Aries76 isn't built for volume — it's built for precision.</strong>
              </p>
              <p>
                We merge human expertise with artificial intelligence to deliver a new model of capital formation. 
                Where traditional placement agents focus on process, we focus on <em>performance</em>.
              </p>
              <p>
                Our hybrid structure combines data analytics, strategic advisory, and cross-border execution 
                to drive measurable fundraising results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiation Sections */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary">
            Our Differentiators
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {differentiators.map((diff, idx) => {
              const Icon = diff.icon;
              return (
                <Card key={idx} className="border-primary/20 hover:border-accent transition-colors">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                      <Icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-primary">
                      {diff.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {diff.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Separator className="bg-accent/20" />

      {/* Quote Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <blockquote className="border-l-4 border-accent pl-8 py-4">
              <p className="text-2xl md:text-3xl font-medium text-foreground italic mb-4">
                "We don't just raise capital — we build lasting partnerships that grow across markets."
              </p>
              <footer className="text-lg text-accent font-semibold">
                — Edoardo Grigione, Founder & Strategic Advisor
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Partner with Aries76
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            If you're a GP, sponsor, or family-backed business seeking institutional capital 
            or cross-border growth, discover how Aries76 can deliver measurable results.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/contact')}
            className="text-lg px-8 py-6"
          >
            Get in Touch
          </Button>
        </div>
      </section>
    </>
  );
};

export default WhyChooseAries;
