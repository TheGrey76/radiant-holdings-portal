import { useState } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { blogPosts, BlogPost } from '@/data/blogPosts';
import { Copy, Check, Linkedin, FileText, Mail, ExternalLink, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GeneratedContent {
  linkedin: string;
  linkedinNewsletter: string;
  medium: string;
  substack: string;
}

const CrossPostingAssistant = () => {
  const { toast } = useToast();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  const generateOptimizedContent = async (post: BlogPost) => {
    setIsGenerating(true);
    setSelectedPost(post);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-cross-post-content', {
        body: {
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          slug: post.slug,
          readTime: post.readTime
        }
      });

      if (error) throw error;

      // Check if response contains valid content or an error
      if (data?.error || !data?.linkedin) {
        console.error('Invalid response from edge function:', data);
        throw new Error(data?.error || 'Invalid response');
      }

      setGeneratedContent(data);
      toast({
        title: "Contenuti generati con AI",
        description: "I contenuti ottimizzati sono pronti per ogni piattaforma"
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      // Fallback to template-based generation
      const templateContent = generateTemplateContent(post);
      setGeneratedContent(templateContent);
      toast({
        title: "Contenuti generati (template)",
        description: "Generati con template predefiniti"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTemplateContent = (post: BlogPost): GeneratedContent => {
    const fullUrl = `https://www.aries76.com/blog/${post.slug}`;
    
    return {
      linkedin: `🎯 ${post.title}

${post.excerpt}

L'analisi completa è disponibile sul nostro blog.

👉 ${fullUrl}

#PrivateMarkets #PrivateEquity #InvestmentStrategy #WealthManagement #FamilyOffice`,
      
      linkedinNewsletter: `# ${post.title}

${post.excerpt}

---

## Punti chiave

In questo articolo analizziamo:

• Le tendenze emergenti nel settore
• Le implicazioni per gli investitori istituzionali  
• Le strategie operative consigliate

---

## Analisi approfondita

[Inserisci qui il contenuto principale dell'articolo, mantenendo paragrafi brevi e inserendo sottotitoli ogni 2-3 paragrafi]

---

## Conclusioni

[Riassumi i takeaway principali]

---

📖 Leggi l'articolo completo: ${fullUrl}

💼 Per approfondimenti: edoardo.grigione@aries76.com

---

*ARIES76 | Capital Intelligence*
*Private Markets Advisory | GP Capital Formation | Structured Solutions*`,

      medium: `# ${post.title}

*${post.category} | ${post.readTime}*

![Cover Image](https://www.aries76.com/og-image.png)

${post.excerpt}

---

## Introduzione

[Espandi l'introduzione con contesto di mercato e rilevanza per il lettore]

## Analisi

[Corpo principale dell'articolo con sottosezioni]

### [Sottotitolo 1]

[Contenuto dettagliato]

### [Sottotitolo 2]

[Contenuto dettagliato]

## Implicazioni per gli investitori

[Conclusioni operative e raccomandazioni]

---

*Questo articolo è stato originariamente pubblicato su [ARIES76](${fullUrl})*

*Per ricevere analisi esclusive sui private markets, iscriviti alla nostra newsletter.*

---

Tags: ${post.category}, Private Markets, Investment Strategy, Wealth Management`,

      substack: `# ${post.title}

*Ciao,*

*Questa settimana analizziamo un tema cruciale per chi opera nei mercati privati.*

---

## Il contesto

${post.excerpt}

## Cosa significa per te

[Personalizza con implicazioni pratiche per il lettore]

## I nostri takeaway

1. **[Punto chiave 1]** - [Spiegazione]
2. **[Punto chiave 2]** - [Spiegazione]
3. **[Punto chiave 3]** - [Spiegazione]

---

## Per approfondire

L'analisi completa con tutti i dati e le fonti è disponibile sul nostro sito:

👉 [Leggi l'articolo completo](${fullUrl})

---

*A presto,*

*Edoardo Grigione*
*Founder, ARIES76*

---

📩 Hai domande? Rispondi a questa email.
🔗 [LinkedIn](https://www.linkedin.com/company/aries76) | [Website](https://www.aries76.com)`
    };
  };

  const copyToClipboard = async (content: string, platform: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedPlatform(platform);
    toast({
      title: "Copiato!",
      description: `Contenuto ${platform} copiato negli appunti`
    });
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
      case 'linkedinNewsletter':
        return <Linkedin className="w-4 h-4" />;
      case 'medium':
        return <FileText className="w-4 h-4" />;
      case 'substack':
        return <Mail className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const platformLabels: Record<string, string> = {
    linkedin: 'LinkedIn Post',
    linkedinNewsletter: 'LinkedIn Newsletter',
    medium: 'Medium Article',
    substack: 'Substack Newsletter'
  };

  const platformDescriptions: Record<string, string> = {
    linkedin: 'Post breve con hashtag per il feed LinkedIn',
    linkedinNewsletter: 'Formato lungo per la tua newsletter LinkedIn',
    medium: 'Articolo SEO-ottimizzato con canonical URL',
    substack: 'Newsletter personalizzata per i tuoi subscriber'
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Cross-Posting Assistant | ARIES76</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Cross-Posting Assistant
            </h1>
            <p className="text-muted-foreground">
              Genera contenuti ottimizzati per ogni piattaforma a partire dai tuoi articoli
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Blog Posts List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Articoli</CardTitle>
                  <CardDescription>
                    Seleziona un articolo da distribuire
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                  {blogPosts.map((post) => (
                    <button
                      key={post.slug}
                      onClick={() => generateOptimizedContent(post)}
                      disabled={isGenerating}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedPost?.slug === post.slug
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <Badge variant="outline" className="text-xs mb-1">
                            {post.category}
                          </Badge>
                          <p className="text-sm font-medium text-foreground line-clamp-2">
                            {post.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {post.date}
                          </p>
                        </div>
                        {selectedPost?.slug === post.slug && isGenerating && (
                          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Generated Content */}
            <div className="lg:col-span-2">
              {!selectedPost ? (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <div className="text-center p-8">
                    <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Seleziona un articolo
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Clicca su un articolo dalla lista per generare contenuti ottimizzati per ogni piattaforma
                    </p>
                  </div>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{selectedPost.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Contenuti generati per la distribuzione
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/blog/${selectedPost.slug}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Vedi originale
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isGenerating ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <Sparkles className="w-8 h-8 text-primary animate-pulse mx-auto mb-3" />
                          <p className="text-muted-foreground">Generazione contenuti in corso...</p>
                        </div>
                      </div>
                    ) : generatedContent ? (
                      <Tabs defaultValue="linkedin" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="linkedin" className="text-xs">
                            <Linkedin className="w-3 h-3 mr-1" />
                            Post
                          </TabsTrigger>
                          <TabsTrigger value="linkedinNewsletter" className="text-xs">
                            <Linkedin className="w-3 h-3 mr-1" />
                            Newsletter
                          </TabsTrigger>
                          <TabsTrigger value="medium" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            Medium
                          </TabsTrigger>
                          <TabsTrigger value="substack" className="text-xs">
                            <Mail className="w-3 h-3 mr-1" />
                            Substack
                          </TabsTrigger>
                        </TabsList>

                        {Object.entries(generatedContent).map(([platform, content]) => (
                          <TabsContent key={platform} value={platform} className="mt-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-sm flex items-center gap-2">
                                    {getPlatformIcon(platform)}
                                    {platformLabels[platform]}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {platformDescriptions[platform]}
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(content, platformLabels[platform])}
                                >
                                  {copiedPlatform === platformLabels[platform] ? (
                                    <Check className="w-4 h-4 mr-2 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4 mr-2" />
                                  )}
                                  {copiedPlatform === platformLabels[platform] ? 'Copiato!' : 'Copia'}
                                </Button>
                              </div>
                              <Textarea
                                value={content}
                                readOnly
                                className="min-h-[300px] font-mono text-xs"
                              />
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    ) : null}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Quick Tips */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Best Practices per piattaforma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                    <span className="font-medium text-sm">LinkedIn Post</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Max 3.000 caratteri</li>
                    <li>• 3-5 hashtag rilevanti</li>
                    <li>• Evita link nel primo commento</li>
                    <li>• Pubblica 8-10 AM o 5-6 PM</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                    <span className="font-medium text-sm">LinkedIn Newsletter</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Formato lungo (1500+ parole)</li>
                    <li>• Sottotitoli ogni 2-3 paragrafi</li>
                    <li>• CTA chiara alla fine</li>
                    <li>• Pubblica martedì o giovedì</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium text-sm">Medium</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Usa canonical URL al tuo sito</li>
                    <li>• 7+ min di lettura performa meglio</li>
                    <li>• Pubblica in publication rilevanti</li>
                    <li>• Tag SEO-ottimizzati (max 5)</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-orange-500" />
                    <span className="font-medium text-sm">Substack</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Tono personale e conversazionale</li>
                    <li>• Lead magnet per crescita lista</li>
                    <li>• Frequenza costante (settimanale)</li>
                    <li>• CTA per engagement (reply)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CrossPostingAssistant;
