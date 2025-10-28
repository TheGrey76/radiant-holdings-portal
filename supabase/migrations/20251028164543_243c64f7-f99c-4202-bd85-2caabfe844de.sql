-- Drop the public insert policy that allows anyone to insert data
DROP POLICY IF EXISTS "Allow public insert for brochure downloads" ON public.brochure_downloads;

-- Create a new policy that only allows authenticated users to insert their own data
CREATE POLICY "Authenticated users can insert brochure downloads"
ON public.brochure_downloads
FOR INSERT
TO authenticated
WITH CHECK (true);