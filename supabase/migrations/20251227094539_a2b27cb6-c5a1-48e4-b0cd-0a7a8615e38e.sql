-- Create a table to link Supabase auth users to ABC console authorization
CREATE TABLE IF NOT EXISTS public.abc_authorized_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email text NOT NULL,
    granted_by text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id),
    UNIQUE(email)
);

-- Enable RLS on the new table
ALTER TABLE public.abc_authorized_users ENABLE ROW LEVEL SECURITY;

-- Only admins can manage authorized users, anyone can check their own authorization
CREATE POLICY "Admins can manage abc_authorized_users"
ON public.abc_authorized_users
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own authorization"
ON public.abc_authorized_users
FOR SELECT
USING (auth.uid() = user_id);

-- Create a helper function to check if user is authorized for ABC console
CREATE OR REPLACE FUNCTION public.is_abc_authorized(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.abc_authorized_users
    WHERE user_id = _user_id
  ) OR public.has_role(_user_id, 'admin')
$$;

-- Drop existing permissive policies and create auth-based ones for abc_investors
DROP POLICY IF EXISTS "Allow all access to abc_investors" ON public.abc_investors;

CREATE POLICY "ABC authorized users can view investors"
ON public.abc_investors
FOR SELECT
USING (public.is_abc_authorized(auth.uid()));

CREATE POLICY "ABC authorized users can insert investors"
ON public.abc_investors
FOR INSERT
WITH CHECK (public.is_abc_authorized(auth.uid()));

CREATE POLICY "ABC authorized users can update investors"
ON public.abc_investors
FOR UPDATE
USING (public.is_abc_authorized(auth.uid()));

CREATE POLICY "ABC authorized users can delete investors"
ON public.abc_investors
FOR DELETE
USING (public.is_abc_authorized(auth.uid()));

-- Drop existing permissive policies and create auth-based ones for abc_notifications
DROP POLICY IF EXISTS "Anyone can create notifications" ON public.abc_notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.abc_notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.abc_notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.abc_notifications;

CREATE POLICY "ABC users can view their notifications"
ON public.abc_notifications
FOR SELECT
USING (
  public.is_abc_authorized(auth.uid()) 
  AND (
    user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "ABC users can create notifications"
ON public.abc_notifications
FOR INSERT
WITH CHECK (public.is_abc_authorized(auth.uid()));

CREATE POLICY "ABC users can update their notifications"
ON public.abc_notifications
FOR UPDATE
USING (
  public.is_abc_authorized(auth.uid())
  AND user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "ABC users can delete their notifications"
ON public.abc_notifications
FOR DELETE
USING (
  public.is_abc_authorized(auth.uid())
  AND user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Drop existing permissive policies and create auth-based ones for abc_investor_notes
DROP POLICY IF EXISTS "Allow all access to abc_investor_notes" ON public.abc_investor_notes;

CREATE POLICY "ABC authorized users can view notes"
ON public.abc_investor_notes
FOR SELECT
USING (public.is_abc_authorized(auth.uid()));

CREATE POLICY "ABC authorized users can insert notes"
ON public.abc_investor_notes
FOR INSERT
WITH CHECK (public.is_abc_authorized(auth.uid()));

CREATE POLICY "ABC authorized users can update notes"
ON public.abc_investor_notes
FOR UPDATE
USING (public.is_abc_authorized(auth.uid()));

CREATE POLICY "ABC authorized users can delete notes"
ON public.abc_investor_notes
FOR DELETE
USING (public.is_abc_authorized(auth.uid()));

-- Drop existing permissive policies for other ABC tables
DROP POLICY IF EXISTS "Allow all access to abc_investor_activities" ON public.abc_investor_activities;
DROP POLICY IF EXISTS "Allow all access to abc_investor_commitments" ON public.abc_investor_commitments;
DROP POLICY IF EXISTS "Allow all access to abc_investor_documents" ON public.abc_investor_documents;
DROP POLICY IF EXISTS "Allow all access to abc_investor_followups" ON public.abc_investor_followups;
DROP POLICY IF EXISTS "Allow all access to abc_email_campaign_history" ON public.abc_email_campaign_history;
DROP POLICY IF EXISTS "Allow all access to abc_email_templates" ON public.abc_email_templates;
DROP POLICY IF EXISTS "Allow all access to abc_email_opens" ON public.abc_email_opens;
DROP POLICY IF EXISTS "Allow all access to abc_company_settings" ON public.abc_company_settings;
DROP POLICY IF EXISTS "Allow all operations on abc_email_responses" ON public.abc_email_responses;

-- Create auth-based policies for abc_investor_activities
CREATE POLICY "ABC authorized users can manage activities"
ON public.abc_investor_activities
FOR ALL
USING (public.is_abc_authorized(auth.uid()))
WITH CHECK (public.is_abc_authorized(auth.uid()));

-- Create auth-based policies for abc_investor_commitments
CREATE POLICY "ABC authorized users can manage commitments"
ON public.abc_investor_commitments
FOR ALL
USING (public.is_abc_authorized(auth.uid()))
WITH CHECK (public.is_abc_authorized(auth.uid()));

-- Create auth-based policies for abc_investor_documents
CREATE POLICY "ABC authorized users can manage documents"
ON public.abc_investor_documents
FOR ALL
USING (public.is_abc_authorized(auth.uid()))
WITH CHECK (public.is_abc_authorized(auth.uid()));

-- Create auth-based policies for abc_investor_followups
CREATE POLICY "ABC authorized users can manage followups"
ON public.abc_investor_followups
FOR ALL
USING (public.is_abc_authorized(auth.uid()))
WITH CHECK (public.is_abc_authorized(auth.uid()));

-- Create auth-based policies for abc_email_campaign_history
CREATE POLICY "ABC authorized users can manage campaign history"
ON public.abc_email_campaign_history
FOR ALL
USING (public.is_abc_authorized(auth.uid()))
WITH CHECK (public.is_abc_authorized(auth.uid()));

-- Create auth-based policies for abc_email_templates
CREATE POLICY "ABC authorized users can manage templates"
ON public.abc_email_templates
FOR ALL
USING (public.is_abc_authorized(auth.uid()))
WITH CHECK (public.is_abc_authorized(auth.uid()));

-- Create auth-based policies for abc_email_opens
CREATE POLICY "ABC authorized users can manage email opens"
ON public.abc_email_opens
FOR ALL
USING (public.is_abc_authorized(auth.uid()))
WITH CHECK (public.is_abc_authorized(auth.uid()));

-- Create auth-based policies for abc_company_settings
CREATE POLICY "ABC authorized users can manage settings"
ON public.abc_company_settings
FOR ALL
USING (public.is_abc_authorized(auth.uid()))
WITH CHECK (public.is_abc_authorized(auth.uid()));

-- Create auth-based policies for abc_email_responses
CREATE POLICY "ABC authorized users can manage responses"
ON public.abc_email_responses
FOR ALL
USING (public.is_abc_authorized(auth.uid()))
WITH CHECK (public.is_abc_authorized(auth.uid()));