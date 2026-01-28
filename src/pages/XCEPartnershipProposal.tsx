import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Shield, Mail, FileText, TrendingUp, Users, GraduationCap, Calendar, Target, CheckCircle2, AlertTriangle, ArrowRight, Building } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from "recharts";

// Authorized emails for this document
const AUTHORIZED_EMAILS = [
  "edoardo.grigione@aries76.com",
  "scott.ellam@xce.io",
  // Add more emails here as needed
];

// Chart data
const revenueByYearData = [
  { year: "Year 1", advisory: 270000, recruitment: 720000, education: 120000, total: 1110000 },
  { year: "Year 2", advisory: 960000, recruitment: 2520000, education: 490000, total: 3920000 },
  { year: "Year 3", advisory: 1920000, recruitment: 5140000, education: 1200000, total: 8400000 },
];

const profitabilityData = [
  { year: "Year 1", revenue: 1110000, costs: 320000, profit: 790000, margin: 71.2 },
  { year: "Year 2", revenue: 3920000, costs: 480000, profit: 3440000, margin: 87.8 },
  { year: "Year 3", revenue: 8400000, costs: 700000, profit: 7700000, margin: 91.9 },
];

const serviceLineData = [
  { name: "Advisory", value: 3150000, color: "#f97316" },
  { name: "Recruitment", value: 8380000, color: "#3b82f6" },
  { name: "Education", value: 1810000, color: "#a855f7" },
];

const clientGrowthData = [
  { year: "Year 1", clients: 6, revenuePerClient: 185000 },
  { year: "Year 2", clients: 14, revenuePerClient: 280000 },
  { year: "Year 3", clients: 24, revenuePerClient: 350000 },
];

const partnerRevenueData = [
  { year: "Year 1", aries76: 467500, xce: 642500 },
  { year: "Year 2", aries76: 1924000, xce: 1996000 },
  { year: "Year 3", aries76: 4724000, xce: 3676000 },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const XCEPartnershipProposal = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    const storedAccess = sessionStorage.getItem("xce_partnership_access");
    if (storedAccess) {
      const { email: storedEmail, timestamp } = JSON.parse(storedAccess);
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

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    }
    return `€${(value / 1000).toFixed(0)}K`;
  };

  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e36] to-[#1a2e4a] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  // Access Gate
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e36] to-[#1a2e4a] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-[#0f1e36]/90 border border-[#1e3a5f] rounded-lg shadow-2xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Shield className="w-8 h-8 text-accent" />
              </motion.div>
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
        </motion.div>
      </div>
    );
  }

  // Document Content
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e36] to-[#1a2e4a]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated background orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Confidential Partnership Proposal
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Partnership Proposal & Economic Offer
          </motion.h1>
          <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl text-accent mb-6">
            XCE & Aries76 Ltd.
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            A Strategic Framework for Capturing the European Private Equity Bitcoin Treasury Market
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span>From: Aries76 Ltd.</span>
            <span>•</span>
            <span>Date: January 27, 2026</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 1: Strategic Vision */}
      <section className="py-16 px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInLeft} className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-white">Section 1: Strategic Vision & Partnership Model</h2>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6 mb-8">
            <p className="text-gray-300 leading-relaxed">
              This document outlines a concrete proposal for a strategic partnership between XCE and Aries76 Ltd. Our goal is to create a market-leading, integrated service offering for European mid-market private equity (PE) funds that are looking to implement Bitcoin treasury strategies. As you know, institutional adoption is accelerating, but fund managers face a critical gap: they need both strategic advisory on capital formation and access to specialized talent. This is where our partnership creates unique value.
            </p>
          </motion.div>

          <motion.h3 variants={fadeInUp} className="text-xl font-semibold text-white mb-6">The Integrated Offering</motion.h3>
          
          <motion.div variants={staggerContainer} className="grid gap-4">
            {[
              { icon: TrendingUp, color: "accent", title: "Strategic Capital Formation", partner: "Aries76 Ltd.", desc: "Advisory services for mid-market PE funds on integrating Bitcoin treasury strategies into their capital formation and fund management." },
              { icon: Users, color: "blue-400", title: "Executive Recruitment", partner: "XCE", desc: "Specialized recruitment for key roles, including Chief Bitcoin Officer (CBO), Treasury Specialists, and other related positions." },
              { icon: GraduationCap, color: "purple-400", title: "Bitcoin Education & Training", partner: "Joint", desc: "Comprehensive workshops, ongoing education programs, and certification for fund teams on all aspects of Bitcoin treasury management." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeInRight}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6"
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    initial={{ rotate: -10 }}
                    whileHover={{ rotate: 0, scale: 1.1 }}
                    className={`w-12 h-12 bg-${item.color}/20 rounded-lg flex items-center justify-center flex-shrink-0`}
                    style={{ backgroundColor: item.color === 'accent' ? 'rgba(249, 115, 22, 0.2)' : item.color === 'blue-400' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(168, 85, 247, 0.2)' }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color === 'accent' ? '#f97316' : item.color === 'blue-400' ? '#60a5fa' : '#a855f7' }} />
                  </motion.div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm mb-2" style={{ color: item.color === 'accent' ? '#f97316' : item.color === 'blue-400' ? '#60a5fa' : '#a855f7' }}>Lead Partner: {item.partner}</p>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={scaleIn} className="mt-8 bg-accent/10 border border-accent/30 rounded-lg p-6">
            <p className="text-gray-300">
              This integrated model provides a powerful, one-stop solution that de-risks and accelerates the adoption of Bitcoin treasury strategies for fund managers. For our firms, it creates a highly defensible market position and a pipeline of high-value, strategic mandates.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2: Market Analysis */}
      <section className="py-16 px-4 bg-[#0a1628]/50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInLeft} className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-white">Section 2: Market Analysis & Competitive Positioning</h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6 mb-8">
            <p className="text-gray-300 leading-relaxed mb-4">
              The European mid-market PE segment raised a record <span className="text-accent font-semibold">€79.9 billion in 2025</span>, and these forward-thinking managers are actively seeking innovative strategies. However, the competitive landscape for Bitcoin-focused advisory in this space is nascent and fragmented. Our joint offering will be the first of its kind, creating a significant first-mover advantage.
            </p>
            <p className="text-gray-300">
              Our research confirms that an aggressive pricing strategy is the most effective way to penetrate this market, build a strong client base, and establish our brand as the go-to leader.
            </p>
          </motion.div>

          <motion.h3 variants={fadeInUp} className="text-xl font-semibold text-white mb-6">Capital Formation Advisory Fee Benchmarks</motion.h3>
          
          <motion.div variants={fadeInUp} className="overflow-x-auto mb-8">
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
          </motion.div>

          <motion.h3 variants={fadeInUp} className="text-xl font-semibold text-white mb-6">Executive Recruitment Fee Benchmarks</motion.h3>
          
          <motion.div variants={fadeInUp} className="overflow-x-auto mb-8">
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
          </motion.div>

          <motion.div variants={scaleIn} className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-300">
                By positioning our fees <span className="text-green-400 font-semibold">20-30% below market rates</span>, we can accelerate client acquisition and build a defensible moat based on our unique, integrated service model.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 3: Economic Offer */}
      <section className="py-16 px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInLeft} className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-white">Section 3: Economic Offer & Pricing Strategy</h2>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-gray-300 mb-8">
            We recommend an aggressive market penetration strategy for the initial 12-18 months. This approach is designed to rapidly capture market share and establish our partnership as the definitive leader.
          </motion.p>

          <motion.h3 variants={fadeInUp} className="text-xl font-semibold text-white mb-6">Strategic Rationale</motion.h3>
          
          <motion.div variants={staggerContainer} className="grid gap-4 mb-8">
            {[
              { title: "Market Entry Velocity", desc: "Lower fees will accelerate the acquisition of our first cohort of clients, creating a strong foundation for growth and a portfolio of case studies." },
              { title: "Market Share Capture", desc: "By entering with a compelling price point, we can establish a dominant position before potential competitors can react." },
              { title: "Building a Moat", desc: "The integrated nature of our services will create high switching costs for clients, fostering long-term loyalty and recurring revenue." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeInRight}
                whileHover={{ x: 5 }}
                className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-5"
              >
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.h3 variants={fadeInUp} className="text-xl font-semibold text-white mb-6">Phased Implementation</motion.h3>
          
          <motion.div variants={staggerContainer} className="space-y-4">
            {[
              { phase: 1, title: "Phase 1 (Year 1)", desc: "Launch with pricing 20-30% below market rates to attract 10-12 early adopter clients." },
              { phase: 2, title: "Phase 2 (Year 2)", desc: "Gradually increase fees for new clients by 10-15%, while maintaining favorable rates for our initial client cohort to reward their early trust." },
              { phase: 3, title: "Phase 3 (Year 3)", desc: "Transition to market-rate pricing as our brand and market leadership are firmly established." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.01 }}
                className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-5"
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                  >
                    {item.phase}
                  </motion.div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Section 4: Financial Projections with Charts */}
      <section className="py-16 px-4 bg-[#0a1628]/50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={fadeInLeft} className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-white">Section 4: Financial Projections & Economic Model</h2>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-gray-300 mb-8">
            Here are the detailed financial projections based on our recommended aggressive pricing strategy. This model assumes we acquire clients progressively and demonstrates a clear and rapid path to profitability.
          </motion.p>

          {/* Revenue by Service Line Chart */}
          <motion.div variants={scaleIn} className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">3-Year Revenue by Service Line</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByYearData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="year" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" tickFormatter={formatCurrency} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f1e36', border: '1px solid #1e3a5f', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar dataKey="advisory" name="Advisory" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="recruitment" name="Recruitment" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="education" name="Education" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Profitability Chart */}
          <motion.div variants={scaleIn} className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">Revenue vs. Gross Profit</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profitabilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="year" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" tickFormatter={formatCurrency} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f1e36', border: '1px solid #1e3a5f', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="profit" name="Gross Profit" stroke="#22c55e" fillOpacity={1} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Two column charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Service Line Pie Chart */}
            <motion.div variants={fadeInLeft} className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Total Revenue by Service (3Y)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceLineData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: '#9ca3af' }}
                    >
                      {serviceLineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f1e36', border: '1px solid #1e3a5f', borderRadius: '8px' }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Margin Evolution Chart */}
            <motion.div variants={fadeInRight} className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Gross Margin Evolution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profitabilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                    <XAxis dataKey="year" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f1e36', border: '1px solid #1e3a5f', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                      formatter={(value: number) => `${value.toFixed(1)}%`}
                    />
                    <Line type="monotone" dataKey="margin" name="Gross Margin" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Client Growth Chart */}
          <motion.div variants={scaleIn} className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">Client Growth & Revenue per Client</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="year" stroke="#9ca3af" />
                  <YAxis yAxisId="left" stroke="#9ca3af" />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" tickFormatter={formatCurrency} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f1e36', border: '1px solid #1e3a5f', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="clients" name="Cumulative Clients" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="revenuePerClient" name="Revenue per Client" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Year 1 Gross Profit", value: "€790,000", sub: "71.2% Margin" },
              { label: "Year 2 Gross Profit", value: "€3,440,000", sub: "87.8% Margin" },
              { label: "Year 3 Gross Profit", value: "€7,700,000", sub: "91.9% Margin", highlight: true }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6 text-center"
              >
                <p className="text-gray-400 text-sm mb-2">{item.label}</p>
                <motion.p 
                  className={`text-3xl font-bold ${item.highlight ? 'text-accent' : 'text-white'}`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                >
                  {item.value}
                </motion.p>
                <p className="text-accent text-sm mt-1">{item.sub}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={scaleIn} className="bg-accent/10 border border-accent/30 rounded-lg p-6">
            <h4 className="text-white font-semibold mb-3">3-Year Cumulative Summary</h4>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <motion.p 
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  €13.43M
                </motion.p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Operating Costs</p>
                <motion.p 
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  €1.48M
                </motion.p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Gross Profit</p>
                <motion.p 
                  className="text-2xl font-bold text-accent"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  €11.95M
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 5: Partnership Structure */}
      <section className="py-16 px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={fadeInLeft} className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-white">Section 5: Partnership Structure & Revenue Sharing</h2>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-gray-300 mb-8">
            We propose a collaborative structure that aligns our incentives and ensures each partner is rewarded for their primary contribution.
          </motion.p>

          <motion.h3 variants={fadeInUp} className="text-xl font-semibold text-white mb-6">Proposed Revenue Sharing Model</motion.h3>
          
          <motion.div variants={fadeInUp} className="overflow-x-auto mb-8">
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
          </motion.div>

          {/* Partner Revenue Chart */}
          <motion.div variants={scaleIn} className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">Projected Revenue by Partner</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={partnerRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="year" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" tickFormatter={formatCurrency} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f1e36', border: '1px solid #1e3a5f', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar dataKey="aries76" name="Aries76 Ltd." fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="xce" name="XCE" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeInLeft} whileHover={{ scale: 1.02 }} className="bg-accent/10 border border-accent/30 rounded-lg p-6">
              <h4 className="text-accent font-semibold mb-4">Aries76 Ltd.</h4>
              <div className="space-y-3">
                {[
                  { year: "Year 1", value: "€467,500" },
                  { year: "Year 2", value: "€1,924,000" },
                  { year: "Year 3", value: "€4,724,000" }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    className="flex justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <span className="text-gray-400">{item.year}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeInRight} whileHover={{ scale: 1.02 }} className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
              <h4 className="text-blue-400 font-semibold mb-4">XCE</h4>
              <div className="space-y-3">
                {[
                  { year: "Year 1", value: "€642,500" },
                  { year: "Year 2", value: "€1,996,000" },
                  { year: "Year 3", value: "€3,676,000" }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    className="flex justify-between"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <span className="text-gray-400">{item.year}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 6: Next Steps */}
      <section className="py-16 px-4 bg-[#0a1628]/50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInLeft} className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-white">Section 6: Next Steps</h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6 mb-8">
            <p className="text-gray-300 leading-relaxed mb-6">
              This partnership represents a compelling opportunity to build a dominant market position in a high-growth, high-value segment. I propose a brief operational call next week to discuss this proposal in more detail. Specifically, I'd like to confirm:
            </p>
            <motion.ol variants={staggerContainer} className="space-y-3">
              {[
                "Your interest in moving forward with this Bitcoin-focused fund advisory partnership.",
                "Alignment on the proposed partnership structure and economic model.",
                "A preliminary list of target fund managers we can approach jointly.",
                "A target timeline for launching a pilot program."
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  variants={fadeInRight}
                  className="flex items-start gap-3"
                >
                  <motion.span 
                    whileHover={{ scale: 1.2 }}
                    className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                  >
                    {index + 1}
                  </motion.span>
                  <span className="text-gray-300">{item}</span>
                </motion.li>
              ))}
            </motion.ol>
          </motion.div>

          <motion.div variants={scaleIn} className="bg-accent/10 border border-accent/30 rounded-lg p-6">
            <p className="text-gray-300 text-center italic">
              I am confident that together, we can create significant value for our clients and our firms. I look forward to discussing this with you further.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Appendix A: Timeline */}
      <section className="py-16 px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-white mb-8">Appendix A: Implementation Timeline</motion.h2>

          <motion.div variants={staggerContainer} className="space-y-6">
            {[
              { phase: "Phase 1: Launch & Market Entry", period: "Months 1-6", color: "#f97316", items: ["Finalize partnership agreement and operational structure", "Develop joint marketing materials and positioning", "Identify and approach 10-15 target fund managers", "Secure 3-5 pilot clients for initial engagement", "Establish internal processes and communication protocols"] },
              { phase: "Phase 2: Scaling & Optimization", period: "Months 7-18", color: "#3b82f6", items: ["Expand client base to 20-25 cumulative clients", "Develop case studies and testimonials from pilot clients"] },
              { phase: "Phase 3: Market Leadership", period: "Months 19-36", color: "#a855f7", items: ["Achieve 45-50 cumulative clients by end of Year 3", "Transition to market-rate pricing for new clients", "Expand service offerings based on market demand", "Establish strategic partnerships with complementary service providers", "Position for potential expansion into adjacent markets (e.g., Asia-Pacific)"] }
            ].map((section, sectionIdx) => (
              <motion.div 
                key={sectionIdx}
                variants={fadeInUp}
                whileHover={{ scale: 1.01 }}
                className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold mb-1" style={{ color: section.color }}>{section.phase}</h3>
                <p className="text-gray-500 text-sm mb-4">{section.period}</p>
                <ul className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <motion.li 
                      key={itemIdx}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: itemIdx * 0.05 }}
                    >
                      <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: section.color }} />
                      <span className="text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Appendix B: Risk Mitigation */}
      <section className="py-16 px-4 bg-[#0a1628]/50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-white mb-8">Appendix B: Risk Mitigation & Success Factors</motion.h2>

          <motion.div variants={staggerContainer} className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeInLeft} whileHover={{ y: -5 }} className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Key Success Factors</h3>
              </div>
              <p className="text-gray-300 text-sm">
                The success of this partnership depends on several critical factors. First, we must maintain alignment between Aries76 Ltd. and XCE on strategy, messaging, and client engagement. This requires clear communication protocols and regular strategic reviews. Second, we must deliver exceptional service quality to our early clients, as their testimonials and case studies will be instrumental in attracting subsequent clients. Third, we must remain agile and responsive to market feedback, adjusting our service offerings and pricing as needed.
              </p>
            </motion.div>

            <motion.div variants={fadeInRight} whileHover={{ y: -5 }} className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Risk Mitigation Strategies</h3>
              </div>
              <p className="text-gray-300 text-sm">
                While the market opportunity is significant, several risks must be managed. The primary risk is that competitors may enter the market and undercut our pricing. To mitigate this, we will focus on building strong client relationships and creating high switching costs through our integrated service model. A secondary risk is that demand for Bitcoin treasury strategies may not materialize as quickly as projected. To address this, we will maintain flexibility in our cost structure and be prepared to adjust our client acquisition targets.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Document Info Footer */}
      <section className="py-12 px-4 border-t border-[#1e3a5f]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-[#0f1e36]/60 border border-[#1e3a5f] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Document Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Prepared by: <span className="text-white">Aries76 Ltd.</span></p>
                <p className="text-gray-400">Date: <span className="text-white">January 27, 2026</span></p>
              </div>
              <div>
                <p className="text-gray-400">Recipient: <span className="text-white">Scott Ellam - Scott.Ellam@xce.io</span></p>
                <p className="text-gray-400">Classification: <span className="text-accent">Confidential - Partnership Discussion</span></p>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-4 italic">
              This proposal is intended for discussion purposes only and does not constitute a binding commitment. All figures and projections are based on conservative assumptions and market research current as of the date of this document.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default XCEPartnershipProposal;
