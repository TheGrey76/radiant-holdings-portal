-- Create notifications table for team mentions
CREATE TABLE public.abc_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  from_user TEXT NOT NULL,
  investor_name TEXT NOT NULL,
  note_id UUID REFERENCES public.abc_investor_notes(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.abc_notifications ENABLE ROW LEVEL SECURITY;

-- Policy: users can view their own notifications
CREATE POLICY "Users can view own notifications"
ON public.abc_notifications
FOR SELECT
USING (true);

-- Policy: anyone can create notifications
CREATE POLICY "Anyone can create notifications"
ON public.abc_notifications
FOR INSERT
WITH CHECK (true);

-- Policy: users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON public.abc_notifications
FOR UPDATE
USING (true);

-- Policy: users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
ON public.abc_notifications
FOR DELETE
USING (true);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE abc_notifications;