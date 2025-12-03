-- Add approved column to abc_investors table
ALTER TABLE public.abc_investors 
ADD COLUMN approved boolean NOT NULL DEFAULT false;

-- Add index for filtering by approval status
CREATE INDEX idx_abc_investors_approved ON public.abc_investors(approved);