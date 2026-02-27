-- Personal CRM: Deals/Initiatives pipeline
CREATE TABLE public.personal_crm_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES public.ariesdb_contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  stage TEXT NOT NULL DEFAULT 'lead',
  priority TEXT DEFAULT 'medium',
  value NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  probability INTEGER DEFAULT 0,
  expected_close DATE,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Personal CRM: Interaction log (calls, emails, meetings, notes)
CREATE TABLE public.personal_crm_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES public.ariesdb_contacts(id) ON DELETE CASCADE NOT NULL,
  deal_id UUID REFERENCES public.personal_crm_deals(id) ON DELETE SET NULL,
  interaction_type TEXT NOT NULL DEFAULT 'note',
  subject TEXT,
  content TEXT,
  channel TEXT,
  sentiment TEXT,
  follow_up_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Personal CRM: Tags for contacts
CREATE TABLE public.personal_crm_contact_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES public.ariesdb_contacts(id) ON DELETE CASCADE NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(contact_id, tag)
);

-- Personal CRM: Outreach campaigns
CREATE TABLE public.personal_crm_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  campaign_type TEXT DEFAULT 'email',
  status TEXT DEFAULT 'draft',
  template_subject TEXT,
  template_body TEXT,
  target_tags TEXT[] DEFAULT '{}',
  sent_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Personal CRM: Campaign recipients
CREATE TABLE public.personal_crm_campaign_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.personal_crm_campaigns(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES public.ariesdb_contacts(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, contact_id)
);

-- Enable RLS on all tables
ALTER TABLE public.personal_crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_crm_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_crm_contact_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_crm_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_crm_campaign_recipients ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "Admins can manage deals" ON public.personal_crm_deals
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage interactions" ON public.personal_crm_interactions
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage contact tags" ON public.personal_crm_contact_tags
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage campaigns" ON public.personal_crm_campaigns
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage campaign recipients" ON public.personal_crm_campaign_recipients
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_personal_crm_deals_updated_at
  BEFORE UPDATE ON public.personal_crm_deals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_personal_crm_campaigns_updated_at
  BEFORE UPDATE ON public.personal_crm_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_crm_deals_contact ON public.personal_crm_deals(contact_id);
CREATE INDEX idx_crm_deals_stage ON public.personal_crm_deals(stage);
CREATE INDEX idx_crm_interactions_contact ON public.personal_crm_interactions(contact_id);
CREATE INDEX idx_crm_interactions_deal ON public.personal_crm_interactions(deal_id);
CREATE INDEX idx_crm_contact_tags_contact ON public.personal_crm_contact_tags(contact_id);
CREATE INDEX idx_crm_contact_tags_tag ON public.personal_crm_contact_tags(tag);
CREATE INDEX idx_crm_campaign_recipients_campaign ON public.personal_crm_campaign_recipients(campaign_id);