import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  Plus, 
  FileText, 
  Edit, 
  Trash2, 
  Eye, 
  Save,
  ArrowLeft,
  Upload,
  Users,
  FileUp,
  ExternalLink,
  Copy,
  Calendar
} from "lucide-react";

interface AdvisoryDocument {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  description: string | null;
  document_date: string;
  content: any;
  cover_image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

interface PageAccess {
  id: string;
  email: string;
  page_slug: string;
  access_type: string;
  created_at: string;
}

export default function StrategicAdvisoryAdmin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<AdvisoryDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<AdvisoryDocument | null>(null);
  const [accessList, setAccessList] = useState<PageAccess[]>([]);
  const [activeTab, setActiveTab] = useState("documents");
  const [uploading, setUploading] = useState(false);
  
  // New document form state
  const [newDocument, setNewDocument] = useState({
    title: '',
    slug: '',
    client_name: '',
    description: '',
    document_date: format(new Date(), 'yyyy-MM-dd'),
  });
  
  // New access form state
  const [newAccess, setNewAccess] = useState({
    email: '',
  });
  
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isAddAccessOpen, setIsAddAccessOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<AdvisoryDocument | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchDocuments();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedDocument) {
      fetchAccessList(selectedDocument.slug);
    }
  }, [selectedDocument]);

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

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('strategic_advisory_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Errore nel caricamento dei documenti");
      return;
    }

    setDocuments(data || []);
  };

  const fetchAccessList = async (docSlug: string) => {
    const pageSlug = `advisory/${docSlug}`;
    const { data, error } = await supabase
      .from('page_access')
      .select('*')
      .eq('page_slug', pageSlug)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching access list:", error);
      return;
    }

    setAccessList(data || []);
  };

  const handleCreateDocument = async () => {
    if (!newDocument.title || !newDocument.slug || !newDocument.client_name) {
      toast.error("Titolo, slug e cliente sono obbligatori");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('strategic_advisory_documents')
      .insert({
        title: newDocument.title,
        slug: newDocument.slug,
        client_name: newDocument.client_name,
        description: newDocument.description || null,
        document_date: newDocument.document_date,
        content: [],
        status: 'draft',
        created_by: user?.email || null,
      });

    if (error) {
      toast.error("Errore nella creazione: " + error.message);
      return;
    }

    toast.success("Documento creato con successo");
    setIsAddDocumentOpen(false);
    setNewDocument({
      title: '',
      slug: '',
      client_name: '',
      description: '',
      document_date: format(new Date(), 'yyyy-MM-dd'),
    });
    fetchDocuments();
  };

  const handleUpdateDocument = async () => {
    if (!editingDocument) return;

    const { error } = await supabase
      .from('strategic_advisory_documents')
      .update({
        title: editingDocument.title,
        client_name: editingDocument.client_name,
        description: editingDocument.description,
        document_date: editingDocument.document_date,
        status: editingDocument.status,
      })
      .eq('id', editingDocument.id);

    if (error) {
      toast.error("Errore nell'aggiornamento");
      return;
    }

    toast.success("Documento aggiornato");
    setEditingDocument(null);
    fetchDocuments();
  };

  const handleDeleteDocument = async (docId: string, docSlug: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo documento? Verranno eliminati anche tutti gli accessi associati.")) {
      return;
    }

    // Delete access entries first
    await supabase
      .from('page_access')
      .delete()
      .eq('page_slug', `advisory/${docSlug}`);
    
    const { error } = await supabase
      .from('strategic_advisory_documents')
      .delete()
      .eq('id', docId);

    if (error) {
      toast.error("Errore nell'eliminazione");
      return;
    }

    toast.success("Documento eliminato");
    if (selectedDocument?.id === docId) {
      setSelectedDocument(null);
      setAccessList([]);
    }
    fetchDocuments();
  };

  const handleAddAccess = async () => {
    if (!selectedDocument || !newAccess.email) {
      toast.error("Inserisci un'email");
      return;
    }

    const pageSlug = `advisory/${selectedDocument.slug}`;

    const { error } = await supabase
      .from('page_access')
      .insert({
        email: newAccess.email.toLowerCase().trim(),
        page_slug: pageSlug,
        access_type: 'whitelist',
      });

    if (error) {
      if (error.code === '23505') {
        toast.error("Questo utente ha già accesso");
      } else {
        toast.error("Errore nell'aggiunta dell'accesso");
      }
      return;
    }

    toast.success("Accesso aggiunto");
    setNewAccess({ email: '' });
    setIsAddAccessOpen(false);
    fetchAccessList(selectedDocument.slug);
  };

  const handleRemoveAccess = async (accessId: string) => {
    if (!confirm("Rimuovere l'accesso per questo utente?")) return;

    const { error } = await supabase
      .from('page_access')
      .delete()
      .eq('id', accessId);

    if (error) {
      toast.error("Errore nella rimozione");
      return;
    }

    toast.success("Accesso rimosso");
    if (selectedDocument) {
      fetchAccessList(selectedDocument.slug);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedDocument || !event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Formato non supportato. Usa file .docx o .doc");
      return;
    }

    setUploading(true);

    try {
      // Upload file to storage
      const fileName = `${selectedDocument.slug}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('advisory-assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Call edge function to parse the Word document
      const { data, error: parseError } = await supabase.functions.invoke('parse-advisory-document', {
        body: { 
          filePath: fileName,
          documentId: selectedDocument.id,
        },
      });

      if (parseError) throw parseError;

      toast.success("Documento importato e formattato con successo");
      setIsUploadOpen(false);
      fetchDocuments();
      
      // Refresh selected document
      const { data: updatedDoc } = await supabase
        .from('strategic_advisory_documents')
        .select('*')
        .eq('id', selectedDocument.id)
        .single();
      
      if (updatedDoc) {
        setSelectedDocument(updatedDoc);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Errore nel caricamento: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateStatus = async (docId: string, status: string) => {
    const { error } = await supabase
      .from('strategic_advisory_documents')
      .update({ status })
      .eq('id', docId);

    if (error) {
      toast.error("Errore nell'aggiornamento dello stato");
      return;
    }

    toast.success(`Documento ${status === 'published' ? 'pubblicato' : 'aggiornato'}`);
    fetchDocuments();
  };

  const copyDocumentLink = (slug: string) => {
    const url = `${window.location.origin}/advisory/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiato negli appunti");
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
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
              <h1 className="text-3xl font-bold text-foreground">Strategic Advisory Console</h1>
              <p className="text-muted-foreground">Gestione documenti advisory per clienti</p>
            </div>
          </div>
          <Dialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Crea Nuovo Documento Advisory</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Titolo *</Label>
                  <Input
                    value={newDocument.title}
                    onChange={(e) => {
                      setNewDocument({ 
                        ...newDocument, 
                        title: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    placeholder="Strategic Advisory Report Q1 2026"
                  />
                </div>
                <div>
                  <Label>Slug URL *</Label>
                  <Input
                    value={newDocument.slug}
                    onChange={(e) => setNewDocument({ ...newDocument, slug: e.target.value })}
                    placeholder="strategic-advisory-q1-2026"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    URL: /advisory/{newDocument.slug || 'slug'}
                  </p>
                </div>
                <div>
                  <Label>Cliente *</Label>
                  <Input
                    value={newDocument.client_name}
                    onChange={(e) => setNewDocument({ ...newDocument, client_name: e.target.value })}
                    placeholder="Nome del cliente"
                  />
                </div>
                <div>
                  <Label>Data Documento</Label>
                  <Input
                    type="date"
                    value={newDocument.document_date}
                    onChange={(e) => setNewDocument({ ...newDocument, document_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Descrizione</Label>
                  <Textarea
                    value={newDocument.description}
                    onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                    placeholder="Breve descrizione del documento..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreateDocument} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Crea Documento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents List */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documenti ({documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nessun documento creato
                  </p>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedDocument?.id === doc.id
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{doc.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">{doc.client_name}</p>
                        </div>
                        <Badge 
                          variant={doc.status === 'published' ? 'default' : 'secondary'}
                          className="ml-2 shrink-0"
                        >
                          {doc.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(doc.document_date), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Document Details */}
          <div className="lg:col-span-2">
            {selectedDocument ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedDocument.title}</CardTitle>
                      <CardDescription>{selectedDocument.client_name}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyDocumentLink(selectedDocument.slug)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/advisory/${selectedDocument.slug}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Anteprima
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="documents" className="flex items-center gap-2">
                        <FileUp className="h-4 w-4" />
                        Contenuto
                      </TabsTrigger>
                      <TabsTrigger value="access" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Accessi ({accessList.length})
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Impostazioni
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="documents" className="space-y-4">
                      {/* Upload Section */}
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                        <h3 className="font-medium mb-1">Importa Documento Word</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Carica un file .docx per importare e formattare automaticamente il contenuto
                        </p>
                        <div className="flex justify-center gap-2">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept=".docx,.doc"
                              className="hidden"
                              onChange={handleFileUpload}
                              disabled={uploading}
                            />
                            <Button variant="default" disabled={uploading} asChild>
                              <span>
                                {uploading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Elaborazione...
                                  </>
                                ) : (
                                  <>
                                    <FileUp className="h-4 w-4 mr-2" />
                                    Seleziona File
                                  </>
                                )}
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>

                      {/* Content Preview */}
                      {selectedDocument.content && selectedDocument.content.length > 0 ? (
                        <div className="space-y-3">
                          <h4 className="font-medium">Contenuto Importato ({selectedDocument.content.length} sezioni)</h4>
                          <div className="max-h-[400px] overflow-y-auto space-y-2 border rounded-lg p-4 bg-muted/30">
                            {selectedDocument.content.map((section: any, index: number) => (
                              <div key={index} className="p-3 bg-background rounded border">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs">
                                    {section.type}
                                  </Badge>
                                  {section.title && (
                                    <span className="font-medium text-sm">{section.title}</span>
                                  )}
                                </div>
                                {section.content && (
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {typeof section.content === 'string' 
                                      ? section.content.substring(0, 150) + '...'
                                      : JSON.stringify(section.content).substring(0, 150) + '...'}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Nessun contenuto importato. Carica un documento Word per iniziare.
                        </p>
                      )}
                    </TabsContent>

                    <TabsContent value="access" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Gestisci gli utenti che possono accedere a questo documento
                        </p>
                        <Dialog open={isAddAccessOpen} onOpenChange={setIsAddAccessOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Plus className="h-4 w-4 mr-1" />
                              Aggiungi Accesso
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Aggiungi Accesso</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label>Email</Label>
                                <Input
                                  type="email"
                                  value={newAccess.email}
                                  onChange={(e) => setNewAccess({ email: e.target.value })}
                                  placeholder="email@esempio.com"
                                />
                              </div>
                              <Button onClick={handleAddAccess} className="w-full">
                                Aggiungi
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {accessList.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Nessun accesso configurato
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Email</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead>Data</TableHead>
                              <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {accessList.map((access) => (
                              <TableRow key={access.id}>
                                <TableCell className="font-medium">{access.email}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{access.access_type}</Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {format(new Date(access.created_at), 'dd/MM/yyyy')}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveAccess(access.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                      <div className="grid gap-4">
                        <div>
                          <Label>Titolo</Label>
                          <Input
                            value={editingDocument?.title || selectedDocument.title}
                            onChange={(e) => setEditingDocument({
                              ...selectedDocument,
                              ...editingDocument,
                              title: e.target.value,
                            })}
                          />
                        </div>
                        <div>
                          <Label>Cliente</Label>
                          <Input
                            value={editingDocument?.client_name || selectedDocument.client_name}
                            onChange={(e) => setEditingDocument({
                              ...selectedDocument,
                              ...editingDocument,
                              client_name: e.target.value,
                            })}
                          />
                        </div>
                        <div>
                          <Label>Data Documento</Label>
                          <Input
                            type="date"
                            value={editingDocument?.document_date || selectedDocument.document_date}
                            onChange={(e) => setEditingDocument({
                              ...selectedDocument,
                              ...editingDocument,
                              document_date: e.target.value,
                            })}
                          />
                        </div>
                        <div>
                          <Label>Descrizione</Label>
                          <Textarea
                            value={editingDocument?.description || selectedDocument.description || ''}
                            onChange={(e) => setEditingDocument({
                              ...selectedDocument,
                              ...editingDocument,
                              description: e.target.value,
                            })}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Stato</Label>
                          <Select
                            value={editingDocument?.status || selectedDocument.status}
                            onValueChange={(value) => setEditingDocument({
                              ...selectedDocument,
                              ...editingDocument,
                              status: value,
                            })}
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
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleUpdateDocument}
                            disabled={!editingDocument}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Salva Modifiche
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteDocument(selectedDocument.id, selectedDocument.slug)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Elimina
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Seleziona un documento</h3>
                  <p className="text-muted-foreground text-sm">
                    Scegli un documento dalla lista o creane uno nuovo
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}