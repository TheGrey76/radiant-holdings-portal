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
  Target
} from 'lucide-react';
import CourseWorkshopCard from './CourseWorkshopCard';

const workshops = [
  {
    number: 1,
    title: 'AI for the Innovation Process',
    icon: Lightbulb,
    problem: 'Traditional innovation processes are slow, expensive, and high-risk. Managers struggle to identify the most promising ideas and allocate resources efficiently.',
    solution: 'Use AI to analyze market trends, customer feedback, and patents to identify non-obvious opportunities and predict the success potential of initiatives.',
    session1: 'From Idea to Insight – AI as a discovery engine',
    session2: 'Workshop: AI-Powered Idea Validation',
  },
  {
    number: 2,
    title: 'AI for Supply Chain Optimization',
    icon: Truck,
    problem: 'Lack of real-time visibility, logistical inefficiencies, and vulnerability to unexpected supply chain disruptions.',
    solution: 'Implement predictive models for demand, optimize logistics routes in real-time, and anticipate disruption risks to create a resilient supply chain.',
    session1: 'The Intelligent Supply Chain – demand forecasting',
    session2: 'Workshop: Supply Chain Risk Simulation',
  },
  {
    number: 3,
    title: 'AI for Business Strategy',
    icon: Globe,
    problem: 'Expansion into new markets and M&A operations are complex and full of uncertainties. Managers need more powerful tools to assess market attractiveness.',
    solution: 'Leverage AI to analyze macroeconomic data for market selection, conduct faster due diligence on M&A targets, and identify integration synergies.',
    session1: 'Data-Driven Growth Strategies – competitive analysis',
    session2: 'Workshop: AI-Powered M&A Target Screening',
  },
  {
    number: 4,
    title: 'AI for Accelerating Capital Raising',
    icon: Coins,
    problem: 'The capital raising process is long, competitive, and often inefficient. Managers struggle to identify the right investors and prepare compelling documentation.',
    solution: 'Use AI for investor matching, build robust financial projections, and automate due diligence documentation preparation.',
    session1: 'Intelligent Fundraising – investor targeting',
    session2: 'Workshop: AI-Powered Pitch Deck Analysis',
  },
  {
    number: 5,
    title: 'AI-Powered Leadership & Change',
    icon: Users2,
    problem: 'AI creates new managerial challenges: leading hybrid human-machine teams, managing resistance to change, and developing a data-driven culture.',
    solution: 'Frameworks to redesign roles and processes, manage the ethical impact of AI, and develop leadership competencies for digital transformation.',
    session1: 'Guiding the Transformation – ethics & responsibility',
    session2: 'Workshop: Change Management Role-Play',
  },
  {
    number: 6,
    title: 'Practical Lab – Build Your AI Solution',
    icon: Wrench,
    problem: 'There is a significant gap between theoretical understanding of AI and the ability to implement a practical solution. Managers lack confidence to launch a pilot project.',
    solution: 'Guide participants in using no-code/low-code AI tools to build a working prototype that addresses real business challenges.',
    session1: 'From Problem to Prototype',
    session2: 'Hands-on building with no-code platforms',
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
          className="text-center mb-12"
        >
          <Badge className="bg-[#FF7A3D]/10 text-[#FF7A3D] border-[#FF7A3D]/30 mb-4">
            Explore Courses
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            AI for Strategic Growth & Capital Raising
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            A series of 6 intensive morning workshops for mid-level managers, combining 25+ years of experience 
            in international capital raising, private equity, and M&A with cutting-edge AI applications.
          </p>
        </motion.div>

        {/* Course Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12"
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#FF7A3D]/10">
                <Clock className="w-5 h-5 text-[#FF7A3D]" />
              </div>
              <div>
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
              <div>
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
              <div>
                <p className="text-white font-medium">Mid-Level Managers</p>
                <p className="text-gray-500 text-sm">5-15 years experience</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Workshop Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {workshops.map((workshop, index) => (
            <CourseWorkshopCard key={workshop.number} workshop={workshop} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
