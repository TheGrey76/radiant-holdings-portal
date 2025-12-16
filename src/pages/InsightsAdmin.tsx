import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  FileText, Plus, RefreshCw, CheckCircle, XCircle, 
  Eye, Edit, Trash2, Rss, Sparkles, Clock, Globe,
  ArrowLeft, Save, Send, PenLine, Wand2, Loader2
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: string;
  author: string;
  read_time: number;
  published_at: string | null;
  created_at: string;
}

interface NewsSource {
  id: string;
  name: string;
  source_type: string;
  url: string;
  category: string;
  is_active: boolean;
  last_fetched_at: string | null;
}

interface AggregatedNews {
  id: string;
  title: string;
  original_url: string;
  source_name: string;
  category: string;
  published_at: string;
  is_processed: boolean;
  is_curated: boolean;
}

interface CuratedContent {
  id: string;
  news_id: string;
  ai_summary: string;
  ai_commentary: string;
  ai_tags: string[];
  status: string;
  created_at: string;
  aggregated_news?: AggregatedNews;
}

const CATEGORIES = [
  { value: 'private_equity', label: 'Private Equity' },
  { value: 'venture_capital', label: 'Venture Capital' },
  { value: 'family_office', label: 'Family Office' },
  { value: 'digital_assets', label: 'Digital Assets' },
  { value: 'markets', label: 'Financial Markets' },
  { value: 'alternatives', label: 'Alternative Investments' },
  { value: 'insights', label: 'ARIES76 Insights' },
];

export default function InsightsAdmin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("articles");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [aggregatedNews, setAggregatedNews] = useState<AggregatedNews[]>([]);
  const [curatedContent, setCuratedContent] = useState<CuratedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // New post form state
  const [newPost, setNewPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'insights',
    tags: '',
    author: 'ARIES76 Research',
    read_time: 5,
    status: 'draft'
  });

  // AI generation state
  const [targetWords, setTargetWords] = useState(500);
  const [aiLanguage, setAiLanguage] = useState<'en' | 'it'>('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sourceNewsUrl, setSourceNewsUrl] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch blog posts
      const { data: postsData } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (postsData) setPosts(postsData);

      // Fetch news sources
      const { data: sourcesData } = await supabase
        .from('news_sources')
        .select('*')
        .order('name');
      
      if (sourcesData) setSources(sourcesData);

      // Fetch aggregated news
      const { data: newsData } = await supabase
        .from('aggregated_news')
        .select('*')
        .order('fetched_at', { ascending: false })
        .limit(50);
      
      if (newsData) setAggregatedNews(newsData);

      // Fetch curated content with related news
      const { data: curatedData } = await supabase
        .from('curated_content')
        .select('*, aggregated_news(*)')
        .order('created_at', { ascending: false });
      
      if (curatedData) setCuratedContent(curatedData);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Errore nel caricamento dei dati');
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      toast.error('Titolo e contenuto sono obbligatori');
      return;
    }

    const slug = newPost.slug || generateSlug(newPost.title);
    const tagsArray = newPost.tags.split(',').map(t => t.trim()).filter(Boolean);

    const { error } = await supabase
      .from('blog_posts')
      .insert({
        ...newPost,
        slug,
        tags: tagsArray,
        published_at: newPost.status === 'published' ? new Date().toISOString() : null
      });

    if (error) {
      toast.error('Errore nella creazione dell\'articolo');
      console.error(error);
    } else {
      toast.success('Articolo creato con successo');
      setIsCreating(false);
      setNewPost({
        title: '', slug: '', excerpt: '', content: '',
        category: 'insights', tags: '', author: 'ARIES76 Research',
        read_time: 5, status: 'draft'
      });
      fetchData();
    }
  };

  const handleUpdatePost = async (post: BlogPost) => {
    const { error } = await supabase
      .from('blog_posts')
      .update({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags,
        status: post.status,
        author: post.author,
        read_time: post.read_time,
        published_at: post.status === 'published' && !post.published_at 
          ? new Date().toISOString() 
          : post.published_at
      })
      .eq('id', post.id);

    if (error) {
      toast.error('Errore nell\'aggiornamento');
    } else {
      toast.success('Articolo aggiornato');
      setEditingPost(null);
      fetchData();
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo articolo?')) return;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Errore nell\'eliminazione');
    } else {
      toast.success('Articolo eliminato');
      fetchData();
    }
  };

  const handleFetchNews = async () => {
    setLoading(true);
    toast.info('Avvio fetch news dai feed RSS...');
    
    try {
      const response = await supabase.functions.invoke('fetch-rss-news');
      if (response.error) throw response.error;
      
      toast.success(`News recuperate: ${response.data?.fetched || 0} nuovi articoli`);
      fetchData();
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Errore nel fetch delle news');
    }
    setLoading(false);
  };

  const handleFetchFinnhub = async (category: string = 'general') => {
    setLoading(true);
    toast.info(`Fetch news Finnhub (${category})...`);
    
    try {
      const response = await supabase.functions.invoke('fetch-finnhub-news', {
        body: { category }
      });
      if (response.error) throw response.error;
      
      toast.success(`Finnhub: ${response.data?.fetched || 0} news recuperate`);
      fetchData();
    } catch (error) {
      console.error('Error fetching Finnhub news:', error);
      toast.error('Errore nel fetch Finnhub');
    }
    setLoading(false);
  };

  const handleProcessWithAI = async (newsId: string) => {
    toast.info('Elaborazione AI in corso...');
    
    try {
      const response = await supabase.functions.invoke('process-news-ai', {
        body: { newsId }
      });
      
      if (response.error) throw response.error;
      
      toast.success('News elaborata con AI');
      fetchData();
    } catch (error) {
      console.error('Error processing with AI:', error);
      toast.error('Errore nell\'elaborazione AI');
    }
  };

  const handleApproveCurated = async (id: string, approve: boolean) => {
    const { error } = await supabase
      .from('curated_content')
      .update({
        status: approve ? 'approved' : 'rejected',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast.error('Errore nell\'aggiornamento');
    } else {
      toast.success(approve ? 'Contenuto approvato' : 'Contenuto rifiutato');
      fetchData();
    }
  };

  const handlePublishCurated = async (id: string) => {
    const { error } = await supabase
      .from('curated_content')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast.error('Errore nella pubblicazione');
    } else {
      toast.success('Contenuto pubblicato');
      fetchData();
    }
  };

  const handleCreateFromNews = (news: AggregatedNews, curatedSummary?: string, curatedCommentary?: string, curatedTags?: string[]) => {
    const title = news.title;
    const content = curatedSummary 
      ? `## Sommario\n\n${curatedSummary}\n\n## Analisi ARIES76\n\n${curatedCommentary || ''}\n\n---\n\n*Fonte: [${news.source_name}](${news.original_url})*`
      : `## Articolo\n\nContenuto da elaborare...\n\n---\n\n*Fonte: [${news.source_name}](${news.original_url})*`;
    
    setNewPost({
      title,
      slug: generateSlug(title),
      excerpt: curatedSummary?.substring(0, 200) || '',
      content,
      category: news.category || 'insights',
      tags: curatedTags?.join(', ') || '',
      author: 'ARIES76 Research',
      read_time: 5,
      status: 'draft'
    });
    setSourceNewsUrl(news.original_url);
    setIsCreating(true);
    setActiveTab('articles');
    toast.success('Articolo pre-compilato dalla news - usa "Genera con AI" per creare il contenuto');
  };

  const handleGenerateAI = async () => {
    const title = editingPost?.title || newPost.title;
    if (!title) {
      toast.error('Inserisci prima un titolo');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-article-content', {
        body: {
          title,
          sourceUrl: sourceNewsUrl || '',
          sourceName: 'ARIES76 Research',
          category: editingPost?.category || newPost.category,
          targetWords,
          language: aiLanguage
        }
      });

      if (error) throw error;
      
      if (data?.content) {
        if (editingPost) {
          setEditingPost({ ...editingPost, content: data.content });
        } else {
          setNewPost({ ...newPost, content: data.content });
        }
        toast.success(`Articolo generato (~${data.wordCount} parole)`);
      }
    } catch (err) {
      console.error('AI generation error:', err);
      toast.error('Errore nella generazione AI');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSource = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('news_sources')
      .update({ is_active: !isActive })
      .eq('id', id);

    if (error) {
      toast.error('Errore nell\'aggiornamento');
    } else {
      fetchData();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Pubblicato</Badge>;
      case 'draft':
        return <Badge variant="secondary">Bozza</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500">Approvato</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">In Attesa</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rifiutato</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Insights CMS</h1>
                <p className="text-sm text-muted-foreground">Gestione contenuti e automazioni news</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={fetchData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Aggiorna
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Articoli
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <Rss className="h-4 w-4" />
              Fonti News
            </TabsTrigger>
            <TabsTrigger value="aggregated" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              News Aggregate
            </TabsTrigger>
            <TabsTrigger value="curated" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Contenuti AI
            </TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Articoli Originali</h2>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuovo Articolo
                </Button>
              </div>

              {/* Create/Edit Form */}
              {(isCreating || editingPost) && (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingPost ? 'Modifica Articolo' : 'Nuovo Articolo'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Titolo</label>
                        <Input
                          value={editingPost?.title || newPost.title}
                          onChange={(e) => editingPost 
                            ? setEditingPost({...editingPost, title: e.target.value})
                            : setNewPost({...newPost, title: e.target.value})
                          }
                          placeholder="Titolo articolo"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Slug (URL)</label>
                        <Input
                          value={editingPost?.slug || newPost.slug}
                          onChange={(e) => editingPost
                            ? setEditingPost({...editingPost, slug: e.target.value})
                            : setNewPost({...newPost, slug: e.target.value})
                          }
                          placeholder="url-articolo"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Estratto</label>
                      <Textarea
                        value={editingPost?.excerpt || newPost.excerpt}
                        onChange={(e) => editingPost
                          ? setEditingPost({...editingPost, excerpt: e.target.value})
                          : setNewPost({...newPost, excerpt: e.target.value})
                        }
                        placeholder="Breve descrizione dell'articolo"
                        rows={2}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Contenuto (Markdown)</label>
                        <div className="flex items-center gap-2">
                          <Select value={aiLanguage} onValueChange={(v: 'en' | 'it') => setAiLanguage(v)}>
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">EN</SelectItem>
                              <SelectItem value="it">IT</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select value={targetWords.toString()} onValueChange={(v) => setTargetWords(parseInt(v))}>
                            <SelectTrigger className="w-28 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="300">300 parole</SelectItem>
                              <SelectItem value="500">500 parole</SelectItem>
                              <SelectItem value="800">800 parole</SelectItem>
                              <SelectItem value="1000">1000 parole</SelectItem>
                              <SelectItem value="1500">1500 parole</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            type="button" 
                            variant="secondary" 
                            size="sm"
                            onClick={handleGenerateAI}
                            disabled={isGenerating}
                          >
                            {isGenerating ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Wand2 className="h-4 w-4 mr-1" />
                            )}
                            {isGenerating ? 'Generando...' : 'Genera con AI'}
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={editingPost?.content || newPost.content}
                        onChange={(e) => editingPost
                          ? setEditingPost({...editingPost, content: e.target.value})
                          : setNewPost({...newPost, content: e.target.value})
                        }
                        placeholder="Scrivi il contenuto in Markdown..."
                        rows={15}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Parole: {(editingPost?.content || newPost.content).split(/\s+/).filter(Boolean).length}
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium">Categoria</label>
                        <Select
                          value={editingPost?.category || newPost.category}
                          onValueChange={(value) => editingPost
                            ? setEditingPost({...editingPost, category: value})
                            : setNewPost({...newPost, category: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tags (separati da virgola)</label>
                        <Input
                          value={editingPost?.tags?.join(', ') || newPost.tags}
                          onChange={(e) => editingPost
                            ? setEditingPost({...editingPost, tags: e.target.value.split(',').map(t => t.trim())})
                            : setNewPost({...newPost, tags: e.target.value})
                          }
                          placeholder="tag1, tag2, tag3"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tempo Lettura (min)</label>
                        <Input
                          type="number"
                          value={editingPost?.read_time || newPost.read_time}
                          onChange={(e) => editingPost
                            ? setEditingPost({...editingPost, read_time: parseInt(e.target.value)})
                            : setNewPost({...newPost, read_time: parseInt(e.target.value)})
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Stato</label>
                        <Select
                          value={editingPost?.status || newPost.status}
                          onValueChange={(value) => editingPost
                            ? setEditingPost({...editingPost, status: value})
                            : setNewPost({...newPost, status: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Bozza</SelectItem>
                            <SelectItem value="published">Pubblicato</SelectItem>
                            <SelectItem value="archived">Archiviato</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditingPost(null);
                          setIsCreating(false);
                        }}
                      >
                        Annulla
                      </Button>
                      <Button onClick={() => editingPost 
                        ? handleUpdatePost(editingPost) 
                        : handleCreatePost()
                      }>
                        <Save className="h-4 w-4 mr-2" />
                        {editingPost ? 'Salva Modifiche' : 'Crea Articolo'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Posts List */}
              <div className="grid gap-4">
                {posts.map(post => (
                  <Card key={post.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{post.title}</h3>
                            {getStatusBadge(post.status)}
                            <Badge variant="outline">{CATEGORIES.find(c => c.value === post.category)?.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.read_time} min
                            </span>
                            <span>/{post.slug}</span>
                            <span>{new Date(post.created_at).toLocaleDateString('it-IT')}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Anteprima"
                            onClick={() => {
                              toast.info(`Anteprima: ${post.title}`, {
                                description: post.excerpt || 'Nessun estratto',
                                duration: 5000
                              });
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Modifica"
                            onClick={() => {
                              setEditingPost(post);
                              setIsCreating(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Elimina"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {posts.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      Nessun articolo. Clicca "Nuovo Articolo" per iniziare.
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* News Sources Tab */}
          <TabsContent value="sources">
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h2 className="text-lg font-semibold">Fonti News Configurate</h2>
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={handleFetchNews} disabled={loading} variant="outline">
                    <Rss className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Fetch RSS
                  </Button>
                  <Button onClick={() => handleFetchFinnhub('general')} disabled={loading}>
                    <Globe className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Finnhub General
                  </Button>
                  <Button onClick={() => handleFetchFinnhub('crypto')} disabled={loading} variant="secondary">
                    <Sparkles className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Finnhub Crypto
                  </Button>
                  <Button onClick={() => handleFetchFinnhub('merger')} disabled={loading} variant="secondary">
                    <FileText className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Finnhub M&A
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {sources.map(source => (
                  <Card key={source.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${source.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <div>
                            <h3 className="font-semibold">{source.name}</h3>
                            <p className="text-xs text-muted-foreground truncate max-w-md">{source.url}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{source.source_type.toUpperCase()}</Badge>
                          <Badge>{CATEGORIES.find(c => c.value === source.category)?.label || source.category}</Badge>
                          {source.last_fetched_at && (
                            <span className="text-xs text-muted-foreground">
                              Ultimo fetch: {new Date(source.last_fetched_at).toLocaleString('it-IT')}
                            </span>
                          )}
                          <Button
                            variant={source.is_active ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleToggleSource(source.id, source.is_active)}
                          >
                            {source.is_active ? 'Disattiva' : 'Attiva'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Aggregated News Tab */}
          <TabsContent value="aggregated">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">News Aggregate ({aggregatedNews.length})</h2>
              </div>

              <div className="grid gap-3">
                {aggregatedNews.map(news => (
                  <Card key={news.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium line-clamp-1">{news.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>{news.source_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {CATEGORIES.find(c => c.value === news.category)?.label || news.category}
                            </Badge>
                            {news.published_at && (
                              <span>{new Date(news.published_at).toLocaleDateString('it-IT')}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {news.is_curated ? (
                            <Badge className="bg-green-500">Curato</Badge>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleProcessWithAI(news.id)}
                            >
                              <Sparkles className="h-4 w-4 mr-1" />
                              Elabora AI
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleCreateFromNews(news)}
                          >
                            <PenLine className="h-4 w-4 mr-1" />
                            Crea Articolo
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => window.open(news.original_url, '_blank')}
                          >
                            <Globe className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {aggregatedNews.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      Nessuna news aggregata. Clicca "Fetch News Ora" per iniziare.
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Curated Content Tab */}
          <TabsContent value="curated">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Contenuti Elaborati con AI</h2>
              </div>

              <div className="grid gap-4">
                {curatedContent.map(content => (
                  <Card key={content.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">
                              {(content as any).aggregated_news?.title || 'News'}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {(content as any).aggregated_news?.source_name} • 
                              {new Date(content.created_at).toLocaleDateString('it-IT')}
                            </p>
                          </div>
                          {getStatusBadge(content.status)}
                        </div>

                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm font-medium mb-1">Sommario AI:</p>
                          <p className="text-sm">{content.ai_summary}</p>
                        </div>

                        {content.ai_commentary && (
                          <div className="bg-primary/5 p-3 rounded-lg">
                            <p className="text-sm font-medium mb-1">Commento ARIES76:</p>
                            <p className="text-sm">{content.ai_commentary}</p>
                          </div>
                        )}

                        {content.ai_tags?.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {content.ai_tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2 justify-end border-t pt-3 mt-3">
                          <Button 
                            size="sm"
                            onClick={() => {
                              const newsData = (content as any).aggregated_news;
                              if (newsData) {
                                handleCreateFromNews(
                                  newsData,
                                  content.ai_summary,
                                  content.ai_commentary || undefined,
                                  content.ai_tags || undefined
                                );
                              }
                            }}
                          >
                            <PenLine className="h-4 w-4 mr-1" />
                            Crea Articolo
                          </Button>
                        </div>

                        {content.status === 'pending' && (
                          <div className="flex gap-2 justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApproveCurated(content.id, false)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rifiuta
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleApproveCurated(content.id, true)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approva
                            </Button>
                          </div>
                        )}

                        {content.status === 'approved' && (
                          <div className="flex justify-end">
                            <Button 
                              size="sm"
                              onClick={() => handlePublishCurated(content.id)}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Pubblica
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {curatedContent.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      Nessun contenuto curato. Elabora le news con AI dalla tab "News Aggregate".
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
