import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Lightbulb, 
  Truck, 
  Globe, 
  Coins, 
  Users2, 
  Wrench,
  Clock,
  Calendar,
  Target,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const workshops = [
  {
    number: 1,
    title: 'AI for the Innovation Process',
    subtitle: 'From Idea to Insight',
    icon: Lightbulb,
    problem: 'Traditional innovation processes are slow, expensive, and high-risk. Managers struggle to identify the most promising ideas, validate them quickly, and allocate resources efficiently, resulting in low ROI on innovation initiatives.',
    solution: 'Use AI to analyze large volumes of data (market trends, customer feedback, patents) to identify non-obvious opportunities, automate validation tests, and predict the success potential of an initiative.',
    takeaways: ['Ability to use AI tools for rapid idea validation', 'Framework for data-driven innovation prioritization', 'Reduced time-to-insight by up to 70%'],
    session1: {
      title: 'From Idea to Insight',
      points: ['Analysis of traditional innovation failures', 'AI as a discovery engine: using data to find hidden opportunities', 'Case Study: How Netflix uses AI to guide content creation']
    },
    session2: {
      title: 'Rapid Validation and De-Risking',
      points: ['Practical Workshop: "AI-Powered Idea Validation"', 'Participants will use AI tools to analyze a business idea and assess its potential']
    },
    caseStudy: 'Netflix'
  },
  {
    number: 2,
    title: 'AI for Supply Chain Optimization',
    subtitle: 'The Intelligent Supply Chain',
    icon: Truck,
    problem: 'Lack of real-time visibility, logistical inefficiencies, and vulnerability to unexpected supply chain disruptions. Managers struggle with inaccurate demand forecasts, high transportation costs, and suboptimal inventory management.',
    solution: 'Implement predictive models for demand, optimize logistics routes in real-time, monitor goods conditions, and anticipate disruption risks to create a resilient and proactive supply chain.',
    takeaways: ['Predictive demand forecasting capabilities', 'Real-time risk monitoring strategies', 'Cost reduction through AI-optimized logistics'],
    session1: {
      title: 'The Intelligent Supply Chain',
      points: ['Weaknesses of traditional supply chains', 'AI for demand forecasting and inventory optimization', 'Case Study: Ocado\'s autonomous supply chain']
    },
    session2: {
      title: 'Resilience and Visibility',
      points: ['Practical Workshop: "Supply Chain Risk Simulation"', 'Simulation of a supply shock and use of AI tools to find real-time solutions']
    },
    caseStudy: 'Ocado'
  },
  {
    number: 3,
    title: 'AI for Business Strategy',
    subtitle: 'Internationalization and Aggregation',
    icon: Globe,
    problem: 'Expansion into new markets and M&A operations are complex and full of uncertainties. Managers need more powerful tools to assess market attractiveness, identify the right acquisition targets, and manage post-merger integration.',
    solution: 'Leverage AI to analyze macroeconomic and industry data for market selection, conduct faster and more thorough due diligence on M&A targets, and identify integration synergies and risks.',
    takeaways: ['AI-powered market intelligence skills', 'Accelerated due diligence methodology', 'Data-driven M&A target screening'],
    session1: {
      title: 'Data-Driven Growth Strategies',
      points: ['Limitations of traditional market analysis', 'AI for competitive analysis and market intelligence', 'Case Study: How Private Equity firms use AI for due diligence']
    },
    session2: {
      title: 'M&A and Integration',
      points: ['Practical Workshop: "AI-Powered M&A Target Screening"', 'Participants will use a tool to analyze and classify potential acquisition targets']
    },
    caseStudy: 'Private Equity'
  },
  {
    number: 4,
    title: 'AI for Accelerating Capital Raising',
    subtitle: 'Intelligent Fundraising',
    icon: Coins,
    problem: 'The capital raising process is long, competitive, and often inefficient. Managers and entrepreneurs struggle to identify the right investors, prepare data-driven compelling documentation, and manage the due diligence process quickly.',
    solution: 'Use AI to identify and qualify potential investors (investor matching), analyze company data to build more robust financial projections, and automate due diligence documentation preparation.',
    takeaways: ['AI-driven investor targeting techniques', 'Automated pitch deck optimization', 'Faster due diligence preparation'],
    session1: {
      title: 'Intelligent Fundraising',
      points: ['Inefficiencies of traditional fundraising', 'AI for investor targeting and pitch preparation', 'Case Study: The evolution of capital raising platforms']
    },
    session2: {
      title: 'Due Diligence and Negotiation',
      points: ['Practical Workshop: "AI-Powered Pitch Deck Analysis"', 'Participants will analyze a pitch deck with AI tools to identify strengths and weaknesses']
    },
    caseStudy: 'Capital Raising Platforms'
  },
  {
    number: 5,
    title: 'AI-Powered Leadership & Change Management',
    subtitle: 'Guiding the Transformation',
    icon: Users2,
    problem: 'The introduction of AI creates new managerial challenges: how to lead hybrid human-machine teams, how to manage fears and resistance to change, and how to develop a corporate culture that embraces data-driven innovation.',
    solution: 'Provide managers with frameworks to redesign roles and processes, manage the ethical and social impact of AI, and develop the leadership competencies necessary to guide digital transformation.',
    takeaways: ['Hybrid team leadership frameworks', 'Change management playbook for AI adoption', 'Ethical AI governance guidelines'],
    session1: {
      title: 'Guiding the Transformation',
      points: ['The human challenges of AI', 'Framework for change management and skills reskilling', 'Discussion: Ethics and responsibility in the age of AI']
    },
    session2: {
      title: 'The Culture of Innovation',
      points: ['Practical Workshop: "Change Management Role-Play"', 'Simulation of a difficult conversation with a team resistant to change']
    },
    caseStudy: 'Leadership'
  },
  {
    number: 6,
    title: 'Practical Lab – Build Your AI Solution',
    subtitle: 'From Problem to Prototype',
    icon: Wrench,
    problem: 'There is a significant gap between theoretical understanding of AI and the ability to implement a practical solution. Managers lack the confidence and practical experience to launch a pilot project.',
    solution: 'Guide participants, step by step, in using no-code/low-code AI tools to build a working prototype that addresses one of the challenges discussed in previous modules, transforming knowledge into applied competency.',
    takeaways: ['Working AI prototype for your business', 'No-code/low-code implementation skills', 'Confidence to launch AI pilot projects'],
    session1: {
      title: 'From Problem to Prototype',
      points: ['Work individually or in small groups', 'Build an AI prototype that addresses real challenges', 'Using no-code platforms for rapid development']
    },
    session2: {
      title: 'Hands-On Building',
      points: ['Supervised prototype development', 'Feedback and iteration', 'Final presentations']
    },
    caseStudy: 'Hands-On'
  },
];

const CoursesSection = () => {
  return (
    <section className="py-20" id="courses">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-[#FF7A3D]/10 text-[#FF7A3D] border-[#FF7A3D]/30 mb-4">
            Explore Courses
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            AI for Strategic Growth & Capital Raising
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            A series of 6 intensive morning workshops for mid-level managers, combining 25+ years of experience 
            in international capital raising, private equity, and M&A with cutting-edge AI applications.
          </p>

          {/* Course Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#FF7A3D]/10">
                  <Clock className="w-5 h-5 text-[#FF7A3D]" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Half-Day Format</p>
                  <p className="text-gray-500 text-sm">9:00 AM - 1:00 PM</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#FF7A3D]/10">
                  <Calendar className="w-5 h-5 text-[#FF7A3D]" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">6 Workshops</p>
                  <p className="text-gray-500 text-sm">Intensive Program</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#FF7A3D]/10">
                  <Target className="w-5 h-5 text-[#FF7A3D]" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Mid-Level Managers</p>
                  <p className="text-gray-500 text-sm">5-15 years experience</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Individual Workshop Sections */}
        <div className="space-y-16 md:space-y-24 max-w-6xl mx-auto">
          {workshops.map((workshop, index) => {
            const Icon = workshop.icon;
            
            return (
              <motion.div
                key={workshop.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {/* Workshop Number Badge - Hidden on mobile */}
                <div className="hidden md:block absolute -top-8 right-0 text-[140px] lg:text-[180px] font-bold text-white/[0.03] leading-none select-none pointer-events-none">
                  0{workshop.number}
                </div>

                {/* Header - Always at top on mobile */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#FF7A3D] to-[#FF7A3D]/70 flex items-center justify-center shadow-lg shadow-[#FF7A3D]/20 shrink-0">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-white/10 text-gray-300 border-white/20 mb-1">
                      Workshop {workshop.number}
                    </Badge>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{workshop.title}</h3>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-[#FF7A3D] font-medium mb-6">{workshop.subtitle}</p>

                {/* Content Grid - Stack on mobile */}
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
                  {/* Problem & Solution - First on mobile */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 sm:p-5">
                      <p className="text-xs uppercase tracking-wider text-red-400 font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                        The Problem
                      </p>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{workshop.problem}</p>
                    </div>
                    
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 sm:p-5">
                      <p className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        The AI Solution
                      </p>
                      <p className="text-sm sm:text-base text-gray-200 leading-relaxed">{workshop.solution}</p>
                    </div>
                  </div>

                  {/* Sessions Card - Second on mobile */}
                  <Card className="bg-[#1a1d2e]/80 border-white/10 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                      {/* Session 1 */}
                      <div className="p-4 sm:p-6 border-b border-white/5">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="px-2.5 sm:px-3 py-1 bg-[#FF7A3D]/10 rounded-full">
                            <span className="text-xs font-medium text-[#FF7A3D]">09:00 - 10:30</span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500">Session 1</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">{workshop.session1.title}</h4>
                        <ul className="space-y-2">
                          {workshop.session1.points.map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-400">
                              <CheckCircle2 className="w-4 h-4 text-[#FF7A3D] mt-0.5 shrink-0" />
                              <span className="text-xs sm:text-sm">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Coffee Break */}
                      <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/[0.02] border-b border-white/5">
                        <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                          <span className="text-xs">☕</span>
                          <span>10:30 - 11:00 Coffee Break & Networking</span>
                        </div>
                      </div>

                      {/* Session 2 */}
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="px-2.5 sm:px-3 py-1 bg-[#FF7A3D]/10 rounded-full">
                            <span className="text-xs font-medium text-[#FF7A3D]">11:00 - 12:30</span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500">Session 2</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">{workshop.session2.title}</h4>
                        <ul className="space-y-2">
                          {workshop.session2.points.map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-400">
                              <ArrowRight className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                              <span className="text-xs sm:text-sm">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Q&A */}
                      <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/[0.02]">
                        <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                          <span className="text-xs">💬</span>
                          <span>12:30 - 13:00 Q&A & Wrap-up</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Divider */}
                {index < workshops.length - 1 && (
                  <div className="mt-12 md:mt-24 flex items-center justify-center">
                    <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
