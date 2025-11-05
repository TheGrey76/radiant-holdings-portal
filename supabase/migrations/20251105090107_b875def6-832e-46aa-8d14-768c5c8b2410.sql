-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create call requests" ON gp_call_requests;

-- Create new policy allowing anyone to insert call requests
CREATE POLICY "Anyone can create call requests"
ON gp_call_requests
FOR INSERT
WITH CHECK (true);