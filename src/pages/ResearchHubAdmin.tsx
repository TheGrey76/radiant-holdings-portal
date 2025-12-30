import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Plus, 
  FileText, 
  Edit, 
  Trash2, 
  Eye, 
  Save,
  ArrowLeft,
  Layers,
  BarChart3,
  TableIcon,
  MessageSquareQuote,
  GripVertical
} from "lucide-react";

interface Report {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  author: string;
  category: string;
  edition: string | null;
  price_eur: number;
  status: string;
  has_live_data: boolean;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
}

interface ReportSection {
  id: string;
  report_id: string;
  order_index: number;
  section_type: string;
  title: string;
  subtitle: string | null;
  content_md: string | null;
  chart_config: any;
  table_data: any;
  is_preview: boolean;
  created_at: string;
}

const SECTION_TYPES = [
  { value: 'text', label: 'Text', icon: FileText },
  { value: 'chart', label: 'Chart', icon: BarChart3 },
  { value: 'table', label: 'Table', icon: TableIcon },
  { value: 'callout', label: 'Callout', icon: MessageSquareQuote },
];

const CATEGORIES = [
  'Private Equity',
  'Venture Capital',
  'Real Estate',
  'Infrastructure',
  'Credit',
  'Macro Research',
  'Digital Assets',
  'ESG',
];

export default function ResearchHubAdmin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [sections, setSections] = useState<ReportSection[]>([]);
  const [activeTab, setActiveTab] = useState("reports");
  
  // New report form state
  const [newReport, setNewReport] = useState({
    slug: '',
    title: '',
    subtitle: '',
    description: '',
    author: 'ARIES76 Research',
    category: 'Private Equity',
    edition: '',
    price_eur: 99,
    has_live_data: false,
    cover_image_url: '',
    seo_title: '',
    seo_description: '',
  });
  
  // New section form state
  const [newSection, setNewSection] = useState({
    section_type: 'text',
    title: '',
    subtitle: '',
    content_md: '',
    chart_config: '',
    table_data: '',
    is_preview: true,
  });
  
  const [isAddReportOpen, setIsAddReportOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<ReportSection | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchReports();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedReport) {
      fetchSections(selectedReport.id);
    }
  }, [selectedReport]);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      toast.error("Accesso non autorizzato");
      navigate('/');
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  };

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Errore nel caricamento dei report");
      return;
    }

    setReports(data || []);
  };

  const fetchSections = async (reportId: string) => {
    const { data, error } = await supabase
      .from('report_sections')
      .select('*')
      .eq('report_id', reportId)
      .order('order_index', { ascending: true });

    if (error) {
      toast.error("Errore nel caricamento delle sezioni");
      return;
    }

    setSections(data || []);
  };

  const handleCreateReport = async () => {
    if (!newReport.title || !newReport.slug) {
      toast.error("Titolo e slug sono obbligatori");
      return;
    }

    const { data, error } = await supabase
      .from('reports')
      .insert({
        ...newReport,
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      toast.error("Errore nella creazione del report: " + error.message);
      return;
    }

    toast.success("Report creato con successo");
    setIsAddReportOpen(false);
    setNewReport({
      slug: '',
      title: '',
      subtitle: '',
      description: '',
      author: 'ARIES76 Research',
      category: 'Private Equity',
      edition: '',
      price_eur: 99,
      has_live_data: false,
      cover_image_url: '',
      seo_title: '',
      seo_description: '',
    });
    fetchReports();
  };

  const handleUpdateReportStatus = async (reportId: string, status: string) => {
    const updateData: any = { status };
    if (status === 'published') {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', reportId);

    if (error) {
      toast.error("Errore nell'aggiornamento dello stato");
      return;
    }

    toast.success(`Report ${status === 'published' ? 'pubblicato' : 'aggiornato'}`);
    fetchReports();
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo report e tutte le sue sezioni?")) {
      return;
    }

    // Delete sections first
    await supabase.from('report_sections').delete().eq('report_id', reportId);
    
    const { error } = await supabase.from('reports').delete().eq('id', reportId);

    if (error) {
      toast.error("Errore nell'eliminazione del report");
      return;
    }

    toast.success("Report eliminato");
    if (selectedReport?.id === reportId) {
      setSelectedReport(null);
      setSections([]);
    }
    fetchReports();
  };

  const handleCreateSection = async () => {
    if (!selectedReport || !newSection.title) {
      toast.error("Seleziona un report e inserisci un titolo");
      return;
    }

    const maxOrder = sections.length > 0 ? Math.max(...sections.map(s => s.order_index)) : 0;

    let chartConfig = null;
    let tableData = null;

    if (newSection.section_type === 'chart' && newSection.chart_config) {
      try {
        chartConfig = JSON.parse(newSection.chart_config);
      } catch {
        toast.error("JSON chart_config non valido");
        return;
      }
    }

    if (newSection.section_type === 'table' && newSection.table_data) {
      try {
        tableData = JSON.parse(newSection.table_data);
      } catch {
        toast.error("JSON table_data non valido");
        return;
      }
    }

    const { error } = await supabase.from('report_sections').insert({
      report_id: selectedReport.id,
      order_index: maxOrder + 1,
      section_type: newSection.section_type,
      title: newSection.title,
      subtitle: newSection.subtitle || null,
      content_md: newSection.content_md || null,
      chart_config: chartConfig,
      table_data: tableData,
      is_preview: newSection.is_preview,
    });

    if (error) {
      toast.error("Errore nella creazione della sezione: " + error.message);
      return;
    }

    toast.success("Sezione creata");
    setIsAddSectionOpen(false);
    setNewSection({
      section_type: 'text',
      title: '',
      subtitle: '',
      content_md: '',
      chart_config: '',
      table_data: '',
      is_preview: true,
    });
    fetchSections(selectedReport.id);
  };

  const handleUpdateSection = async () => {
    if (!editingSection) return;

    let chartConfig = editingSection.chart_config;
    let tableData = editingSection.table_data;

    const { error } = await supabase
      .from('report_sections')
      .update({
        title: editingSection.title,
        subtitle: editingSection.subtitle,
        content_md: editingSection.content_md,
        chart_config: chartConfig,
        table_data: tableData,
        is_preview: editingSection.is_preview,
      })
      .eq('id', editingSection.id);

    if (error) {
      toast.error("Errore nell'aggiornamento della sezione");
      return;
    }

    toast.success("Sezione aggiornata");
    setEditingSection(null);
    if (selectedReport) {
      fetchSections(selectedReport.id);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Eliminare questa sezione?")) return;

    const { error } = await supabase.from('report_sections').delete().eq('id', sectionId);

    if (error) {
      toast.error("Errore nell'eliminazione");
      return;
    }

    toast.success("Sezione eliminata");
    if (selectedReport) {
      fetchSections(selectedReport.id);
    }
  };

  const handleMoveSection = async (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    if (currentIndex === -1) return;
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const currentSection = sections[currentIndex];
    const targetSection = sections[targetIndex];

    // Swap order_index values
    await supabase.from('report_sections').update({ order_index: targetSection.order_index }).eq('id', currentSection.id);
    await supabase.from('report_sections').update({ order_index: currentSection.order_index }).eq('id', targetSection.id);

    if (selectedReport) {
      fetchSections(selectedReport.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Admin
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Research Hub Console</h1>
              <p className="text-muted-foreground">Gestione report e sezioni</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/reports')}>
              <Eye className="h-4 w-4 mr-2" />
              Catalogo
            </Button>
            <Dialog open={isAddReportOpen} onOpenChange={setIsAddReportOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuovo Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crea Nuovo Report</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Titolo *</Label>
                      <Input
                        value={newReport.title}
                        onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                        placeholder="Private Equity Outlook 2025"
                      />
                    </div>
                    <div>
                      <Label>Slug *</Label>
                      <Input
                        value={newReport.slug}
                        onChange={(e) => setNewReport({ ...newReport, slug: e.target.value })}
                        placeholder="private-equity-outlook-2025"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Sottotitolo</Label>
                    <Input
                      value={newReport.subtitle}
                      onChange={(e) => setNewReport({ ...newReport, subtitle: e.target.value })}
                      placeholder="Strategic Analysis & Investment Opportunities"
                    />
                  </div>
                  <div>
                    <Label>Descrizione</Label>
                    <Textarea
                      value={newReport.description}
                      onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                      placeholder="Descrizione completa del report..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Categoria</Label>
                      <Select value={newReport.category} onValueChange={(v) => setNewReport({ ...newReport, category: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Edizione</Label>
                      <Input
                        value={newReport.edition}
                        onChange={(e) => setNewReport({ ...newReport, edition: e.target.value })}
                        placeholder="Q1 2025"
                      />
                    </div>
                    <div>
                      <Label>Prezzo (EUR)</Label>
                      <Input
                        type="number"
                        value={newReport.price_eur}
                        onChange={(e) => setNewReport({ ...newReport, price_eur: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Autore</Label>
                      <Input
                        value={newReport.author}
                        onChange={(e) => setNewReport({ ...newReport, author: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Cover Image URL</Label>
                      <Input
                        value={newReport.cover_image_url}
                        onChange={(e) => setNewReport({ ...newReport, cover_image_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newReport.has_live_data}
                      onCheckedChange={(v) => setNewReport({ ...newReport, has_live_data: v })}
                    />
                    <Label>Ha dati live (aggiornamento automatico)</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>SEO Title</Label>
                      <Input
                        value={newReport.seo_title}
                        onChange={(e) => setNewReport({ ...newReport, seo_title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>SEO Description</Label>
                      <Input
                        value={newReport.seo_description}
                        onChange={(e) => setNewReport({ ...newReport, seo_description: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateReport} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Crea Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Report ({reports.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {reports.map(report => (
                <div
                  key={report.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedReport?.id === report.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{report.title}</h3>
                      <p className="text-xs text-muted-foreground">{report.category}</p>
                    </div>
                    <Badge variant={report.status === 'published' ? 'default' : 'secondary'} className="ml-2 text-xs">
                      {report.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>€{report.price_eur}</span>
                    {report.edition && <span>• {report.edition}</span>}
                  </div>
                </div>
              ))}
              {reports.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Nessun report creato</p>
              )}
            </CardContent>
          </Card>

          {/* Report Details & Sections */}
          <Card className="lg:col-span-2">
            {selectedReport ? (
              <>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedReport.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{selectedReport.subtitle}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/reports/${selectedReport.slug}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      {selectedReport.status === 'draft' ? (
                        <Button 
                          size="sm"
                          onClick={() => handleUpdateReportStatus(selectedReport.id, 'published')}
                        >
                          Pubblica
                        </Button>
                      ) : (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleUpdateReportStatus(selectedReport.id, 'draft')}
                        >
                          Bozza
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteReport(selectedReport.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="sections">
                        <Layers className="h-4 w-4 mr-2" />
                        Sezioni ({sections.length})
                      </TabsTrigger>
                      <TabsTrigger value="info">Info</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sections" className="space-y-4">
                      <div className="flex justify-end">
                        <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Aggiungi Sezione
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Nuova Sezione</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Tipo Sezione</Label>
                                  <Select 
                                    value={newSection.section_type} 
                                    onValueChange={(v) => setNewSection({ ...newSection, section_type: v })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {SECTION_TYPES.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                          <div className="flex items-center gap-2">
                                            <type.icon className="h-4 w-4" />
                                            {type.label}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                  <Switch
                                    checked={newSection.is_preview}
                                    onCheckedChange={(v) => setNewSection({ ...newSection, is_preview: v })}
                                  />
                                  <Label>Preview (visibile a tutti)</Label>
                                </div>
                              </div>
                              <div>
                                <Label>Titolo *</Label>
                                <Input
                                  value={newSection.title}
                                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label>Sottotitolo</Label>
                                <Input
                                  value={newSection.subtitle}
                                  onChange={(e) => setNewSection({ ...newSection, subtitle: e.target.value })}
                                />
                              </div>
                              
                              {(newSection.section_type === 'text' || newSection.section_type === 'callout') && (
                                <div>
                                  <Label>Contenuto (HTML/Markdown)</Label>
                                  <Textarea
                                    value={newSection.content_md}
                                    onChange={(e) => setNewSection({ ...newSection, content_md: e.target.value })}
                                    rows={8}
                                    placeholder="<p>Contenuto della sezione...</p>"
                                  />
                                </div>
                              )}
                              
                              {newSection.section_type === 'chart' && (
                                <div>
                                  <Label>Chart Config (JSON)</Label>
                                  <Textarea
                                    value={newSection.chart_config}
                                    onChange={(e) => setNewSection({ ...newSection, chart_config: e.target.value })}
                                    rows={10}
                                    placeholder='{"type":"bar","xKey":"year","yKeys":[{"key":"value","name":"Value","color":"#C9A227"}],"data":[...]}'
                                  />
                                </div>
                              )}
                              
                              {newSection.section_type === 'table' && (
                                <div>
                                  <Label>Table Data (JSON)</Label>
                                  <Textarea
                                    value={newSection.table_data}
                                    onChange={(e) => setNewSection({ ...newSection, table_data: e.target.value })}
                                    rows={10}
                                    placeholder='{"headers":["Col1","Col2"],"rows":[["A","B"],["C","D"]]}'
                                  />
                                </div>
                              )}
                              
                              <Button onClick={handleCreateSection} className="w-full">
                                <Save className="h-4 w-4 mr-2" />
                                Crea Sezione
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {/* Sections List */}
                      <div className="space-y-2">
                        {sections.map((section, idx) => {
                          const TypeIcon = SECTION_TYPES.find(t => t.value === section.section_type)?.icon || FileText;
                          return (
                            <div
                              key={section.id}
                              className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                            >
                              <div className="flex flex-col gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleMoveSection(section.id, 'up')}
                                  disabled={idx === 0}
                                >
                                  ↑
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleMoveSection(section.id, 'down')}
                                  disabled={idx === sections.length - 1}
                                >
                                  ↓
                                </Button>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <TypeIcon className="h-4 w-4" />
                                <span className="text-xs font-mono">{section.order_index}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{section.title}</h4>
                                {section.subtitle && (
                                  <p className="text-xs text-muted-foreground truncate">{section.subtitle}</p>
                                )}
                              </div>
                              <Badge variant={section.is_preview ? 'default' : 'secondary'} className="text-xs">
                                {section.is_preview ? 'Preview' : 'Premium'}
                              </Badge>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setEditingSection(section)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteSection(section.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                        {sections.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            Nessuna sezione. Clicca "Aggiungi Sezione" per iniziare.
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="info">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-muted-foreground">Slug</Label>
                          <p className="font-mono">{selectedReport.slug}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Categoria</Label>
                          <p>{selectedReport.category}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Autore</Label>
                          <p>{selectedReport.author}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Prezzo</Label>
                          <p>€{selectedReport.price_eur}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Edizione</Label>
                          <p>{selectedReport.edition || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Live Data</Label>
                          <p>{selectedReport.has_live_data ? 'Sì' : 'No'}</p>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-muted-foreground">Descrizione</Label>
                          <p>{selectedReport.description || '-'}</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Seleziona un report dalla lista</p>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Edit Section Dialog */}
        <Dialog open={!!editingSection} onOpenChange={(open) => !open && setEditingSection(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifica Sezione</DialogTitle>
            </DialogHeader>
            {editingSection && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo</Label>
                    <Input value={editingSection.section_type} disabled />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      checked={editingSection.is_preview}
                      onCheckedChange={(v) => setEditingSection({ ...editingSection, is_preview: v })}
                    />
                    <Label>Preview (visibile a tutti)</Label>
                  </div>
                </div>
                <div>
                  <Label>Titolo</Label>
                  <Input
                    value={editingSection.title}
                    onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Sottotitolo</Label>
                  <Input
                    value={editingSection.subtitle || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                  />
                </div>
                {(editingSection.section_type === 'text' || editingSection.section_type === 'callout') && (
                  <div>
                    <Label>Contenuto (HTML/Markdown)</Label>
                    <Textarea
                      value={editingSection.content_md || ''}
                      onChange={(e) => setEditingSection({ ...editingSection, content_md: e.target.value })}
                      rows={8}
                    />
                  </div>
                )}
                {editingSection.section_type === 'chart' && (
                  <div>
                    <Label>Chart Config (JSON)</Label>
                    <Textarea
                      value={JSON.stringify(editingSection.chart_config, null, 2) || ''}
                      onChange={(e) => {
                        try {
                          setEditingSection({ ...editingSection, chart_config: JSON.parse(e.target.value) });
                        } catch {}
                      }}
                      rows={10}
                    />
                  </div>
                )}
                {editingSection.section_type === 'table' && (
                  <div>
                    <Label>Table Data (JSON)</Label>
                    <Textarea
                      value={JSON.stringify(editingSection.table_data, null, 2) || ''}
                      onChange={(e) => {
                        try {
                          setEditingSection({ ...editingSection, table_data: JSON.parse(e.target.value) });
                        } catch {}
                      }}
                      rows={10}
                    />
                  </div>
                )}
                <Button onClick={handleUpdateSection} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salva Modifiche
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
