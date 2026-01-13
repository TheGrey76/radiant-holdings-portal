
-- Create table for KPI snapshots with real data from Supabase
CREATE TABLE public.abc_kpi_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  raised_amount NUMERIC DEFAULT 0,
  target_amount NUMERIC DEFAULT 5000000,
  pipeline_value NUMERIC DEFAULT 0,
  closed_deals_count INTEGER DEFAULT 0,
  closed_deals_value NUMERIC DEFAULT 0,
  meetings_count INTEGER DEFAULT 0,
  meetings_target INTEGER DEFAULT 50,
  total_investors INTEGER DEFAULT 0,
  to_contact_count INTEGER DEFAULT 0,
  contacted_count INTEGER DEFAULT 0,
  interested_count INTEGER DEFAULT 0,
  meeting_scheduled_count INTEGER DEFAULT 0,
  in_negotiation_count INTEGER DEFAULT 0,
  notes_count INTEGER DEFAULT 0,
  activities_count INTEGER DEFAULT 0,
  campaigns_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(snapshot_date)
);

-- Enable RLS
ALTER TABLE public.abc_kpi_snapshots ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read KPI snapshots
CREATE POLICY "Authenticated users can read KPI snapshots"
  ON public.abc_kpi_snapshots
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert KPI snapshots
CREATE POLICY "Authenticated users can insert KPI snapshots"
  ON public.abc_kpi_snapshots
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update KPI snapshots
CREATE POLICY "Authenticated users can update KPI snapshots"
  ON public.abc_kpi_snapshots
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to capture daily KPI snapshot
CREATE OR REPLACE FUNCTION public.capture_kpi_snapshot()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_raised NUMERIC;
  v_pipeline NUMERIC;
  v_closed_count INTEGER;
  v_closed_value NUMERIC;
  v_meetings INTEGER;
  v_total INTEGER;
  v_to_contact INTEGER;
  v_contacted INTEGER;
  v_interested INTEGER;
  v_meeting_scheduled INTEGER;
  v_in_negotiation INTEGER;
  v_notes INTEGER;
  v_activities INTEGER;
  v_campaigns INTEGER;
BEGIN
  -- Calculate metrics from real data
  SELECT 
    COALESCE(SUM(CASE WHEN status = 'Closed' THEN pipeline_value ELSE 0 END), 0),
    COALESCE(SUM(pipeline_value), 0),
    COUNT(CASE WHEN status = 'Closed' THEN 1 END),
    COALESCE(SUM(CASE WHEN status = 'Closed' THEN pipeline_value ELSE 0 END), 0),
    COUNT(*),
    COUNT(CASE WHEN status = 'To Contact' THEN 1 END),
    COUNT(CASE WHEN status = 'Contacted' THEN 1 END),
    COUNT(CASE WHEN status = 'Interested' THEN 1 END),
    COUNT(CASE WHEN status = 'Meeting Scheduled' THEN 1 END),
    COUNT(CASE WHEN status = 'In Negotiation' THEN 1 END)
  INTO v_raised, v_pipeline, v_closed_count, v_closed_value, v_total, 
       v_to_contact, v_contacted, v_interested, v_meeting_scheduled, v_in_negotiation
  FROM abc_investors
  WHERE status != 'Not Interested';

  -- Count meetings from activities
  SELECT COUNT(*) INTO v_meetings
  FROM abc_investor_activities
  WHERE activity_type ILIKE '%meeting%';

  -- Count notes
  SELECT COUNT(*) INTO v_notes FROM abc_investor_notes;

  -- Count all activities
  SELECT COUNT(*) INTO v_activities FROM abc_investor_activities;

  -- Count campaigns
  SELECT COUNT(*) INTO v_campaigns FROM abc_email_campaign_history;

  -- Insert or update today's snapshot
  INSERT INTO abc_kpi_snapshots (
    snapshot_date, raised_amount, pipeline_value, closed_deals_count, closed_deals_value,
    meetings_count, total_investors, to_contact_count, contacted_count, interested_count,
    meeting_scheduled_count, in_negotiation_count, notes_count, activities_count, campaigns_count
  ) VALUES (
    CURRENT_DATE, v_raised, v_pipeline, v_closed_count, v_closed_value,
    v_meetings, v_total, v_to_contact, v_contacted, v_interested,
    v_meeting_scheduled, v_in_negotiation, v_notes, v_activities, v_campaigns
  )
  ON CONFLICT (snapshot_date) DO UPDATE SET
    raised_amount = EXCLUDED.raised_amount,
    pipeline_value = EXCLUDED.pipeline_value,
    closed_deals_count = EXCLUDED.closed_deals_count,
    closed_deals_value = EXCLUDED.closed_deals_value,
    meetings_count = EXCLUDED.meetings_count,
    total_investors = EXCLUDED.total_investors,
    to_contact_count = EXCLUDED.to_contact_count,
    contacted_count = EXCLUDED.contacted_count,
    interested_count = EXCLUDED.interested_count,
    meeting_scheduled_count = EXCLUDED.meeting_scheduled_count,
    in_negotiation_count = EXCLUDED.in_negotiation_count,
    notes_count = EXCLUDED.notes_count,
    activities_count = EXCLUDED.activities_count,
    campaigns_count = EXCLUDED.campaigns_count;
END;
$$;

-- Capture initial snapshot with current data
SELECT public.capture_kpi_snapshot();
