export type Confidence = 'high' | 'medium' | 'low';

export interface ExtractedField<T = string> {
  value: T | null;
  confidence: Confidence;
  source: string;
}

export interface KeyPerson {
  name: string;
  title: string;
  years_experience: number | null;
}

export interface ExtractedFundInfo {
  fund_name: ExtractedField;
  gp_name: ExtractedField;
  fund_number: ExtractedField;
  target_size_usd_m: ExtractedField<number>;
  management_fee_pct: ExtractedField<number>;
  carry_pct: ExtractedField<number>;
  hurdle_rate_pct: ExtractedField<number>;
  gp_commitment_pct: ExtractedField<number>;
  key_persons: KeyPerson[];
}

export interface ExtractedMetric {
  raw_data: string;
  source_document: string;
  source_location: string;
  confidence: Confidence;
  suggested_score: number;
  rationale: string;
}

export interface ExtractionResult {
  fund_info: ExtractedFundInfo;
  metrics: Record<string, ExtractedMetric>;
}

export interface UploadedDoc {
  id: string;
  file: File;
  type: DocumentType;
  status: 'ready' | 'uploading' | 'processing' | 'done' | 'error';
  base64?: string;
}

export type DocumentType =
  | 'ppm'
  | 'pitch_deck'
  | 'ddq'
  | 'track_record'
  | 'financials'
  | 'side_letter'
  | 'ilpa_ddq'
  | 'other';

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  ppm: 'PPM / Offering Memorandum',
  pitch_deck: 'Pitch Deck / Marketing Materials',
  ddq: 'Due Diligence Questionnaire (DDQ)',
  track_record: 'Track Record / Performance Report',
  financials: 'Audited Financial Statements',
  side_letter: 'Side Letter / LPA Terms',
  ilpa_ddq: 'ILPA DDQ Response',
  other: 'Other',
};

export type ScoringMode = 'ai' | 'manual';

export type ProcessingStep = 'reading' | 'extracting' | 'mapping' | 'scoring' | 'done';

export const PROCESSING_STEPS: { key: ProcessingStep; label: string }[] = [
  { key: 'reading', label: 'Reading documents...' },
  { key: 'extracting', label: 'Extracting data points...' },
  { key: 'mapping', label: 'Mapping to scoring framework...' },
  { key: 'scoring', label: 'Generating score suggestions...' },
  { key: 'done', label: 'Complete' },
];

export interface SavedAssessment {
  id: string;
  fundName: string;
  gpName: string;
  date: string;
  score: number;
  verdict: string;
  timestamp: number;
  data: {
    fundInfo: any;
    pillars: any;
    overallNotes: string;
    extraction?: ExtractionResult | null;
  };
}

export const METRIC_ID_MAP: Record<string, string> = {
  senior_team_stability: 'senior_stability',
  attribution_analysis: 'attribution',
  relevant_experience: 'experience',
  gp_commitment: 'gp_commitment',
  net_irr_usd: 'net_irr',
  net_moic_usd: 'net_moic',
  dpi_cash_returns: 'dpi',
  loss_ratio: 'loss_ratio',
  strategy_market_fit: 'strategy_fit',
  fund_size_discipline: 'fund_size_discipline',
  vintage_focus: 'vintage_focus',
  ilpa_compliance: 'ilpa',
  fee_structure: 'fee_structure',
  operational_dd: 'operational_dd',
};

export const CONFIDENCE_COLORS: Record<Confidence, string> = {
  high: 'bg-emerald-500',
  medium: 'bg-yellow-500',
  low: 'bg-red-500',
};

export function getConfidenceLabel(c: Confidence): string {
  return c === 'high' ? 'High' : c === 'medium' ? 'Medium' : 'Low';
}
