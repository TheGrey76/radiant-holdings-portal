import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, CreditCard, Shield, Check } from 'lucide-react';

interface ReportPaywallProps {
  title: string;
  price: number;
  features?: string[];
  onPurchase: (email: string) => Promise<void>;
  isLoading?: boolean;
}

const ReportPaywall = ({
  title,
  price,
  features = [
    'Lifetime access to full report',
    'All interactive charts and data',
    'Future updates included',
    'PDF download available',
  ],
  onPurchase,
  isLoading = false,
}: ReportPaywallProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await onPurchase(email);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden"
    >
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      
      <div className="p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Unlock Full Access
          </h3>
          <p className="text-zinc-400">
            Get complete access to <span className="text-white font-medium">{title}</span>
          </p>
        </div>

        {/* Price */}
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-white mb-1">
            €{price.toFixed(0)}
          </div>
          <p className="text-zinc-500 text-sm">One-time payment</p>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-zinc-300">
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Purchase Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-zinc-400 text-sm">
              Email for delivery
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                required
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold h-12"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Pay with Card
              </span>
            )}
          </Button>
        </form>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
            <Shield className="w-4 h-4" />
            Secure Payment
          </div>
          <div className="text-zinc-700">•</div>
          <div className="text-zinc-500 text-xs">
            Powered by Stripe
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportPaywall;
