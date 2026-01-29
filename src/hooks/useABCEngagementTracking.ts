import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EngagementData {
  // Investors who have opened at least one email
  openers: Set<string>;
  // Investors who have clicked at least one link
  clickers: Set<string>;
  // Investors who have received email but never opened
  nonOpeners: Set<string>;
  // Investors who have never been contacted
  neverContacted: Set<string>;
  // Email to investor ID mapping
  emailToInvestorId: Map<string, string>;
  // Engagement stats per investor
  investorStats: Map<string, {
    opensCount: number;
    clicksCount: number;
    lastOpenAt: string | null;
    lastClickAt: string | null;
    campaignIds: string[];
  }>;
}

export interface EngagementFilters {
  // Filter types
  filterType: 'all' | 'never_contacted' | 'non_openers' | 'openers' | 'clickers';
}

export const useABCEngagementTracking = (investorEmails: Map<string, string>) => {
  const [engagementData, setEngagementData] = useState<EngagementData>({
    openers: new Set(),
    clickers: new Set(),
    nonOpeners: new Set(),
    neverContacted: new Set(),
    emailToInvestorId: new Map(),
    investorStats: new Map(),
  });
  const [loading, setLoading] = useState(true);

  const fetchEngagementData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all email opens
      const { data: opens } = await supabase
        .from('abc_email_opens')
        .select('recipient_email, campaign_id, opened_at')
        .order('opened_at', { ascending: false });

      // Fetch all email clicks
      const { data: clicks } = await supabase
        .from('abc_email_clicks')
        .select('recipient_email, campaign_id, clicked_at')
        .order('clicked_at', { ascending: false });

      // Fetch all campaign recipients
      const { data: campaigns } = await supabase
        .from('abc_email_campaign_history')
        .select('id, recipients');

      // Build email to investor ID mapping
      const emailToId = new Map<string, string>();
      investorEmails.forEach((email, investorId) => {
        if (email) {
          emailToId.set(email.toLowerCase(), investorId);
        }
      });

      // Track all emails that have been contacted
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
      const openerEmails = new Set<string>();
      const investorStats = new Map<string, {
        opensCount: number;
        clicksCount: number;
        lastOpenAt: string | null;
        lastClickAt: string | null;
        campaignIds: string[];
      }>();

      (opens || []).forEach(open => {
        const email = open.recipient_email.toLowerCase();
        const investorId = emailToId.get(email);
        
        if (investorId) {
          openerEmails.add(email);
          
          const existing = investorStats.get(investorId) || {
            opensCount: 0,
            clicksCount: 0,
            lastOpenAt: null,
            lastClickAt: null,
            campaignIds: [],
          };
          
          existing.opensCount++;
          if (!existing.lastOpenAt || open.opened_at > existing.lastOpenAt) {
            existing.lastOpenAt = open.opened_at;
          }
          if (open.campaign_id && !existing.campaignIds.includes(open.campaign_id)) {
            existing.campaignIds.push(open.campaign_id);
          }
          
          investorStats.set(investorId, existing);
        }
      });

      // Process clicks
      const clickerEmails = new Set<string>();
      (clicks || []).forEach(click => {
        const email = click.recipient_email.toLowerCase();
        const investorId = emailToId.get(email);
        
        if (investorId) {
          clickerEmails.add(email);
          
          const existing = investorStats.get(investorId) || {
            opensCount: 0,
            clicksCount: 0,
            lastOpenAt: null,
            lastClickAt: null,
            campaignIds: [],
          };
          
          existing.clicksCount++;
          if (!existing.lastClickAt || click.clicked_at > existing.lastClickAt) {
            existing.lastClickAt = click.clicked_at;
          }
          if (click.campaign_id && !existing.campaignIds.includes(click.campaign_id)) {
            existing.campaignIds.push(click.campaign_id);
          }
          
          investorStats.set(investorId, existing);
        }
      });

      // Calculate non-openers: contacted but never opened
      const nonOpenerEmails = new Set<string>();
      contactedEmails.forEach(email => {
        if (!openerEmails.has(email)) {
          nonOpenerEmails.add(email);
        }
      });

      // Calculate never contacted
      const neverContactedIds = new Set<string>();
      investorEmails.forEach((email, investorId) => {
        if (email && !contactedEmails.has(email.toLowerCase())) {
          neverContactedIds.add(investorId);
        }
      });

      // Convert email sets to investor ID sets
      const openerIds = new Set<string>();
      openerEmails.forEach(email => {
        const id = emailToId.get(email);
        if (id) openerIds.add(id);
      });

      const clickerIds = new Set<string>();
      clickerEmails.forEach(email => {
        const id = emailToId.get(email);
        if (id) clickerIds.add(id);
      });

      const nonOpenerIds = new Set<string>();
      nonOpenerEmails.forEach(email => {
        const id = emailToId.get(email);
        if (id) nonOpenerIds.add(id);
      });

      setEngagementData({
        openers: openerIds,
        clickers: clickerIds,
        nonOpeners: nonOpenerIds,
        neverContacted: neverContactedIds,
        emailToInvestorId: emailToId,
        investorStats,
      });

    } catch (error) {
      console.error('Error fetching engagement data:', error);
    } finally {
      setLoading(false);
    }
  }, [investorEmails]);

  useEffect(() => {
    if (investorEmails.size > 0) {
      fetchEngagementData();
    }
  }, [fetchEngagementData, investorEmails]);

  const refetch = useCallback(() => {
    fetchEngagementData();
  }, [fetchEngagementData]);

  // Get engagement label for an investor
  const getEngagementLabel = (investorId: string): 'engaged' | 'clicked' | 'non_opener' | 'never_contacted' | 'unknown' => {
    if (engagementData.clickers.has(investorId)) return 'clicked';
    if (engagementData.openers.has(investorId)) return 'engaged';
    if (engagementData.nonOpeners.has(investorId)) return 'non_opener';
    if (engagementData.neverContacted.has(investorId)) return 'never_contacted';
    return 'unknown';
  };

  // Get stats for an investor
  const getInvestorStats = (investorId: string) => {
    return engagementData.investorStats.get(investorId) || null;
  };

  return {
    engagementData,
    loading,
    refetch,
    getEngagementLabel,
    getInvestorStats,
  };
};
