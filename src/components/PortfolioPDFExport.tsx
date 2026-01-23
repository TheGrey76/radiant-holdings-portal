import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import { PortfolioConfig } from '@/hooks/usePortfolioGU';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface PortfolioPDFExportProps {
  portfolio: PortfolioConfig;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export const PortfolioPDFExport = ({ portfolio, variant = 'default', size = 'default' }: PortfolioPDFExportProps) => {
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    if (!portfolio) return;

    setGenerating(true);

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let y = margin;

      // Helper function to add new page if needed
      const checkPageBreak = (neededSpace: number) => {
        if (y + neededSpace > 270) {
          pdf.addPage();
          y = margin;
        }
      };

      // Header with branding
      pdf.setFillColor(30, 41, 59); // slate-800
      pdf.rect(0, 0, pageWidth, 45, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ARIES76', margin, 20);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('CAPITAL INTELLIGENCE', margin, 28);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Structured Products Portfolio', pageWidth - margin, 20, { align: 'right' });
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${portfolio.client_name}`, pageWidth - margin, 28, { align: 'right' });
      pdf.text(`Generato: ${format(new Date(), 'dd MMMM yyyy, HH:mm', { locale: it })}`, pageWidth - margin, 36, { align: 'right' });

      y = 60;
      pdf.setTextColor(0, 0, 0);

      // Portfolio Summary Box
      pdf.setFillColor(248, 250, 252); // slate-50
      pdf.setDrawColor(226, 232, 240); // slate-200
      pdf.roundedRect(margin, y - 5, pageWidth - 2 * margin, 30, 3, 3, 'FD');
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Riepilogo Portafoglio', margin + 5, y + 5);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const totalValue = portfolio.holdings.reduce((sum, h) => sum + h.allocation_amount, 0);
      pdf.text(`Valore Totale: EUR ${totalValue.toLocaleString('it-IT')}`, margin + 5, y + 15);
      
      const totalCouponIncome = portfolio.holdings.reduce((sum, h) => {
        const coupon = parseFloat(h.coupon_pa?.replace('%', '') || '0');
        return sum + (h.allocation_amount * coupon / 100);
      }, 0);
      pdf.text(`Reddito Cedolare Potenziale: EUR ${totalCouponIncome.toLocaleString('it-IT', { maximumFractionDigits: 0 })} / anno`, margin + 100, y + 15);
      
      y += 40;

      // Holdings Table
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Composizione Portafoglio', margin, y);
      y += 10;

      // Table Header
      pdf.setFillColor(30, 41, 59);
      pdf.rect(margin, y - 5, pageWidth - 2 * margin, 10, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Pos', margin + 3, y + 2);
      pdf.text('ISIN', margin + 15, y + 2);
      pdf.text('Emittente / Nome', margin + 50, y + 2);
      pdf.text('Cedola', margin + 115, y + 2);
      pdf.text('Barriera', margin + 135, y + 2);
      pdf.text('Allocazione', pageWidth - margin - 5, y + 2, { align: 'right' });
      
      y += 10;
      pdf.setTextColor(0, 0, 0);

      // Table Rows
      portfolio.holdings.forEach((holding, index) => {
        checkPageBreak(20);
        
        // Alternate row background
        if (index % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(margin, y - 4, pageWidth - 2 * margin, 18, 'F');
        }

        // Position badge
        const badgeColors: Record<string, number[]> = {
          'A': [71, 85, 105], // slate-600
          'B': [37, 99, 235], // blue-600
          'C': [5, 150, 105], // emerald-600
          'D': [217, 119, 6], // amber-600
          'E': [22, 163, 74], // green-600
        };
        const color = badgeColors[holding.position_label] || [100, 100, 100];
        pdf.setFillColor(color[0], color[1], color[2]);
        pdf.roundedRect(margin + 2, y - 3, 8, 8, 1, 1, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.text(holding.position_label, margin + 4.5, y + 2);

        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        
        // ISIN
        pdf.text(holding.isin, margin + 15, y);
        
        // Show if replaced
        if (holding.replaced_isin) {
          pdf.setTextColor(220, 38, 38); // red-600
          pdf.setFontSize(5);
          pdf.text(`(sostituisce ${holding.replaced_isin})`, margin + 15, y + 4);
          pdf.setTextColor(0, 0, 0);
        }
        
        // Issuer & Name
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.text(holding.issuer, margin + 50, y);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6);
        const truncatedName = holding.name.length > 35 ? holding.name.substring(0, 35) + '...' : holding.name;
        pdf.text(truncatedName, margin + 50, y + 5);
        
        // Underlyings
        if (holding.underlyings) {
          pdf.setFontSize(5);
          pdf.setTextColor(100, 116, 139);
          const truncatedUnderlyings = holding.underlyings.length > 40 ? holding.underlyings.substring(0, 40) + '...' : holding.underlyings;
          pdf.text(truncatedUnderlyings, margin + 50, y + 9);
          pdf.setTextColor(0, 0, 0);
        }
        
        // Coupon
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        const couponValue = holding.coupon_pa || '-';
        if (couponValue !== '-') {
          pdf.setTextColor(5, 150, 105);
        } else {
          pdf.setTextColor(0, 0, 0);
        }
        pdf.text(couponValue, margin + 115, y);
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(5);
        pdf.setFont('helvetica', 'normal');
        pdf.text(holding.coupon_frequency || '', margin + 115, y + 4);
        
        // Barrier
        pdf.setFontSize(7);
        pdf.text(holding.capital_barrier || '-', margin + 135, y);
        
        // Allocation
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${holding.allocation_percent}%`, pageWidth - margin - 5, y - 1, { align: 'right' });
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`€${holding.allocation_amount.toLocaleString('it-IT')}`, pageWidth - margin - 5, y + 5, { align: 'right' });
        
        y += 18;
      });

      // Total row
      pdf.setFillColor(30, 41, 59);
      pdf.rect(margin, y - 4, pageWidth - 2 * margin, 12, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TOTALE PORTAFOGLIO', margin + 5, y + 4);
      pdf.text(`€${totalValue.toLocaleString('it-IT')}`, pageWidth - margin - 5, y + 4, { align: 'right' });
      
      y += 25;

      // Risk Summary Section
      checkPageBreak(60);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Riepilogo Rischio e Rendimento', margin, y);
      y += 10;

      // Calculate metrics
      const avgCoupon = portfolio.holdings.reduce((sum, h) => {
        const coupon = parseFloat(h.coupon_pa?.replace('%', '') || '0');
        return sum + coupon * h.allocation_percent / 100;
      }, 0);

      const issuerCount = new Set(portfolio.holdings.map(h => h.issuer)).size;
      const protectedAllocation = portfolio.holdings
        .filter(h => h.capital_barrier === '100%')
        .reduce((sum, h) => sum + h.allocation_percent, 0);

      const metrics = [
        { label: 'Cedola Media Ponderata', value: `${avgCoupon.toFixed(2)}% p.a.` },
        { label: 'Reddito Annuo Potenziale', value: `€${totalCouponIncome.toLocaleString('it-IT', { maximumFractionDigits: 0 })}` },
        { label: 'Numero Emittenti', value: issuerCount.toString() },
        { label: 'Allocazione Capital Protected', value: `${protectedAllocation}%` },
      ];

      const metricWidth = (pageWidth - 2 * margin - 15) / 2;
      metrics.forEach((metric, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = margin + col * (metricWidth + 10);
        const yPos = y + row * 18;

        pdf.setFillColor(248, 250, 252);
        pdf.setDrawColor(226, 232, 240);
        pdf.roundedRect(x, yPos - 3, metricWidth, 15, 2, 2, 'FD');
        
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 116, 139);
        pdf.text(metric.label, x + 5, yPos + 3);
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(30, 41, 59);
        pdf.text(metric.value, x + 5, yPos + 9);
      });

      y += 45;

      // Disclaimer
      checkPageBreak(40);
      
      pdf.setFillColor(254, 243, 199); // amber-100
      pdf.setDrawColor(252, 211, 77); // amber-300
      pdf.roundedRect(margin, y - 3, pageWidth - 2 * margin, 25, 2, 2, 'FD');
      
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(120, 53, 15); // amber-800
      pdf.text('AVVERTENZE: Questo documento è fornito esclusivamente a scopo informativo e non costituisce consulenza finanziaria.', margin + 5, y + 3);
      pdf.text('I rendimenti passati non sono indicativi di quelli futuri. Prima di investire, si prega di consultare tutta la documentazione di offerta.', margin + 5, y + 9);
      pdf.text('I certificati sono strumenti finanziari complessi che comportano rischi significativi, inclusa la possibile perdita del capitale investito.', margin + 5, y + 15);

      // Footer
      const footerY = pdf.internal.pageSize.getHeight() - 15;
      pdf.setFontSize(7);
      pdf.setTextColor(148, 163, 184);
      pdf.text('© 2026 ARIES76 Capital Intelligence | Documento Confidenziale', margin, footerY);
      pdf.text(`Pagina 1 di 1`, pageWidth - margin, footerY, { align: 'right' });

      // Save the PDF
      const filename = `Portfolio_${portfolio.client_code}_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`;
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
      disabled={generating || !portfolio}
      variant={variant}
      size={size}
    >
      {generating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4 mr-2" />
      )}
      {generating ? 'Generazione...' : 'Esporta PDF'}
    </Button>
  );
};

export default PortfolioPDFExport;
