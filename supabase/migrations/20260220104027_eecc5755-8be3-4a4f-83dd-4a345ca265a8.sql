
-- Add max_profit column to track peak unrealized P&L per position
ALTER TABLE public.swing_positions
ADD COLUMN IF NOT EXISTS max_profit numeric DEFAULT NULL;
