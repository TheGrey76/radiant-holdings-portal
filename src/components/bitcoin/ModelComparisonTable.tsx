import { motion } from 'framer-motion';
import { BarChart3, Loader2 } from 'lucide-react';
import { AllocationModel } from '@/hooks/useBitcoinAllocationModels';

interface ModelComparisonTableProps {
  models: AllocationModel[];
  loading: boolean;
}

const colorClasses = {
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  orange: 'text-orange-400',
};

const regimeBadgeClasses = {
  emerald: 'bg-emerald-400/20 text-emerald-400',
  amber: 'bg-amber-400/20 text-amber-400',
  orange: 'bg-orange-400/20 text-orange-400',
};

export function ModelComparisonTable({ models, loading }: ModelComparisonTableProps) {
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
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
          <BarChart3 className="w-7 h-7 text-primary-foreground" />
        </div>
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Chapter XXI</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Model Comparison Table</h2>
        </div>
      </div>

      {/* Comparison Table */}
      <motion.div 
        className="overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-primary/30">
              <th className="text-left py-4 px-4 text-sm font-bold text-foreground">Metric</th>
              {models.map((model) => (
                <th 
                  key={model.id} 
                  className={`text-center py-4 px-4 text-sm font-bold ${colorClasses[model.color_theme as keyof typeof colorClasses] || 'text-foreground'}`}
                >
                  {model.display_name.replace(' Model', '')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {/* Current Allocation */}
            <tr className="hover:bg-muted/30 transition-colors">
              <td className="py-4 px-4 text-sm text-foreground font-medium">Current Allocation (%)</td>
              {models.map((model) => (
                <td 
                  key={model.id} 
                  className={`py-4 px-4 text-center text-sm font-semibold ${colorClasses[model.color_theme as keyof typeof colorClasses] || 'text-foreground'}`}
                >
                  {model.current_allocation}%
                </td>
              ))}
            </tr>

            {/* Historical Range */}
            <tr className="hover:bg-muted/30 transition-colors">
              <td className="py-4 px-4 text-sm text-foreground font-medium">Historical Range</td>
              {models.map((model) => (
                <td key={model.id} className="py-4 px-4 text-center text-sm text-muted-foreground">
                  {model.allocation_min}% – {model.allocation_max}%
                </td>
              ))}
            </tr>

            {/* Distance from Mean */}
            <tr className="hover:bg-muted/30 transition-colors">
              <td className="py-4 px-4 text-sm text-foreground font-medium">Distance from Mean</td>
              {models.map((model) => (
                <td key={model.id} className="py-4 px-4 text-center text-sm text-muted-foreground">
                  {model.distance_from_mean || 'At mean'}
                </td>
              ))}
            </tr>

            {/* Current Regime */}
            <tr className="hover:bg-muted/30 transition-colors">
              <td className="py-4 px-4 text-sm text-foreground font-medium">Current Regime</td>
              {models.map((model) => (
                <td key={model.id} className="py-4 px-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${regimeBadgeClasses[model.color_theme as keyof typeof regimeBadgeClasses] || 'bg-muted text-foreground'}`}>
                    {model.current_regime}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </motion.div>

      <p className="text-sm text-muted-foreground mt-4">
        This comparison reflects the current quarter's model state. Historical ranges are based on backtested data since 2017. Distance from mean uses standard deviation (σ) from long-term average allocation.
      </p>
    </div>
  );
}
