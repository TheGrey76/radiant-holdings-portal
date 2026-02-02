-- Create portfolio tier enum
CREATE TYPE portfolio_tier AS ENUM ('essentials', 'professional', 'enterprise');

-- Create portfolio subscriptions table
CREATE TABLE public.portfolio_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  tier portfolio_tier NOT NULL,
  stripe_payment_id TEXT,
  stripe_customer_id TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tier)
);

-- Enable RLS
ALTER TABLE public.portfolio_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
ON public.portfolio_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Service role can manage all subscriptions (for webhooks/edge functions)
CREATE POLICY "Service role can manage subscriptions"
ON public.portfolio_subscriptions
FOR ALL
USING (auth.role() = 'service_role');

-- Create function to check portfolio tier access
CREATE OR REPLACE FUNCTION public.check_portfolio_tier(p_user_id UUID, p_tier portfolio_tier)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.portfolio_subscriptions
    WHERE user_id = p_user_id
      AND tier = p_tier
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
  )
$$;

-- Create function to get user's active tiers
CREATE OR REPLACE FUNCTION public.get_user_portfolio_tiers(p_user_id UUID)
RETURNS SETOF portfolio_tier
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tier
  FROM public.portfolio_subscriptions
  WHERE user_id = p_user_id
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
$$;

-- Add index for faster lookups
CREATE INDEX idx_portfolio_subscriptions_user_tier 
ON public.portfolio_subscriptions(user_id, tier, is_active);

CREATE INDEX idx_portfolio_subscriptions_email 
ON public.portfolio_subscriptions(email);