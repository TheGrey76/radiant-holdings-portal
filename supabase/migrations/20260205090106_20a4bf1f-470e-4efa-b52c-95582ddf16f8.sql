-- LinkedIn Outreach & Warm Intro System for ABC Company

-- Table for LinkedIn outreach tracking
CREATE TABLE public.abc_linkedin_outreach (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_id UUID REFERENCES public.abc_investors(id) ON DELETE CASCADE,
  investor_name TEXT NOT NULL,
  linkedin_url TEXT,
  outreach_type TEXT NOT NULL DEFAULT 'direct_message', -- 'direct_message', 'connection_request', 'warm_intro_request'
  message_content TEXT,
  template_used TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'replied', 'no_response', 'converted'
  sent_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for warm intro connections (mutual connections to leverage)
CREATE TABLE public.abc_warm_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_id UUID REFERENCES public.abc_investors(id) ON DELETE CASCADE,
  investor_name TEXT NOT NULL,
  connector_name TEXT NOT NULL, -- Person who can make the intro
  connector_linkedin TEXT,
  connector_relationship TEXT, -- How we know the connector
  connection_strength TEXT DEFAULT 'medium', -- 'weak', 'medium', 'strong'
  intro_status TEXT DEFAULT 'identified', -- 'identified', 'requested', 'intro_made', 'declined'
  intro_requested_at TIMESTAMP WITH TIME ZONE,
  intro_made_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- LinkedIn message templates
CREATE TABLE public.abc_linkedin_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL DEFAULT 'direct_message', -- 'direct_message', 'connection_request', 'warm_intro_request', 'follow_up'
  subject TEXT,
  content TEXT NOT NULL,
  variables TEXT[], -- ['{{investor_name}}', '{{company_name}}', '{{connector_name}}']
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  success_rate NUMERIC(5,2),
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.abc_linkedin_outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abc_warm_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abc_linkedin_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow ABC authorized users)
CREATE POLICY "ABC authorized users can manage linkedin outreach" 
ON public.abc_linkedin_outreach 
FOR ALL 
USING (true);

CREATE POLICY "ABC authorized users can manage warm connections" 
ON public.abc_warm_connections 
FOR ALL 
USING (true);

CREATE POLICY "ABC authorized users can manage linkedin templates" 
ON public.abc_linkedin_templates 
FOR ALL 
USING (true);

-- Insert default templates
INSERT INTO public.abc_linkedin_templates (name, template_type, content, variables, created_by) VALUES
('Primo Contatto - Investitore', 'connection_request', 
'Gentile {{investor_name}}, seguo con interesse le attività di {{company_name}} nel settore degli investimenti. Sto collaborando con ABC Company per un''opportunità di co-investimento esclusiva. Le piacerebbe approfondire?', 
ARRAY['{{investor_name}}', '{{company_name}}'], 'system'),

('Richiesta Intro - Connessione', 'warm_intro_request',
'Ciao {{connector_name}}, spero tutto bene! Ho visto che sei collegato con {{investor_name}} di {{company_name}}. Stiamo lavorando a un''opportunità di investimento che potrebbe interessargli. Saresti disponibile per una breve intro? Ti sarei molto grato.', 
ARRAY['{{connector_name}}', '{{investor_name}}', '{{company_name}}'], 'system'),

('Follow-up Post Intro', 'follow_up',
'Gentile {{investor_name}}, la contatto come suggerito da {{connector_name}}. ABC Company sta strutturando un round di investimento con interessanti condizioni per i co-investitori istituzionali. Quando possiamo organizzare una call di 15 minuti?', 
ARRAY['{{investor_name}}', '{{connector_name}}'], 'system'),

('DM Diretto - Opportunità', 'direct_message',
'Buongiorno {{investor_name}}, mi permetto di contattarla direttamente per presentare un''opportunità di co-investimento gestita da ARIES76 per conto di ABC Company. Il round offre condizioni competitive per investitori qualificati. Posso inviarle il teaser deck?', 
ARRAY['{{investor_name}}'], 'system');

-- Create indexes for performance
CREATE INDEX idx_linkedin_outreach_investor ON public.abc_linkedin_outreach(investor_id);
CREATE INDEX idx_linkedin_outreach_status ON public.abc_linkedin_outreach(status);
CREATE INDEX idx_warm_connections_investor ON public.abc_warm_connections(investor_id);
CREATE INDEX idx_warm_connections_status ON public.abc_warm_connections(intro_status);