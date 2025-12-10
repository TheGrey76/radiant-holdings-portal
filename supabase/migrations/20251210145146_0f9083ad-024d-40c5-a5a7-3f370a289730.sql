-- Create table for ABC Company shared settings
CREATE TABLE public.abc_company_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by text
);

-- Enable RLS
ALTER TABLE public.abc_company_settings ENABLE ROW LEVEL SECURITY;

-- Allow all access (console users are pre-authorized)
CREATE POLICY "Allow all access to abc_company_settings"
ON public.abc_company_settings
FOR ALL
USING (true)
WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE abc_company_settings;

-- Insert default settings
INSERT INTO public.abc_company_settings (setting_key, setting_value) VALUES
('company', '{"companyName": "ABC Company", "companyDescription": "Club Deal per investimenti in PMI italiane con track record consolidato di 207 operazioni e €32M di capitale investito.", "sector": "Private Equity", "website": "www.abccompany.it", "phone": "+39 02 1234567", "address": "Milano, Italia", "logoUrl": ""}'::jsonb),
('fundraising', '{"targetAmount": 12000000, "deadline": "2026-06-30", "valuation": 48000000, "sharePrice": 4.00, "minInvestment": 50000, "dealStructure": "Club Deal", "investmentType": "Equity"}'::jsonb),
('email', '{"senderName": "ABC Company - Capital Raise", "senderEmail": "edoardo.grigione@aries76.com", "replyTo": "stefano.taioli@abccompany.it", "signature": "Best regards,\\n\\nEdoardo Grigione\\nCEO, ARIES76\\n\\n---\\nABC Company Capital Raise\\nPowered by ARIES76", "defaultSubject": "ABC Company - Opportunità di Investimento"}'::jsonb),
('team', '{"members": [{"email": "edoardo.grigione@aries76.com", "name": "Edoardo Grigione", "role": "admin", "isDefault": true}, {"email": "admin@aries76.com", "name": "Admin ARIES76", "role": "admin", "isDefault": true}, {"email": "stefano.taioli@abccompany.it", "name": "Stefano Taioli", "role": "admin", "isDefault": true}, {"email": "enrico.sobacchi@abccompany.it", "name": "Enrico Sobacchi", "role": "manager", "isDefault": true}, {"email": "lorenzo.delforno@abccompany.it", "name": "Lorenzo Del Forno", "role": "manager", "isDefault": true}, {"email": "alessandro.catullo@aries76.com", "name": "Alessandro Catullo", "role": "manager", "isDefault": true}]}'::jsonb),
('notifications', '{"dailySummary": true, "followUpReminders": true, "milestoneAlerts": true, "overdueTasks": true, "biweeklyReport": true, "newInteractions": true, "statusChanges": true, "documentUploads": false, "meetingReminders": true}'::jsonb);