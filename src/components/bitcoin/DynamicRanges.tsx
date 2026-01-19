import { motion } from 'framer-motion';
import { TrendingUp, Loader2 } from 'lucide-react';
import { AllocationModel } from '@/hooks/useBitcoinAllocationModels';

interface DynamicRangesProps {
  models: AllocationModel[];
  loading: boolean;
}

const colorClasses = {
  emerald: {
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
  },
  amber: {
    border: 'border-amber-500/30',
    text: 'text-amber-400',
  },
  orange: {
    border: 'border-orange-500/30',
    text: 'text-orange-400',
  },
};

const formatPrice = (price: number | null) => {
  if (!price) return '—';
  return `$${price.toLocaleString('en-US')}`;
};

export function DynamicRanges({ models, loading }: DynamicRangesProps) {
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
          <TrendingUp className="w-7 h-7 text-white" />
        </div>
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider">Chapter XXII</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Bitcoin 2026 – Scenario-Consistent Ranges</h2>
        </div>
      </div>

      <p className="text-foreground/80 leading-relaxed mb-8">
        The following ranges represent scenario-consistent price zones for each model. These are not predictions—they are reference levels derived from the model's internal logic, updated quarterly to maintain alignment with realized market conditions and macro-liquidity dynamics.
      </p>

      {/* Target Ranges Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {models.map((model, index) => {
          const colors = colorClasses[model.color_theme as keyof typeof colorClasses] || colorClasses.amber;
          
          return (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl bg-card border-2 ${colors.border}`}
            >
              <h4 className={`text-lg font-bold ${colors.text} mb-4`}>{model.display_name}</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Target Range</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatPrice(model.target_range_low)} – {formatPrice(model.target_range_high)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Stress Floor</p>
                  <p className="text-lg font-semibold text-muted-foreground">
                    {formatPrice(model.stress_floor)}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 p-6 rounded-xl bg-muted/30 border border-border/40">
        <h4 className="text-sm font-bold text-foreground mb-3">How targets update</h4>
        <p className="text-sm text-foreground/70 leading-relaxed">
          Target ranges recalibrate each quarter based on realized volatility, macro-liquidity conditions, and regime classification. The model does not chase momentum or react to news—it maintains systematic consistency across market cycles.
        </p>
      </div>
    </div>
  );
}
