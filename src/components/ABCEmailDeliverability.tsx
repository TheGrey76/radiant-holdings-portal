import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Mail, 
  TrendingUp, TrendingDown, BarChart3, Zap, RefreshCw,
  ThermometerSun, Activity, AlertCircle, Info, Trash2
} from "lucide-react";
import { format, subDays, differenceInDays } from "date-fns";
import { it } from "date-fns/locale";

// Spam trigger words in Italian and English
const SPAM_TRIGGER_WORDS = [
  // Urgency
  'urgente', 'urgent', 'immediato', 'immediate', 'ora', 'now', 'affrettati', 'hurry',
  'scade', 'expires', 'ultima occasione', 'last chance', 'tempo limitato', 'limited time',
  // Money
  'gratis', 'free', 'gratuito', 'guadagna', 'earn', 'soldi', 'money', 'denaro', 
  'milioni', 'millions', 'risparmia', 'save', 'sconto', 'discount', 'offerta', 'offer',
  'garantito', 'guaranteed', 'senza rischi', 'risk free', 'investimento sicuro',
  // Spam classics
  'congratulazioni', 'congratulations', 'vincitore', 'winner', 'premio', 'prize',
  'clicca qui', 'click here', 'clicca ora', 'click now', 'agisci ora', 'act now',
  // Shady
  '100%', 'incredibile', 'incredible', 'straordinario', 'extraordinary', 'esclusivo',
  'segreto', 'secret', 'senza obbligo', 'no obligation', 'nessun impegno',
];

// Analyze email content for spam score
export function analyzeSpamScore(subject: string, content: string): {
  score: number;
  issues: Array<{ type: 'warning' | 'error'; message: string }>;
  suggestions: string[];
} {
  const issues: Array<{ type: 'warning' | 'error'; message: string }> = [];
  const suggestions: string[] = [];
  let score = 100;

  const fullText = `${subject} ${content}`.toLowerCase();
  const subjectLower = subject.toLowerCase();
  
  // Check for spam trigger words
  const foundTriggerWords: string[] = [];
  SPAM_TRIGGER_WORDS.forEach(word => {
    if (fullText.includes(word.toLowerCase())) {
      foundTriggerWords.push(word);
    }
  });

  if (foundTriggerWords.length > 0) {
    score -= foundTriggerWords.length * 5;
    issues.push({
      type: foundTriggerWords.length > 3 ? 'error' : 'warning',
      message: `Parole spam rilevate: ${foundTriggerWords.slice(0, 5).join(', ')}${foundTriggerWords.length > 5 ? '...' : ''}`
    });
    suggestions.push('Evita parole comuni negli spam come "gratis", "urgente", "clicca qui"');
  }

  // Check subject length
  if (subject.length > 60) {
    score -= 10;
    issues.push({ type: 'warning', message: 'Oggetto troppo lungo (>60 caratteri)' });
    suggestions.push('Mantieni l\'oggetto sotto i 60 caratteri per una migliore visualizzazione');
  }

  // Check for ALL CAPS in subject
  const capsRatio = (subject.match(/[A-Z]/g) || []).length / subject.length;
  if (capsRatio > 0.5 && subject.length > 5) {
    score -= 15;
    issues.push({ type: 'error', message: 'Troppo MAIUSCOLO nell\'oggetto' });
    suggestions.push('Evita l\'uso eccessivo di maiuscole - appare aggressivo');
  }

  // Check for excessive punctuation
  const excessivePunctuation = (subject.match(/[!?]{2,}/g) || []).length;
  if (excessivePunctuation > 0) {
    score -= 10;
    issues.push({ type: 'warning', message: 'Punteggiatura eccessiva (!! o ??)' });
    suggestions.push('Usa un solo punto esclamativo o interrogativo');
  }

  // Check for emojis in subject (some filters flag this)
  const emojiPattern = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/gu;
  if (emojiPattern.test(subject)) {
    score -= 5;
    issues.push({ type: 'warning', message: 'Emoji nell\'oggetto' });
    suggestions.push('Alcuni filtri penalizzano le emoji - usale con parsimonia');
  }

  // Check content length (too short = suspicious)
  if (content.length < 100) {
    score -= 10;
    issues.push({ type: 'warning', message: 'Contenuto troppo breve (<100 caratteri)' });
    suggestions.push('Email troppo corte possono sembrare sospette');
  }

  // Check for personalization placeholders
  if (!content.includes('{nome}') && !content.includes('{azienda}')) {
    score -= 5;
    issues.push({ type: 'warning', message: 'Nessuna personalizzazione rilevata' });
    suggestions.push('Usa {nome} e {azienda} per personalizzare le email');
  }

  // Check link ratio (too many links = spam)
  const linkCount = (content.match(/https?:\/\//g) || []).length;
  if (linkCount > 3) {
    score -= linkCount * 3;
    issues.push({ type: 'warning', message: `Troppi link (${linkCount})` });
    suggestions.push('Limita i link a 2-3 per email');
  }

  // Check for image-only content hints
  if (content.includes('[image]') || content.includes('[immagine]')) {
    score -= 15;
    issues.push({ type: 'error', message: 'Contenuto solo immagine' });
    suggestions.push('Evita email composte solo da immagini - aggiungi testo');
  }

  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));

  return { score, issues, suggestions };
}

interface EmailStats {
  totalSent: number;
  totalOpened: number;
  totalBounced: number;
  openRate: number;
  bounceRate: number;
  last7DaysSent: number;
  last30DaysSent: number;
  dailyAverage: number;
}

interface InvalidEmail {
  id: string;
  email: string;
  name: string;
  company: string;
  reason: 'invalid_format' | 'bounced' | 'duplicate' | 'unsubscribed';
  detectedAt: string;
}

export function ABCEmailDeliverability() {
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [invalidEmails, setInvalidEmails] = useState<InvalidEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [contentToAnalyze, setContentToAnalyze] = useState({ subject: '', content: '' });
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof analyzeSpamScore> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
    fetchInvalidEmails();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const last7Days = subDays(now, 7);
      const last30Days = subDays(now, 30);

      // Get all campaigns
      const { data: campaigns, error: campaignsError } = await supabase
        .from('abc_email_campaign_history')
        .select('successful_sends, failed_sends, sent_at');

      if (campaignsError) throw campaignsError;

      // Get all opens
      const { count: opensCount } = await supabase
        .from('abc_email_opens')
        .select('*', { count: 'exact', head: true });

      const totalSent = campaigns?.reduce((sum, c) => sum + (c.successful_sends || 0), 0) || 0;
      const totalBounced = campaigns?.reduce((sum, c) => sum + (c.failed_sends || 0), 0) || 0;
      const totalOpened = opensCount || 0;

      const last7DaysSent = campaigns
        ?.filter(c => new Date(c.sent_at) >= last7Days)
        .reduce((sum, c) => sum + (c.successful_sends || 0), 0) || 0;

      const last30DaysSent = campaigns
        ?.filter(c => new Date(c.sent_at) >= last30Days)
        .reduce((sum, c) => sum + (c.successful_sends || 0), 0) || 0;

      setStats({
        totalSent,
        totalOpened,
        totalBounced,
        openRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
        bounceRate: totalSent > 0 ? (totalBounced / (totalSent + totalBounced)) * 100 : 0,
        last7DaysSent,
        last30DaysSent,
        dailyAverage: last30DaysSent / 30,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvalidEmails = async () => {
    try {
      // Get all investors and check for invalid emails
      const { data: investors, error } = await supabase
        .from('abc_investors')
        .select('id, nome, azienda, email')
        .not('email', 'is', null);

      if (error) throw error;

      const invalid: InvalidEmail[] = [];
      const emailSet = new Set<string>();

      investors?.forEach(inv => {
        if (!inv.email) return;
        
        const email = inv.email.toLowerCase().trim();
        
        // Check for invalid format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          invalid.push({
            id: inv.id,
            email: inv.email,
            name: inv.nome,
            company: inv.azienda,
            reason: 'invalid_format',
            detectedAt: new Date().toISOString(),
          });
          return;
        }

        // Check for duplicates
        if (emailSet.has(email)) {
          invalid.push({
            id: inv.id,
            email: inv.email,
            name: inv.nome,
            company: inv.azienda,
            reason: 'duplicate',
            detectedAt: new Date().toISOString(),
          });
        } else {
          emailSet.add(email);
        }
      });

      setInvalidEmails(invalid);
    } catch (error) {
      console.error('Error fetching invalid emails:', error);
    }
  };

  const handleAnalyzeContent = () => {
    if (!contentToAnalyze.subject && !contentToAnalyze.content) {
      toast({
        title: "Contenuto mancante",
        description: "Inserisci oggetto e/o contenuto da analizzare",
        variant: "destructive",
      });
      return;
    }
    const result = analyzeSpamScore(contentToAnalyze.subject, contentToAnalyze.content);
    setAnalysisResult(result);
  };

  const handleRemoveInvalidEmail = async (investorId: string) => {
    try {
      const { error } = await supabase
        .from('abc_investors')
        .update({ email: null })
        .eq('id', investorId);

      if (error) throw error;

      toast({
        title: "Email rimossa",
        description: "L'indirizzo email non valido è stato rimosso",
      });

      setInvalidEmails(prev => prev.filter(e => e.id !== investorId));
    } catch (error) {
      console.error('Error removing email:', error);
      toast({
        title: "Errore",
        description: "Errore nella rimozione dell'email",
        variant: "destructive",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Ottimo';
    if (score >= 60) return 'Buono';
    if (score >= 40) return 'Da migliorare';
    return 'Critico';
  };

  const getWarmupStatus = () => {
    if (!stats) return { status: 'unknown', message: '', color: '' };
    
    const daily = stats.dailyAverage;
    
    if (daily < 10) {
      return { 
        status: 'cold', 
        message: 'Dominio freddo - aumenta gradualmente il volume', 
        color: 'text-blue-500',
        icon: ThermometerSun 
      };
    }
    if (daily < 50) {
      return { 
        status: 'warming', 
        message: 'Fase warm-up - mantieni volumi costanti', 
        color: 'text-yellow-500',
        icon: Activity 
      };
    }
    if (daily < 100) {
      return { 
        status: 'warm', 
        message: 'Dominio riscaldato - buona reputazione', 
        color: 'text-green-500',
        icon: CheckCircle 
      };
    }
    return { 
      status: 'hot', 
      message: 'Alto volume - monitora la reputazione', 
      color: 'text-orange-500',
      icon: Zap 
    };
  };

  const warmup = getWarmupStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Email Deliverability Suite
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitora e ottimizza la consegna delle tue email
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { fetchStats(); fetchInvalidEmails(); }}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Aggiorna
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="text-xs sm:text-sm">
            <BarChart3 className="h-4 w-4 mr-1 sm:mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="content-score" className="text-xs sm:text-sm">
            <Zap className="h-4 w-4 mr-1 sm:mr-2" />
            Content Score
          </TabsTrigger>
          <TabsTrigger value="list-hygiene" className="text-xs sm:text-sm">
            <AlertTriangle className="h-4 w-4 mr-1 sm:mr-2" />
            List Hygiene
          </TabsTrigger>
          <TabsTrigger value="warmup" className="text-xs sm:text-sm">
            <ThermometerSun className="h-4 w-4 mr-1 sm:mr-2" />
            Warm-up
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Email Inviate</p>
                      <p className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</p>
                    </div>
                    <Mail className="h-8 w-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tasso Apertura</p>
                      <p className="text-2xl font-bold">{stats.openRate.toFixed(1)}%</p>
                    </div>
                    {stats.openRate >= 20 ? (
                      <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
                    ) : (
                      <TrendingDown className="h-8 w-8 text-red-500 opacity-50" />
                    )}
                  </div>
                  <Progress value={stats.openRate} className="mt-2 h-1" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tasso Bounce</p>
                      <p className="text-2xl font-bold">{stats.bounceRate.toFixed(1)}%</p>
                    </div>
                    {stats.bounceRate < 5 ? (
                      <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500 opacity-50" />
                    )}
                  </div>
                  <Progress value={stats.bounceRate} className="mt-2 h-1" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Ultimi 7 giorni</p>
                      <p className="text-2xl font-bold">{stats.last7DaysSent}</p>
                    </div>
                    <Activity className="h-8 w-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4" />
                Raccomandazioni
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats && stats.openRate < 15 && (
                <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Tasso apertura basso</p>
                    <p className="text-xs text-muted-foreground">
                      Considera di migliorare gli oggetti delle email o segmentare meglio i destinatari
                    </p>
                  </div>
                </div>
              )}
              {stats && stats.bounceRate > 5 && (
                <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Tasso bounce elevato</p>
                    <p className="text-xs text-muted-foreground">
                      Pulisci la lista email nella sezione "List Hygiene" per migliorare la reputazione
                    </p>
                  </div>
                </div>
              )}
              {invalidEmails.length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{invalidEmails.length} email non valide rilevate</p>
                    <p className="text-xs text-muted-foreground">
                      Vai in "List Hygiene" per rimuoverle e migliorare la deliverability
                    </p>
                  </div>
                </div>
              )}
              {(!stats || (stats.openRate >= 20 && stats.bounceRate < 3 && invalidEmails.length === 0)) && (
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Tutto in ordine!</p>
                    <p className="text-xs text-muted-foreground">
                      La tua lista email e i tassi di deliverability sono ottimi
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Score Tab */}
        <TabsContent value="content-score" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Analizza Contenuto Email</CardTitle>
              <CardDescription>
                Verifica il contenuto prima di inviare per evitare filtri spam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Oggetto Email</Label>
                <Textarea
                  value={contentToAnalyze.subject}
                  onChange={(e) => setContentToAnalyze(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Inserisci l'oggetto dell'email..."
                  rows={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Contenuto Email</Label>
                <Textarea
                  value={contentToAnalyze.content}
                  onChange={(e) => setContentToAnalyze(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Inserisci il contenuto dell'email..."
                  rows={6}
                  className="mt-2"
                />
              </div>
              <Button onClick={handleAnalyzeContent} className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Analizza Contenuto
              </Button>

              {analysisResult && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">Content Score</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-3xl font-bold ${getScoreColor(analysisResult.score)}`}>
                          {analysisResult.score}
                        </span>
                        <Badge variant={analysisResult.score >= 60 ? 'default' : 'destructive'}>
                          {getScoreLabel(analysisResult.score)}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-24 h-24 relative">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(analysisResult.score / 100) * 251} 251`}
                          className={getScoreColor(analysisResult.score)}
                        />
                      </svg>
                    </div>
                  </div>

                  {analysisResult.issues.length > 0 && (
                    <div className="space-y-2">
                      <Label>Problemi Rilevati</Label>
                      {analysisResult.issues.map((issue, idx) => (
                        <div 
                          key={idx}
                          className={`flex items-start gap-2 p-2 rounded-md ${
                            issue.type === 'error' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                          }`}
                        >
                          {issue.type === 'error' ? (
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                          )}
                          <span className="text-sm">{issue.message}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {analysisResult.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <Label>Suggerimenti</Label>
                      {analysisResult.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 bg-primary/5 rounded-md">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* List Hygiene Tab */}
        <TabsContent value="list-hygiene" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Email Non Valide ({invalidEmails.length})
                </span>
                {invalidEmails.length > 0 && (
                  <Badge variant="destructive">{invalidEmails.length} da pulire</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Rimuovi email non valide per migliorare la reputazione del dominio
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invalidEmails.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-50" />
                  <p>Nessuna email non valida rilevata!</p>
                  <p className="text-sm">La tua lista è pulita</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contatto</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Problema</TableHead>
                      <TableHead className="w-[100px]">Azione</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invalidEmails.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.company}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.email}</TableCell>
                        <TableCell>
                          <Badge variant={item.reason === 'bounced' ? 'destructive' : 'secondary'}>
                            {item.reason === 'invalid_format' && 'Formato non valido'}
                            {item.reason === 'bounced' && 'Bounce'}
                            {item.reason === 'duplicate' && 'Duplicato'}
                            {item.reason === 'unsubscribed' && 'Disiscritto'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveInvalidEmail(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warm-up Tab */}
        <TabsContent value="warmup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ThermometerSun className="h-4 w-4" />
                Stato Warm-up Dominio
              </CardTitle>
              <CardDescription>
                Monitora il riscaldamento del dominio per massimizzare la deliverability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {stats && (
                <>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {warmup.icon && <warmup.icon className={`h-8 w-8 ${warmup.color}`} />}
                      <div>
                        <p className="font-medium capitalize">{warmup.status}</p>
                        <p className="text-sm text-muted-foreground">{warmup.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stats.dailyAverage.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">email/giorno (media)</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Raccomandazioni Warm-up</Label>
                    
                    <div className="grid gap-3">
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <p className="font-medium text-sm">Settimana 1-2: 10-20 email/giorno</p>
                          <p className="text-xs text-muted-foreground">
                            Inizia con volumi bassi verso contatti di alta qualità
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <p className="font-medium text-sm">Settimana 3-4: 30-50 email/giorno</p>
                          <p className="text-xs text-muted-foreground">
                            Aumenta gradualmente mantenendo alta la qualità
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <p className="font-medium text-sm">Mese 2+: 50-100 email/giorno</p>
                          <p className="text-xs text-muted-foreground">
                            Dominio riscaldato - mantieni consistenza nei volumi
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Volume Ultimi 30 Giorni</Label>
                    <div className="flex items-center gap-2">
                      <Progress value={Math.min((stats.last30DaysSent / 1000) * 100, 100)} className="h-3" />
                      <span className="text-sm font-medium w-16">{stats.last30DaysSent}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Target consigliato: 500-1000 email/mese per un warm-up ottimale
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
