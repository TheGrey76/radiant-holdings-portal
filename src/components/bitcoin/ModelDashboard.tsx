import { motion } from 'framer-motion';
import { Target, Loader2 } from 'lucide-react';
import { AllocationModel } from '@/hooks/useBitcoinAllocationModels';
import { format } from 'date-fns';

interface ModelDashboardProps {
  models: AllocationModel[];
  quarter: string;
  lastUpdate: Date | null;
  loading: boolean;
}

const colorClasses = {
  emerald: {
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    textMuted: 'text-emerald-400/70',
    borderDivider: 'border-emerald-500/20',
    badge: 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30',
  },
  amber: {
    gradient: 'from-amber-500/10 to-amber-500/5',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    textMuted: 'text-amber-400/70',
    borderDivider: 'border-amber-500/20',
    badge: 'bg-amber-400/20 text-amber-400 border-amber-400/30',
  },
  orange: {
    gradient: 'from-orange-500/10 to-orange-500/5',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    textMuted: 'text-orange-400/70',
    borderDivider: 'border-orange-500/20',
    badge: 'bg-orange-400/20 text-orange-400 border-orange-400/30',
  },
};

export function ModelDashboard({ models, quarter, lastUpdate, loading }: ModelDashboardProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-amber-500 flex items-center justify-center shadow-lg">
          <Target className="w-7 h-7 text-white" />
        </div>
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider">Chapter XX</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Model Dashboard – {quarter}</h2>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="px-4 py-2 rounded-lg bg-muted/50 border border-border/40">
          <span className="text-xs text-muted-foreground">Last update:</span>
          <span className="ml-2 text-sm font-medium text-foreground">
            {lastUpdate ? format(lastUpdate, 'MMMM d, yyyy') : 'Loading...'}
          </span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-muted/50 border border-border/40">
          <span className="text-xs text-muted-foreground">Update frequency:</span>
          <span className="ml-2 text-sm font-medium text-foreground">Quarterly</span>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {models.map((model, index) => {
          const colors = colorClasses[model.color_theme as keyof typeof colorClasses] || colorClasses.amber;
          
          return (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl bg-gradient-to-br ${colors.gradient} border-2 ${colors.border}`}
            >
              <h4 className="text-lg font-bold text-foreground mb-2">{model.display_name}</h4>
              <p className="text-sm text-muted-foreground mb-4">{model.description}</p>
              <div className={`text-4xl font-bold ${colors.text} mb-2`}>{model.current_allocation}%</div>
              <p className={`text-xs ${colors.textMuted}`}>Current allocation</p>
              <div className={`mt-4 pt-4 border-t ${colors.borderDivider}`}>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.badge} border`}>
                  {model.exposure_level} Exposure
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
