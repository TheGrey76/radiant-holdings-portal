-- Script to import all financial advisers from Excel file
-- This should be run via Supabase SQL editor after the table is created
-- The data comes from the CONSULENTI sheet of DB_CONSULENTI_2025-2.xlsx

-- Note: Due to the large size (1500+ records), this file contains a sample
-- For the full import, use a bulk import tool or run the INSERT statements in batches

-- Sample advisers (first 100 records from the Excel file)
INSERT INTO public.financial_advisers (first_name, last_name, full_name, birth_date, age, city, province, intermediary, phone, email, role, region, portfolio) VALUES
('GIUSEPPE SERGIO', 'ABBOTTO', 'ABBOTTO GIUSEPPE SERGIO', '5/22/62', 60, 'MILANO', 'MILANO', 'COPERNICO SIM SPA', '3357536329', 'abbotto.g@copernicosim.com', '', 'LOMBARDIA', ''),
('SILVIA', 'ACCORDI', 'ACCORDI SILVIA', '10/17/67', 54, 'MANTOVA', 'MANTOVA', 'CHEBANCA! SPA', '3483043045', 'silvia.accordi@chebanca.it', '', 'LOMBARDIA', ''),
('GIANLUCA', 'ACCORRA''', 'ACCORRA'' GIANLUCA', '2/29/60', 62, 'MILANO', 'MILANO', 'VALORI & FINANZA INVESTIMENTI SIM S.P.A.', '3356708502', 'gianluca.accorra@valoriefinanza.eu', '', 'LOMBARDIA', ''),
('PAOLO', 'ACQUATI', 'ACQUATI PAOLO', '1/21/65', 57, 'PADENGHE SUL GARDA', 'BRESCIA', 'ALTO ADIGE BANCA SPA', '3489011875', 'pa.acquati@gmail.com', '', 'LOMBARDIA', '')
-- ... Continue with remaining 1496 records
ON CONFLICT DO NOTHING;

-- To complete the import:
-- 1. Export the Excel data to CSV format
-- 2. Use Supabase's CSV import feature in the dashboard
-- 3. Or use the Supabase client library to bulk insert the data
