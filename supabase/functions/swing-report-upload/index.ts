import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { token, format } = body;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate upload token
    const { data: tokenData, error: tokenError } = await supabase
      .from('swing_upload_tokens')
      .select('*')
      .eq('token', token)
      .eq('is_active', true)
      .single();

    if (tokenError || !tokenData) {
      console.error('Invalid upload token:', token);
      return new Response(JSON.stringify({ error: 'Invalid or expired upload token' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Valid upload token: ${tokenData.label}, format: ${format || 'markdown'}`);

    let reportData: any;
    let positions: any[] = [];

    // ========== JSON FORMAT ==========
    if (format === 'json') {
      const { report, positions: jsonPositions } = body;

      if (!report || !jsonPositions || !Array.isArray(jsonPositions)) {
        return new Response(JSON.stringify({ error: 'JSON format requires "report" object and "positions" array' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`JSON upload: ${report.client_name}, ${jsonPositions.length} positions`);

      // Insert report
      const { data: insertedReport, error: insertError } = await supabase
        .from('swing_reports')
        .insert({
          client_name: report.client_name || 'Unknown',
          capital: report.capital || null,
          risk_profile: report.risk_profile || null,
          sectors: report.sectors || null,
          horizon: report.horizon || null,
          report_date: report.report_date || null,
          week_range: report.week_range || null,
          raw_content: JSON.stringify(body, null, 2),
          file_name: report.file_name || 'json-upload.json',
          uploaded_by: tokenData.label,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting report:', insertError);
        throw new Error(`Failed to save report: ${insertError.message}`);
      }

      reportData = insertedReport;

      // Map JSON positions to DB schema
      positions = jsonPositions.map((p: any) => ({
        report_id: insertedReport.id,
        ticker: p.ticker,
        name: p.name || null,
        sector: p.sector || null,
        status: p.status || 'PASS',
        entry_zone_low: p.entry_zone_low ?? null,
        entry_zone_high: p.entry_zone_high ?? null,
        stop_loss: p.stop_loss ?? null,
        target_1: p.target_1 ?? null,
        target_2: p.target_2 ?? null,
        target_3: p.target_3 ?? null,
        risk_reward: p.risk_reward ?? null,
        allocation_pct: p.allocation_pct ?? null,
        allocation_amount: p.allocation_amount ?? null,
        confidence: p.confidence || null,
        is_active: p.is_active !== undefined ? p.is_active : true,
        notes: p.notes || null,
      }));

    // ========== MARKDOWN FORMAT (legacy) ==========
    } else {
      const { content, file_name, client_name } = body;

      if (!content) {
        return new Response(JSON.stringify({ error: 'Content is required for markdown format' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const metadata = parseReportMetadata(content);

      const { data: insertedReport, error: insertError } = await supabase
        .from('swing_reports')
        .insert({
          client_name: client_name || metadata.client_name || 'Unknown',
          capital: metadata.capital,
          risk_profile: metadata.risk_profile,
          sectors: metadata.sectors,
          horizon: metadata.horizon,
          report_date: metadata.report_date,
          week_range: metadata.week_range,
          raw_content: content,
          file_name: file_name || 'uploaded-report.md',
          uploaded_by: tokenData.label,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting report:', insertError);
        throw new Error(`Failed to save report: ${insertError.message}`);
      }

      reportData = insertedReport;
      positions = parsePositions(content, insertedReport.id);
    }

    console.log('Report saved:', reportData.id);

    // Insert positions
    if (positions.length > 0) {
      const { error: posError } = await supabase
        .from('swing_positions')
        .insert(positions);
      
      if (posError) {
        console.error('Error inserting positions:', posError);
      } else {
        console.log(`Inserted ${positions.length} positions`);
      }
    }

    // Send email notification
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const notificationEmail = tokenData.notification_email || 'info@aries76.com';
        
        const positionsSummary = positions
          .filter((p: any) => p.status === 'PASS' || p.status === 'WATCHLIST')
          .map((p: any) => `${p.status === 'PASS' ? '✅' : '⚠️'} ${p.ticker} — ${p.name || ''} (${p.sector || ''})`)
          .join('<br/>');

        const reportName = reportData.client_name || 'Report';
        const weekRange = reportData.week_range || 'N/A';
        const uploadFormat = format === 'json' ? '📋 JSON' : '📄 Markdown';

        await resend.emails.send({
          from: 'Aries76 Swing <noreply@aries76.com>',
          to: [notificationEmail],
          subject: `📊 Nuovo Swing Report: ${reportName} — ${weekRange}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1a365d;">Nuovo Swing Report Caricato</h2>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Cliente</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${reportName}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Capitale</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">$${reportData.capital?.toLocaleString() || 'N/A'}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Settimana</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${weekRange}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Formato</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${uploadFormat}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Caricato da</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${tokenData.label}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Posizioni</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${positions.length} totali</td></tr>
              </table>
              ${positionsSummary ? `<h3 style="color: #1a365d; margin-top: 24px;">Segnali</h3><p style="line-height: 1.8;">${positionsSummary}</p>` : ''}
              <p style="margin-top: 24px; color: #718096; font-size: 14px;">
                <a href="https://aries76.lovable.app/swingreport" style="color: #dd6b20;">Apri Dashboard →</a>
              </p>
            </div>
          `,
        });
        console.log('Notification email sent to:', notificationEmail);
      } catch (emailErr) {
        console.error('Failed to send notification email:', emailErr);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      report_id: reportData.id,
      positions_count: positions.length,
      format: format || 'markdown',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in swing-report-upload:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// ========== Markdown parsing (legacy) ==========

function parseReportMetadata(content: string) {
  const clientMatch = content.match(/\*\*Cliente:\*\*\s*(.+)/);
  const capitalMatch = content.match(/\*\*Capitale:\*\*\s*\$?([\d,]+)/);
  const riskMatch = content.match(/\*\*Profilo Rischio:\*\*\s*(.+)/);
  const sectorsMatch = content.match(/\*\*Settori:\*\*\s*(.+)/);
  const horizonMatch = content.match(/\*\*Orizzonte:\*\*\s*(.+)/);
  const dateMatch = content.match(/\*\*Data Report:\*\*\s*(.+)/);
  const weekMatch = content.match(/Settimana\s+([\d]+-[\d]+\s+\w+\s+\d{4})/);

  return {
    client_name: clientMatch?.[1]?.trim() || null,
    capital: capitalMatch ? parseFloat(capitalMatch[1].replace(/,/g, '')) : null,
    risk_profile: riskMatch?.[1]?.trim() || null,
    sectors: sectorsMatch ? sectorsMatch[1].split(/\s*\+\s*/).map(s => s.trim()) : null,
    horizon: horizonMatch?.[1]?.trim() || null,
    report_date: dateMatch?.[1]?.trim() || null,
    week_range: weekMatch?.[1]?.trim() || null,
  };
}

function parsePositions(content: string, reportId: string) {
  const positions: any[] = [];

  const passSection = content.match(/### ✅ PASS.*?\n\n([\s\S]*?)(?=\n###|\n## )/);
  if (passSection) {
    const rows = passSection[1].match(/\|\s*\*\*(\w+)\*\*\s*\|(.+)\|/g);
    if (rows) {
      for (const row of rows) {
        const pos = parsePositionRow(row, 'PASS', reportId);
        if (pos) positions.push(pos);
      }
    }
  }

  const watchSection = content.match(/### ⚠️ WATCHLIST.*?\n\n([\s\S]*?)(?=\n>|\n## )/);
  if (watchSection) {
    const rows = watchSection[1].match(/\|\s*\*\*(\w+)\*\*\s*\|(.+)\|/g);
    if (rows) {
      for (const row of rows) {
        const pos = parsePositionRow(row, 'WATCHLIST', reportId);
        if (pos) positions.push(pos);
      }
    }
  }

  return positions;
}

function parsePositionRow(row: string, status: string, reportId: string) {
  const cells = row.split('|').map(c => c.trim()).filter(c => c);
  if (cells.length < 11) return null;

  const ticker = cells[0].replace(/\*\*/g, '').trim();
  const name = cells[1].trim();
  const sector = cells[2].trim();
  
  const entryText = cells[4];
  const entryMatch = entryText.match(/\$?([\d.]+)\s*-\s*\$?([\d.]+)/);
  const singleEntry = entryText.match(/\$?([\d.]+)/);
  
  const entryLow = entryMatch ? parseFloat(entryMatch[1]) : (singleEntry ? parseFloat(singleEntry[1]) : null);
  const entryHigh = entryMatch ? parseFloat(entryMatch[2]) : null;
  
  const stopMatch = cells[5].match(/\$?([\d.]+)/);
  const t1Match = cells[6].match(/\$?([\d.]+)/);
  const t2Match = cells[7].match(/\$?([\d.]+)/);
  const t3Match = cells[8].match(/\$?([\d.]+)/);
  const rrMatch = cells[9].match(/([\d.]+)/);
  const sizeMatch = cells[10].match(/([\d.]+)%\s*\(\$([\d,]+)\)/);
  const confidenceText = cells[11] || '';

  return {
    report_id: reportId,
    ticker,
    name,
    sector,
    status,
    entry_zone_low: entryLow,
    entry_zone_high: entryHigh,
    stop_loss: stopMatch ? parseFloat(stopMatch[1]) : null,
    target_1: t1Match ? parseFloat(t1Match[1]) : null,
    target_2: t2Match ? parseFloat(t2Match[1]) : null,
    target_3: t3Match ? parseFloat(t3Match[1]) : null,
    risk_reward: rrMatch ? parseFloat(rrMatch[1]) : null,
    allocation_pct: sizeMatch ? parseFloat(sizeMatch[1]) : null,
    allocation_amount: sizeMatch ? parseFloat(sizeMatch[2].replace(/,/g, '')) : null,
    confidence: confidenceText.replace(/[✅⚠️❌]/g, '').trim() || null,
    is_active: true,
  };
}
