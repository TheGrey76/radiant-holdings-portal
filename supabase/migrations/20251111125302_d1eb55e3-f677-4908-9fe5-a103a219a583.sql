-- Create assessment_bookings table
CREATE TABLE public.assessment_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  client_type TEXT NOT NULL,
  fundraising_target TEXT NOT NULL,
  timeline TEXT NOT NULL,
  materials TEXT,
  key_metrics TEXT,
  lp_preferences TEXT,
  contact_name TEXT NOT NULL,
  contact_role TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);

-- Enable RLS
ALTER TABLE public.assessment_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all assessment bookings"
  ON public.assessment_bookings
  FOR SELECT
  USING (get_current_user_role() = 'admin');

CREATE POLICY "Anyone can submit assessment bookings"
  ON public.assessment_bookings
  FOR INSERT
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_assessment_bookings_updated_at
  BEFORE UPDATE ON public.assessment_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();