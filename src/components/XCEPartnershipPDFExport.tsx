import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Chart data for PDF
const revenueByYearData = [
  { year: "Year 1", advisory: 270000, recruitment: 720000, education: 120000, total: 1110000 },
  { year: "Year 2", advisory: 960000, recruitment: 2520000, education: 490000, total: 3920000 },
  { year: "Year 3", advisory: 1920000, recruitment: 5140000, education: 1200000, total: 8400000 },
];

const profitabilityData = [
  { year: "Year 1", revenue: 1110000, costs: 320000, profit: 790000, margin: 71.2 },
  { year: "Year 2", revenue: 3920000, costs: 480000, profit: 3440000, margin: 87.8 },
  { year: "Year 3", revenue: 8400000, costs: 700000, profit: 7700000, margin: 91.9 },
];

const partnerRevenueData = [
  { year: "Year 1", aries76: 467500, xce: 642500 },
  { year: "Year 2", aries76: 1924000, xce: 1996000 },
  { year: "Year 3", aries76: 4724000, xce: 3676000 },
];

interface XCEPartnershipPDFExportProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export const XCEPartnershipPDFExport = ({ variant = 'default', size = 'default' }: XCEPartnershipPDFExportProps) => {
  const [generating, setGenerating] = useState(false);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    }
    return `€${(value / 1000).toFixed(0)}K`;
  };

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

      // Colors
      const darkBlue = [10, 22, 40];
      const accentOrange = [249, 115, 22];
      const textWhite = [255, 255, 255];
      const textGray = [156, 163, 175];
      const borderBlue = [30, 58, 95];

      // Helper: Check page break
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

      // Helper: Add footer
      const addFooter = () => {
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Confidential - XCE & Aries76 Ltd. Partnership Proposal', margin, pageHeight - 10);
        pdf.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      };

      // Helper: Draw section header
      const drawSectionHeader = (title: string, iconLabel?: string) => {
        checkPageBreak(25);
        
        // Section box
        pdf.setFillColor(15, 30, 54);
        pdf.setDrawColor(borderBlue[0], borderBlue[1], borderBlue[2]);
        pdf.roundedRect(margin, y - 3, contentWidth, 14, 2, 2, 'FD');
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
        pdf.text(title, margin + 5, y + 6);
        
        y += 20;
      };

      // Helper: Draw text block with auto-wrap
      const drawTextBlock = (text: string, fontSize: number = 10, indent: number = 0) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        
        const lines = pdf.splitTextToSize(text, contentWidth - indent);
        const lineHeight = fontSize * 0.45;
        
        lines.forEach((line: string) => {
          checkPageBreak(lineHeight + 2);
          pdf.text(line, margin + indent, y);
          y += lineHeight;
        });
        
        y += 3;
      };

      // Helper: Draw bullet point
      const drawBullet = (title: string, description: string, color: number[]) => {
        checkPageBreak(20);
        
        pdf.setFillColor(color[0], color[1], color[2]);
        pdf.circle(margin + 3, y - 1, 2, 'F');
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(40, 40, 40);
        pdf.text(title, margin + 10, y);
        
        y += 5;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        const lines = pdf.splitTextToSize(description, contentWidth - 15);
        lines.forEach((line: string) => {
          checkPageBreak(5);
          pdf.text(line, margin + 10, y);
          y += 4.5;
        });
        
        y += 3;
      };

      // ===== COVER PAGE =====
      pdf.setFillColor(darkBlue[0], darkBlue[1], darkBlue[2]);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Decorative elements
      pdf.setFillColor(accentOrange[0], accentOrange[1], accentOrange[2]);
      pdf.rect(0, pageHeight / 2 - 40, 8, 80, 'F');
      
      // Title
      pdf.setFontSize(32);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
      pdf.text('Partnership Proposal', pageWidth / 2, pageHeight / 2 - 30, { align: 'center' });
      pdf.text('& Economic Offer', pageWidth / 2, pageHeight / 2 - 15, { align: 'center' });
      
      // Subtitle
      pdf.setFontSize(24);
      pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
      pdf.text('XCE & Aries76 Ltd.', pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
      
      // Tagline
      pdf.setFontSize(12);
      pdf.setTextColor(textGray[0], textGray[1], textGray[2]);
      pdf.text('A Strategic Framework for Capturing the European', pageWidth / 2, pageHeight / 2 + 35, { align: 'center' });
      pdf.text('Private Equity Bitcoin Treasury Market', pageWidth / 2, pageHeight / 2 + 45, { align: 'center' });
      
      // Document info
      pdf.setFontSize(10);
      pdf.text('Prepared by: Aries76 Ltd.', pageWidth / 2, pageHeight - 50, { align: 'center' });
      pdf.text(`Date: January 27, 2026`, pageWidth / 2, pageHeight - 40, { align: 'center' });
      pdf.text('Classification: Confidential - Partnership Discussion', pageWidth / 2, pageHeight - 30, { align: 'center' });
      
      // ===== PAGE 2: Strategic Vision =====
      pdf.addPage();
      pageNumber++;
      y = margin;
      
      drawSectionHeader('Section 1: Strategic Vision & Partnership Model');
      
      drawTextBlock('This document outlines a concrete proposal for a strategic partnership between XCE and Aries76 Ltd. Our goal is to create a market-leading, integrated service offering for European mid-market private equity (PE) funds that are looking to implement Bitcoin treasury strategies. As you know, institutional adoption is accelerating, but fund managers face a critical gap: they need both strategic advisory on capital formation and access to specialized talent. This is where our partnership creates unique value.');
      
      y += 5;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('The Integrated Offering', margin, y);
      y += 8;
      
      drawBullet('Strategic Capital Formation (Lead: Aries76 Ltd.)', 'Advisory services for mid-market PE funds on integrating Bitcoin treasury strategies into their capital formation and fund management.', accentOrange);
      drawBullet('Executive Recruitment (Lead: XCE)', 'Specialized recruitment for key roles, including Chief Bitcoin Officer (CBO), Treasury Specialists, and other related positions.', [59, 130, 246]);
      drawBullet('Bitcoin Education & Training (Joint)', 'Comprehensive workshops, ongoing education programs, and certification for fund teams on all aspects of Bitcoin treasury management.', [168, 85, 247]);
      
      y += 5;
      checkPageBreak(25);
      
      pdf.setFillColor(249, 115, 22, 0.1);
      pdf.setDrawColor(accentOrange[0], accentOrange[1], accentOrange[2]);
      pdf.roundedRect(margin, y - 3, contentWidth, 20, 2, 2, 'FD');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(80, 80, 80);
      const integratedText = pdf.splitTextToSize('This integrated model provides a powerful, one-stop solution that de-risks and accelerates the adoption of Bitcoin treasury strategies for fund managers. For our firms, it creates a highly defensible market position and a pipeline of high-value, strategic mandates.', contentWidth - 10);
      integratedText.forEach((line: string, idx: number) => {
        pdf.text(line, margin + 5, y + 3 + (idx * 4));
      });
      
      y += 28;
      
      // ===== Section 2: Market Analysis =====
      drawSectionHeader('Section 2: Market Analysis & Competitive Positioning');
      
      drawTextBlock('The European mid-market PE segment raised a record €79.9 billion in 2025, and these forward-thinking managers are actively seeking innovative strategies. However, the competitive landscape for Bitcoin-focused advisory in this space is nascent and fragmented. Our joint offering will be the first of its kind, creating a significant first-mover advantage.');
      
      y += 3;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('Capital Formation Advisory Fee Benchmarks', margin, y);
      y += 8;
      
      // Table 1
      checkPageBreak(45);
      const tableHeaders1 = ['Fee Type', 'Industry Standard', 'Our Proposed Pricing'];
      const tableData1 = [
        ['Success Fee', '1.5% - 2.5% of capital raised', '1.0% - 1.5% of capital raised'],
        ['Retainer (Large)', '€24,000 - €124,000+', '€30,000 - €75,000'],
        ['Retainer (Boutique)', '€6,000 - €24,000', '€6,000 - €20,000 monthly'],
      ];
      
      const colWidths1 = [50, 60, 60];
      const rowHeight = 10;
      
      // Table header
      pdf.setFillColor(30, 41, 59);
      pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      let xPos = margin + 3;
      tableHeaders1.forEach((header, idx) => {
        pdf.text(header, xPos, y + 3);
        xPos += colWidths1[idx];
      });
      y += rowHeight;
      
      // Table rows
      tableData1.forEach((row, rowIdx) => {
        if (rowIdx % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
        }
        xPos = margin + 3;
        row.forEach((cell, colIdx) => {
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          if (colIdx === 2) {
            pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
            pdf.setFont('helvetica', 'bold');
          } else {
            pdf.setTextColor(60, 60, 60);
          }
          pdf.text(cell, xPos, y + 3);
          xPos += colWidths1[colIdx];
        });
        y += rowHeight;
      });
      
      y += 8;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('Executive Recruitment Fee Benchmarks', margin, y);
      y += 8;
      
      // Table 2
      checkPageBreak(35);
      const tableData2 = [
        ['Retained Search', '30% - 35% of first-year salary', '8% - 10% of first-year salary'],
        ['CBO Placement', '€80,000 - €124,000', '€60,000'],
      ];
      
      // Table header
      pdf.setFillColor(30, 41, 59);
      pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      xPos = margin + 3;
      tableHeaders1.forEach((header, idx) => {
        pdf.text(header, xPos, y + 3);
        xPos += colWidths1[idx];
      });
      y += rowHeight;
      
      tableData2.forEach((row, rowIdx) => {
        if (rowIdx % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
        }
        xPos = margin + 3;
        row.forEach((cell, colIdx) => {
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          if (colIdx === 2) {
            pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
            pdf.setFont('helvetica', 'bold');
          } else {
            pdf.setTextColor(60, 60, 60);
          }
          pdf.text(cell, xPos, y + 3);
          xPos += colWidths1[colIdx];
        });
        y += rowHeight;
      });
      
      y += 8;
      
      // Highlight box
      checkPageBreak(18);
      pdf.setFillColor(34, 197, 94, 0.1);
      pdf.setDrawColor(34, 197, 94);
      pdf.roundedRect(margin, y - 3, contentWidth, 15, 2, 2, 'FD');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      pdf.text('By positioning our fees 20-30% below market rates, we can accelerate client acquisition', margin + 5, y + 3);
      pdf.text('and build a defensible moat based on our unique, integrated service model.', margin + 5, y + 8);
      
      y += 22;
      
      // ===== Section 3: Economic Offer =====
      checkPageBreak(80);
      drawSectionHeader('Section 3: Economic Offer & Pricing Strategy');
      
      drawTextBlock('We recommend an aggressive market penetration strategy for the initial 12-18 months. This approach is designed to rapidly capture market share and establish our partnership as the definitive leader.');
      
      y += 3;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('Strategic Rationale', margin, y);
      y += 8;
      
      drawBullet('Market Entry Velocity', 'Lower fees will accelerate the acquisition of our first cohort of clients, creating a strong foundation for growth and a portfolio of case studies.', accentOrange);
      drawBullet('Market Share Capture', 'By entering with a compelling price point, we can establish a dominant position before potential competitors can react.', [59, 130, 246]);
      drawBullet('Building a Moat', 'The integrated nature of our services will create high switching costs for clients, fostering long-term loyalty and recurring revenue.', [168, 85, 247]);
      
      y += 5;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('Phased Implementation', margin, y);
      y += 8;
      
      const phases = [
        { phase: 'Phase 1 (Year 1)', desc: 'Launch with pricing 20-30% below market rates to attract 10-12 early adopter clients.' },
        { phase: 'Phase 2 (Year 2)', desc: 'Gradually increase fees for new clients by 10-15%, while maintaining favorable rates for our initial client cohort.' },
        { phase: 'Phase 3 (Year 3)', desc: 'Transition to market-rate pricing as our brand and market leadership are firmly established.' },
      ];
      
      phases.forEach((item, idx) => {
        checkPageBreak(15);
        pdf.setFillColor(accentOrange[0], accentOrange[1], accentOrange[2]);
        pdf.circle(margin + 4, y, 4, 'F');
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text(`${idx + 1}`, margin + 2.5, y + 2);
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(40, 40, 40);
        pdf.text(item.phase, margin + 12, y + 1);
        
        y += 6;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(9);
        const lines = pdf.splitTextToSize(item.desc, contentWidth - 15);
        lines.forEach((line: string) => {
          pdf.text(line, margin + 12, y);
          y += 4;
        });
        y += 4;
      });
      
      // ===== Section 4: Financial Projections =====
      addFooter();
      pdf.addPage();
      pageNumber++;
      y = margin;
      
      drawSectionHeader('Section 4: Financial Projections & Economic Model');
      
      drawTextBlock('Here are the detailed financial projections based on our recommended aggressive pricing strategy. This model assumes we acquire clients progressively and demonstrates a clear and rapid path to profitability.');
      
      y += 5;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('3-Year Revenue by Service Line', margin, y);
      y += 8;
      
      // Revenue table
      checkPageBreak(50);
      const revHeaders = ['Year', 'Advisory', 'Recruitment', 'Education', 'Total'];
      const colWidths2 = [30, 35, 40, 35, 30];
      
      pdf.setFillColor(30, 41, 59);
      pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      xPos = margin + 3;
      revHeaders.forEach((header, idx) => {
        pdf.text(header, xPos, y + 3);
        xPos += colWidths2[idx];
      });
      y += rowHeight;
      
      revenueByYearData.forEach((row, rowIdx) => {
        if (rowIdx % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
        }
        xPos = margin + 3;
        const cells = [row.year, formatCurrency(row.advisory), formatCurrency(row.recruitment), formatCurrency(row.education), formatCurrency(row.total)];
        cells.forEach((cell, colIdx) => {
          pdf.setFontSize(8);
          if (colIdx === 4) {
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
          } else {
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(60, 60, 60);
          }
          pdf.text(cell, xPos, y + 3);
          xPos += colWidths2[colIdx];
        });
        y += rowHeight;
      });
      
      y += 12;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('Profitability Analysis', margin, y);
      y += 8;
      
      // Profitability table
      const profHeaders = ['Year', 'Revenue', 'Costs', 'Gross Profit', 'Margin'];
      
      pdf.setFillColor(30, 41, 59);
      pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      xPos = margin + 3;
      profHeaders.forEach((header, idx) => {
        pdf.text(header, xPos, y + 3);
        xPos += colWidths2[idx];
      });
      y += rowHeight;
      
      profitabilityData.forEach((row, rowIdx) => {
        if (rowIdx % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
        }
        xPos = margin + 3;
        const cells = [row.year, formatCurrency(row.revenue), formatCurrency(row.costs), formatCurrency(row.profit), `${row.margin}%`];
        cells.forEach((cell, colIdx) => {
          pdf.setFontSize(8);
          if (colIdx === 3) {
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(34, 197, 94);
          } else if (colIdx === 4) {
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
          } else {
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(60, 60, 60);
          }
          pdf.text(cell, xPos, y + 3);
          xPos += colWidths2[colIdx];
        });
        y += rowHeight;
      });
      
      y += 12;
      
      // KPI Cards
      checkPageBreak(40);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('Key Performance Indicators', margin, y);
      y += 10;
      
      const kpis = [
        { label: 'Year 1 Gross Profit', value: '€790,000', sub: '71.2% Margin' },
        { label: 'Year 2 Gross Profit', value: '€3,440,000', sub: '87.8% Margin' },
        { label: 'Year 3 Gross Profit', value: '€7,700,000', sub: '91.9% Margin' },
      ];
      
      const kpiWidth = (contentWidth - 10) / 3;
      kpis.forEach((kpi, idx) => {
        const kpiX = margin + (idx * (kpiWidth + 5));
        
        pdf.setFillColor(15, 30, 54);
        pdf.setDrawColor(borderBlue[0], borderBlue[1], borderBlue[2]);
        pdf.roundedRect(kpiX, y - 3, kpiWidth, 28, 2, 2, 'FD');
        
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(120, 120, 120);
        pdf.text(kpi.label, kpiX + kpiWidth / 2, y + 4, { align: 'center' });
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        if (idx === 2) {
          pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
        } else {
          pdf.setTextColor(40, 40, 40);
        }
        pdf.text(kpi.value, kpiX + kpiWidth / 2, y + 15, { align: 'center' });
        
        pdf.setFontSize(8);
        pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
        pdf.text(kpi.sub, kpiX + kpiWidth / 2, y + 22, { align: 'center' });
      });
      
      y += 38;
      
      // 3-Year Summary
      checkPageBreak(35);
      pdf.setFillColor(249, 115, 22, 0.1);
      pdf.setDrawColor(accentOrange[0], accentOrange[1], accentOrange[2]);
      pdf.roundedRect(margin, y - 3, contentWidth, 30, 2, 2, 'FD');
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('3-Year Cumulative Summary', margin + contentWidth / 2, y + 3, { align: 'center' });
      
      const summaryItems = [
        { label: 'Total Revenue', value: '€13.43M' },
        { label: 'Operating Costs', value: '€1.48M' },
        { label: 'Gross Profit', value: '€11.95M' },
      ];
      
      const summaryWidth = contentWidth / 3;
      summaryItems.forEach((item, idx) => {
        const sumX = margin + (idx * summaryWidth);
        
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text(item.label, sumX + summaryWidth / 2, y + 13, { align: 'center' });
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        if (idx === 2) {
          pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
        } else {
          pdf.setTextColor(40, 40, 40);
        }
        pdf.text(item.value, sumX + summaryWidth / 2, y + 22, { align: 'center' });
      });
      
      y += 40;
      
      // ===== Section 5: Partnership Structure =====
      checkPageBreak(100);
      drawSectionHeader('Section 5: Partnership Structure');
      
      drawTextBlock('We propose a straightforward, transparent economic model designed to ensure that both parties benefit equitably from the partnership, while also allowing for flexibility as we grow.');
      
      y += 3;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('Proposed Revenue Sharing Model', margin, y);
      y += 8;
      
      // Revenue sharing table
      const shareHeaders = ['Service Line', 'Aries76 Share', 'XCE Share'];
      const shareData = [
        ['Advisory (Aries76-led)', '55%', '45%'],
        ['Recruitment (XCE-led)', '35%', '65%'],
        ['Education (Joint)', '50%', '50%'],
      ];
      const shareColWidths = [70, 50, 50];
      
      pdf.setFillColor(30, 41, 59);
      pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      xPos = margin + 3;
      shareHeaders.forEach((header, idx) => {
        pdf.text(header, xPos, y + 3);
        xPos += shareColWidths[idx];
      });
      y += rowHeight;
      
      shareData.forEach((row, rowIdx) => {
        if (rowIdx % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
        }
        xPos = margin + 3;
        row.forEach((cell, colIdx) => {
          pdf.setFontSize(8);
          if (colIdx === 1) {
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
          } else if (colIdx === 2) {
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(59, 130, 246);
          } else {
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(60, 60, 60);
          }
          pdf.text(cell, xPos, y + 3);
          xPos += shareColWidths[colIdx];
        });
        y += rowHeight;
      });
      
      y += 12;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('Partner Revenue Distribution', margin, y);
      y += 8;
      
      // Partner revenue table
      const partnerHeaders = ['Year', 'Aries76 Ltd.', 'XCE', 'Total'];
      const partnerColWidths = [40, 45, 45, 40];
      
      pdf.setFillColor(30, 41, 59);
      pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      xPos = margin + 3;
      partnerHeaders.forEach((header, idx) => {
        pdf.text(header, xPos, y + 3);
        xPos += partnerColWidths[idx];
      });
      y += rowHeight;
      
      partnerRevenueData.forEach((row, rowIdx) => {
        if (rowIdx % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
        }
        xPos = margin + 3;
        const total = row.aries76 + row.xce;
        const cells = [row.year, formatCurrency(row.aries76), formatCurrency(row.xce), formatCurrency(total)];
        cells.forEach((cell, colIdx) => {
          pdf.setFontSize(8);
          if (colIdx === 1) {
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
          } else if (colIdx === 2) {
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(59, 130, 246);
          } else if (colIdx === 3) {
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(40, 40, 40);
          } else {
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(60, 60, 60);
          }
          pdf.text(cell, xPos, y + 3);
          xPos += partnerColWidths[colIdx];
        });
        y += rowHeight;
      });
      
      // ===== Section 6: Next Steps =====
      addFooter();
      pdf.addPage();
      pageNumber++;
      y = margin;
      
      drawSectionHeader('Section 6: Next Steps');
      
      drawTextBlock('This partnership represents a compelling opportunity to build a dominant market position in a high-growth, high-value segment. I propose a brief operational call next week to discuss this proposal in more detail. Specifically, I\'d like to confirm:');
      
      y += 5;
      const nextSteps = [
        'Your interest in moving forward with this Bitcoin-focused fund advisory partnership.',
        'Alignment on the proposed partnership structure and economic model.',
        'A preliminary list of target fund managers we can approach jointly.',
        'A target timeline for launching a pilot program.',
      ];
      
      nextSteps.forEach((step, idx) => {
        checkPageBreak(12);
        pdf.setFillColor(accentOrange[0], accentOrange[1], accentOrange[2]);
        pdf.circle(margin + 4, y, 4, 'F');
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text(`${idx + 1}`, margin + 2.5, y + 2);
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        pdf.text(step, margin + 12, y + 1);
        y += 10;
      });
      
      y += 10;
      checkPageBreak(20);
      pdf.setFillColor(249, 115, 22, 0.1);
      pdf.setDrawColor(accentOrange[0], accentOrange[1], accentOrange[2]);
      pdf.roundedRect(margin, y - 3, contentWidth, 18, 2, 2, 'FD');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(80, 80, 80);
      pdf.text('I am confident that together, we can create significant value for our clients and our firms.', margin + contentWidth / 2, y + 5, { align: 'center' });
      pdf.text('I look forward to discussing this with you further.', margin + contentWidth / 2, y + 11, { align: 'center' });
      
      y += 28;
      
      // ===== Appendix A =====
      drawSectionHeader('Appendix A: Implementation Timeline');
      
      const timeline = [
        { phase: 'Phase 1: Launch & Market Entry', period: 'Months 1-6', color: accentOrange, items: ['Finalize partnership agreement and operational structure', 'Develop joint marketing materials and positioning', 'Identify and approach 10-15 target fund managers', 'Secure 3-5 pilot clients for initial engagement'] },
        { phase: 'Phase 2: Scaling & Optimization', period: 'Months 7-18', color: [59, 130, 246], items: ['Expand client base to 20-25 cumulative clients', 'Develop case studies and testimonials from pilot clients'] },
        { phase: 'Phase 3: Market Leadership', period: 'Months 19-36', color: [168, 85, 247], items: ['Achieve 45-50 cumulative clients by end of Year 3', 'Transition to market-rate pricing for new clients', 'Position for potential expansion into adjacent markets'] },
      ];
      
      timeline.forEach((section) => {
        checkPageBreak(35);
        
        pdf.setFillColor(15, 30, 54);
        pdf.setDrawColor(borderBlue[0], borderBlue[1], borderBlue[2]);
        pdf.roundedRect(margin, y - 3, contentWidth, 8, 1, 1, 'FD');
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(section.color[0], section.color[1], section.color[2]);
        pdf.text(section.phase, margin + 5, y + 3);
        
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(120, 120, 120);
        pdf.text(section.period, pageWidth - margin - 5, y + 3, { align: 'right' });
        
        y += 12;
        
        section.items.forEach((item) => {
          checkPageBreak(8);
          pdf.setFillColor(section.color[0], section.color[1], section.color[2]);
          pdf.circle(margin + 5, y - 1, 1.5, 'F');
          
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(80, 80, 80);
          pdf.text(item, margin + 10, y);
          y += 6;
        });
        
        y += 6;
      });
      
      // ===== Appendix B =====
      checkPageBreak(80);
      drawSectionHeader('Appendix B: Risk Mitigation & Success Factors');
      
      // Success factors box
      pdf.setFillColor(34, 197, 94, 0.1);
      pdf.setDrawColor(34, 197, 94);
      pdf.roundedRect(margin, y - 3, contentWidth, 35, 2, 2, 'FD');
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(34, 197, 94);
      pdf.text('Key Success Factors', margin + 5, y + 4);
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      const successText = pdf.splitTextToSize('The success of this partnership depends on maintaining alignment between Aries76 Ltd. and XCE on strategy, messaging, and client engagement. We must deliver exceptional service quality to our early clients, as their testimonials will be instrumental in attracting subsequent clients. We must remain agile and responsive to market feedback.', contentWidth - 10);
      successText.forEach((line: string, idx: number) => {
        pdf.text(line, margin + 5, y + 12 + (idx * 4));
      });
      
      y += 45;
      
      // Risk mitigation box
      checkPageBreak(40);
      pdf.setFillColor(234, 179, 8, 0.1);
      pdf.setDrawColor(234, 179, 8);
      pdf.roundedRect(margin, y - 3, contentWidth, 35, 2, 2, 'FD');
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(234, 179, 8);
      pdf.text('Risk Mitigation Strategies', margin + 5, y + 4);
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      const riskText = pdf.splitTextToSize('The primary risk is that competitors may enter the market. To mitigate this, we will focus on building strong client relationships and creating high switching costs through our integrated service model. A secondary risk is that demand may not materialize as quickly as projected. We will maintain flexibility in our cost structure and be prepared to adjust targets.', contentWidth - 10);
      riskText.forEach((line: string, idx: number) => {
        pdf.text(line, margin + 5, y + 12 + (idx * 4));
      });
      
      y += 45;
      
      // ===== Document Footer =====
      checkPageBreak(40);
      pdf.setFillColor(15, 30, 54);
      pdf.setDrawColor(borderBlue[0], borderBlue[1], borderBlue[2]);
      pdf.roundedRect(margin, y - 3, contentWidth, 35, 2, 2, 'FD');
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('Document Information', margin + 5, y + 5);
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(156, 163, 175);
      pdf.text('Prepared by:', margin + 5, y + 13);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Aries76 Ltd.', margin + 35, y + 13);
      
      pdf.setTextColor(156, 163, 175);
      pdf.text('Date:', margin + 5, y + 19);
      pdf.setTextColor(255, 255, 255);
      pdf.text('January 27, 2026', margin + 35, y + 19);
      
      pdf.setTextColor(156, 163, 175);
      pdf.text('Recipient:', margin + 90, y + 13);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Scott Ellam - Scott.Ellam@xce.io', margin + 115, y + 13);
      
      pdf.setTextColor(156, 163, 175);
      pdf.text('Classification:', margin + 90, y + 19);
      pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
      pdf.text('Confidential - Partnership Discussion', margin + 115, y + 19);
      
      pdf.setFontSize(7);
      pdf.setTextColor(120, 120, 120);
      pdf.setFont('helvetica', 'italic');
      pdf.text('This proposal is intended for discussion purposes only and does not constitute a binding commitment.', margin + 5, y + 29);
      
      // Final footer
      addFooter();

      // Save the PDF
      const filename = `XCE_Aries76_Partnership_Proposal_${format(new Date(), 'yyyyMMdd')}.pdf`;
      pdf.save(filename);
      
      toast.success(`PDF generato: ${filename}`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error('Errore nella generazione del PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button 
      onClick={generatePDF} 
      disabled={generating}
      variant={variant}
      size={size}
      className="bg-accent hover:bg-accent/90 text-white"
    >
      {generating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4 mr-2" />
      )}
      {generating ? 'Generating PDF...' : 'Export PDF'}
    </Button>
  );
};

export default XCEPartnershipPDFExport;
