import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface Report {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  price_eur: number;
  stripe_price_id: string | null;
  cover_image_url: string | null;
  preview_image_url: string | null;
  status: string;
  category: string;
  author: string;
  edition: string | null;
  has_live_data: boolean;
  live_data_source: string | null;
  metadata: Json;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ReportSection {
  id: string;
  report_id: string;
  order_index: number;
  section_type: string;
  title: string | null;
  subtitle: string | null;
  content_md: string | null;
  chart_config: Json | null;
  table_data: Json | null;
  image_url: string | null;
  css_classes: string | null;
  is_preview: boolean;
  metadata: Json;
}
  id: string;
  report_id: string;
  order_index: number;
  section_type: string;
  title: string | null;
  subtitle: string | null;
  content_md: string | null;
  chart_config: Record<string, unknown> | null;
  table_data: Record<string, unknown> | null;
  image_url: string | null;
  css_classes: string | null;
  is_preview: boolean;
  metadata: Record<string, unknown>;
}

export const useReports = (category?: string) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        let query = supabase
          .from('reports')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setReports(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [category]);

  return { reports, loading, error };
};

export const useReport = (slug: string) => {
  const [report, setReport] = useState<Report | null>(null);
  const [sections, setSections] = useState<ReportSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!slug) return;
      
      try {
        // Fetch report
        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (reportError) throw reportError;
        setReport(reportData);

        // Fetch sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('report_sections')
          .select('*')
          .eq('report_id', reportData.id)
          .order('order_index', { ascending: true });

        if (sectionsError) throw sectionsError;
        setSections(sectionsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [slug]);

  return { report, sections, loading, error };
};

export const useReportAccess = (slug: string, email: string | null) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!slug || !email) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('check_report_access', {
            p_report_slug: slug,
            p_user_email: email,
          });

        if (error) throw error;
        setHasAccess(data || false);
      } catch (err) {
        console.error('Error checking report access:', err);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [slug, email]);

  return { hasAccess, loading };
};

export type { Report, ReportSection };
