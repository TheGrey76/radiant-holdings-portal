import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Types
export interface Investor {
  id: string;
  nome: string;
  azienda: string;
  ruolo?: string;
  categoria: string;
  citta?: string;
  fonte?: string;
  status: string;
  pipelineValue: number;
  lastContactDate?: string;
  linkedin?: string;
  email?: string;
  phone?: string;
  approvalStatus?: 'pending' | 'approved' | 'not_approved';
  priorita?: string;
  rilevanza?: string;
  engagementScore?: number;
  expectedClose?: string;
  probability?: number;
}

export interface MissingDataStats {
  totalInvestors: number;
  missingEmail: number;
  missingLinkedin: number;
  investorsWithMissingData: Array<{
    id: string;
    nome: string;
    azienda: string;
    ruolo?: string;
    categoria: string;
    missingEmail: boolean;
    missingLinkedin: boolean;
  }>;
}

export interface EngagementStats {
  openers: Set<string>;
  clickers: Set<string>;
  nonOpeners: Set<string>;
  neverContacted: Set<string>;
  investorStats: Map<string, {
    opensCount: number;
    clicksCount: number;
    lastOpenAt: string | null;
    lastClickAt: string | null;
  }>;
}

interface ABCDataContextType {
  // Data
  investors: Investor[];
  missingDataStats: MissingDataStats | null;
  engagementStats: EngagementStats | null;
  
  // Loading states
  isLoadingInvestors: boolean;
  isLoadingStats: boolean;
  isEnriching: boolean;
  enrichProgress: number;
  
  // Actions
  refreshAll: () => Promise<void>;
  refreshInvestors: () => Promise<void>;
  refreshEngagement: () => Promise<void>;
  refreshMissingData: () => Promise<void>;
  enrichInvestors: (percentage: number) => Promise<void>;
  stopEnrichment: () => void;
  
  // Helpers
  isEnriched: (investor: Investor) => boolean;
  getEngagementLabel: (investorId: string) => 'clicked' | 'engaged' | 'non_opener' | 'never_contacted' | 'unknown';
  
  // Refresh key for forcing component re-renders
  refreshKey: number;
}

const ABCDataContext = createContext<ABCDataContextType | null>(null);

export const useABCData = () => {
  const context = useContext(ABCDataContext);
  if (!context) {
    throw new Error('useABCData must be used within ABCDataProvider');
  }
  return context;
};

interface ABCDataProviderProps {
  children: React.ReactNode;
}

export const ABCDataProvider: React.FC<ABCDataProviderProps> = ({ children }) => {
  // Core data
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [missingDataStats, setMissingDataStats] = useState<MissingDataStats | null>(null);
  const [engagementStats, setEngagementStats] = useState<EngagementStats | null>(null);
  
  // Loading states
  const [isLoadingInvestors, setIsLoadingInvestors] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichProgress, setEnrichProgress] = useState(0);
  
  // Refresh key to force re-renders
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Stop enrichment ref
  const stopEnrichmentRef = useRef(false);

  // Helper: check if investor has enriched data
  const isEnriched = useCallback((investor: Investor) => {
    const hasEmail = investor.email && investor.email.trim() !== '' && investor.email.trim().toLowerCase() !== 'null';
    const hasLinkedin = investor.linkedin && investor.linkedin.trim() !== '' && investor.linkedin.trim().toLowerCase() !== 'null';
    return !!(hasEmail || hasLinkedin);
  }, []);

  // Fetch investors
  const refreshInvestors = useCallback(async () => {
    setIsLoadingInvestors(true);
    try {
      const { data, error } = await supabase
        .from('abc_investors')
        .select('*')
        .order('nome');

      if (error) throw error;

      const mapped: Investor[] = (data || []).map(inv => ({
        id: inv.id,
        nome: inv.nome,
        azienda: inv.azienda,
        ruolo: inv.ruolo,
        categoria: inv.categoria,
        citta: inv.citta,
        fonte: inv.fonte,
        status: inv.status,
        pipelineValue: Number(inv.pipeline_value) || 0,
        lastContactDate: inv.last_contact_date,
        linkedin: inv.linkedin,
        email: inv.email,
        phone: inv.phone,
        approvalStatus: inv.approval_status as 'pending' | 'approved' | 'not_approved',
        priorita: inv.priorita,
        rilevanza: inv.rilevanza,
        engagementScore: inv.engagement_score,
        expectedClose: inv.expected_close,
        probability: inv.probability,
      }));

      setInvestors(mapped);
    } catch (error) {
      console.error('Error fetching investors:', error);
    } finally {
      setIsLoadingInvestors(false);
    }
  }, []);

  // Calculate missing data stats
  const refreshMissingData = useCallback(async () => {
    try {
      const investorList = investors;
      const totalInvestors = investorList.length;
      
      const investorsWithMissingData = investorList
        .map(inv => ({
          id: inv.id,
          nome: inv.nome,
          azienda: inv.azienda,
          ruolo: inv.ruolo,
          categoria: inv.categoria,
          missingEmail: !inv.email || inv.email.trim() === '' || inv.email.trim().toLowerCase() === 'null',
          missingLinkedin: !inv.linkedin || inv.linkedin.trim() === '' || inv.linkedin.trim().toLowerCase() === 'null'
        }))
        .filter(inv => inv.missingEmail || inv.missingLinkedin);

      const missingEmail = investorsWithMissingData.filter(i => i.missingEmail).length;
      const missingLinkedin = investorsWithMissingData.filter(i => i.missingLinkedin).length;

      setMissingDataStats({
        totalInvestors,
        missingEmail,
        missingLinkedin,
        investorsWithMissingData
      });
    } catch (error) {
      console.error('Error calculating missing data stats:', error);
    }
  }, [investors]);

  // Fetch engagement data
  const refreshEngagement = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      // Build email to investor ID mapping
      const emailToId = new Map<string, string>();
      investors.forEach(inv => {
        if (inv.email) {
          emailToId.set(inv.email.toLowerCase(), inv.id);
        }
      });

      // Fetch opens
      const { data: opens } = await supabase
        .from('abc_email_opens')
        .select('recipient_email, campaign_id, opened_at')
        .order('opened_at', { ascending: false });

      // Fetch clicks
      const { data: clicks } = await supabase
        .from('abc_email_clicks')
        .select('recipient_email, campaign_id, clicked_at')
        .order('clicked_at', { ascending: false });

      // Fetch campaign recipients
      const { data: campaigns } = await supabase
        .from('abc_email_campaign_history')
        .select('id, recipients');

      // Track contacted emails
      const contactedEmails = new Set<string>();
      (campaigns || []).forEach(campaign => {
        const recipients = campaign.recipients as Array<{ email: string }> | null;
        if (recipients && Array.isArray(recipients)) {
          recipients.forEach(r => {
            if (r.email) contactedEmails.add(r.email.toLowerCase());
          });
        }
      });

      // Process opens
      const openerIds = new Set<string>();
      const investorStatsMap = new Map<string, {
        opensCount: number;
        clicksCount: number;
        lastOpenAt: string | null;
        lastClickAt: string | null;
      }>();

      (opens || []).forEach(open => {
        const email = open.recipient_email.toLowerCase();
        const investorId = emailToId.get(email);
        
        if (investorId) {
          openerIds.add(investorId);
          
          const existing = investorStatsMap.get(investorId) || {
            opensCount: 0,
            clicksCount: 0,
            lastOpenAt: null,
            lastClickAt: null,
          };
          
          existing.opensCount++;
          if (!existing.lastOpenAt || open.opened_at > existing.lastOpenAt) {
            existing.lastOpenAt = open.opened_at;
          }
          
          investorStatsMap.set(investorId, existing);
        }
      });

      // Process clicks
      const clickerIds = new Set<string>();
      (clicks || []).forEach(click => {
        const email = click.recipient_email.toLowerCase();
        const investorId = emailToId.get(email);
        
        if (investorId) {
          clickerIds.add(investorId);
          
          const existing = investorStatsMap.get(investorId) || {
            opensCount: 0,
            clicksCount: 0,
            lastOpenAt: null,
            lastClickAt: null,
          };
          
          existing.clicksCount++;
          if (!existing.lastClickAt || click.clicked_at > existing.lastClickAt) {
            existing.lastClickAt = click.clicked_at;
          }
          
          investorStatsMap.set(investorId, existing);
        }
      });

      // Calculate non-openers
      const nonOpenerIds = new Set<string>();
      contactedEmails.forEach(email => {
        const investorId = emailToId.get(email);
        if (investorId && !openerIds.has(investorId)) {
          nonOpenerIds.add(investorId);
        }
      });

      // Calculate never contacted
      const neverContactedIds = new Set<string>();
      investors.forEach(inv => {
        if (inv.email && !contactedEmails.has(inv.email.toLowerCase())) {
          neverContactedIds.add(inv.id);
        }
      });

      setEngagementStats({
        openers: openerIds,
        clickers: clickerIds,
        nonOpeners: nonOpenerIds,
        neverContacted: neverContactedIds,
        investorStats: investorStatsMap,
      });
    } catch (error) {
      console.error('Error fetching engagement data:', error);
    } finally {
      setIsLoadingStats(false);
    }
  }, [investors]);

  // Get engagement label
  const getEngagementLabel = useCallback((investorId: string): 'clicked' | 'engaged' | 'non_opener' | 'never_contacted' | 'unknown' => {
    if (!engagementStats) return 'unknown';
    if (engagementStats.clickers.has(investorId)) return 'clicked';
    if (engagementStats.openers.has(investorId)) return 'engaged';
    if (engagementStats.nonOpeners.has(investorId)) return 'non_opener';
    if (engagementStats.neverContacted.has(investorId)) return 'never_contacted';
    return 'unknown';
  }, [engagementStats]);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await refreshInvestors();
    // These will be triggered by the effect when investors change
  }, [refreshInvestors]);

  // Enrichment function
  const enrichInvestors = useCallback(async (percentage: number) => {
    if (!missingDataStats || missingDataStats.investorsWithMissingData.length === 0) return;

    setIsEnriching(true);
    setEnrichProgress(0);
    stopEnrichmentRef.current = false;

    const allToEnrich = missingDataStats.investorsWithMissingData;
    const count = Math.max(1, Math.ceil(allToEnrich.length * (percentage / 100)));
    const toEnrich = allToEnrich.slice(0, count);
    
    let completed = 0;
    let enriched = 0;

    for (const investor of toEnrich) {
      if (stopEnrichmentRef.current) {
        break;
      }

      try {
        const { data, error } = await supabase.functions.invoke('ai-investor-enrichment', {
          body: {
            investorId: investor.id,
            nome: investor.nome,
            azienda: investor.azienda,
            ruolo: investor.ruolo,
            categoria: investor.categoria,
          },
        });

        if (!error && data?.updated) {
          enriched++;
        }
      } catch (err) {
        console.error('Error enriching investor:', investor.nome, err);
      }

      completed++;
      setEnrichProgress(Math.round((completed / toEnrich.length) * 100));
      
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setIsEnriching(false);
    stopEnrichmentRef.current = false;
    
    // Refresh all data after enrichment
    await refreshInvestors();
    
    // Increment refresh key to force component updates
    setRefreshKey(prev => prev + 1);
    
    return;
  }, [missingDataStats, refreshInvestors]);

  // Stop enrichment
  const stopEnrichment = useCallback(() => {
    stopEnrichmentRef.current = true;
  }, []);

  // Initial load
  useEffect(() => {
    refreshInvestors();
  }, [refreshInvestors]);

  // Update derived data when investors change
  useEffect(() => {
    if (investors.length > 0) {
      refreshMissingData();
      refreshEngagement();
    }
  }, [investors, refreshMissingData, refreshEngagement]);

  const value: ABCDataContextType = {
    investors,
    missingDataStats,
    engagementStats,
    isLoadingInvestors,
    isLoadingStats,
    isEnriching,
    enrichProgress,
    refreshAll,
    refreshInvestors,
    refreshEngagement,
    refreshMissingData,
    stopEnrichment,
    enrichInvestors,
    isEnriched,
    getEngagementLabel,
    refreshKey,
  };

  return (
    <ABCDataContext.Provider value={value}>
      {children}
    </ABCDataContext.Provider>
  );
};
