import { Button } from '@/components/ui/button';
import { FileDown, Loader2, Eye } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface OverviewPDFExportProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  mode?: 'download' | 'preview';
  onPreviewReady?: (blobUrl: string) => void;
}

export const OverviewPDFExport = ({ variant = 'default', size = 'sm', mode = 'download', onPreviewReady }: OverviewPDFExportProps) => {
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
        pdf.text('Confidential - Aries76 Ltd.', margin, pageHeight - 10);
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

      const drawTextBlock = (text: string, fontSize: number = 10) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        const lines = pdf.splitTextToSize(text, contentWidth);
        const lineHeight = fontSize * 0.45;
        lines.forEach((line: string) => {
          checkPageBreak(lineHeight + 2);
          pdf.text(line, margin, y);
          y += lineHeight;
        });
        y += 5;
      };

      const drawBullet = (title: string, description: string) => {
        checkPageBreak(18);
        pdf.setFillColor(accentOrange[0], accentOrange[1], accentOrange[2]);
        pdf.circle(margin + 3, y - 1, 2, 'F');
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(30, 30, 30);
        pdf.text(title, margin + 10, y);
        y += 5;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        const lines = pdf.splitTextToSize(description, contentWidth - 15);
        lines.forEach((line: string) => {
          checkPageBreak(5);
          pdf.text(line, margin + 10, y);
          y += 4.5;
        });
        y += 4;
      };

      // ===== COVER PAGE =====
      pdf.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      pdf.setFillColor(accentOrange[0], accentOrange[1], accentOrange[2]);
      pdf.rect(0, pageHeight / 2 - 40, 8, 80, 'F');

      pdf.setFontSize(36);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
      pdf.text('ARIES76', pageWidth / 2, pageHeight / 2 - 25, { align: 'center' });

      pdf.setFontSize(14);
      pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
      pdf.text('CAPITAL INTELLIGENCE', pageWidth / 2, pageHeight / 2 - 10, { align: 'center' });

      pdf.setFontSize(20);
      pdf.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
      pdf.text('Connecting Capital & Vision', pageWidth / 2, pageHeight / 2 + 15, { align: 'center' });

      pdf.setFontSize(11);
      pdf.setTextColor(textGray[0], textGray[1], textGray[2]);
      pdf.text('AI-amplified capital formation and investor intelligence', pageWidth / 2, pageHeight / 2 + 35, { align: 'center' });
      pdf.text('for the European private markets ecosystem', pageWidth / 2, pageHeight / 2 + 45, { align: 'center' });

      pdf.setFontSize(10);
      pdf.text('London • Milan', pageWidth / 2, pageHeight - 40, { align: 'center' });
      pdf.text('www.aries76.com', pageWidth / 2, pageHeight - 30, { align: 'center' });

      // ===== PAGE 2 =====
      pdf.addPage();
      pageNumber++;
      y = margin;

      drawSectionHeader('The Aries76 Advantage');

      drawTextBlock('We help PE/VC funds and institutional investors navigate the European fintech & AI landscape through technology-powered processes and 26 years of capital markets expertise.');

      y += 5;

      drawBullet('AI-Powered Intelligence', 'Technology-driven sourcing and matching. See opportunities 3-6 months before the market.');
      drawBullet('Process, Not Introductions', 'Structured methodologies that deliver results. We don\'t disappear after the handshake.');
      drawBullet('Partnership Model', 'Aligned incentives through flexible fee structures. We succeed when you succeed.');

      y += 8;

      checkPageBreak(45);
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(margin, y, contentWidth, 40, 3, 3, 'F');
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 30, 30);
      pdf.text('Track Record', margin + 5, y + 10);

      const stats = [
        { value: '26+', label: 'Years Experience' },
        { value: '500+', label: 'Companies Monitored' },
        { value: '€3B+', label: 'Capital Markets Track Record' },
      ];

      let statX = margin + 15;
      stats.forEach((stat) => {
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
        pdf.text(stat.value, statX, y + 25);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        pdf.text(stat.label, statX, y + 32);
        statX += 55;
      });

      y += 50;

      drawSectionHeader('How We Help');

      checkPageBreak(60);
      
      pdf.setFillColor(240, 253, 244);
      pdf.roundedRect(margin, y, contentWidth / 2 - 5, 55, 2, 2, 'F');
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(22, 101, 52);
      pdf.text('For Fund Managers (GPs)', margin + 5, y + 10);
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(30, 30, 30);
      const gpServices = ['• Deal Sourcing as a Service', '• Portfolio Company Fundraising', '• Exit Preparation & M&A Advisory', '• Market Intelligence & Reports', '• Strategic Partnership Development'];
      gpServices.forEach((service, idx) => {
        pdf.text(service, margin + 5, y + 20 + (idx * 7));
      });

      pdf.setFillColor(239, 246, 255);
      pdf.roundedRect(margin + contentWidth / 2 + 5, y, contentWidth / 2 - 5, 55, 2, 2, 'F');
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 64, 175);
      pdf.text('For Institutional Investors (LPs)', margin + contentWidth / 2 + 10, y + 10);
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(30, 30, 30);
      const lpServices = ['• Fund Due Diligence', '• GP Screening & Selection', '• Co-Investment Sourcing', '• Portfolio Monitoring', '• Allocation Strategy Advisory'];
      lpServices.forEach((service, idx) => {
        pdf.text(service, margin + contentWidth / 2 + 10, y + 20 + (idx * 7));
      });

      y += 65;

      checkPageBreak(35);
      drawSectionHeader('Sector Expertise');
      
      pdf.setFillColor(254, 249, 195);
      pdf.roundedRect(margin, y, contentWidth, 25, 2, 2, 'F');
      
      const sectors = ['Fintech', 'AI/ML', 'B2B Software', 'Payments', 'RegTech', 'InsurTech', 'WealthTech', 'Cybersecurity'];
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 30, 30);
      
      let sectorX = margin + 8;
      sectors.forEach((sector, idx) => {
        if (idx < 4) {
          pdf.text('• ' + sector, sectorX, y + 10);
        } else {
          pdf.text('• ' + sector, sectorX - 160, y + 18);
        }
        sectorX += 40;
      });

      y += 35;

      checkPageBreak(25);
      pdf.setFillColor(15, 30, 54);
      pdf.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
      pdf.text('Let\'s Explore the Fit', margin + 5, y + 8);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(textGray[0], textGray[1], textGray[2]);
      pdf.text('A brief conversation to understand your challenges and whether Aries76 can add value.', margin + 5, y + 14);

      addFooter();

      if (forPreview && onPreviewReady) {
        const blob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        onPreviewReady(blobUrl);
      } else {
        pdf.save('Aries76_Overview.pdf');
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
