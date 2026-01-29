-- Create table to track import batches/history
CREATE TABLE public.abc_import_batches (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_name text NOT NULL,
  file_name text,
  imported_by text NOT NULL,
  imported_at timestamp with time zone NOT NULL DEFAULT now(),
  total_records integer NOT NULL DEFAULT 0,
  new_records integer NOT NULL DEFAULT 0,
  duplicates_skipped integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add import_batch_id to abc_investors to track which batch each investor came from
ALTER TABLE public.abc_investors 
ADD COLUMN import_batch_id uuid REFERENCES public.abc_import_batches(id) ON DELETE SET NULL;

-- Add index for faster lookups
CREATE INDEX idx_abc_investors_import_batch ON public.abc_investors(import_batch_id);
CREATE INDEX idx_abc_import_batches_imported_at ON public.abc_import_batches(imported_at DESC);

-- Enable RLS
ALTER TABLE public.abc_import_batches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for import batches
CREATE POLICY "ABC authorized users can view import batches"
ON public.abc_import_batches
FOR SELECT
USING (is_abc_authorized(auth.uid()));

CREATE POLICY "ABC authorized users can insert import batches"
ON public.abc_import_batches
FOR INSERT
WITH CHECK (is_abc_authorized(auth.uid()));

CREATE POLICY "ABC authorized users can update import batches"
ON public.abc_import_batches
FOR UPDATE
USING (is_abc_authorized(auth.uid()));

CREATE POLICY "ABC authorized users can delete import batches"
ON public.abc_import_batches
FOR DELETE
USING (is_abc_authorized(auth.uid()));