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
      firm: "Campbell Lutyens",
      offering: "Fundraising, Secondary Advisory",
      focus: "Global (US, UK, EU)",
      differentiators: "Strong brand legacy",
      ariesAdvantage: "Aries76 offers boutique agility, personalized mandates, and tech-enabled investor intelligence."
    },
    {
      firm: "REDE Partners",
      offering: "Private markets placement",
      focus: "European mid-market",
      differentiators: "Deep LP network",
      ariesAdvantage: "Aries76 combines comparable network depth with AI-driven matching and cross-border structuring expertise."
    },
    {
      firm: "GS Equity",
      offering: "Institutional fundraising",
      focus: "Emerging markets",
      differentiators: "Broad access",
      ariesAdvantage: "Aries76 provides strategic positioning in Europe with advanced data analytics and direct deal insight."
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

  return (
    <>
      <Helmet>
        <title>Why Choose Aries76 | Precision Capital Formation</title>
        <meta name="description" content="Discover how Aries76 redefines capital formation through precision, technology, and partnership. Compare our boutique approach with global advisors." />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
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

      {/* Comparative Table */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">
            How We Compare
          </h2>
          <div className="overflow-x-auto">
            <Card className="border-primary/20">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead className="font-bold text-primary">Firm</TableHead>
                      <TableHead className="font-bold text-primary">Core Offering</TableHead>
                      <TableHead className="font-bold text-primary">Focus & Reach</TableHead>
                      <TableHead className="font-bold text-primary">Differentiators</TableHead>
                      <TableHead className="font-bold text-primary">Aries76 Advantage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {competitors.map((comp, idx) => (
                      <TableRow key={idx} className="hover:bg-accent/5">
                        <TableCell className="font-semibold text-foreground">{comp.firm}</TableCell>
                        <TableCell className="text-muted-foreground">{comp.offering}</TableCell>
                        <TableCell className="text-muted-foreground">{comp.focus}</TableCell>
                        <TableCell className="text-muted-foreground">{comp.differentiators}</TableCell>
                        <TableCell className="text-accent font-medium">{comp.ariesAdvantage}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
