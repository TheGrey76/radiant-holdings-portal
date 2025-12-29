import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface ReportCalloutProps {
  title?: string;
  content: string;
  variant?: 'default' | 'highlight' | 'warning' | 'success';
  icon?: 'lightbulb' | 'alert' | 'info' | 'check';
}

const variantStyles = {
  default: {
    container: 'bg-muted/30 border-border/50',
    icon: 'text-muted-foreground',
    title: 'text-foreground',
  },
  highlight: {
    container: 'bg-primary/10 border-primary/30',
    icon: 'text-primary',
    title: 'text-primary',
  },
  warning: {
    container: 'bg-yellow-500/10 border-yellow-500/30',
    icon: 'text-yellow-500',
    title: 'text-yellow-500',
  },
  success: {
    container: 'bg-green-500/10 border-green-500/30',
    icon: 'text-green-500',
    title: 'text-green-500',
  },
};

const icons = {
  lightbulb: Lightbulb,
  alert: AlertTriangle,
  info: Info,
  check: CheckCircle,
};

export const ReportCallout = ({ 
  title, 
  content, 
  variant = 'default',
  icon = 'lightbulb'
}: ReportCalloutProps) => {
  const styles = variantStyles[variant];
  const IconComponent = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl border p-6 ${styles.container}`}
    >
      <div className="flex gap-4">
        <div className={`flex-shrink-0 ${styles.icon}`}>
          <IconComponent className="w-6 h-6" />
        </div>
        <div>
          {title && (
            <h4 className={`font-semibold mb-2 ${styles.title}`}>
              {title}
            </h4>
          )}
          <p className="text-muted-foreground leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
