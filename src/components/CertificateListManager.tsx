import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Upload, Search, ExternalLink, ArrowUpDown, Star, X, CheckCircle2, AlertTriangle, TrendingUp, Medal, Plus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Certificate {
  id: number;
  isin: string;
  issuer: string;
  theme: string;
  type: string;
  couponPa: string;
  couponFrequency: string;
  couponBarrier: string;
  capitalBarrier: string;
  maturity: string;
  irr: string;
  ask: string;
  underlyings: string;
  isNew?: boolean;
}

// Initial list parsed from the PDF
const certificateList: Certificate[] = [
  // Capital Protected
  { id: 2, isin: 'CH1491786658', issuer: 'Leonteq', theme: 'Italian Equity Capital Protected', type: 'Capital Protected', couponPa: '-', couponFrequency: '-', couponBarrier: '-', capitalBarrier: '100%', maturity: '5 Year', irr: '-', ask: '98.27%', underlyings: 'Leonteq Italian Equity 16%RC Index' },
  { id: 3, isin: 'CH1491772674', issuer: 'Leonteq', theme: 'Cross Asset Basket', type: 'Capital Protected', couponPa: '-', couponFrequency: '-', couponBarrier: '-', capitalBarrier: 'Formula', maturity: '5 Year', irr: '-', ask: '-', underlyings: 'Leonteq Cross Asset Basket 8%RC Index' },
  
  // Phoenix Single Underlying
  { id: 4, isin: 'DE000VJ3ALX6', issuer: 'Vontobel', theme: 'Single Name on Palantir', type: 'Phoenix Single', couponPa: '11.00%', couponFrequency: 'Quarterly', couponBarrier: '65%', capitalBarrier: '65%', maturity: '3 Year', irr: '11.88%', ask: '97.20%', underlyings: 'Palantir Technologies Inc', isNew: true },
  { id: 5, isin: 'XS3189111779', issuer: 'Barclays', theme: 'Single Name on Intel', type: 'Phoenix Single', couponPa: '10.40%', couponFrequency: 'Semi-annual', couponBarrier: '65%', capitalBarrier: '65%', maturity: '3 Year', irr: '10.59%', ask: '-', underlyings: 'Intel Corp' },
  { id: 6, isin: 'DE000VJ3ALY4', issuer: 'Vontobel', theme: 'Single Name on Micron', type: 'Phoenix Single', couponPa: '14.00%', couponFrequency: 'Quarterly', couponBarrier: '65%', capitalBarrier: '65%', maturity: '3 Year', irr: '13.47%', ask: '-', underlyings: 'MICRON TECH', isNew: true },
  { id: 7, isin: 'XS3189111852', issuer: 'Barclays', theme: 'Single Name on Tesla', type: 'Phoenix Single', couponPa: '13.16%', couponFrequency: 'Semi-annual', couponBarrier: '65%', capitalBarrier: '65%', maturity: '3 Year', irr: '12.29%', ask: '-', underlyings: 'Tesla Inc' },
  
  // Phoenix Worst-of 2
  { id: 8, isin: 'XS3221979696', issuer: 'Barclays', theme: 'Quantum Computing Basket', type: 'Phoenix WO-2', couponPa: '28.44%', couponFrequency: 'Quarterly', couponBarrier: '55%', capitalBarrier: '55%', maturity: '2 Year', irr: '26.55%', ask: '-', underlyings: 'IONQ Inc, Rigetti Computing Inc' },
  
  // Phoenix Worst-of 3
  { id: 9, isin: 'XS3167625907', issuer: 'Barclays', theme: 'FinTech Basket', type: 'Phoenix WO-3', couponPa: '15.00%', couponFrequency: 'Monthly', couponBarrier: '50%', capitalBarrier: '50%', maturity: '5 Year', irr: '17.44%', ask: '88.42%', underlyings: 'Block Inc, MicroStrategy Inc, AMD' },
  { id: 10, isin: 'XS3153270833', issuer: 'Barclays', theme: 'Look Back Ita Basket', type: 'Phoenix WO-3', couponPa: '8.00%', couponFrequency: 'Quarterly', couponBarrier: '65%', capitalBarrier: '65%', maturity: '4 Year', irr: '9.76%', ask: '93.30%', underlyings: 'Ferrari NV, Brunello Cucinelli, Campari' },
  { id: 11, isin: 'XS3167626897', issuer: 'Barclays', theme: 'ITA Basket', type: 'Phoenix WO-3', couponPa: '12.00%', couponFrequency: 'Quarterly', couponBarrier: '60%', capitalBarrier: '60%', maturity: '5 Year', irr: '13.64%', ask: '94.24%', underlyings: 'Nexi SpA, Campari, Fincantieri SpA' },
  { id: 12, isin: 'CH1505560248', issuer: 'Leonteq', theme: 'Germany Basket', type: 'Phoenix WO-3', couponPa: '12.00%', couponFrequency: 'Monthly', couponBarrier: '60%', capitalBarrier: '60%', maturity: '4 Year', irr: '11.82%', ask: '-', underlyings: 'Allianz SE, Commerzbank, Deutsche Bank' },
  { id: 13, isin: 'DE000UQ40VL6', issuer: 'UBS', theme: 'EU Banks Basket', type: 'Phoenix WO-3', couponPa: '10.50%', couponFrequency: 'Monthly', couponBarrier: '65%', capitalBarrier: '60%', maturity: '3 Year', irr: '10.28%', ask: '-', underlyings: 'Deutsche Bank, Soc Gen, Unicredit' },
  { id: 14, isin: 'XS3178417096', issuer: 'Barclays', theme: 'Italian Blue Chips', type: 'Phoenix WO-3', couponPa: '9.60%', couponFrequency: 'Monthly', couponBarrier: '65%', capitalBarrier: '65%', maturity: '5 Year', irr: '9.26%', ask: '-', underlyings: 'ENI, Enel, Intesa Sanpaolo' },
  { id: 15, isin: 'DE000UQ71H37', issuer: 'UBS', theme: 'Italian Basket', type: 'Phoenix WO-3', couponPa: '15.75%', couponFrequency: 'Quarterly', couponBarrier: '60%', capitalBarrier: '60%', maturity: '3 Year', irr: '-', ask: '-', underlyings: 'Stellantis, Nexi, STM', isNew: true },
  { id: 16, isin: 'XS3239587002', issuer: 'Barclays', theme: 'EU Defensive Basket', type: 'Phoenix WO-3', couponPa: '13.52%', couponFrequency: 'Quarterly', couponBarrier: '65%', capitalBarrier: '65%', maturity: '3 Year', irr: '-', ask: '-', underlyings: 'Rheinmetall, BAE Systems, Thales', isNew: true },
  { id: 17, isin: 'XS3120925063', issuer: 'Barclays', theme: 'Semiconductor Basket', type: 'Phoenix WO-3', couponPa: '15.60%', couponFrequency: 'Quarterly', couponBarrier: '60%', capitalBarrier: '60%', maturity: '5 Year', irr: '18.49%', ask: '90.41%', underlyings: 'AMD, Intel, TSMC' },
  { id: 18, isin: 'DE000VJ1P3J8', issuer: 'Vontobel', theme: 'Luxury Basket', type: 'Phoenix WO-3', couponPa: '10.56%', couponFrequency: 'Quarterly', couponBarrier: '65%', capitalBarrier: '65%', maturity: '3 Year', irr: '11.31%', ask: '93.80%', underlyings: 'Kering, LVMH, Richemont' },
  { id: 19, isin: 'XS3189071965', issuer: 'Barclays', theme: 'Energy Basket', type: 'Phoenix WO-3', couponPa: '12.00%', couponFrequency: 'Quarterly', couponBarrier: '60%', capitalBarrier: '60%', maturity: '5 Year', irr: '13.26%', ask: '95.26%', underlyings: 'BP, Shell, TotalEnergies' },
  { id: 20, isin: 'CH1505566112', issuer: 'Leonteq', theme: 'US Tech Autocallable', type: 'Phoenix WO-3', couponPa: '12.00%', couponFrequency: 'Monthly', couponBarrier: '65%', capitalBarrier: '65%', maturity: '3 Year', irr: '12.51%', ask: '98.28%', underlyings: 'Alphabet, Microsoft, Nvidia' },
  { id: 21, isin: 'DE000UQ5Q5P2', issuer: 'UBS', theme: 'Italian Banks Basket', type: 'Phoenix WO-3', couponPa: '10.20%', couponFrequency: 'Monthly', couponBarrier: '70%', capitalBarrier: '60%', maturity: '3 Year', irr: '10.26%', ask: '99.62%', underlyings: 'Intesa, Unicredit, BPER' },
  { id: 22, isin: 'XS3230927454', issuer: 'Barclays', theme: 'Large Pharma Basket', type: 'Phoenix WO-3', couponPa: '13.84%', couponFrequency: 'Quarterly', couponBarrier: '65%', capitalBarrier: '65%', maturity: '3 Year', irr: '13.70%', ask: '-', underlyings: 'Pfizer, JNJ, Merck', isNew: true },
  { id: 23, isin: 'XS3230910302', issuer: 'Barclays', theme: 'Miners Basket', type: 'Phoenix WO-3', couponPa: '12.00%', couponFrequency: 'Quarterly', couponBarrier: '65%', capitalBarrier: '65%', maturity: '3 Year', irr: '11.79%', ask: '-', underlyings: 'Rio Tinto, BHP, Vale', isNew: true },
  
  // Phoenix Worst-of 4
  { id: 24, isin: 'XS3178429703', issuer: 'Barclays', theme: 'US Mixed Basket', type: 'Phoenix WO-4', couponPa: '17.00%', couponFrequency: 'Quarterly', couponBarrier: '60%', capitalBarrier: '60%', maturity: '5 Year', irr: '16.77%', ask: '-', underlyings: 'Tesla, Coinbase, Block, AMD' },
  { id: 25, isin: 'XS3239537163', issuer: 'Barclays', theme: 'US Defensive Basket', type: 'Phoenix WO-4', couponPa: '14.04%', couponFrequency: 'Quarterly', couponBarrier: '65%', capitalBarrier: '65%', maturity: '3 Year', irr: '13.76%', ask: '100.4%', underlyings: 'Northrop Grumman, Lockheed, Axon, Boeing', isNew: true },
];

// Calculate composite score for ranking (higher = better)
const calculateScore = (cert: Certificate): number => {
  const parsePercent = (val: string) => {
    const num = parseFloat(val.replace('%', ''));
    return isNaN(num) ? 0 : num;
  };

  const coupon = parsePercent(cert.couponPa);
  const irr = parsePercent(cert.irr);
  const capitalBarrier = parsePercent(cert.capitalBarrier);
  const couponBarrier = parsePercent(cert.couponBarrier);
  
  // Score components (normalized 0-100)
  const yieldScore = Math.min((irr > 0 ? irr : coupon) * 4, 100); // Max ~25% IRR = 100
  const barrierScore = (100 - capitalBarrier) + (100 - couponBarrier); // Lower barrier = more protection = higher score
  const safetyScore = Math.min(barrierScore, 100);
  
  // Weighted composite: 50% yield, 30% safety, 20% bonus for new products
  const newBonus = cert.isNew ? 10 : 0;
  
  return yieldScore * 0.5 + safetyScore * 0.3 + newBonus;
};

interface CertificateListManagerProps {
  onSelectReplacement?: (cert: Certificate) => void;
  onAddToPortfolio?: (cert: Certificate) => void;
  replacingIsin?: string;
  showAddButton?: boolean;
}

export const CertificateListManager = ({ 
  onSelectReplacement, 
  onAddToPortfolio,
  replacingIsin,
  showAddButton = false 
}: CertificateListManagerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [issuerFilter, setIssuerFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'couponPa' | 'irr' | 'maturity'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  
  const issuers = useMemo(() => 
    Array.from(new Set(certificateList.map(c => c.issuer))).sort(),
    []
  );
  
  const types = useMemo(() => 
    Array.from(new Set(certificateList.map(c => c.type))).sort(),
    []
  );
  
  const filteredCerts = useMemo(() => {
    return certificateList
      .filter(cert => {
        const matchesSearch = 
          cert.isin.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.underlyings.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesIssuer = issuerFilter === 'all' || cert.issuer === issuerFilter;
        const matchesType = typeFilter === 'all' || cert.type === typeFilter;
        const matchesNew = !showOnlyNew || cert.isNew;
        return matchesSearch && matchesIssuer && matchesType && matchesNew;
      })
      .sort((a, b) => {
        const parsePercent = (val: string) => {
          const num = parseFloat(val.replace('%', ''));
          return isNaN(num) ? 0 : num;
        };
        
        let comparison = 0;
        if (sortBy === 'score') {
          comparison = calculateScore(a) - calculateScore(b);
        } else if (sortBy === 'couponPa') {
          comparison = parsePercent(a.couponPa) - parsePercent(b.couponPa);
        } else if (sortBy === 'irr') {
          comparison = parsePercent(a.irr) - parsePercent(b.irr);
        } else if (sortBy === 'maturity') {
          const parseMaturity = (val: string) => parseInt(val) || 0;
          comparison = parseMaturity(a.maturity) - parseMaturity(b.maturity);
        }
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });
  }, [searchTerm, issuerFilter, typeFilter, sortBy, sortOrder, showOnlyNew]);
  
  const handleSort = (column: 'score' | 'couponPa' | 'irr' | 'maturity') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  const getRankBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-amber-500 text-white">🥇 #1</Badge>;
    if (index === 1) return <Badge className="bg-slate-400 text-white">🥈 #2</Badge>;
    if (index === 2) return <Badge className="bg-amber-700 text-white">🥉 #3</Badge>;
    return <Badge variant="outline" className="text-slate-500">#{index + 1}</Badge>;
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 40) return 'text-emerald-600';
    if (score >= 30) return 'text-blue-600';
    if (score >= 20) return 'text-amber-600';
    return 'text-slate-500';
  };
  
  const getIssuerColor = (issuer: string) => {
    switch (issuer) {
      case 'Barclays': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'UBS': return 'bg-red-100 text-red-800 border-red-200';
      case 'Vontobel': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Leonteq': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };
  
  const getBorsaItalianaUrl = (isin: string) => {
    if (isin.startsWith('XS')) {
      return `https://www.borsaitaliana.it/borsa/cw-e-certificates/eurotlx/scheda/${isin}.html?lang=it`;
    }
    return `https://www.borsaitaliana.it/borsa/cw-e-certificates/scheda/${isin}.html?lang=it`;
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
              <Upload className="h-5 w-5 text-slate-600" />
              Certificati Disponibili
              <Badge variant="secondary" className="ml-2">{filteredCerts.length}</Badge>
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              Lista aggiornata al 19 gennaio 2026 — EuroTLX & SeDeX
            </p>
          </div>
          {replacingIsin && (
            <Badge variant="outline" className="border-amber-400 text-amber-700 bg-amber-50 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Sostituzione: {replacingIsin}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Cerca ISIN, tema o sottostanti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={issuerFilter} onValueChange={setIssuerFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Emittente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti</SelectItem>
              {issuers.map(issuer => (
                <SelectItem key={issuer} value={issuer}>{issuer}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i tipi</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant={showOnlyNew ? "default" : "outline"}
            size="sm"
            onClick={() => setShowOnlyNew(!showOnlyNew)}
            className="gap-2"
          >
            <Star className="h-4 w-4" />
            Solo Nuovi
          </Button>
          
          {(searchTerm || issuerFilter !== 'all' || typeFilter !== 'all' || showOnlyNew) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setIssuerFilter('all');
                setTypeFilter('all');
                setShowOnlyNew(false);
              }}
              className="gap-2 text-slate-500"
            >
              <X className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
        
        {/* Table */}
        <ScrollArea className="h-[500px] rounded-lg border border-slate-200">
          <Table>
            <TableHeader className="sticky top-0 bg-slate-50 z-10">
              <TableRow>
                <TableHead 
                  className="w-[80px] cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('score')}
                >
                  <div className="flex items-center gap-1">
                    <Medal className="h-3 w-3" />
                    Rank
                    {sortBy === 'score' && <ArrowUpDown className="h-3 w-3" />}
                  </div>
                </TableHead>
                <TableHead className="w-[120px]">ISIN</TableHead>
                <TableHead>Emittente</TableHead>
                <TableHead className="max-w-[180px]">Tema / Sottostanti</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('couponPa')}
                >
                  <div className="flex items-center gap-1">
                    Cedola p.a.
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Barriera</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('irr')}
                >
                  <div className="flex items-center gap-1">
                    IRR
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="w-[70px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        Score
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[200px]">
                        <p className="text-xs">Score composito basato su: rendimento (50%), sicurezza barriere (30%), novità (20%)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredCerts.map((cert, index) => {
                  const score = calculateScore(cert);
                  return (
                  <motion.tr
                    key={cert.isin}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.02 }}
                    className={`group hover:bg-slate-50 ${selectedCert?.isin === cert.isin ? 'bg-blue-50' : ''} ${index < 3 ? 'bg-gradient-to-r from-amber-50/50 to-transparent' : ''}`}
                  >
                    <TableCell>
                      {getRankBadge(index)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        {cert.isNew && (
                          <Badge variant="default" className="bg-emerald-500 text-[10px] px-1">NEW</Badge>
                        )}
                        {cert.isin.slice(0, 12)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getIssuerColor(cert.issuer)}>
                        {cert.issuer}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-900 text-sm">{cert.theme}</p>
                        <p className="text-xs text-slate-500 truncate">{cert.underlyings}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${parseFloat(cert.couponPa) >= 12 ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {cert.couponPa}
                      </span>
                      <p className="text-xs text-slate-500">{cert.couponFrequency}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{cert.capitalBarrier}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${parseFloat(cert.irr) >= 12 ? 'text-blue-600' : 'text-slate-700'}`}>
                        {cert.irr || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${getScoreColor(score)}`}>
                        {score.toFixed(0)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={getBorsaItalianaUrl(cert.isin)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        {onSelectReplacement && (
                          <Button 
                            size="sm" 
                            variant="default"
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => {
                              setSelectedCert(cert);
                              onSelectReplacement(cert);
                            }}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Seleziona
                          </Button>
                        )}
                        {onAddToPortfolio && showAddButton && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => onAddToPortfolio(cert)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Aggiungi
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-7 text-xs"
                              onClick={() => setSelectedCert(cert)}
                            >
                              Dettagli
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Badge variant="outline" className={getIssuerColor(cert.issuer)}>
                                  {cert.issuer}
                                </Badge>
                                {cert.theme}
                              </DialogTitle>
                              <DialogDescription className="font-mono">{cert.isin}</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                              <div>
                                <p className="text-xs text-slate-500 uppercase">Tipo</p>
                                <p className="font-medium">{cert.type}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase">Cedola p.a.</p>
                                <p className="font-medium text-emerald-600">{cert.couponPa}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase">Frequenza</p>
                                <p className="font-medium">{cert.couponFrequency}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase">IRR</p>
                                <p className="font-medium text-blue-600">{cert.irr || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase">Barriera Cedola</p>
                                <p className="font-medium">{cert.couponBarrier}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase">Barriera Capitale</p>
                                <p className="font-medium">{cert.capitalBarrier}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase">Scadenza</p>
                                <p className="font-medium">{cert.maturity}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase">Ask</p>
                                <p className="font-medium">{cert.ask || 'N/A'}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-xs text-slate-500 uppercase">Sottostanti</p>
                                <p className="font-medium">{cert.underlyings}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href={getBorsaItalianaUrl(cert.isin)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                              >
                                <Button className="w-full" variant="outline">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Vedi su Borsa Italiana
                                </Button>
                              </a>
                              {onSelectReplacement && (
                                <Button 
                                  className="flex-1"
                                  onClick={() => onSelectReplacement(cert)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Usa come Sostituto
                                </Button>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        </ScrollArea>
        
        {/* Summary */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-50 border-emerald-200">NEW</Badge>
            <span>{certificateList.filter(c => c.isNew).length} nuovi certificati</span>
          </div>
          <div>Top Cedola: <span className="font-semibold text-emerald-600">28.44%</span> (Quantum Computing)</div>
          <div>Top IRR: <span className="font-semibold text-blue-600">26.55%</span> (Quantum Computing)</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateListManager;
