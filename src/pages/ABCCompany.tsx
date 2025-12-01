import { motion } from 'framer-motion';
import { useState } from 'react';
import { Download, Calendar, Linkedin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';

// Placeholder investor data - replace with actual data from investitori_abc_data.json
const investorsData = [
  {
    name: "Marco Rossi",
    company: "Rossi Family Office",
    category: "Family Office",
    city: "Milano",
    source: "Direct Network",
    relevance: "Active investor in Italian SMEs, focus on permanent capital structures",
    linkedin: "https://linkedin.com/in/example"
  },
  {
    name: "Laura Bianchi",
    company: "Italian Growth Capital",
    category: "Private Equity",
    city: "Roma",
    source: "Industry Database",
    relevance: "Specialized in club deals, €5-15M ticket size preference",
    linkedin: null
  },
  // Add more investors here when data is provided
];

const ABCCompany = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const filteredInvestors = investorsData.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || investor.category === categoryFilter;
    const matchesSource = sourceFilter === 'all' || investor.source === sourceFilter;
    return matchesSearch && matchesCategory && matchesSource;
  });

  const categories = ['all', ...Array.from(new Set(investorsData.map(i => i.category)))];
  const sources = ['all', ...Array.from(new Set(investorsData.map(i => i.source)))];

  return (
    <div className="min-h-screen bg-[#1a2332]">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920')] bg-cover bg-center opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              ABC COMPANY CLUB DEAL OPPORTUNITY
            </h1>
            <p className="text-2xl md:text-3xl text-[#ff6b35] mb-4 font-light">
              €10M Fundraising for Italian SME Investments
            </p>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Permanent Capital vehicle targeting high-quality Italian SMEs through a flexible Club Deal structure. First closing: March 2025.
            </p>
            <Button 
              size="lg" 
              className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-semibold px-8 py-6 text-lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Pitch Deck
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Investment Highlights */}
      <section className="py-20 bg-[#1a2332]">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: "💼",
                title: "Permanent Capital",
                description: "Listed vehicle with proven track record: 207 investments, €32M equity"
              },
              {
                icon: "🤝",
                title: "Club Deal Model",
                description: "Flexible tickets, co-investment opportunities, active participation"
              },
              {
                icon: "🇮🇹",
                title: "Italian SME Focus",
                description: "Deep market knowledge, medium-long term horizon, quality targets"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-[#2a3544] p-8 rounded-2xl border-l-4 border-[#ff6b35]"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-20 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#1a2332]">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: "€10M", label: "Target Raise" },
              { value: "207", label: "Portfolio Companies" },
              { value: "€32M", label: "Equity Capital" },
              { value: "March 2025", label: "First Closing" }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#ff6b35] mb-2">{metric.value}</div>
                <div className="text-white/70 font-light">{metric.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Top Investors Section - MAIN SECTION */}
      <section className="py-20 bg-[#1a2332]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              PRIORITY INVESTORS IDENTIFIED
            </h2>
            <p className="text-xl text-white/70 mb-12 text-center max-w-3xl mx-auto">
              Top 20 high-priority institutional and private investors for ABC Company Club Deal
            </p>

            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-[#2a3544] border-white/10 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="bg-[#2a3544] border-white/10 text-white">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map(src => (
                    <SelectItem key={src} value={src}>
                      {src === 'all' ? 'All Sources' : src}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search investors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#2a3544] border-white/10 text-white pl-10"
                />
              </div>
            </div>

            {/* Investors Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredInvestors.map((investor, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#2a3544] p-6 rounded-xl border-l-4 border-[#ff6b35] hover:shadow-2xl transition-all"
                >
                  <Badge className="bg-[#ff6b35] text-white mb-3">🔥 HIGH PRIORITY</Badge>
                  <h3 className="text-xl font-bold text-white mb-1">{investor.name}</h3>
                  <p className="text-white/90 mb-2">{investor.company}</p>
                  <p className="text-[#ff6b35] font-semibold mb-2">{investor.category}</p>
                  <p className="text-white/70 text-sm mb-2">📍 {investor.city}</p>
                  <p className="text-white/60 text-sm mb-3">Source: {investor.source}</p>
                  <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
                    {investor.relevance}
                  </p>
                  {investor.linkedin && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white"
                      asChild
                    >
                      <a href={investor.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Investment Structure */}
      <section className="py-20 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#1a2332]">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
          >
            Investment Structure
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-[#2a3544] p-8 rounded-2xl border border-white/10"
            >
              <h3 className="text-2xl font-bold text-[#ff6b35] mb-6">Investment Options</h3>
              <ul className="space-y-4 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-[#ff6b35] text-2xl">•</span>
                  <span><strong className="text-white">Direct Capital Increase:</strong> Participate directly in ABC Company's growth</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff6b35] text-2xl">•</span>
                  <span><strong className="text-white">Dedicated SPV:</strong> Co-investment vehicle for aligned investors</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-[#2a3544] p-8 rounded-2xl border border-white/10"
            >
              <h3 className="text-2xl font-bold text-[#ff6b35] mb-6">Timeline</h3>
              <div className="space-y-4">
                {[
                  { period: "Q4 2024", event: "Due Diligence & Investor Outreach" },
                  { period: "Q1 2025", event: "Term Sheet Finalization" },
                  { period: "March 2025", event: "First Closing" },
                  { period: "Q2 2025", event: "Final Closing" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="bg-[#ff6b35] text-white px-3 py-1 rounded-lg font-semibold text-sm whitespace-nowrap">
                      {item.period}
                    </div>
                    <div className="text-white/70">{item.event}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-20 bg-[#1a2332]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
              Why ABC Company?
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                "Permanent Capital Structure",
                "Proven Track Record",
                "Club Deal Flexibility",
                "Italian SME Expertise",
                "Medium-Long Term Horizon",
                "Experienced Team"
              ].map((advantage, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 bg-[#2a3544] p-6 rounded-xl"
                >
                  <div className="text-[#ff6b35] text-2xl">✓</div>
                  <div className="text-white font-semibold">{advantage}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-[#ff6b35]">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              INTERESTED IN LEARNING MORE?
            </h2>
            <p className="text-2xl text-white/90 mb-8">
              Contact us to discuss this opportunity
            </p>
            <a 
              href="mailto:quinley.martini@aries76.com"
              className="inline-block bg-white text-[#ff6b35] px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/90 transition-all mb-6"
            >
              quinley.martini@aries76.com
            </a>
            <div>
              <Button 
                size="lg"
                className="bg-[#1a2332] hover:bg-[#1a2332]/90 text-white"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule a Meeting
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ABCCompany;
