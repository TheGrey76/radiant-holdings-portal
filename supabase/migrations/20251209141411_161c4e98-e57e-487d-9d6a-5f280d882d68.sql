-- Enable REPLICA IDENTITY FULL for real-time updates on ABC tables
ALTER TABLE public.abc_investor_notes REPLICA IDENTITY FULL;
ALTER TABLE public.abc_investor_followups REPLICA IDENTITY FULL;
ALTER TABLE public.abc_investor_activities REPLICA IDENTITY FULL;
ALTER TABLE public.abc_investor_documents REPLICA IDENTITY FULL;
ALTER TABLE public.abc_investors REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.abc_investor_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.abc_investor_followups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.abc_investor_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.abc_investor_documents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.abc_investors;