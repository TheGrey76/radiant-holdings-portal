import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ReportCalloutProps {
  title?: string;
  content?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  items?: string[];
}

const variantStyles = {
  info: {
    container: 'bg-blue-500/10 border-blue-500/30',
    icon: Info,
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-300',
  },
  success: {
    container: 'bg-emerald-500/10 border-emerald-500/30',
    icon: CheckCircle,
    iconColor: 'text-emerald-400',
    titleColor: 'text-emerald-300',
  },
  warning: {
    container: 'bg-amber-500/10 border-amber-500/30',
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    titleColor: 'text-amber-300',
  },
  error: {
    container: 'bg-red-500/10 border-red-500/30',
    icon: AlertCircle,
    iconColor: 'text-red-400',
    titleColor: 'text-red-300',
  },
};

const ReportCallout = ({ 
  title = 'Key Takeaway', 
  content, 
  variant = 'info',
  items 
}: ReportCalloutProps) => {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <div className={cn(
      'rounded-xl border p-6 my-6',
      styles.container
    )}>
      <div className="flex items-start gap-4">
        <div className={cn('mt-0.5', styles.iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          {title && (
            <h4 className={cn('font-semibold mb-2', styles.titleColor)}>
              {title}
            </h4>
          )}
          {content && (
            <p className="text-zinc-300 text-sm leading-relaxed">
              {content}
            </p>
          )}
          {items && items.length > 0 && (
            <ul className="mt-3 space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-zinc-300 text-sm">
                  <span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0', styles.iconColor.replace('text-', 'bg-'))} />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCallout;
