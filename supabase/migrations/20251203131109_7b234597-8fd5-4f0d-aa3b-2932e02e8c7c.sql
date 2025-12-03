-- Change approved boolean to approval_status text with 3 states
ALTER TABLE public.abc_investors 
DROP COLUMN approved;

ALTER TABLE public.abc_investors 
ADD COLUMN approval_status text NOT NULL DEFAULT 'pending';

-- Add check constraint for valid values
ALTER TABLE public.abc_investors
ADD CONSTRAINT abc_investors_approval_status_check 
CHECK (approval_status IN ('pending', 'approved', 'not_approved'));

-- Add index for filtering
CREATE INDEX idx_abc_investors_approval_status ON public.abc_investors(approval_status);