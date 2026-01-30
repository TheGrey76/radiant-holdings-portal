import { Button } from '@/components/ui/button';
import { FileDown, Loader2, Eye } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface LPServicesPDFExportProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  mode?: 'download' | 'preview';
  onPreviewReady?: (blobUrl: string) => void;
}

export const LPServicesPDFExport = ({ variant = 'default', size = 'sm', mode = 'download', onPreviewReady }: LPServicesPDFExportProps) => {
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
        pdf.text('Confidential - Aries76 LP Services', margin, pageHeight - 10);
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
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        let xPos = margin + 3;
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
      pdf.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      pdf.setFillColor(accentOrange[0], accentOrange[1], accentOrange[2]);
      pdf.rect(0, pageHeight / 2 - 40, 8, 80, 'F');

      pdf.setFontSize(32);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
      pdf.text('Services for', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
      pdf.text('Limited Partners', pageWidth / 2, pageHeight / 2, { align: 'center' });

      pdf.setFontSize(14);
      pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
      pdf.text('INSTITUTIONAL-GRADE ADVISORY', pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });

      pdf.setFontSize(10);
      pdf.setTextColor(textGray[0], textGray[1], textGray[2]);
      pdf.text('26 years of capital markets expertise • Deep fintech/AI sector knowledge', pageWidth / 2, pageHeight / 2 + 40, { align: 'center' });
      pdf.text('Trusted partner to leading funds', pageWidth / 2, pageHeight / 2 + 50, { align: 'center' });

      pdf.setFontSize(10);
      pdf.text('London • Milan • www.aries76.com', pageWidth / 2, pageHeight - 30, { align: 'center' });

      // ===== PAGE 2 =====
      pdf.addPage();
      pageNumber++;
      y = margin;

      drawSectionHeader('Section 1: Fund Selection & Due Diligence');

      drawTable(
        ['Service', 'Description', 'Deliverable', 'Pricing'],
        [
          ['GP Screening', 'Systematic identification of funds matching your criteria', 'Quarterly shortlist of 15-25 funds', '€6,000 - €15,000/mo'],
          ['Fund Due Diligence', 'Comprehensive DD: strategy, track record, team, operations', 'Full DD report with recommendation', '€12,000 - €40,000/fund'],
          ['Reference Program', 'Structured references on GP under consideration', '10-20 references, summary report', '€8,000 - €18,000'],
        ],
        [35, 55, 45, 35]
      );

      checkPageBreak(35);
      pdf.setFillColor(239, 246, 255);
      pdf.roundedRect(margin, y, contentWidth, 30, 2, 2, 'F');
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 64, 175);
      pdf.text('Due Diligence Tiers', margin + 5, y + 8);

      const ddTiers = [
        { tier: 'Express DD', price: '€12,000', time: '2 weeks' },
        { tier: 'Standard DD', price: '€25,000', time: '4-5 weeks' },
        { tier: 'Enhanced DD', price: '€40,000', time: '6-8 weeks' },
        { tier: 'Emerging Manager DD', price: '€35,000', time: '5-6 weeks' },
      ];

      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(30, 30, 30);
      let tierX = margin + 5;
      ddTiers.forEach((tier) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(tier.tier, tierX, y + 18);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${tier.price} | ${tier.time}`, tierX, y + 24);
        tierX += 42;
      });

      y += 40;

      drawSectionHeader('Section 2: Portfolio Management Support');

      drawTable(
        ['Service', 'Description', 'Deliverable', 'Pricing'],
        [
          ['Fund Monitoring', 'Ongoing monitoring and analysis of PE/VC investments', 'Quarterly performance, benchmarking', '€30,000 - €75,000/yr'],
          ['Co-Investment Sourcing', 'Proactive identification of co-invest opportunities', 'Qualified opportunities, DD support', '€5,000/mo + 1% success'],
          ['Secondary Advisory', 'Buy-side or sell-side fund interest transactions', 'Valuation, process, execution', '0.75% - 1.5% of transaction'],
        ],
        [40, 50, 45, 35]
      );

      drawSectionHeader('Section 3: Strategic Advisory');

      drawTable(
        ['Service', 'Description', 'Timeline', 'Pricing'],
        [
          ['Allocation Strategy', 'Design or optimize PE/VC investment program', '10-14 weeks', '€35,000 - €125,000'],
          ['Emerging Manager Program', 'Design and implement first-time fund strategy', '12-16 weeks', '€60,000'],
          ['Ongoing Program Mgmt', 'Annual emerging manager program management', 'Annual', '€75,000/year'],
        ],
        [45, 55, 30, 40]
      );

      checkPageBreak(50);
      drawSectionHeader('Quick-Win Packages');

      pdf.setFillColor(240, 253, 244);
      pdf.roundedRect(margin, y, contentWidth, 40, 2, 2, 'F');

      const packages = [
        { name: 'GP Landscape Map', price: '€20,000', time: '3 weeks' },
        { name: 'Portfolio Health Check', price: '€25,000', time: '3 weeks' },
        { name: 'Terms Benchmarking', price: '€8,000', time: '1 week' },
        { name: 'Reference Fast-Track', price: '€6,000', time: '1 week' },
        { name: 'Co-Invest Readiness', price: '€15,000', time: '2 weeks' },
      ];

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(30, 30, 30);
      packages.forEach((pkg, idx) => {
        const pkgY = y + 8 + (idx * 6);
        pdf.text(`• ${pkg.name}`, margin + 5, pkgY);
        pdf.text(pkg.price, margin + 80, pkgY);
        pdf.text(pkg.time, margin + 110, pkgY);
      });

      y += 50;

      checkPageBreak(45);
      pdf.setFillColor(254, 249, 195);
      pdf.roundedRect(margin, y, contentWidth, 40, 2, 2, 'F');
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(146, 64, 14);
      pdf.text('Why Aries76?', margin + 5, y + 10);

      const reasons = [
        { others: 'Paid by GPs (conflict)', aries: 'Aligned with your goals' },
        { others: 'Generalist coverage', aries: 'Fintech/AI specialist' },
        { others: 'Junior staff delivery', aries: 'Senior-led engagement' },
        { others: 'High overhead pricing', aries: 'Efficient fee structure' },
      ];

      pdf.setFontSize(7);
      let reasonY = y + 18;
      reasons.forEach((reason) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Others: ${reason.others}`, margin + 5, reasonY);
        pdf.setTextColor(22, 101, 52);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Aries76: ${reason.aries}`, margin + 90, reasonY);
        reasonY += 6;
      });

      addFooter();

      if (forPreview && onPreviewReady) {
        const blob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        onPreviewReady(blobUrl);
      } else {
        pdf.save('Aries76_LP_Services.pdf');
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
