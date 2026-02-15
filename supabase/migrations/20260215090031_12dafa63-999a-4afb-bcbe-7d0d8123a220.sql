-- Allow public read/write access for ariesdb_contacts (admin tool, no auth required)
CREATE POLICY "Allow public select on ariesdb_contacts"
ON public.ariesdb_contacts FOR SELECT
USING (true);

CREATE POLICY "Allow public insert on ariesdb_contacts"
ON public.ariesdb_contacts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update on ariesdb_contacts"
ON public.ariesdb_contacts FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete on ariesdb_contacts"
ON public.ariesdb_contacts FOR DELETE
USING (true);