import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface GPServicesPDFExportProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export const GPServicesPDFExport = ({ variant = 'default', size = 'sm' }: GPServicesPDFExportProps) => {
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let y = margin;
      let pageNumber = 1;

      const darkBlue = [10, 22, 40];
      const accentGold = [212, 175, 55];
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
        pdf.text('Confidential - Aries76 GP Services', margin, pageHeight - 10);
        pdf.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      };

      const drawSectionHeader = (title: string) => {
        checkPageBreak(25);
        pdf.setFillColor(15, 30, 54);
        pdf.roundedRect(margin, y - 3, contentWidth, 14, 2, 2, 'F');
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(accentGold[0], accentGold[1], accentGold[2]);
        pdf.text(title, margin + 5, y + 6);
        y += 20;
      };

      const drawTable = (headers: string[], data: string[][], colWidths: number[]) => {
        const rowHeight = 10;
        
        checkPageBreak(rowHeight * (data.length + 1) + 10);
        
        // Header
        pdf.setFillColor(30, 41, 59);
        pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        let xPos = margin + 3;
        headers.forEach((header, idx) => {
          pdf.text(header, xPos, y + 3);
          xPos += colWidths[idx];
        });
        y += rowHeight;

        // Rows
        data.forEach((row, rowIdx) => {
          checkPageBreak(rowHeight + 2);
          if (rowIdx % 2 === 0) {
            pdf.setFillColor(248, 250, 252);
            pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
          }
          xPos = margin + 3;
          row.forEach((cell, colIdx) => {
            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(50, 50, 50);
            const cellText = pdf.splitTextToSize(cell, colWidths[colIdx] - 3);
            pdf.text(cellText[0], xPos, y + 3);
            xPos += colWidths[colIdx];
          });
          y += rowHeight;
        });
        y += 8;
      };

      // ===== COVER PAGE =====
      pdf.setFillColor(darkBlue[0], darkBlue[1], darkBlue[2]);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      pdf.setFillColor(accentGold[0], accentGold[1], accentGold[2]);
      pdf.rect(0, pageHeight / 2 - 40, 8, 80, 'F');

      pdf.setFontSize(32);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
      pdf.text('Services for', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
      pdf.text('Fund Managers', pageWidth / 2, pageHeight / 2, { align: 'center' });

      pdf.setFontSize(14);
      pdf.setTextColor(accentGold[0], accentGold[1], accentGold[2]);
      pdf.text('AI-POWERED SOLUTIONS FOR PE/VC FUNDS', pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });

      pdf.setFontSize(10);
      pdf.setTextColor(textGray[0], textGray[1], textGray[2]);
      pdf.text('Deploy capital efficiently. Differentiate your deal flow.', pageWidth / 2, pageHeight / 2 + 40, { align: 'center' });
      pdf.text('Support portfolio companies through exit.', pageWidth / 2, pageHeight / 2 + 50, { align: 'center' });

      pdf.setFontSize(10);
      pdf.text('London • Milan • www.aries76.com', pageWidth / 2, pageHeight - 30, { align: 'center' });

      // ===== PAGE 2 =====
      pdf.addPage();
      pageNumber++;
      y = margin;

      drawSectionHeader('Section 1: Deal Sourcing as a Service');

      drawTable(
        ['Service', 'Description', 'Deliverables', 'Pricing'],
        [
          ['Sector Monitoring', 'Real-time intelligence on fintech/AI companies across Europe', 'Weekly digest, alerts, monthly analysis', '€3,000 - €8,000/mo'],
          ['Qualified Deal Flow', 'Pre-qualified opportunities matching your investment thesis', '10-20 opportunities/month with memos', '€5,000/mo + 1.5% success'],
          ['Exclusive First-Look', 'Proprietary deals with 2-week exclusivity window', '3-5 exclusive opportunities/quarter', '€50,000/yr + 2% success'],
        ],
        [40, 55, 45, 30]
      );

      drawSectionHeader('Section 2: Portfolio Value Creation');

      drawTable(
        ['Service', 'Description', 'Scope', 'Pricing'],
        [
          ['Follow-on Fundraising', 'Full-service Series A-C support for portfolio companies', 'Strategy, materials, outreach, closing', '€15-30K + 2-3% success'],
          ['Strategic Partnerships', 'Customer, distribution, technology partner introductions', '50-100 targets, facilitated intros', '€25,000/engagement'],
          ['Exit Preparation', 'M&A positioning, buyer mapping, process management', 'Full exit support over 6-12 months', '€35K + 1.5-2.5% success'],
        ],
        [40, 50, 45, 35]
      );

      drawSectionHeader('Section 3: Market Intelligence');

      drawTable(
        ['Service', 'Description', 'Deliverable', 'Pricing'],
        [
          ['Sector Deep Dives', 'Comprehensive analysis of specific fintech/AI verticals', '50-page report with company mapping', '€12,000 - €25,000'],
          ['Competitive Intelligence', 'Target company + competitor analysis', 'Detailed positioning report', '€3,500 - €8,000'],
          ['Valuation Benchmarking', 'Comparable analysis for investment decisions', 'Comps analysis, valuation range', '€5,000/company'],
        ],
        [42, 55, 45, 28]
      );

      // Quick-Win Packages
      checkPageBreak(50);
      drawSectionHeader('Quick-Win Packages');

      pdf.setFillColor(240, 253, 244);
      pdf.roundedRect(margin, y, contentWidth, 40, 2, 2, 'F');
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(22, 101, 52);
      pdf.text('Fixed scope. Fixed price. Fast delivery.', margin + 5, y + 8);

      const packages = [
        { name: 'Fund Positioning Audit', price: '€15,000', time: '2 weeks' },
        { name: 'LP Readiness Assessment', price: '€20,000', time: '3 weeks' },
        { name: 'European Market Entry', price: '€25,000', time: '4 weeks' },
        { name: 'Co-Investor Mapping', price: '€10,000', time: '10 days' },
      ];

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(30, 30, 30);
      packages.forEach((pkg, idx) => {
        const pkgY = y + 16 + (idx * 6);
        pdf.text(`• ${pkg.name}`, margin + 5, pkgY);
        pdf.text(pkg.price, margin + 80, pkgY);
        pdf.text(pkg.time, margin + 110, pkgY);
      });

      y += 50;

      // Aries76 Difference
      checkPageBreak(50);
      pdf.setFillColor(254, 249, 195);
      pdf.roundedRect(margin, y, contentWidth, 45, 2, 2, 'F');
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(146, 64, 14);
      pdf.text('The Aries76 Difference', margin + 5, y + 10);

      const differences = [
        { traditional: 'Relationship-based sourcing', aries: 'AI-powered + relationships' },
        { traditional: 'Generic market knowledge', aries: 'Deep fintech/AI expertise' },
        { traditional: 'Transactional model', aries: 'Partnership approach' },
        { traditional: 'Reactive service', aries: 'Proactive intelligence' },
      ];

      pdf.setFontSize(7);
      let diffY = y + 18;
      differences.forEach((diff) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Traditional: ${diff.traditional}`, margin + 5, diffY);
        pdf.setTextColor(22, 101, 52);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Aries76: ${diff.aries}`, margin + 90, diffY);
        diffY += 6;
      });

      addFooter();

      pdf.save('Aries76_GP_Services.pdf');
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={generatePDF}
      disabled={generating}
      className="bg-amber-500 hover:bg-amber-600 text-slate-900"
    >
      {generating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
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
