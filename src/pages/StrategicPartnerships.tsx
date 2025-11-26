import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StrategicPartnerships = () => {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    counterpartType: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const sectors = [
    {
      title: "AI & Data Infrastructure",
      description: "Focus on AI-native software, data centres, edge computing, and B2B SaaS where AI is a core driver of value. Emphasize recurring revenues, mission-critical use-cases and strong unit economics."
    },
    {
      title: "Energy Transition & Industrial Tech",
      description: "Focus on distributed renewables, efficiency solutions, advanced industrial technologies and circular economy models. Emphasize long-term visibility, regulatory support and cash-flow resilience."
    },
    {
      title: "Healthcare Services & MedTech",
      description: "Focus on specialised healthcare platforms, outpatient services, diagnostics and MedTech with recurring revenues. Emphasize demographic trends, essential services and defensiveness."
    },
    {
      title: "Premium Manufacturing & Luxury",
      description: "Focus on European premium and luxury brands, design and high-end manufacturing. Emphasize heritage, barriers to entry and international scalability."
    }
  ];

  const counterparties = [
    {
      title: "Entrepreneurs & Business Owners",
      description: "Owners of successful mid-market companies seeking growth capital, internationalisation or partial liquidity. Interested in a partner that preserves the identity of the business while accelerating its development."
    },
    {
      title: "GPs, Sponsors & Platforms",
      description: "Private equity and growth equity managers looking for a specialised European capital formation partner. Interested in raising capital from family offices, professional investors and selected institutions."
    },
    {
      title: "Family Offices & Professional Investors",
      description: "Single and multi-family offices, entrepreneurs-investors and professional investors. Interested in curated access to proprietary deal flow across AI, energy transition, healthcare and premium manufacturing."
    }
  ];

  const partnershipModels = [
    {
      title: "GP Strategic Partnership",
      description: "A long-term collaboration with a limited number of GPs and sponsors in our core verticals. Aries76 supports capital formation, investor relations and cross-border expansion. Revenue model: retainers, success fees and, where appropriate, recurring economics linked to committed capital."
    },
    {
      title: "Co-Sponsor & Co-Investment",
      description: "Aries76 may participate as co-sponsor or co-investor alongside GPs and strategic partners. Focus on high-conviction deals where we can add value on strategy, capital raising and investor communication."
    },
    {
      title: "Family Office Partnership",
      description: "Tailored advisory and access to selected deal flow for single and multi-family offices. Emphasis on alignment, transparency and long-term relationships across multiple transactions."
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Introductory Conversation",
      description: "Confidential discussion to understand objectives, constraints and preferred sectors."
    },
    {
      number: "02",
      title: "Alignment & Mandate",
      description: "Definition of scope: sectors, geographies, ticket sizes, preferred structures."
    },
    {
      number: "03",
      title: "Deal Origination & Screening",
      description: "Use of AI-driven tools and proprietary network to identify and prioritise opportunities."
    },
    {
      number: "04",
      title: "Due Diligence & Structuring",
      description: "Coordination with management teams, advisors and investors. Support on structure, terms and documentation, always in collaboration with legal and tax advisors."
    },
    {
      number: "05",
      title: "Capital Formation",
      description: "Targeted outreach to qualified investors and family offices. Management of the fundraising process and investor communication."
    },
    {
      number: "06",
      title: "Closing & Long-Term Partnership",
      description: "Support through closing. Ongoing relationship management, monitoring and preparation for future transactions."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section id="vision" className="relative py-32 md:py-48 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8 text-foreground tracking-tight">
              Aries76 Strategic Partnerships
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground/80 leading-relaxed font-light mb-8">
              An AI-enabled investment partnership platform connecting institutional-grade capital with high-conviction private market opportunities across Europe and beyond.
            </p>
            <p className="text-lg text-muted-foreground/70 leading-relaxed font-light max-w-4xl mx-auto mb-12">
              Aries76 is a UK-based partnership platform focusing on thematic, sector-specific deals rather than generalist fundraising. 
              We combine 25+ years of private markets experience with an AI-driven approach to investor intelligence and deal selection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="min-w-[200px]">
                Discuss a Partnership
              </Button>
              <Button size="lg" variant="outline" className="min-w-[200px]">
                Request Investor Deck
              </Button>
            </div>
            <p className="text-sm text-muted-foreground/60 mt-6 font-light">
              For professional investors and family offices only.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sectors Section */}
      <section id="sectors" className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-8 text-foreground text-center">Sectors</h2>
            <p className="text-center text-muted-foreground/70 mb-16 text-lg font-light max-w-3xl mx-auto">
              Aries76 focuses on a concentrated set of thematic verticals where we see long-term structural demand from institutional investors and family offices.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {sectors.map((sector, index) => (
                <motion.div
                  key={sector.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-8 bg-card border border-border/30 hover:border-primary/40 transition-all duration-300"
                >
                  <h3 className="text-2xl font-semibold text-foreground mb-4">{sector.title}</h3>
                  <p className="text-muted-foreground/80 leading-relaxed font-light">{sector.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who We Work With */}
      <section id="who-we-work-with" className="py-24 md:py-32 bg-muted/20">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-16 text-foreground text-center">Who We Work With</h2>
            
            <div className="space-y-8">
              {counterparties.map((counterparty, index) => (
                <motion.div
                  key={counterparty.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-8 bg-background border border-border/30"
                >
                  <h3 className="text-2xl font-semibold text-foreground mb-4">{counterparty.title}</h3>
                  <p className="text-muted-foreground/80 leading-relaxed font-light">{counterparty.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Investment Criteria */}
      <section id="investment-criteria" className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-16 text-foreground text-center">Investment Criteria</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-foreground border-b border-border/30 pb-4">
                  The Companies and Platforms We Look For
                </h3>
                <ul className="space-y-4 text-muted-foreground/80 font-light">
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Clear, proven business model.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Strong or improving cash generation.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Mid-market size (EBITDA starting from low single-digit millions upwards).</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Internationalisation potential or clear sector leadership in a niche.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-foreground border-b border-border/30 pb-4">
                  The Partners We Look For
                </h3>
                <ul className="space-y-4 text-muted-foreground/80 font-light">
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Long-term orientation and alignment on value creation.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Willingness to co-invest and share risk.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Transparent governance and institutional-grade reporting.</span>
                  </li>
                </ul>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 p-10 bg-primary/5 border-2 border-primary/20"
            >
              <h3 className="text-2xl font-semibold text-foreground mb-4 text-center">Minimum Commitment</h3>
              <p className="text-center text-muted-foreground/80 leading-relaxed font-light max-w-3xl mx-auto">
                Aries76 welcomes professional investors and family offices with a typical minimum commitment starting from €250,000 per transaction, 
                with higher thresholds for selected co-investment SPVs and anchor positions.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partnership Models */}
      <section id="partnership-models" className="py-24 md:py-32 bg-muted/20">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-16 text-foreground text-center">Partnership Models</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {partnershipModels.map((model, index) => (
                <motion.div
                  key={model.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-8 bg-background border border-border/30 hover:border-primary/40 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-foreground mb-4">{model.title}</h3>
                  <p className="text-muted-foreground/80 leading-relaxed font-light text-sm">{model.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-16 text-foreground text-center">Process</h2>
            
            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                    <span className="text-primary font-semibold text-lg">{step.number}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-2xl font-semibold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground/80 leading-relaxed font-light">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team & Governance */}
      <section id="team-governance" className="py-24 md:py-32 bg-muted/20">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-16 text-foreground text-center">Team & Governance</h2>
            
            <div className="max-w-3xl mx-auto mb-16">
              <div className="p-10 bg-background border border-border/30">
                <h3 className="text-2xl font-semibold text-foreground mb-2">Edoardo Grigione</h3>
                <p className="text-primary mb-6 font-light">Founder, Aries76</p>
                <p className="text-muted-foreground/80 leading-relaxed font-light">
                  25+ years of experience in private banking, hedge funds, private equity and capital raising. 
                  Cross-border experience between Italy, UK, Switzerland, US and Central Europe. 
                  Focus on alternative investments and AI-enabled investor intelligence.
                </p>
              </div>
            </div>

            <div className="p-10 bg-background/50 border border-border/20">
              <p className="text-center text-muted-foreground/70 leading-relaxed font-light">
                Aries76 operates as an advisory and holding platform, working alongside regulated partners and advisors in each relevant jurisdiction. 
                All transactions are structured in compliance with applicable laws and reserved strictly to professional investors and eligible counterparties.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-8 text-foreground text-center">Contact</h2>
            <p className="text-center text-muted-foreground/70 mb-12 text-lg font-light">
              If you are an entrepreneur, GP, family office or professional investor and would like to explore a strategic partnership with Aries76, 
              we would be pleased to speak with you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Organisation"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Select value={formData.counterpartType} onValueChange={(value) => setFormData({ ...formData, counterpartType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type of counterpart" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                    <SelectItem value="gp-sponsor">GP or Sponsor</SelectItem>
                    <SelectItem value="family-office">Family Office</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Textarea
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Submit
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground/60 mt-8 font-light">
              Or email us at: <a href="mailto:partnerships@aries76.com" className="text-primary hover:underline">partnerships@aries76.com</a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/30 bg-muted/20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-light text-foreground mb-2">Aries76 Ltd</h3>
              <p className="text-muted-foreground/70 font-light">Strategic Advisory & Investment Partnerships</p>
            </div>
            <p className="text-center text-sm text-muted-foreground/60 font-light max-w-4xl mx-auto">
              The content on this page is for professional investors only and does not constitute an offer or solicitation. 
              All investment opportunities are subject to thorough due diligence and compliance with applicable regulations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StrategicPartnerships;
