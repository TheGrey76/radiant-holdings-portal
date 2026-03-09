export interface Metric {
  id: string;
  name: string;
  weight: number;
  score: number; // 0, 1, 3, or 5
  criteria: {
    score5: string;
    score3: string;
    score1: string;
    score0: string;
  };
}

export interface Pillar {
  id: string;
  name: string;
  shortName: string;
  totalPoints: number;
  metrics: Metric[];
  notes: string;
}

export interface FundInfo {
  fundName: string;
  gpName: string;
  fundVintage: string;
  targetSize: string;
  assessmentDate: string;
  assessedBy: string;
}

export type Verdict = 'pass' | 'conditional' | 'fail';

export const VALID_SCORES = [0, 1, 3, 5] as const;

export const SCORE_COLORS: Record<number, string> = {
  5: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  3: 'text-teal-600 bg-teal-50 border-teal-200',
  1: 'text-orange-600 bg-orange-50 border-orange-200',
  0: 'text-red-600 bg-red-50 border-red-200',
};

export const SCORE_DOT_COLORS: Record<number, string> = {
  5: 'bg-emerald-500',
  3: 'bg-teal-500',
  1: 'bg-orange-500',
  0: 'bg-red-500',
};

export function getDefaultPillars(): Pillar[] {
  return [
    {
      id: 'team',
      name: 'The Team',
      shortName: 'Team',
      totalPoints: 30,
      notes: '',
      metrics: [
        {
          id: 'senior_stability',
          name: 'Senior Team Stability',
          weight: 10,
          score: -1,
          criteria: {
            score5: '>90% together >7 yrs',
            score3: '70–90% together >5 yrs',
            score1: '<70% or <5 yrs',
            score0: 'High turnover',
          },
        },
        {
          id: 'attribution',
          name: 'Attribution Analysis',
          weight: 10,
          score: -1,
          criteria: {
            score5: '>80% value from current key persons',
            score3: '60–80%',
            score1: '<60%',
            score0: 'Key persons departed',
          },
        },
        {
          id: 'experience',
          name: 'Relevant Experience',
          weight: 5,
          score: -1,
          criteria: {
            score5: 'Avg >15 yrs in India PE/VC',
            score3: '10–15 yrs',
            score1: '<10 yrs',
            score0: 'Limited India experience',
          },
        },
        {
          id: 'gp_commitment',
          name: 'GP Commitment',
          weight: 5,
          score: -1,
          criteria: {
            score5: '>3% of fund size',
            score3: '1.5–3%',
            score1: '1–1.5%',
            score0: '<1%',
          },
        },
      ],
    },
    {
      id: 'track_record',
      name: 'The Track Record',
      shortName: 'Track Record',
      totalPoints: 35,
      notes: '',
      metrics: [
        {
          id: 'net_irr',
          name: 'Net IRR (USD)',
          weight: 10,
          score: -1,
          criteria: {
            score5: 'Top quartile (>22%)',
            score3: '2nd quartile (15–22%)',
            score1: '3rd quartile (10–15%)',
            score0: 'Bottom quartile (<10%)',
          },
        },
        {
          id: 'net_moic',
          name: 'Net MOIC (USD)',
          weight: 10,
          score: -1,
          criteria: {
            score5: '>2.5x',
            score3: '2.0x–2.5x',
            score1: '1.5x–2.0x',
            score0: '<1.5x',
          },
        },
        {
          id: 'dpi',
          name: 'DPI (Cash Returns)',
          weight: 10,
          score: -1,
          criteria: {
            score5: '>1.2x in mature funds',
            score3: '0.8x–1.2x',
            score1: '0.5x–0.8x',
            score0: '<0.5x',
          },
        },
        {
          id: 'loss_ratio',
          name: 'Loss Ratio',
          weight: 5,
          score: -1,
          criteria: {
            score5: '<5% capital written off',
            score3: '5–10%',
            score1: '10–15%',
            score0: '>15%',
          },
        },
      ],
    },
    {
      id: 'strategy',
      name: 'The Strategy',
      shortName: 'Strategy',
      totalPoints: 20,
      notes: '',
      metrics: [
        {
          id: 'strategy_fit',
          name: 'Strategy-Market Fit',
          weight: 10,
          score: -1,
          criteria: {
            score5: 'Clear, differentiated niche strategy',
            score3: 'Solid but generic',
            score1: 'Unclear or misaligned',
            score0: 'N/A',
          },
        },
        {
          id: 'fund_size_discipline',
          name: 'Fund Size Discipline',
          weight: 5,
          score: -1,
          criteria: {
            score5: '<1.5x prior fund',
            score3: '1.5x–2.0x',
            score1: '>2.0x',
            score0: 'Significant size increase',
          },
        },
        {
          id: 'vintage_focus',
          name: 'Vintage Focus',
          weight: 5,
          score: -1,
          criteria: {
            score5: 'Fund II or III',
            score3: 'Fund IV',
            score1: 'Fund I or Fund V+',
            score0: 'N/A',
          },
        },
      ],
    },
    {
      id: 'governance',
      name: 'Governance & Operations',
      shortName: 'Governance',
      totalPoints: 15,
      notes: '',
      metrics: [
        {
          id: 'ilpa',
          name: 'ILPA Compliance',
          weight: 5,
          score: -1,
          criteria: {
            score5: 'Full ILPA 3.0 adoption',
            score3: 'Partial adoption',
            score1: 'Limited compliance',
            score0: 'Non-compliant',
          },
        },
        {
          id: 'fee_structure',
          name: 'Fee Structure',
          weight: 5,
          score: -1,
          criteria: {
            score5: 'Mgmt <2%, Carry 20%, Hurdle >8%',
            score3: 'Standard 2/20/8',
            score1: 'Above-market fees',
            score0: 'Egregious fees',
          },
        },
        {
          id: 'operational_dd',
          name: 'Operational DD',
          weight: 5,
          score: -1,
          criteria: {
            score5: 'Passes all critical checks',
            score3: 'Minor issues',
            score1: 'Significant concerns',
            score0: 'Fails ODD',
          },
        },
      ],
    },
  ];
}

export function calcMetricWeightedScore(metric: Metric): number {
  if (metric.score < 0) return 0;
  return (metric.score / 5) * metric.weight;
}

export function calcPillarScore(pillar: Pillar): number {
  return pillar.metrics.reduce((sum, m) => sum + calcMetricWeightedScore(m), 0);
}

export function calcTotalScore(pillars: Pillar[]): number {
  return pillars.reduce((sum, p) => sum + calcPillarScore(p), 0);
}

export function getZeroMetrics(pillars: Pillar[]): string[] {
  const zeros: string[] = [];
  pillars.forEach((p) => {
    p.metrics.forEach((m) => {
      if (m.score === 0) zeros.push(m.name);
    });
  });
  return zeros;
}

export function getVerdict(pillars: Pillar[]): Verdict {
  const total = calcTotalScore(pillars);
  const zeros = getZeroMetrics(pillars);
  if (total >= 75 && zeros.length === 0) return 'pass';
  if (total >= 75 && zeros.length > 0) return 'conditional';
  return 'fail';
}
