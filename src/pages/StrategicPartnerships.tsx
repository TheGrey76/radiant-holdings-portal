import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, TrendingUp, Heart, Gem, Target, Users2, Handshake, CheckCircle2, ArrowRight } from "lucide-react";

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
      icon: Building2,
      title: "AI & Data Infrastructure",
      description: "AI-native software, data centres, edge computing, and B2B SaaS where AI is a core driver of value. Recurring revenues, mission-critical use-cases and strong unit economics."
    },
    {
      icon: TrendingUp,
      title: "Energy Transition & Industrial Tech",
      description: "Distributed renewables, efficiency solutions, advanced industrial technologies and circular economy models. Long-term visibility, regulatory support and cash-flow resilience."
    },
    {
      icon: Heart,
      title: "Healthcare Services & MedTech",
      description: "Specialised healthcare platforms, outpatient services, diagnostics and MedTech with recurring revenues. Demographic trends, essential services and defensiveness."
    },
    {
      icon: Gem,
      title: "Premium Manufacturing & Luxury",
      description: "European premium and luxury brands, design and high-end manufacturing. Heritage, barriers to entry and international scalability."
    }
  ];

  const counterparties = [
    {
      icon: Target,
      title: "Entrepreneurs & Business Owners",
      description: "Owners of successful mid-market companies seeking growth capital, internationalisation or partial liquidity. Interested in a partner that preserves the identity of the business while accelerating its development."
    },
    {
      icon: Users2,
      title: "GPs, Sponsors & Platforms",
      description: "Private equity and growth equity managers looking for a specialised European capital formation partner. Interested in raising capital from family offices, professional investors and selected institutions."
    },
    {
      icon: Handshake,
      title: "Family Offices & Professional Investors",
      description: "Single and multi-family offices, entrepreneurs-investors and professional investors. Interested in curated access to proprietary deal flow across AI, energy transition, healthcare and premium manufacturing."
    }
  ];

  const partnershipModels = [
    {
      title: "GP Strategic Partnership",
      description: "A long-term collaboration with a limited number of GPs and sponsors in our core verticals. Aries76 supports capital formation, investor relations and cross-border expansion.",
      details: "Revenue model: retainers, success fees and, where appropriate, recurring economics linked to committed capital."
    },
    {
      title: "Co-Sponsor & Co-Investment",
      description: "Aries76 may participate as co-sponsor or co-investor alongside GPs and strategic partners.",
      details: "Focus on high-conviction deals where we can add value on strategy, capital raising and investor communication."
    },
    {
      title: "Family Office Partnership",
      description: "Tailored advisory and access to selected deal flow for single and multi-family offices.",
      details: "Emphasis on alignment, transparency and long-term relationships across multiple transactions."
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
      description: "Coordination with management teams, advisors and investors. Support on structure, terms and documentation."
    },
    {
      number: "05",
      title: "Capital Formation",
      description: "Targeted outreach to qualified investors and family offices. Management of the fundraising process."
    },
    {
      number: "06",
      title: "Closing & Long-Term Partnership",
      description: "Support through closing. Ongoing relationship management and preparation for future transactions."
    }
  ];

  const companyCriteria = [
    "Clear, proven business model",
    "Strong or improving cash generation",
    "Mid-market size (EBITDA starting from low single-digit millions upwards)",
    "Internationalisation potential or clear sector leadership in a niche"
  ];

  const partnerCriteria = [
    "Long-term orientation and alignment on value creation",
    "Willingness to co-invest and share risk",
    "Transparent governance and institutional-grade reporting"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] text-white py-32 md:py-40 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px),
                             repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px)`
          }} />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 tracking-tight">
              ARIES76 STRATEGIC PARTNERSHIPS
            </h1>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light mb-6 max-w-4xl mx-auto">
              An AI-enabled investment partnership platform connecting institutional-grade capital with high-conviction private market opportunities across Europe and beyond.
            </p>
            <p className="text-base md:text-lg text-white/70 leading-relaxed font-light max-w-3xl mx-auto mb-12">
              Aries76 is a UK-based partnership platform focusing on thematic, sector-specific deals rather than generalist fundraising. 
              We combine 25+ years of private markets experience with an AI-driven approach to investor intelligence and deal selection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white min-w-[220px]">
                Discuss a Partnership
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 min-w-[220px]">
                Request Investor Deck
              </Button>
            </div>
            <p className="text-sm text-white/50 mt-6 font-light tracking-wide">
              FOR PROFESSIONAL INVESTORS AND FAMILY OFFICES ONLY
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-4 text-foreground">Thematic Verticals</h2>
              <div className="w-16 h-1 bg-accent mx-auto mb-6"></div>
              <p className="text-lg text-muted-foreground/70 font-light max-w-3xl mx-auto">
                Aries76 focuses on a concentrated set of thematic verticals where we see long-term structural demand from institutional investors and family offices.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {sectors.map((sector, index) => {
                const Icon = sector.icon;
                return (
                  <motion.div
                    key={sector.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group p-8 bg-white border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300"
                  >
                    <Icon className="w-10 h-10 text-accent mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">{sector.title}</h3>
                    <p className="text-muted-foreground/80 leading-relaxed font-light text-sm">{sector.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-4 text-foreground">Who We Work With</h2>
              <div className="w-16 h-1 bg-accent mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {counterparties.map((counterparty, index) => {
                const Icon = counterparty.icon;
                return (
                  <motion.div
                    key={counterparty.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="p-8 bg-background border border-border/50 hover:border-accent/30 transition-all duration-300"
                  >
                    <Icon className="w-10 h-10 text-accent mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">{counterparty.title}</h3>
                    <p className="text-muted-foreground/80 leading-relaxed font-light text-sm">{counterparty.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Investment Criteria */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-4 text-foreground">Investment Criteria</h2>
              <div className="w-16 h-1 bg-accent mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-6 pb-3 border-b-2 border-accent/30">
                  The Companies We Look For
                </h3>
                <ul className="space-y-4">
                  {companyCriteria.map((criterion, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground/80 font-light">{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-6 pb-3 border-b-2 border-accent/30">
                  The Partners We Look For
                </h3>
                <ul className="space-y-4">
                  {partnerCriteria.map((criterion, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground/80 font-light">{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-10 bg-gradient-to-br from-primary/5 to-accent/5 border-l-4 border-accent"
            >
              <h3 className="text-2xl font-semibold text-foreground mb-4 text-center">Minimum Commitment</h3>
              <p className="text-center text-muted-foreground/80 leading-relaxed font-light max-w-3xl mx-auto">
                Aries76 welcomes professional investors and family offices with a typical minimum commitment starting from <span className="font-semibold text-foreground">€250,000</span> per transaction, 
                with higher thresholds for selected co-investment SPVs and anchor positions.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partnership Models */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-4 text-foreground">Partnership Models</h2>
              <div className="w-16 h-1 bg-accent mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {partnershipModels.map((model, index) => (
                <motion.div
                  key={model.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-8 bg-background border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <h3 className="text-xl font-semibold text-foreground mb-4 pb-3 border-b border-border/50">{model.title}</h3>
                  <p className="text-muted-foreground/80 leading-relaxed font-light text-sm mb-4 flex-grow">{model.description}</p>
                  <p className="text-muted-foreground/60 leading-relaxed font-light text-xs italic">{model.details}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-4 text-foreground">Our Process</h2>
              <div className="w-16 h-1 bg-accent mx-auto"></div>
            </div>
            
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex gap-6 items-start p-6 bg-white border border-border/50 hover:border-accent/30 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                    <span className="text-accent font-semibold text-lg">{step.number}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground/80 leading-relaxed font-light text-sm">{step.description}</p>
                  </div>
                  {index < processSteps.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-accent/40 flex-shrink-0 mt-4" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team & Governance */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-4 text-foreground">Team & Governance</h2>
              <div className="w-16 h-1 bg-accent mx-auto"></div>
            </div>
            
            <div className="max-w-3xl mx-auto mb-12">
              <div className="p-10 bg-background border-l-4 border-accent">
                <h3 className="text-2xl font-semibold text-foreground mb-2">Edoardo Grigione</h3>
                <p className="text-accent mb-6 font-light tracking-wide">Founder, Aries76</p>
                <p className="text-muted-foreground/80 leading-relaxed font-light">
                  25+ years of experience in private banking, hedge funds, private equity and capital raising. 
                  Cross-border experience between Italy, UK, Switzerland, US and Central Europe. 
                  Focus on alternative investments and AI-enabled investor intelligence.
                </p>
              </div>
            </div>

            <div className="p-10 bg-background/80 border border-border/50">
              <p className="text-center text-muted-foreground/70 leading-relaxed font-light">
                Aries76 operates as an advisory and holding platform, working alongside regulated partners and advisors in each relevant jurisdiction. 
                All transactions are structured in compliance with applicable laws and reserved strictly to professional investors and eligible counterparties.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-light mb-4 text-foreground">Get in Touch</h2>
              <div className="w-16 h-1 bg-accent mx-auto mb-6"></div>
              <p className="text-muted-foreground/70 text-lg font-light max-w-2xl mx-auto">
                If you are an entrepreneur, GP, family office or professional investor and would like to explore a strategic partnership with Aries76, 
                we would be pleased to speak with you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white border border-border/50">
              <div>
                <Input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-border/50 focus:border-accent"
                />
              </div>
              <div>
                <Input
                  placeholder="Organisation"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  required
                  className="border-border/50 focus:border-accent"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-border/50 focus:border-accent"
                />
              </div>
              <div>
                <Select value={formData.counterpartType} onValueChange={(value) => setFormData({ ...formData, counterpartType: value })}>
                  <SelectTrigger className="border-border/50 focus:border-accent">
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
                  className="border-border/50 focus:border-accent"
                />
              </div>
              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90">
                Submit Inquiry
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground/60 mt-8 font-light">
              Or email us directly at: <a href="mailto:partnerships@aries76.com" className="text-accent hover:underline font-normal">partnerships@aries76.com</a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <section className="py-12 px-6 md:px-10 border-t border-border/50 bg-muted/20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-muted-foreground/60 font-light leading-relaxed max-w-4xl mx-auto">
            <span className="font-semibold text-foreground">Aries76 Ltd – Strategic Advisory & Investment Partnerships.</span><br />
            The content on this page is for professional investors only and does not constitute an offer or solicitation. 
            All investment opportunities are subject to thorough due diligence and compliance with applicable regulations.
          </p>
        </div>
      </section>
    </div>
  );
};

export default StrategicPartnerships;
