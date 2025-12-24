-- Tabella storica: Tutti i dati raccolti
CREATE TABLE IF NOT EXISTS bitcoin_report_data (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Dati Bitcoin
    bitcoin_price_usd DECIMAL(15, 2),
    bitcoin_price_eur DECIMAL(15, 2),
    bitcoin_market_cap DECIMAL(20, 2),
    bitcoin_volume_24h DECIMAL(20, 2),
    bitcoin_change_24h DECIMAL(10, 4),
    
    -- Dati Macro
    m2_value DECIMAL(20, 2),
    real_rate DECIMAL(10, 4),
    unemployment_rate DECIMAL(10, 4),
    inflation_rate DECIMAL(10, 4),
    
    -- Dati Modello
    current_regime VARCHAR(50),
    regime_confidence DECIMAL(5, 4),
    price_target_low DECIMAL(15, 2),
    price_target_high DECIMAL(15, 2),
    probability DECIMAL(5, 4),
    institutional_target DECIMAL(15, 2),
    
    -- Dati grezzi JSON
    raw_data JSONB,
    
    -- Metadati
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX idx_bitcoin_report_data_timestamp ON bitcoin_report_data(timestamp DESC);
CREATE INDEX idx_bitcoin_report_data_regime ON bitcoin_report_data(current_regime);

-- Tabella per accesso rapido ai dati più recenti
CREATE TABLE IF NOT EXISTS bitcoin_report_latest (
    id INTEGER PRIMARY KEY DEFAULT 1,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    bitcoin_price_usd DECIMAL(15, 2),
    bitcoin_price_eur DECIMAL(15, 2),
    m2_value DECIMAL(20, 2),
    real_rate DECIMAL(10, 4),
    current_regime VARCHAR(50),
    regime_confidence DECIMAL(5, 4),
    price_target_low DECIMAL(15, 2),
    price_target_high DECIMAL(15, 2),
    probability DECIMAL(5, 4),
    institutional_target DECIMAL(15, 2),
    raw_data JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per storico dei regimi
CREATE TABLE IF NOT EXISTS bitcoin_regime_history (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    regime VARCHAR(50) NOT NULL,
    confidence DECIMAL(5, 4),
    price_target_low DECIMAL(15, 2),
    price_target_high DECIMAL(15, 2),
    probability DECIMAL(5, 4),
    bitcoin_price_at_time DECIMAL(15, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per regime history
CREATE INDEX idx_regime_history_timestamp ON bitcoin_regime_history(timestamp DESC);
CREATE INDEX idx_regime_history_regime ON bitcoin_regime_history(regime);

-- Tabella per tracciare gli aggiornamenti
CREATE TABLE IF NOT EXISTS bitcoin_report_updates_log (
    id BIGSERIAL PRIMARY KEY,
    update_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50),
    bitcoin_data_updated BOOLEAN,
    macro_data_updated BOOLEAN,
    model_updated BOOLEAN,
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per update log
CREATE INDEX idx_updates_log_timestamp ON bitcoin_report_updates_log(update_timestamp DESC);
CREATE INDEX idx_updates_log_status ON bitcoin_report_updates_log(status);

-- Abilita Row Level Security
ALTER TABLE bitcoin_report_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE bitcoin_report_latest ENABLE ROW LEVEL SECURITY;
ALTER TABLE bitcoin_regime_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE bitcoin_report_updates_log ENABLE ROW LEVEL SECURITY;

-- Policy per lettura pubblica (i dati sono pubblici)
CREATE POLICY "Allow public read on bitcoin_report_latest" ON bitcoin_report_latest
    FOR SELECT USING (true);

CREATE POLICY "Allow public read on bitcoin_report_data" ON bitcoin_report_data
    FOR SELECT USING (true);

CREATE POLICY "Allow public read on bitcoin_regime_history" ON bitcoin_regime_history
    FOR SELECT USING (true);

CREATE POLICY "Allow public read on bitcoin_report_updates_log" ON bitcoin_report_updates_log
    FOR SELECT USING (true);

-- Policy per scrittura solo da service role
CREATE POLICY "Allow service_role write on bitcoin_report_latest" ON bitcoin_report_latest
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service_role write on bitcoin_report_data" ON bitcoin_report_data
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service_role write on bitcoin_regime_history" ON bitcoin_regime_history
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service_role write on bitcoin_report_updates_log" ON bitcoin_report_updates_log
    FOR ALL USING (auth.role() = 'service_role');

-- Crea funzione per aggiornamento automatico della tabella latest
CREATE OR REPLACE FUNCTION update_bitcoin_report_latest()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO bitcoin_report_latest (
        id, timestamp, bitcoin_price_usd, bitcoin_price_eur, m2_value, real_rate,
        current_regime, regime_confidence, price_target_low, price_target_high,
        probability, institutional_target, raw_data, updated_at
    ) VALUES (
        1, NEW.timestamp, NEW.bitcoin_price_usd, NEW.bitcoin_price_eur, NEW.m2_value, 
        NEW.real_rate, NEW.current_regime, NEW.regime_confidence, NEW.price_target_low, 
        NEW.price_target_high, NEW.probability, NEW.institutional_target, NEW.raw_data, NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        timestamp = EXCLUDED.timestamp,
        bitcoin_price_usd = EXCLUDED.bitcoin_price_usd,
        bitcoin_price_eur = EXCLUDED.bitcoin_price_eur,
        m2_value = EXCLUDED.m2_value,
        real_rate = EXCLUDED.real_rate,
        current_regime = EXCLUDED.current_regime,
        regime_confidence = EXCLUDED.regime_confidence,
        price_target_low = EXCLUDED.price_target_low,
        price_target_high = EXCLUDED.price_target_high,
        probability = EXCLUDED.probability,
        institutional_target = EXCLUDED.institutional_target,
        raw_data = EXCLUDED.raw_data,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Crea trigger per aggiornamento automatico
CREATE TRIGGER trigger_update_bitcoin_latest
AFTER INSERT ON bitcoin_report_data
FOR EACH ROW
EXECUTE FUNCTION update_bitcoin_report_latest();