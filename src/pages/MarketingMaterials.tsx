import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Building2, Users, Briefcase, BookOpen, Eye, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import jsPDF from 'jspdf';

type MaterialId = 'overview' | 'gp-services' | 'lp-services' | 'service-catalog';

const materials: Array<{
  id: MaterialId;
  title: string;
  description: string;
  icon: typeof Building2;
  pages: number;
  category: string;
}> = [
  {
    id: "overview",
    title: "Aries76 Overview",
    description: "Company introduction and value proposition for PE/VC funds and institutional investors",
    icon: Building2,
    pages: 2,
    category: "Company",
  },
  {
    id: "gp-services",
    title: "Services for Fund Managers",
    description: "AI-powered solutions for PE/VC funds: deal sourcing, portfolio value creation, and market intelligence",
    icon: Briefcase,
    pages: 2,
    category: "GP Services",
  },
  {
    id: "lp-services",
    title: "Services for Limited Partners",
    description: "Institutional-grade advisory: fund selection, due diligence, portfolio management, and strategic advisory",
    icon: Users,
    pages: 2,
    category: "LP Services",
  },
  {
    id: "service-catalog",
    title: "Service Catalog 2026",
    description: "Complete pricing and service breakdown for GPs and LPs with quick-win packages",
    icon: BookOpen,
    pages: 4,
    category: "Pricing",
  }
];

// PDF Generation functions
const generateOverviewPDF = () => {
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

  // Cover Page
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
  pdf.text('London • Milan • www.aries76.com', pageWidth / 2, pageHeight - 30, { align: 'center' });

  // Page 2
  pdf.addPage();
  pageNumber++;
  y = margin;

  pdf.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  pdf.roundedRect(margin, y - 3, contentWidth, 14, 2, 2, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
  pdf.text('The Aries76 Advantage', margin + 5, y + 6);
  y += 20;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  const introText = 'We help PE/VC funds and institutional investors navigate the European fintech & AI landscape through technology-powered processes and 26 years of capital markets expertise.';
  const lines = pdf.splitTextToSize(introText, contentWidth);
  lines.forEach((line: string) => {
    pdf.text(line, margin, y);
    y += 5;
  });
  y += 10;

  const bullets = [
    { title: 'AI-Powered Intelligence', desc: 'Technology-driven sourcing and matching. See opportunities 3-6 months before the market.' },
    { title: 'Process, Not Introductions', desc: 'Structured methodologies that deliver results. We don\'t disappear after the handshake.' },
    { title: 'Partnership Model', desc: 'Aligned incentives through flexible fee structures. We succeed when you succeed.' },
  ];

  bullets.forEach(bullet => {
    pdf.setFillColor(accentOrange[0], accentOrange[1], accentOrange[2]);
    pdf.circle(margin + 3, y - 1, 2, 'F');
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 30, 30);
    pdf.text(bullet.title, margin + 10, y);
    y += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    const descLines = pdf.splitTextToSize(bullet.desc, contentWidth - 15);
    descLines.forEach((line: string) => {
      pdf.text(line, margin + 10, y);
      y += 4.5;
    });
    y += 6;
  });

  // Track Record Box
  y += 5;
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(margin, y, contentWidth, 35, 3, 3, 'F');
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
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
    pdf.text(stat.value, statX, y + 22);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text(stat.label, statX, y + 28);
    statX += 55;
  });

  addFooter();
  return pdf;
};

const generateGPServicesPDF = () => {
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

  const addFooter = () => {
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Confidential - Aries76 GP Services', margin, pageHeight - 10);
    pdf.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  };

  // Cover Page
  pdf.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  pdf.setFillColor(accentOrange[0], accentOrange[1], accentOrange[2]);
  pdf.rect(0, pageHeight / 2 - 40, 8, 80, 'F');
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  pdf.text('Services for', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
  pdf.text('Fund Managers', pageWidth / 2, pageHeight / 2, { align: 'center' });
  pdf.setFontSize(14);
  pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
  pdf.text('AI-POWERED SOLUTIONS FOR PE/VC FUNDS', pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
  pdf.setFontSize(10);
  pdf.setTextColor(textGray[0], textGray[1], textGray[2]);
  pdf.text('Deploy capital efficiently. Differentiate your deal flow.', pageWidth / 2, pageHeight / 2 + 40, { align: 'center' });
  pdf.text('London • Milan • www.aries76.com', pageWidth / 2, pageHeight - 30, { align: 'center' });

  // Page 2
  pdf.addPage();
  pageNumber++;
  y = margin;

  const drawTable = (title: string, headers: string[], data: string[][], colWidths: number[]) => {
    pdf.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    pdf.roundedRect(margin, y - 3, contentWidth, 14, 2, 2, 'F');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
    pdf.text(title, margin + 5, y + 6);
    y += 20;

    const rowHeight = 10;
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
    y += 10;
  };

  drawTable('Section 1: Deal Sourcing as a Service', 
    ['Service', 'Description', 'Deliverables', 'Pricing'],
    [
      ['Sector Monitoring', 'Real-time intelligence on fintech/AI companies', 'Weekly digest, alerts, monthly analysis', '€3,000 - €8,000/mo'],
      ['Qualified Deal Flow', 'Pre-qualified opportunities matching thesis', '10-20 opportunities/month with memos', '€5,000/mo + 1.5%'],
      ['Exclusive First-Look', 'Proprietary deals, 2-week exclusivity', '3-5 exclusive opportunities/quarter', '€50,000/yr + 2%'],
    ],
    [40, 55, 45, 30]
  );

  drawTable('Section 2: Portfolio Value Creation',
    ['Service', 'Description', 'Scope', 'Pricing'],
    [
      ['Follow-on Fundraising', 'Full-service Series A-C support', 'Strategy, materials, outreach, closing', '€15-30K + 2-3%'],
      ['Strategic Partnerships', 'Customer & distribution intros', '50-100 targets, facilitated intros', '€25,000/engagement'],
      ['Exit Preparation', 'M&A positioning, buyer mapping', 'Full exit support 6-12 months', '€35K + 1.5-2.5%'],
    ],
    [40, 50, 45, 35]
  );

  drawTable('Section 3: Market Intelligence',
    ['Service', 'Description', 'Deliverable', 'Pricing'],
    [
      ['Sector Deep Dives', 'Comprehensive vertical analysis', '50-page report with company mapping', '€12,000 - €25,000'],
      ['Competitive Intelligence', 'Target + competitor analysis', 'Detailed positioning report', '€3,500 - €8,000'],
      ['Valuation Benchmarking', 'Comparable analysis', 'Comps, valuation range', '€5,000/company'],
    ],
    [42, 55, 45, 28]
  );

  addFooter();
  return pdf;
};

const generateLPServicesPDF = () => {
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

  const addFooter = () => {
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Confidential - Aries76 LP Services', margin, pageHeight - 10);
    pdf.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  };

  // Cover Page
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
  pdf.text('London • Milan • www.aries76.com', pageWidth / 2, pageHeight - 30, { align: 'center' });

  // Page 2
  pdf.addPage();
  pageNumber++;
  y = margin;

  const drawTable = (title: string, headers: string[], data: string[][], colWidths: number[]) => {
    pdf.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    pdf.roundedRect(margin, y - 3, contentWidth, 14, 2, 2, 'F');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
    pdf.text(title, margin + 5, y + 6);
    y += 20;

    const rowHeight = 10;
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
    y += 10;
  };

  drawTable('Section 1: Fund Selection & Due Diligence',
    ['Service', 'Description', 'Deliverable', 'Pricing'],
    [
      ['GP Screening', 'Systematic fund identification', 'Quarterly shortlist of 15-25 funds', '€6,000 - €15,000/mo'],
      ['Fund Due Diligence', 'Comprehensive DD package', 'Full report with recommendation', '€12,000 - €40,000/fund'],
      ['Reference Program', 'Structured GP references', '10-20 references, summary report', '€8,000 - €18,000'],
    ],
    [35, 55, 45, 35]
  );

  drawTable('Section 2: Portfolio Management Support',
    ['Service', 'Description', 'Deliverable', 'Pricing'],
    [
      ['Fund Monitoring', 'Ongoing monitoring & analysis', 'Quarterly performance, benchmarking', '€30,000 - €75,000/yr'],
      ['Co-Investment Sourcing', 'Proactive co-invest identification', 'Qualified opportunities, DD support', '€5,000/mo + 1%'],
      ['Secondary Advisory', 'Buy/sell-side transactions', 'Valuation, process, execution', '0.75% - 1.5%'],
    ],
    [40, 50, 45, 35]
  );

  drawTable('Section 3: Strategic Advisory',
    ['Service', 'Description', 'Timeline', 'Pricing'],
    [
      ['Allocation Strategy', 'Design or optimize PE/VC program', '10-14 weeks', '€35,000 - €125,000'],
      ['Emerging Manager Program', 'Design first-time fund strategy', '12-16 weeks', '€60,000'],
      ['Ongoing Program Mgmt', 'Annual emerging manager program', 'Annual', '€75,000/year'],
    ],
    [45, 55, 30, 40]
  );

  addFooter();
  return pdf;
};

const generateServiceCatalogPDF = () => {
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

  const addFooter = () => {
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Confidential - Aries76 Service Catalog 2026', margin, pageHeight - 10);
    pdf.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  };

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

  // Cover Page
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
  pdf.text('Complete Service & Pricing Guide for GPs and LPs', pageWidth / 2, pageHeight / 2 + 35, { align: 'center' });
  pdf.text('London • Milan • www.aries76.com', pageWidth / 2, pageHeight - 30, { align: 'center' });

  // Page 2: GP Services
  pdf.addPage();
  pageNumber++;
  y = margin;

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 30, 30);
  pdf.text('Services for Fund Managers (GPs)', margin, y + 5);
  y += 18;

  const drawTable = (title: string, headers: string[], data: string[][], colWidths: number[]) => {
    checkPageBreak(50);
    pdf.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    pdf.roundedRect(margin, y - 3, contentWidth, 14, 2, 2, 'F');
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
    pdf.text(title, margin + 5, y + 6);
    y += 18;

    const rowHeight = 9;
    pdf.setFillColor(30, 41, 59);
    pdf.rect(margin, y - 3, contentWidth, rowHeight, 'F');
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    let xPos = margin + 2;
    headers.forEach((header, idx) => {
      pdf.text(header, xPos, y + 2);
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
        pdf.text(cellText[0], xPos, y + 2);
        xPos += colWidths[colIdx];
      });
      y += rowHeight;
    });
    y += 6;
  };

  drawTable('Deal Sourcing as a Service',
    ['Service', 'Description', 'Deliverables', 'Pricing'],
    [
      ['Sector Monitoring', 'Real-time intelligence on fintech/AI', 'Weekly digest, alerts, analysis', '€3K-€8K/mo'],
      ['Qualified Deal Flow', 'Pre-qualified opportunities', '10-20 opps/month with memos', '€5K/mo + 1.5%'],
      ['Exclusive First-Look', 'Proprietary deals, exclusivity', '3-5 exclusive opps/quarter', '€50K/yr + 2%'],
    ],
    [38, 52, 48, 32]
  );

  drawTable('Portfolio Value Creation',
    ['Service', 'Description', 'Scope', 'Pricing'],
    [
      ['Follow-on Fundraising', 'Full-service Series A-C', 'Strategy, materials, closing', '€15-30K + 2-3%'],
      ['Strategic Partnerships', 'Customer & distribution', '50-100 targets, intros', '€25K/engagement'],
      ['Exit Preparation', 'M&A positioning, buyers', '6-12 months support', '€35K + 1.5-2.5%'],
    ],
    [40, 48, 48, 34]
  );

  // Page 3: LP Services
  addFooter();
  pdf.addPage();
  pageNumber++;
  y = margin;

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 30, 30);
  pdf.text('Services for Limited Partners (LPs)', margin, y + 5);
  y += 18;

  drawTable('Fund Selection & Due Diligence',
    ['Service', 'Description', 'Deliverable', 'Pricing'],
    [
      ['GP Screening', 'Systematic fund identification', 'Quarterly shortlist 15-25 funds', '€6K-€15K/mo'],
      ['Fund Due Diligence', 'Comprehensive DD package', 'Full report, recommendation', '€12K-€40K/fund'],
      ['Reference Program', 'Structured GP references', '10-20 references, summary', '€8K-€18K'],
    ],
    [38, 50, 50, 32]
  );

  drawTable('Portfolio Management Support',
    ['Service', 'Description', 'Deliverable', 'Pricing'],
    [
      ['Fund Monitoring', 'Ongoing monitoring', 'Quarterly performance', '€30K-€75K/yr'],
      ['Co-Investment Sourcing', 'Proactive co-invest', 'Opportunities, DD support', '€5K/mo + 1%'],
      ['Secondary Advisory', 'Buy/sell-side transactions', 'Valuation, execution', '0.75%-1.5%'],
    ],
    [42, 50, 48, 30]
  );

  drawTable('Strategic Advisory',
    ['Service', 'Description', 'Timeline', 'Pricing'],
    [
      ['Allocation Strategy', 'Design PE/VC program', '10-14 weeks', '€35K-€125K'],
      ['Emerging Manager', 'First-time fund strategy', '12-16 weeks', '€60K'],
      ['Program Mgmt', 'Annual EM program', 'Annual', '€75K/year'],
    ],
    [45, 55, 30, 40]
  );

  // Page 4: Why It Works
  addFooter();
  pdf.addPage();
  pageNumber++;
  y = margin;

  pdf.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  pdf.roundedRect(margin, y - 3, contentWidth, 14, 2, 2, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
  pdf.text('Why Aries76 Works', margin + 5, y + 6);
  y += 25;

  const valueProps = [
    { title: 'AI Platform', desc: 'Monitors 500+ European fintech/AI companies in real-time' },
    { title: 'Human Qualification', desc: 'Ensures thesis alignment and quality opportunities' },
    { title: 'Early Access', desc: 'See opportunities 3-6 months before the market' },
    { title: 'Deep Relationships', desc: '26 years of capital markets expertise and network' },
  ];

  valueProps.forEach((prop) => {
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
    y += 12;
  });

  y += 10;
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
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
  pdf.text('www.aries76.com/contact', pageWidth - margin - 10, y + 22, { align: 'right' });

  addFooter();
  return pdf;
};

const MarketingMaterials = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [loadingPreview, setLoadingPreview] = useState<MaterialId | null>(null);
  const [downloading, setDownloading] = useState<MaterialId | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const getPDFGenerator = (id: MaterialId) => {
    switch (id) {
      case 'overview': return generateOverviewPDF;
      case 'gp-services': return generateGPServicesPDF;
      case 'lp-services': return generateLPServicesPDF;
      case 'service-catalog': return generateServiceCatalogPDF;
    }
  };

  const handlePreview = useCallback(async (materialId: MaterialId, title: string) => {
    setLoadingPreview(materialId);
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const generator = getPDFGenerator(materialId);
      const pdf = generator();
      const blob = pdf.output('blob');
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewTitle(title);
      setPreviewOpen(true);
    } catch (error) {
      console.error('PDF preview failed:', error);
    } finally {
      setLoadingPreview(null);
    }
  }, [previewUrl]);

  const handleDownload = useCallback(async (materialId: MaterialId, title: string) => {
    setDownloading(materialId);
    
    try {
      const generator = getPDFGenerator(materialId);
      const pdf = generator();
      pdf.save(`Aries76_${title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('PDF download failed:', error);
    } finally {
      setDownloading(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
              <FileText className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-medium">Marketing Materials</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Aries76 <span className="text-orange-400">Collateral</span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Professional marketing materials. Preview documents directly in the browser before downloading.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {materials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 border-slate-700/50 hover:border-orange-500/30 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-orange-500/10">
                          <material.icon className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <span className="text-xs text-orange-400 font-medium uppercase tracking-wider">
                            {material.category}
                          </span>
                          <CardTitle className="text-white text-lg mt-1">
                            {material.title}
                          </CardTitle>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                        {material.pages} pages
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-400 mb-6">
                      {material.description}
                    </CardDescription>
                    
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-600 hover:border-orange-500/50 hover:bg-orange-500/10"
                        onClick={() => handlePreview(material.id, material.title)}
                        disabled={loadingPreview === material.id}
                      >
                        {loadingPreview === material.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </>
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-slate-900"
                        onClick={() => handleDownload(material.id, material.title)}
                        disabled={downloading === material.id}
                      >
                        {downloading === material.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: "Years Experience", value: "26+" },
              { label: "Companies Monitored", value: "500+" },
              { label: "Capital Markets Track Record", value: "€3B+" },
              { label: "Offices", value: "London • Milan" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-slate-900/30 border border-slate-700/30">
                <div className="text-2xl md:text-3xl font-bold text-orange-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-orange-500/10 to-blue-500/10 border border-orange-500/20"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Explore Partnership Opportunities?
            </h3>
            <p className="text-slate-300 mb-6 max-w-xl mx-auto">
              Schedule a discovery call to discuss how Aries76 can support your capital formation and investment goals.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              onClick={() => window.location.href = '/contact'}
            >
              Schedule a Call
            </Button>
          </motion.div>
        </div>
      </section>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl h-[90vh] bg-slate-900 border-slate-700 p-0 flex flex-col">
          <DialogHeader className="p-4 border-b border-slate-700 flex flex-row items-center justify-between shrink-0">
            <DialogTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" />
              {previewTitle}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreviewOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogHeader>
          <div className="flex-1 p-4 min-h-0">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full rounded-lg border border-slate-700"
                title={`Preview: ${previewTitle}`}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketingMaterials;
