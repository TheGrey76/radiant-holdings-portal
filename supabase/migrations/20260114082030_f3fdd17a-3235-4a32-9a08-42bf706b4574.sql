-- Table for follow-up sequences
CREATE TABLE public.abc_followup_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL DEFAULT 'no_open',
  trigger_days INTEGER NOT NULL DEFAULT 3,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  enrolled_count INTEGER NOT NULL DEFAULT 0,
  completed_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for sequence enrollments
CREATE TABLE public.abc_sequence_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_id UUID REFERENCES public.abc_investors(id) ON DELETE CASCADE,
  investor_name TEXT NOT NULL,
  investor_email TEXT NOT NULL,
  sequence_id UUID REFERENCES public.abc_followup_sequences(id) ON DELETE CASCADE,
  current_step INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  next_email_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.abc_followup_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abc_sequence_enrollments ENABLE ROW LEVEL SECURITY;

-- Policies for sequences
CREATE POLICY "Authenticated users can view sequences"
ON public.abc_followup_sequences FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create sequences"
ON public.abc_followup_sequences FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sequences"
ON public.abc_followup_sequences FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete sequences"
ON public.abc_followup_sequences FOR DELETE
USING (auth.role() = 'authenticated');

-- Policies for enrollments
CREATE POLICY "Authenticated users can view enrollments"
ON public.abc_sequence_enrollments FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create enrollments"
ON public.abc_sequence_enrollments FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update enrollments"
ON public.abc_sequence_enrollments FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete enrollments"
ON public.abc_sequence_enrollments FOR DELETE
USING (auth.role() = 'authenticated');

-- Add index for faster querying
CREATE INDEX idx_sequence_enrollments_status ON public.abc_sequence_enrollments(status);
CREATE INDEX idx_sequence_enrollments_next_email ON public.abc_sequence_enrollments(next_email_date);
CREATE INDEX idx_sequence_enrollments_investor ON public.abc_sequence_enrollments(investor_id);