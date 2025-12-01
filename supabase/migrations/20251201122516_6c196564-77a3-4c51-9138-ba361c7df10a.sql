-- Create tables for ABC Company Console data management

-- Table for investor notes
CREATE TABLE public.abc_investor_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_name text NOT NULL,
  note_text text NOT NULL,
  created_by text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table for investor follow-ups
CREATE TABLE public.abc_investor_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_name text NOT NULL,
  follow_up_date date NOT NULL,
  follow_up_type text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'scheduled',
  created_by text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table for investor activities
CREATE TABLE public.abc_investor_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_name text NOT NULL,
  activity_type text NOT NULL,
  activity_description text NOT NULL,
  activity_date timestamp with time zone NOT NULL DEFAULT now(),
  created_by text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table for investor documents
CREATE TABLE public.abc_investor_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_name text NOT NULL,
  document_name text NOT NULL,
  document_type text NOT NULL,
  document_url text,
  uploaded_by text NOT NULL,
  uploaded_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.abc_investor_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abc_investor_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abc_investor_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abc_investor_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow authenticated users to manage all ABC data
CREATE POLICY "Authenticated users can manage notes"
  ON public.abc_investor_notes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage followups"
  ON public.abc_investor_followups
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage activities"
  ON public.abc_investor_activities
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage documents"
  ON public.abc_investor_documents
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_abc_notes_investor ON public.abc_investor_notes(investor_name);
CREATE INDEX idx_abc_followups_investor ON public.abc_investor_followups(investor_name);
CREATE INDEX idx_abc_followups_date ON public.abc_investor_followups(follow_up_date);
CREATE INDEX idx_abc_activities_investor ON public.abc_investor_activities(investor_name);
CREATE INDEX idx_abc_documents_investor ON public.abc_investor_documents(investor_name);

-- Add triggers for updated_at columns
CREATE TRIGGER update_abc_notes_updated_at
  BEFORE UPDATE ON public.abc_investor_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_abc_followups_updated_at
  BEFORE UPDATE ON public.abc_investor_followups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();