import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  TrendingUp, 
  Building2, 
  Bitcoin, 
  BarChart3,
  Linkedin,
  BookOpen,
  PenLine,
  Quote,
  GraduationCap,
  Award,
  Briefcase,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
  Rocket,
  Globe,
  Handshake,
  Users,
  LineChart,
  Coins,
  LucideIcon
} from 'lucide-react';
import edoardoPhoto from '@/assets/edoardo-grigione.jpg';

const AriesAICourses = () => {
  const expertise = [
    { icon: Brain, title: 'AI in Finance', desc: 'Applications of AI and machine learning in banking, trading, and portfolio management' },
    { icon: Sparkles, title: 'Generative AI & LLMs', desc: 'Practical use of tools like ChatGPT in financial analysis and decision-making' },
    { icon: Bitcoin, title: 'Blockchain & Crypto', desc: 'Early adopter and commentator on Bitcoin and digital assets' },
    { icon: Building2, title: 'Private Markets', desc: 'Strategic fundraising in the era of AI' },
    { icon: BarChart3, title: 'Risk Management', desc: 'Intuitive approaches to managing market risk and generating alpha' },
  ];

  const featuredTopics = [
    { icon: Building2, title: 'AI in Banking: Promise and Disruption' },
    { icon: Brain, title: 'ChatGPT for Financial Professionals' },
    { icon: TrendingUp, title: 'The Future of Private Markets in the AI Era' },
    { icon: Bitcoin, title: 'Blockchain, Bitcoin & the New Financial Order' },
    { icon: BarChart3, title: 'From Data to Decisions: AI-Powered Investment Strategies' },
  ];

  const careerHighlights: { role: string; company: string; period: string; highlight?: boolean; detail?: string; icon: LucideIcon }[] = [
    { role: 'Founder', company: 'Aries76 Ltd', period: 'Dec 2023 – Present', highlight: true, detail: 'Independent advisory firm for international fundraising and strategic investor relations', icon: Rocket },
    { role: 'Founder', company: 'AIRES Data Driven Decisions', period: 'Jul 2024 – Present', detail: 'AI-powered capital raising and predictive analytics platform', icon: Brain },
    { role: 'Advisor & Capital Raiser', company: 'FARO Value', period: 'Oct 2024 – Present', icon: Handshake },
    { role: 'Senior Relationship Manager', company: 'Run Capital Partners Ltd', period: 'Jan 2024 – Present', icon: Users },
    { role: 'Branch Manager Italy', company: 'ABALONE Group', period: 'Nov 2021 – Present', icon: Globe },
    { role: 'Founder', company: 'Gry Capital Advisor', period: '2016 – 2019', detail: 'Innovative financial advisory firm', icon: LineChart },
    { role: 'Co-Founder', company: 'Bi-Different S.r.l.', period: '2014 – 2016', detail: 'Fintech startup focused on alternative currencies', icon: Bitcoin },
    { role: 'CEO & Founder', company: 'Gry Capital Management LLC, New York', period: '2007 – 2013', detail: 'Portfolio management and capital raising', icon: TrendingUp },
    { role: 'Founder & Portfolio Manager', company: 'COFIN S.r.l.', period: '2001 – 2007', detail: 'Investment advisory for Italian private clients', icon: Coins },
  ];

  return (
    <div className="min-h-screen bg-[#0f1219]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF7A3D]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#1a1d2e]/50 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-[#FF7A3D]/10 text-[#FF7A3D] border-[#FF7A3D]/30 mb-6">
                <Sparkles className="w-3 h-3 mr-1" />
                Aries AI Courses
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Learn AI for Finance
                <span className="block text-[#FF7A3D]">From an Expert</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                25+ years of real-world finance experience, now applied to AI education for modern professionals.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-[#FF7A3D] hover:bg-[#FF7A3D]/90 text-white">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/20 bg-white/10">
                  View Profile
                </Button>
              </div>
            </motion.div>
            
            {/* Right: Instructor Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#FF7A3D]/20 via-transparent to-[#1a1d2e]/50 rounded-3xl blur-xl" />
                
                <Card className="relative bg-gradient-to-br from-[#1a1d2e] to-[#0f1219] border-white/10 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={edoardoPhoto} 
                        alt="Edoardo Grigione" 
                        className="w-full h-80 object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d2e] via-transparent to-transparent" />
                    </div>
                    
                    <div className="p-6 relative">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-white">Edoardo Grigione</h2>
                          <p className="text-[#FF7A3D]">AI & Finance Educator</p>
                        </div>
                        <Badge className="bg-[#FF7A3D] text-white">
                          <Award className="w-3 h-3 mr-1" />
                          Instructor
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className="flex items-center text-sm text-gray-400">
                          <MapPin className="w-4 h-4 mr-1" /> London
                        </span>
                        <span className="flex items-center text-sm text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" /> 25+ Years Experience
                        </span>
                        <span className="flex items-center text-sm text-gray-400">
                          <GraduationCap className="w-4 h-4 mr-1" /> University of Pavia
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <a 
                          href="https://www.linkedin.com/in/edoardogrigione/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Linkedin className="w-5 h-5 text-[#0077B5]" />
                        </a>
                        <a 
                          href="https://edogrigione.substack.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <BookOpen className="w-5 h-5 text-[#FF6719]" />
                        </a>
                        <a 
                          href="https://medium.com/@edogrigione" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <PenLine className="w-5 h-5 text-white" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <Badge className="bg-white/5 text-gray-300 border-white/10 mb-4">About the Instructor</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Bridging Finance & AI
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Edoardo Grigione is a seasoned finance professional and AI educator with over 25 years of experience 
              at the intersection of financial markets, technology, and innovation. Based in London, he brings a 
              unique perspective to AI education, combining deep expertise in asset management, private equity, 
              and emerging technologies.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed mt-4">
              His approach to teaching AI focuses on practical, real-world applications—particularly how artificial 
              intelligence is transforming banking, investment strategies, and the broader financial ecosystem.
            </p>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-[#1a1d2e]/80 to-[#0f1219] border-[#FF7A3D]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7A3D]/10 rounded-full blur-3xl" />
              <CardContent className="p-8 relative">
                <Quote className="w-10 h-10 text-[#FF7A3D]/30 mb-4" />
                <blockquote className="text-xl text-gray-300 italic mb-6 leading-relaxed">
                  "Edoardo is a solid professional, direct and undeniably effective, able to interpret the market 
                  and economic variables with uncommon objectivity. His approach is based on the combination of 
                  economic logic and common sense."
                </blockquote>
                <p className="text-gray-500">— LinkedIn Recommendation</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Areas of Expertise */}
      <section className="py-20 bg-[#1a1d2e]/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-[#FF7A3D]/10 text-[#FF7A3D] border-[#FF7A3D]/30 mb-4">Expertise</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Areas of Expertise</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {expertise.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-[#0f1219] border-white/5 hover:border-[#FF7A3D]/30 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-[#FF7A3D]/10 flex items-center justify-center mb-4 group-hover:bg-[#FF7A3D]/20 transition-colors">
                      <item.icon className="w-6 h-6 text-[#FF7A3D]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-white/5 text-gray-300 border-white/10 mb-4">Background</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Professional Journey</h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {careerHighlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-[#1a1d2e]/50 border-white/5 ${item.highlight ? 'border-[#FF7A3D]/30' : ''}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${item.highlight ? 'bg-[#FF7A3D]/20' : 'bg-white/5'}`}>
                        <item.icon className={`w-5 h-5 ${item.highlight ? 'text-[#FF7A3D]' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{item.role}</h3>
                          {item.highlight && (
                            <Badge className="bg-[#FF7A3D] text-white text-xs">Current</Badge>
                          )}
                        </div>
                        <p className="text-[#FF7A3D] text-sm">{item.company}</p>
                        {item.period && <p className="text-gray-500 text-sm">{item.period}</p>}
                        {item.detail && <p className="text-gray-400 text-sm mt-1">{item.detail}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="py-20 bg-gradient-to-b from-[#1a1d2e]/30 to-[#0f1219]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-[#FF7A3D]/10 text-[#FF7A3D] border-[#FF7A3D]/30 mb-4">Coming Soon</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Course Topics</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Practical, hands-on courses designed for finance professionals ready to master AI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {featuredTopics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-[#0f1219] border-white/5 hover:border-[#FF7A3D]/30 transition-all cursor-pointer group">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-[#FF7A3D]/10 group-hover:bg-[#FF7A3D]/20 transition-colors">
                      <topic.icon className="w-5 h-5 text-[#FF7A3D]" />
                    </div>
                    <span className="text-white font-medium">{topic.title}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Philosophy */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative">
              {/* Glow effect behind */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF7A3D]/30 via-[#FF7A3D]/10 to-transparent rounded-2xl blur-xl opacity-50" />
              
              <Card className="relative backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <Badge className="bg-white/10 text-[#FF7A3D] border border-[#FF7A3D]/30 mb-6 backdrop-blur-sm">
                    Teaching Philosophy
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                    AI Literacy is Essential for Today's Finance Professionals
                  </h2>
                  <p className="text-white/80 text-lg mb-8 leading-relaxed">
                    My courses bridge the gap between complex AI concepts and practical business applications, 
                    empowering students to leverage artificial intelligence in their daily work.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      'Understand how AI is reshaping the financial industry',
                      'Apply generative AI tools to enhance productivity',
                      'Navigate ethical and strategic implications of AI',
                      'Make data-driven decisions with confidence'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-[#FF7A3D] shrink-0" />
                        <span className="text-white/90">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1a1d2e]/50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Master AI in Finance?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join upcoming courses and stay updated on new educational content.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-[#FF7A3D] hover:bg-[#FF7A3D]/90 text-white">
                Get Notified
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <a 
                href="https://www.linkedin.com/in/edoardogrigione/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/20 bg-white/10">
                  <Linkedin className="mr-2 h-5 w-5" />
                  Connect on LinkedIn
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AriesAICourses;
