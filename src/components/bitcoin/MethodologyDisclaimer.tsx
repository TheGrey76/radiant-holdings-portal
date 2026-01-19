import { motion } from 'framer-motion';

export function MethodologyDisclaimer() {
  return (
    <motion.div 
      className="mt-24 p-10 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border-2 border-border/60"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
        Methodology & Disclaimers
      </h2>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3">Nature of the Models</h4>
          <p className="text-sm text-foreground/70 leading-relaxed">
            The Bitcoin Dynamic Allocation Models are standardized, rules-based frameworks. They do not adapt to individual circumstances, risk tolerances, or investment objectives. Each model operates on identical input data but applies different threshold parameters consistent with its stated risk profile.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3">No Personalization</h4>
          <p className="text-sm text-foreground/70 leading-relaxed">
            This is not financial advice. The models do not know who you are, what your portfolio looks like, or what your goals are. They provide a reference framework—a systematic lens through which to observe Bitcoin allocation dynamics. How you use this information is entirely your responsibility.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3">Role of AI</h4>
          <p className="text-sm text-foreground/70 leading-relaxed">
            AI systems assist in data processing, model recalibration, and commentary generation. They do not make investment decisions. The AI maintains consistency in the framework's logic and ensures timely updates—nothing more.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3">User Responsibility</h4>
          <p className="text-sm text-foreground/70 leading-relaxed">
            By accessing this content, you acknowledge that you are solely responsible for any investment decisions you make. The models are observational tools, not trading signals. Past performance of any backtested or simulated model does not guarantee future results. Bitcoin is a highly volatile asset that may lose significant value.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
