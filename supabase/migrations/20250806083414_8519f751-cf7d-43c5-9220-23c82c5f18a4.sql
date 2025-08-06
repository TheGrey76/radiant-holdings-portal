-- Assicuriamoci che la tabella brochure_downloads possa accettare inserimenti
-- e aggiungiamo una colonna per il tipo di richiesta se non esiste già

ALTER TABLE brochure_downloads 
ADD COLUMN IF NOT EXISTS request_type TEXT DEFAULT 'business_intelligence';