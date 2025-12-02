-- Fix: Remove public access to financial_advisers table containing PII
-- The "Admins can manage financial advisers" policy already exists for admin access

DROP POLICY IF EXISTS "Anyone can view financial advisers" ON public.financial_advisers;