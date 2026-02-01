import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Unlock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailGateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  source: 'unlock_gate' | 'dca_strategy' | 'mini_scan_cta' | 'sticky_banner';
  title?: string;
  description?: string;
}

export const EmailGateModal: React.FC<EmailGateModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  source,
  title = 'Unlock Premium Insights',
  description = 'Enter your email to access exclusive AI-powered analysis and recommendations.',
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('portfolio-email-capture', {
        body: {
          email,
          source,
          sendWelcome: true,
        },
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success('Access granted!');
      
      // Wait a moment to show success state, then close
      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
        setIsSuccess(false);
        setEmail('');
      }, 1500);
    } catch (err: any) {
      console.error('Email capture error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Unlock className="h-5 w-5 text-primary" />
                {title}
              </DialogTitle>
              <DialogDescription>
                {description}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-orange-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    Unlock Access
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Access Granted!</h3>
            <p className="text-muted-foreground text-sm">
              You now have access to all insights.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailGateModal;
