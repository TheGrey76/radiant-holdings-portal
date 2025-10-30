import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users2, Globe2, Award, TrendingUp, Target } from 'lucide-react';
import { useEffect } from 'react';

const Press = () => {
  const stats = [
    { label: "Founded", value: "2023", icon: Building2 },
    { label: "Headquarters", value: "London, UK", icon: Globe2 },
    { label: "Client AUM Range", value: "€1-5bn", icon: TrendingUp },
    { label: "Primary Markets", value: "EU & UK", icon: Target },
    { label: "Advisory Focus", value: "GP Capital", icon: Award }
  ];

  const keyFacts = [
    {
      title: "Company Overview",
      content: "Aries76 Ltd is a London-based boutique advisory firm specializing in GP capital advisory and strategic fund advisory for private markets managers. Founded in 2023, we support second and later-generation GPs in capital formation, management company structuring, and institutional investor access across Europe, the UK, and select global markets."
    },
    {
      title: "Core Services",
      content: "GP Equity Investments, GP M&A Transactions, GP Financing Solutions, Succession Planning & Partner Alignment, Management Company Valuation, Strategic Fund Advisory, and Institutional Investor Relations. We combine strategic advisory with execution capability, supported by our proprietary AIRES AI-powered analytics platform."
    },
    {
      title: "Target Clients",
      content: "Second and later-generation private equity and private markets fund managers, typically managing €1-5 billion in AUM, based in Luxembourg, London, Paris, and Nordic countries. Sector focus includes digital infrastructure & AI, healthcare & life sciences, sustainability & energy transition, industrial technology, and selective consumer & luxury."
    },
    {
      title: "Geographic Presence",
      content: "Headquartered in London with operational presence in Zurich, Luxembourg, and Budapest. Active investor network spans UK, EU, Switzerland, and MENA region. Cross-border transaction experience across European jurisdictions with expertise in multi-jurisdictional fund structuring."
    },
    {
      title: "Technology & Innovation",
      content: "AIRES (Aries Intelligence & Research Engine System) is our proprietary AI-powered platform that provides advanced investor targeting, market intelligence, and engagement optimization. AIRES uses machine learning to analyze LP preferences, identify optimal matches, and enhance fundraising outcomes for our clients."
    },
    {
      title: "Leadership",
      content: "Led by experienced professionals with backgrounds in private equity, investment banking, and institutional asset management. The team combines deep expertise in capital markets, fund structuring, and cross-border transactions with a client-first boutique approach."
    }
  ];

  const mediaAssets = [
    {
      title: "Company Logo",
      description: "High-resolution Aries76 logo in various formats",
      note: "Available upon request"
    },
    {
      title: "Executive Headshots",
      description: "Professional photographs of leadership team",
      note: "Available upon request"
    },
    {
      title: "Brand Guidelines",
      description: "Official Aries76 brand colors, typography, and usage guidelines",
      note: "Available upon request"
    }
  ];

  // Inject Organization Schema
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Aries76 Ltd",
      "description": "London-based boutique advisory firm specializing in GP capital advisory and strategic fund advisory for private markets managers",
      "url": "https://www.aries76.com",
      "logo": "https://www.aries76.com/aries76-og-logo.png",
      "foundingDate": "2023",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "London",
        "addressCountry": "UK"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "quinley.martini@aries76.com",
        "contactType": "Business Inquiries"
      },
      "sameAs": [
        "https://www.linkedin.com/company/aries76"
      ],
      "areaServed": ["GB", "LU", "FR", "CH", "NO", "SE", "DK", "FI"],
      "knowsAbout": [
        "Private Equity",
        "GP Capital Advisory",
        "Fund Formation",
        "Management Company Valuation",
        "Succession Planning",
        "Institutional Capital Markets"
      ],
      "serviceType": [
        "GP Equity Investments",
        "GP M&A Advisory",
        "GP Financing Solutions",
        "Succession Planning",
        "Management Company Valuation",
        "Strategic Fund Advisory"
      ]
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* Hero */}
      <section className="px-6 md:px-10 py-16 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] text-white">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-light tracking-tight mb-6"
          >
            About & <span className="text-accent">Press</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl font-light text-white/80 max-w-3xl"
          >
            Company information, media assets, and press inquiries for Aries76 Ltd
          </motion.p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-6 md:px-10 py-20 bg-gradient-to-br from-[#0f1729]/5 to-[#1a2744]/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card text-center h-full">
                  <CardContent className="p-6">
                    <stat.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                    <div className="text-2xl font-light text-foreground mb-1">{stat.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-light text-foreground mb-12 text-center"
          >
            Company <span className="text-accent">Information</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {keyFacts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card h-full">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-light text-foreground mb-4 tracking-tight">
                      {fact.title}
                    </h3>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      {fact.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Assets */}
      <section className="px-6 md:px-10 py-20 bg-gradient-to-br from-[#0f1729]/5 to-[#1a2744]/5">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-light text-foreground mb-12 text-center"
          >
            Media <span className="text-accent">Assets</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mediaAssets.map((asset, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-light text-foreground mb-2 tracking-tight">
                      {asset.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-light mb-3">
                      {asset.description}
                    </p>
                    <Badge variant="outline" className="font-light text-xs">
                      {asset.note}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border/50 bg-card">
            <CardContent className="p-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6">
                  Press Inquiries
                </h2>
                <p className="text-lg text-muted-foreground mb-8 font-light">
                  For media inquiries, interviews, or additional information, please contact:
                </p>
                <a
                  href="mailto:quinley.martini@aries76.com"
                  className="inline-block bg-accent hover:bg-accent/90 text-white font-light px-8 py-3 rounded-md uppercase tracking-wider transition-colors mb-4"
                >
                  quinley.martini@aries76.com
                </a>
                <p className="text-sm text-muted-foreground font-light mt-6">
                  We typically respond to press inquiries within 24 hours
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Press;