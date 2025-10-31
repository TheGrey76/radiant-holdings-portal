-- Create network_profiles table to replace localStorage
CREATE TABLE public.network_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  account_type text NOT NULL CHECK (account_type IN ('investor', 'startup')),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  sector text,
  
  -- Investor specific fields
  investment_range text,
  investment_stage text,
  portfolio_size text,
  geographic_focus text,
  
  -- Startup specific fields
  funding_stage text,
  funding_amount text,
  revenue text,
  team_size text,
  website text,
  pitch_deck text,
  
  -- Common fields
  linkedin text,
  description text,
  avatar_url text,
  profile_complete boolean DEFAULT false,
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.network_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all network profiles (public directory)
CREATE POLICY "Anyone can view network profiles"
ON public.network_profiles
FOR SELECT
USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can create their own profile"
ON public.network_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.network_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
ON public.network_profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_network_profiles_updated_at
BEFORE UPDATE ON public.network_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();