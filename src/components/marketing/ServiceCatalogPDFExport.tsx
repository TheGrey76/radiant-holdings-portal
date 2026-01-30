import { Button } from '@/components/ui/button';
import { FileDown, Loader2, Eye } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface ServiceCatalogPDFExportProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  mode?: 'download' | 'preview';
  onPreviewReady?: (blobUrl: string) => void;
}

export const ServiceCatalogPDFExport = ({ variant = 'default', size = 'sm', mode = 'download', onPreviewReady }: ServiceCatalogPDFExportProps) => {
  const [generating, setGenerating] = useState(false);

  const generatePDF = async (forPreview = false) => {
    setGenerating(true);

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let y = margin;
      let pageNumber = 1;

      const darkNavy = [26, 29, 46];
      const accentOrange = [255, 122, 61];
      const textWhite = [255, 255, 255];
      const textGray = [156, 163, 175];

      const checkPageBreak = (neededSpace: number): boolean => {
        if (y + neededSpace > pageHeight - 30) {
          addFooter();
          pdf.addPage();
          pageNumber++;
          y = margin;
          return true;
        }
        return false;
      };

      const addFooter = () => {
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Confidential - Aries76 Service Catalog 2026', margin, pageHeight - 10);
        pdf.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      };

      const drawSectionHeader = (title: string) => {
        checkPageBreak(25);
        pdf.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        pdf.roundedRect(margin, y - 3, contentWidth, 14, 2, 2, 'F');
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
        pdf.text(title, margin + 5, y + 6);
        y += 20;
      };

      const drawTable = (headers: string[], data: string[][], colWidths: number[]) => {
        const rowHeight = 10;
        
        checkPageBreak(rowHeight * (data.length + 1) + 10);
        
        pdf.setFillColor(30, 41, 59);
        pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        let xPos = margin + 2;
        headers.forEach((header, idx) => {
          pdf.text(header, xPos, y + 3);
          xPos += colWidths[idx];
        });
        y += rowHeight;

        data.forEach((row, rowIdx) => {
          checkPageBreak(rowHeight + 2);
          if (rowIdx % 2 === 0) {
            pdf.setFillColor(248, 250, 252);
            pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
          }
          xPos = margin + 2;
          row.forEach((cell, colIdx) => {
            pdf.setFontSize(6.5);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(50, 50, 50);
            const cellText = pdf.splitTextToSize(cell, colWidths[colIdx] - 2);
            pdf.text(cellText[0], xPos, y + 3);
            xPos += colWidths[colIdx];
          });
          y += rowHeight;
        });
        y += 6;
      };

      // ===== COVER PAGE =====
      pdf.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      pdf.setFillColor(accentOrange[0], accentOrange[1], accentOrange[2]);
      pdf.rect(0, pageHeight / 2 - 40, 8, 80, 'F');

      pdf.setFontSize(14);
      pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
      pdf.text('ARIES76', pageWidth / 2, pageHeight / 2 - 35, { align: 'center' });

      pdf.setFontSize(32);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
      pdf.text('Service Catalog', pageWidth / 2, pageHeight / 2 - 10, { align: 'center' });
      pdf.text('2026', pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });

      pdf.setFontSize(12);
      pdf.setTextColor(textGray[0], textGray[1], textGray[2]);
      pdf.text('Complete Service & Pricing Guide', pageWidth / 2, pageHeight / 2 + 35, { align: 'center' });
      pdf.text('for GPs and LPs', pageWidth / 2, pageHeight / 2 + 47, { align: 'center' });

      pdf.setFontSize(10);
      pdf.text('London • Milan • www.aries76.com', pageWidth / 2, pageHeight - 30, { align: 'center' });

      // ===== PAGE 2: GP Services =====
      pdf.addPage();
      pageNumber++;
      y = margin;

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 30, 30);
      pdf.text('Services for Fund Managers (GPs)', margin, y + 5);
      y += 18;

      drawSectionHeader('Deal Sourcing as a Service');
      drawTable(
        ['Service', 'Description', 'Deliverables', 'Pricing'],
        [
          ['Sector Monitoring', 'Real-time intelligence on fintech/AI companies', 'Weekly digest, alerts, monthly analysis', '€3,000 - €8,000/mo'],
          ['Qualified Deal Flow', 'Pre-qualified opportunities matching thesis', '10-20 opportunities/month with memos', '€5,000/mo + 1.5%'],
          ['Exclusive First-Look', 'Proprietary deals, 2-week exclusivity', '3-5 exclusive opportunities/quarter', '€50,000/yr + 2%'],
        ],
        [38, 52, 48, 32]
      );

      drawSectionHeader('Portfolio Value Creation');
      drawTable(
        ['Service', 'Description', 'Scope', 'Pricing'],
        [
          ['Follow-on Fundraising', 'Full-service Series A-C support', 'Strategy, materials, outreach, closing', '€15-30K + 2-3%'],
          ['Strategic Partnerships', 'Customer & distribution intros', '50-100 targets, facilitated intros', '€25,000/engagement'],
          ['Exit Preparation', 'M&A positioning, buyer mapping', 'Full exit support 6-12 months', '€35K + 1.5-2.5%'],
        ],
        [40, 48, 48, 34]
      );

      drawSectionHeader('Market Intelligence');
      drawTable(
        ['Service', 'Description', 'Deliverable', 'Pricing'],
        [
          ['Sector Deep Dives', 'Comprehensive vertical analysis', '50-page report with company mapping', '€12,000 - €25,000'],
          ['Competitive Intelligence', 'Target + competitor analysis', 'Detailed positioning report', '€3,500 - €8,000'],
          ['Valuation Benchmarking', 'Comparable analysis', 'Comps, valuation range', '€5,000/company'],
        ],
        [42, 50, 48, 30]
      );

      checkPageBreak(35);
      pdf.setFillColor(240, 253, 244);
      pdf.roundedRect(margin, y, contentWidth, 30, 2, 2, 'F');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(22, 101, 52);
      pdf.text('Quick-Win Packages for GPs', margin + 5, y + 8);

      const gpPackages = [
        ['Fund Positioning Audit', '€15,000', '2 weeks'],
        ['LP Readiness Assessment', '€20,000', '3 weeks'],
        ['European Market Entry', '€25,000', '4 weeks'],
        ['Co-Investor Mapping', '€10,000', '10 days'],
      ];

      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(30, 30, 30);
      gpPackages.forEach((pkg, idx) => {
        const pkgY = y + 15 + (idx * 4);
        pdf.text(`• ${pkg[0]}`, margin + 5, pkgY);
        pdf.text(pkg[1], margin + 75, pkgY);
        pdf.text(pkg[2], margin + 105, pkgY);
      });
      y += 38;

      // ===== PAGE 3: LP Services =====
      addFooter();
      pdf.addPage();
      pageNumber++;
      y = margin;

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 30, 30);
      pdf.text('Services for Limited Partners (LPs)', margin, y + 5);
      y += 18;

      drawSectionHeader('Fund Selection & Due Diligence');
      drawTable(
        ['Service', 'Description', 'Deliverable', 'Pricing'],
        [
          ['GP Screening', 'Systematic fund identification', 'Quarterly shortlist of 15-25 funds', '€6,000 - €15,000/mo'],
          ['Fund Due Diligence', 'Comprehensive DD package', 'Full report with recommendation', '€12,000 - €40,000/fund'],
          ['Reference Program', 'Structured GP references', '10-20 references, summary', '€8,000 - €18,000'],
        ],
        [38, 50, 50, 32]
      );

      checkPageBreak(28);
      pdf.setFillColor(239, 246, 255);
      pdf.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 64, 175);
      pdf.text('Due Diligence Tiers:', margin + 5, y + 8);

      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(30, 30, 30);
      pdf.text('Express DD: €12,000 (2 wks) | Standard DD: €25,000 (4-5 wks) | Enhanced DD: €40,000 (6-8 wks) | Emerging Mgr: €35,000 (5-6 wks)', margin + 5, y + 16);
      y += 30;

      drawSectionHeader('Portfolio Management Support');
      drawTable(
        ['Service', 'Description', 'Deliverable', 'Pricing'],
        [
          ['Fund Monitoring', 'Ongoing monitoring & analysis', 'Quarterly performance, benchmarking', '€30,000 - €75,000/yr'],
          ['Co-Investment Sourcing', 'Proactive co-invest identification', 'Qualified opportunities, DD support', '€5,000/mo + 1% success'],
          ['Secondary Advisory', 'Buy/sell-side transactions', 'Valuation, process, execution', '0.75% - 1.5% of transaction'],
        ],
        [42, 50, 48, 30]
      );

      drawSectionHeader('Strategic Advisory');
      drawTable(
        ['Service', 'Description', 'Timeline', 'Pricing'],
        [
          ['Allocation Strategy', 'Design or optimize PE/VC program', '10-14 weeks', '€35,000 - €125,000'],
          ['Emerging Manager Program', 'Design first-time fund strategy', '12-16 weeks', '€60,000'],
          ['Ongoing Program Mgmt', 'Annual emerging manager program', 'Annual', '€75,000/year'],
        ],
        [45, 55, 30, 40]
      );

      checkPageBreak(35);
      pdf.setFillColor(240, 253, 244);
      pdf.roundedRect(margin, y, contentWidth, 35, 2, 2, 'F');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(22, 101, 52);
      pdf.text('Quick-Win Packages for LPs', margin + 5, y + 8);

      const lpPackages = [
        ['GP Landscape Map', '€20,000', '3 weeks'],
        ['Portfolio Health Check', '€25,000', '3 weeks'],
        ['Terms Benchmarking', '€8,000', '1 week'],
        ['Reference Fast-Track', '€6,000', '1 week'],
        ['Co-Invest Readiness', '€15,000', '2 weeks'],
      ];

      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(30, 30, 30);
      lpPackages.forEach((pkg, idx) => {
        const pkgY = y + 15 + (idx * 4);
        pdf.text(`• ${pkg[0]}`, margin + 5, pkgY);
        pdf.text(pkg[1], margin + 75, pkgY);
        pdf.text(pkg[2], margin + 105, pkgY);
      });

      y += 43;

      // ===== PAGE 4: Why It Works =====
      addFooter();
      pdf.addPage();
      pageNumber++;
      y = margin;

      drawSectionHeader('Why Aries76 Works');

      const valueProps = [
        { title: 'AI Platform', desc: 'Monitors 500+ European fintech/AI companies in real-time' },
        { title: 'Human Qualification', desc: 'Ensures thesis alignment and quality opportunities' },
        { title: 'Early Access', desc: 'See opportunities 3-6 months before the market' },
        { title: 'Deep Relationships', desc: '26 years of capital markets expertise and network' },
      ];

      valueProps.forEach((prop) => {
        checkPageBreak(18);
        pdf.setFillColor(accentOrange[0], accentOrange[1], accentOrange[2]);
        pdf.circle(margin + 3, y - 1, 2, 'F');
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(30, 30, 30);
        pdf.text(prop.title, margin + 10, y);
        y += 5;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(9);
        pdf.text(prop.desc, margin + 10, y);
        y += 10;
      });

      y += 5;

      checkPageBreak(40);
      pdf.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      pdf.roundedRect(margin, y, contentWidth, 35, 3, 3, 'F');
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
      pdf.text('Ready to Get Started?', margin + 10, y + 12);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(textGray[0], textGray[1], textGray[2]);
      pdf.text('15-minute discovery call. No pitch. No pressure.', margin + 10, y + 22);
      pdf.text('Just an honest conversation about fit.', margin + 10, y + 29);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
      pdf.text('www.aries76.com/contact', pageWidth - margin - 10, y + 20, { align: 'right' });

      addFooter();

      if (forPreview && onPreviewReady) {
        const blob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        onPreviewReady(blobUrl);
      } else {
        pdf.save('Aries76_Service_Catalog_2026.pdf');
        toast.success('PDF downloaded successfully');
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  const handleClick = () => {
    if (mode === 'preview' && onPreviewReady) {
      generatePDF(true);
    } else {
      generatePDF(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={generating}
      className={mode === 'preview' 
        ? "border-slate-600 hover:border-orange-500/50 hover:bg-orange-500/10" 
        : "bg-orange-500 hover:bg-orange-600 text-slate-900"
      }
    >
      {generating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {mode === 'preview' ? 'Loading...' : 'Generating...'}
        </>
      ) : mode === 'preview' ? (
        <>
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4 mr-2" />
          Download
        </>
      )}
    </Button>
  );
};
