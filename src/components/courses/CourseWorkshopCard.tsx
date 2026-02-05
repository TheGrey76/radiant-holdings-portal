import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, Clock, Users } from 'lucide-react';

interface CourseWorkshopCardProps {
  workshop: {
    number: number;
    title: string;
    icon: LucideIcon;
    problem: string;
    solution: string;
    session1: string;
    session2: string;
  };
  index: number;
}

const CourseWorkshopCard = ({ workshop, index }: CourseWorkshopCardProps) => {
  const Icon = workshop.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full bg-gradient-to-br from-[#1a1d2e] to-[#0f1219] border-white/10 hover:border-[#FF7A3D]/30 transition-all duration-300 group overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#FF7A3D]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FF7A3D]/20 transition-colors">
                <Icon className="w-7 h-7 text-[#FF7A3D]" />
              </div>
              <div className="flex-1 min-w-0">
                <Badge className="bg-white/5 text-gray-400 border-white/10 mb-2">
                  Workshop {workshop.number}
                </Badge>
                <h3 className="text-lg font-bold text-white leading-tight">{workshop.title}</h3>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Problem */}
            <div>
              <p className="text-xs uppercase tracking-wider text-[#FF7A3D] font-semibold mb-1">The Problem</p>
              <p className="text-gray-400 text-sm leading-relaxed">{workshop.problem}</p>
            </div>
            
            {/* Solution */}
            <div>
              <p className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">The AI Solution</p>
              <p className="text-gray-300 text-sm leading-relaxed">{workshop.solution}</p>
            </div>
            
            {/* Sessions */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Session 1 (09:00-10:30)</p>
                  <p className="text-sm text-white/80">{workshop.session1}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Session 2 (11:00-12:30)</p>
                  <p className="text-sm text-white/80">{workshop.session2}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CourseWorkshopCard;
