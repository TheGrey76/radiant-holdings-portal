import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Shield, Mail, Lock, FileText, TrendingUp, Users, GraduationCap, Calendar, Target, CheckCircle2, AlertTriangle, ArrowRight, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Authorized emails for this document
const AUTHORIZED_EMAILS = [
  "edoardo.grigione@aries76.com",
  // Add more emails here as needed
];

const XCEPartnershipProposal = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    // Check if user already has access via session storage
    const storedAccess = sessionStorage.getItem("xce_partnership_access");
    if (storedAccess) {
      const { email: storedEmail, timestamp } = JSON.parse(storedAccess);
      // Session valid for 24 hours
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000 && AUTHORIZED_EMAILS.includes(storedEmail.toLowerCase())) {
        setHasAccess(true);
      }
    }
    setIsCheckingAccess(false);
  }, []);

  const handleAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const normalizedEmail = email.toLowerCase().trim();

    if (AUTHORIZED_EMAILS.includes(normalizedEmail)) {
      sessionStorage.setItem("xce_partnership_access", JSON.stringify({
        email: normalizedEmail,
        timestamp: Date.now()
      }));
      setHasAccess(true);
      toast.success("Access granted");
    } else {
      toast.error("Access denied. This email is not authorized.");
    }

    setIsLoading(false);
  };

  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-deep via-primary to-primary flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Access Gate
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e36] to-[#1a2e4a] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#0f1e36]/90 border border-[#1e3a5f] rounded-lg shadow-2xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Partnership Proposal
              </h1>
              <p className="text-gray-400 text-sm">
                XCE & Aries76 Ltd. Strategic Framework
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Confidential - Authorized Access Only
              </p>
            </div>

            <form onSubmit={handleAccessRequest} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 bg-[#1a2e4a] border-[#2a4a6a] text-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Access Document"}
              </Button>
            </form>

            <p className="text-center text-gray-600 text-xs mt-6">
              This is a confidential document for authorized parties only.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Document Content
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e36] to-[#1a2e4a]">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Confidential Partnership Proposal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Partnership Proposal & Economic Offer
          </h1>
          <h2 className="text-2xl md:text-3xl text-accent mb-6">
            XCE & Aries76 Ltd.
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            A Strategic Framework for Capturing the European Private Equity Bitcoin Treasury Market
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span>From: Aries76 Ltd.</span>
            <span>•</span>
            <span>Date: January 27, 2026</span>
          </div>
        </div>
      </section>

      {/* Section 1: Strategic Vision */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-white">Section 1: Strategic Vision & Partnership Model</h2>
          </div>
          
          <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6 mb-8">
            <p className="text-gray-300 leading-relaxed">
              This document outlines a concrete proposal for a strategic partnership between XCE and Aries76 Ltd. Our goal is to create a market-leading, integrated service offering for European mid-market private equity (PE) funds that are looking to implement Bitcoin treasury strategies. As you know, institutional adoption is accelerating, but fund managers face a critical gap: they need both strategic advisory on capital formation and access to specialized talent. This is where our partnership creates unique value.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-white mb-6">The Integrated Offering</h3>
          
          <div className="grid gap-4">
            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Strategic Capital Formation</h4>
                  <p className="text-accent text-sm mb-2">Lead Partner: Aries76 Ltd.</p>
                  <p className="text-gray-400 text-sm">Advisory services for mid-market PE funds on integrating Bitcoin treasury strategies into their capital formation and fund management.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Executive Recruitment</h4>
                  <p className="text-blue-400 text-sm mb-2">Lead Partner: XCE</p>
                  <p className="text-gray-400 text-sm">Specialized recruitment for key roles, including Chief Bitcoin Officer (CBO), Treasury Specialists, and other related positions.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Bitcoin Education & Training</h4>
                  <p className="text-purple-400 text-sm mb-2">Lead Partner: Joint</p>
                  <p className="text-gray-400 text-sm">Comprehensive workshops, ongoing education programs, and certification for fund teams on all aspects of Bitcoin treasury management.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-accent/10 border border-accent/30 rounded-lg p-6">
            <p className="text-gray-300">
              This integrated model provides a powerful, one-stop solution that de-risks and accelerates the adoption of Bitcoin treasury strategies for fund managers. For our firms, it creates a highly defensible market position and a pipeline of high-value, strategic mandates.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Market Analysis */}
      <section className="py-16 px-4 bg-[#0a1628]/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-white">Section 2: Market Analysis & Competitive Positioning</h2>
          </div>

          <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6 mb-8">
            <p className="text-gray-300 leading-relaxed mb-4">
              The European mid-market PE segment raised a record <span className="text-accent font-semibold">€79.9 billion in 2025</span>, and these forward-thinking managers are actively seeking innovative strategies. However, the competitive landscape for Bitcoin-focused advisory in this space is nascent and fragmented. Our joint offering will be the first of its kind, creating a significant first-mover advantage.
            </p>
            <p className="text-gray-300">
              Our research confirms that an aggressive pricing strategy is the most effective way to penetrate this market, build a strong client base, and establish our brand as the go-to leader.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-white mb-6">Capital Formation Advisory Fee Benchmarks</h3>
          
          <div className="overflow-x-auto mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e3a5f]">
                  <th className="text-left text-gray-400 py-3 px-4 font-medium">Fee Type</th>
                  <th className="text-left text-gray-400 py-3 px-4 font-medium">Industry Standard</th>
                  <th className="text-left text-accent py-3 px-4 font-medium">Our Proposed Pricing</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1e3a5f]/50">
                  <td className="text-white py-3 px-4">Success Fee</td>
                  <td className="text-gray-400 py-3 px-4">1.5% - 2.5% of capital raised</td>
                  <td className="text-accent py-3 px-4 font-medium">1.0% - 1.5% of capital raised</td>
                </tr>
                <tr className="border-b border-[#1e3a5f]/50">
                  <td className="text-white py-3 px-4">Retainer Fee (Large)</td>
                  <td className="text-gray-400 py-3 px-4">€24,000 - €124,000+</td>
                  <td className="text-accent py-3 px-4 font-medium">€30,000 - €75,000</td>
                </tr>
                <tr>
                  <td className="text-white py-3 px-4">Retainer Fee (Boutique)</td>
                  <td className="text-gray-400 py-3 px-4">€6,000 - €24,000</td>
                  <td className="text-accent py-3 px-4 font-medium">€6,000 - €20,000 monthly</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-white mb-6">Executive Recruitment Fee Benchmarks</h3>
          
          <div className="overflow-x-auto mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e3a5f]">
                  <th className="text-left text-gray-400 py-3 px-4 font-medium">Fee Type</th>
                  <th className="text-left text-gray-400 py-3 px-4 font-medium">Industry Standard (Europe)</th>
                  <th className="text-left text-accent py-3 px-4 font-medium">Our Proposed Pricing</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1e3a5f]/50">
                  <td className="text-white py-3 px-4">Retained Search</td>
                  <td className="text-gray-400 py-3 px-4">30% - 35% of first-year salary</td>
                  <td className="text-accent py-3 px-4 font-medium">8% - 10% of first-year salary</td>
                </tr>
                <tr>
                  <td className="text-white py-3 px-4">CBO Placement</td>
                  <td className="text-gray-400 py-3 px-4">€80,000 - €124,000</td>
                  <td className="text-accent py-3 px-4 font-medium">€60,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-300">
                By positioning our fees <span className="text-green-400 font-semibold">20-30% below market rates</span>, we can accelerate client acquisition and build a defensible moat based on our unique, integrated service model.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Economic Offer */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-white">Section 3: Economic Offer & Pricing Strategy</h2>
          </div>

          <p className="text-gray-300 mb-8">
            We recommend an aggressive market penetration strategy for the initial 12-18 months. This approach is designed to rapidly capture market share and establish our partnership as the definitive leader.
          </p>

          <h3 className="text-xl font-semibold text-white mb-6">Strategic Rationale</h3>
          
          <div className="grid gap-4 mb-8">
            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-5">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Market Entry Velocity</h4>
                  <p className="text-gray-400 text-sm">Lower fees will accelerate the acquisition of our first cohort of clients, creating a strong foundation for growth and a portfolio of case studies.</p>
                </div>
              </div>
            </div>
            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-5">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Market Share Capture</h4>
                  <p className="text-gray-400 text-sm">By entering with a compelling price point, we can establish a dominant position before potential competitors can react.</p>
                </div>
              </div>
            </div>
            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-5">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Building a Moat</h4>
                  <p className="text-gray-400 text-sm">The integrated nature of our services will create high switching costs for clients, fostering long-term loyalty and recurring revenue.</p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white mb-6">Phased Implementation</h3>
          
          <div className="space-y-4">
            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">1</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Phase 1 (Year 1)</h4>
                  <p className="text-gray-400 text-sm">Launch with pricing 20-30% below market rates to attract 10-12 early adopter clients.</p>
                </div>
              </div>
            </div>
            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">2</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Phase 2 (Year 2)</h4>
                  <p className="text-gray-400 text-sm">Gradually increase fees for new clients by 10-15%, while maintaining favorable rates for our initial client cohort to reward their early trust.</p>
                </div>
              </div>
            </div>
            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">3</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Phase 3 (Year 3)</h4>
                  <p className="text-gray-400 text-sm">Transition to market-rate pricing as our brand and market leadership are firmly established.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Financial Projections */}
      <section className="py-16 px-4 bg-[#0a1628]/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-white">Section 4: Financial Projections & Economic Model</h2>
          </div>

          <p className="text-gray-300 mb-8">
            Here are the detailed financial projections based on our recommended aggressive pricing strategy. This model assumes we acquire clients progressively and demonstrates a clear and rapid path to profitability.
          </p>

          <h3 className="text-xl font-semibold text-white mb-6">3-Year Revenue Projections</h3>
          
          <div className="overflow-x-auto mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e3a5f]">
                  <th className="text-left text-gray-400 py-3 px-4 font-medium">Year</th>
                  <th className="text-center text-gray-400 py-3 px-4 font-medium">New Clients</th>
                  <th className="text-center text-gray-400 py-3 px-4 font-medium">Cumulative</th>
                  <th className="text-right text-gray-400 py-3 px-4 font-medium">Advisory (€)</th>
                  <th className="text-right text-gray-400 py-3 px-4 font-medium">Recruitment (€)</th>
                  <th className="text-right text-gray-400 py-3 px-4 font-medium">Education (€)</th>
                  <th className="text-right text-accent py-3 px-4 font-medium">Total (€)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1e3a5f]/50">
                  <td className="text-white py-3 px-4 font-semibold">1</td>
                  <td className="text-center text-gray-400 py-3 px-4">6</td>
                  <td className="text-center text-gray-400 py-3 px-4">6</td>
                  <td className="text-right text-gray-400 py-3 px-4">270,000</td>
                  <td className="text-right text-gray-400 py-3 px-4">720,000</td>
                  <td className="text-right text-gray-400 py-3 px-4">120,000</td>
                  <td className="text-right text-accent py-3 px-4 font-semibold">1,110,000</td>
                </tr>
                <tr className="border-b border-[#1e3a5f]/50">
                  <td className="text-white py-3 px-4 font-semibold">2</td>
                  <td className="text-center text-gray-400 py-3 px-4">8</td>
                  <td className="text-center text-gray-400 py-3 px-4">14</td>
                  <td className="text-right text-gray-400 py-3 px-4">960,000</td>
                  <td className="text-right text-gray-400 py-3 px-4">2,520,000</td>
                  <td className="text-right text-gray-400 py-3 px-4">490,000</td>
                  <td className="text-right text-accent py-3 px-4 font-semibold">3,920,000</td>
                </tr>
                <tr>
                  <td className="text-white py-3 px-4 font-semibold">3</td>
                  <td className="text-center text-gray-400 py-3 px-4">10</td>
                  <td className="text-center text-gray-400 py-3 px-4">24</td>
                  <td className="text-right text-gray-400 py-3 px-4">1,920,000</td>
                  <td className="text-right text-gray-400 py-3 px-4">5,140,000</td>
                  <td className="text-right text-gray-400 py-3 px-4">1,200,000</td>
                  <td className="text-right text-accent py-3 px-4 font-semibold">8,400,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-white mb-6">Profitability Analysis</h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Year 1 Gross Profit</p>
              <p className="text-3xl font-bold text-white">€790,000</p>
              <p className="text-accent text-sm mt-1">71.2% Margin</p>
            </div>
            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Year 2 Gross Profit</p>
              <p className="text-3xl font-bold text-white">€3,440,000</p>
              <p className="text-accent text-sm mt-1">87.8% Margin</p>
            </div>
            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Year 3 Gross Profit</p>
              <p className="text-3xl font-bold text-accent">€7,700,000</p>
              <p className="text-accent text-sm mt-1">91.9% Margin</p>
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
            <h4 className="text-white font-semibold mb-3">3-Year Cumulative Summary</h4>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">€13.43M</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Operating Costs</p>
                <p className="text-2xl font-bold text-white">€1.48M</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Gross Profit</p>
                <p className="text-2xl font-bold text-accent">€11.95M</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Partnership Structure */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-white">Section 5: Partnership Structure & Revenue Sharing</h2>
          </div>

          <p className="text-gray-300 mb-8">
            We propose a collaborative structure that aligns our incentives and ensures each partner is rewarded for their primary contribution.
          </p>

          <h3 className="text-xl font-semibold text-white mb-6">Proposed Revenue Sharing Model</h3>
          
          <div className="overflow-x-auto mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e3a5f]">
                  <th className="text-left text-gray-400 py-3 px-4 font-medium">Service Offering</th>
                  <th className="text-left text-gray-400 py-3 px-4 font-medium">Lead Partner</th>
                  <th className="text-center text-accent py-3 px-4 font-medium">Aries76 Share</th>
                  <th className="text-center text-blue-400 py-3 px-4 font-medium">XCE Share</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1e3a5f]/50">
                  <td className="text-white py-3 px-4">Strategic Capital Formation</td>
                  <td className="text-accent py-3 px-4">Aries76 Ltd.</td>
                  <td className="text-center text-accent py-3 px-4 font-semibold">70%</td>
                  <td className="text-center text-blue-400 py-3 px-4">30%</td>
                </tr>
                <tr className="border-b border-[#1e3a5f]/50">
                  <td className="text-white py-3 px-4">Executive Recruitment</td>
                  <td className="text-blue-400 py-3 px-4">XCE</td>
                  <td className="text-center text-accent py-3 px-4">25%</td>
                  <td className="text-center text-blue-400 py-3 px-4 font-semibold">75%</td>
                </tr>
                <tr>
                  <td className="text-white py-3 px-4">Bitcoin Education & Training</td>
                  <td className="text-purple-400 py-3 px-4">Joint</td>
                  <td className="text-center text-accent py-3 px-4">50%</td>
                  <td className="text-center text-blue-400 py-3 px-4">50%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-white mb-6">Projected Revenue by Partner</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
              <h4 className="text-accent font-semibold mb-4">Aries76 Ltd.</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Year 1</span>
                  <span className="text-white font-medium">€467,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Year 2</span>
                  <span className="text-white font-medium">€1,924,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Year 3</span>
                  <span className="text-white font-medium">€4,724,000</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
              <h4 className="text-blue-400 font-semibold mb-4">XCE</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Year 1</span>
                  <span className="text-white font-medium">€642,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Year 2</span>
                  <span className="text-white font-medium">€1,996,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Year 3</span>
                  <span className="text-white font-medium">€3,676,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Next Steps */}
      <section className="py-16 px-4 bg-[#0a1628]/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-white">Section 6: Next Steps</h2>
          </div>

          <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6 mb-8">
            <p className="text-gray-300 leading-relaxed mb-6">
              This partnership represents a compelling opportunity to build a dominant market position in a high-growth, high-value segment. I propose a brief operational call next week to discuss this proposal in more detail. Specifically, I'd like to confirm:
            </p>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">1</span>
                <span className="text-gray-300">Your interest in moving forward with this Bitcoin-focused fund advisory partnership.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">2</span>
                <span className="text-gray-300">Alignment on the proposed partnership structure and economic model.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">3</span>
                <span className="text-gray-300">A preliminary list of target fund managers we can approach jointly.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">4</span>
                <span className="text-gray-300">A target timeline for launching a pilot program.</span>
              </li>
            </ol>
          </div>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
            <p className="text-gray-300 text-center italic">
              I am confident that together, we can create significant value for our clients and our firms. I look forward to discussing this with you further.
            </p>
          </div>
        </div>
      </section>

      {/* Appendix A: Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Appendix A: Implementation Timeline</h2>

          <div className="space-y-6">
            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-accent mb-4">Phase 1: Launch & Market Entry (Months 1-6)</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Finalize partnership agreement and operational structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Develop joint marketing materials and positioning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Identify and approach 10-15 target fund managers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Secure 3-5 pilot clients for initial engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Establish internal processes and communication protocols</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-400 mb-4">Phase 2: Scaling & Optimization (Months 7-18)</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Expand client base to 20-25 cumulative clients</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Develop case studies and testimonials from pilot clients</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">Phase 3: Market Leadership (Months 19-36)</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Achieve 45-50 cumulative clients by end of Year 3</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Transition to market-rate pricing for new clients</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Expand service offerings based on market demand</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Establish strategic partnerships with complementary service providers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Position for potential expansion into adjacent markets (e.g., Asia-Pacific)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Appendix B: Risk Mitigation */}
      <section className="py-16 px-4 bg-[#0a1628]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Appendix B: Risk Mitigation & Success Factors</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Key Success Factors</h3>
              </div>
              <p className="text-gray-300 text-sm">
                The success of this partnership depends on several critical factors. First, we must maintain alignment between Aries76 Ltd. and XCE on strategy, messaging, and client engagement. This requires clear communication protocols and regular strategic reviews. Second, we must deliver exceptional service quality to our early clients, as their testimonials and case studies will be instrumental in attracting subsequent clients. Third, we must remain agile and responsive to market feedback, adjusting our service offerings and pricing as needed.
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Risk Mitigation Strategies</h3>
              </div>
              <p className="text-gray-300 text-sm">
                While the market opportunity is significant, several risks must be managed. The primary risk is that competitors may enter the market and undercut our pricing. To mitigate this, we will focus on building strong client relationships and creating high switching costs through our integrated service model. A secondary risk is that demand for Bitcoin treasury strategies may not materialize as quickly as projected. To address this, we will maintain flexibility in our cost structure and be prepared to adjust our client acquisition targets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Document Info Footer */}
      <section className="py-12 px-4 border-t border-[#1e3a5f]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Document Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Prepared by: <span className="text-white">Aries76 Ltd.</span></p>
                <p className="text-gray-400">Date: <span className="text-white">January 27, 2026</span></p>
              </div>
              <div>
                <p className="text-gray-400">Recipient: <span className="text-white">Scott (XCE)</span></p>
                <p className="text-gray-400">Classification: <span className="text-accent">Confidential - Partnership Discussion</span></p>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-4 italic">
              This proposal is intended for discussion purposes only and does not constitute a binding commitment. All figures and projections are based on conservative assumptions and market research current as of the date of this document.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default XCEPartnershipProposal;
