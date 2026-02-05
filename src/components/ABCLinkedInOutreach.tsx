 import { useState, useEffect } from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Input } from '@/components/ui/input';
 import { Textarea } from '@/components/ui/textarea';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
 import { supabase } from '@/integrations/supabase/client';
 import { toast } from 'sonner';
 import { 
   Linkedin, 
   Users, 
   Send, 
   MessageSquare, 
   UserPlus, 
   CheckCircle, 
   Clock, 
   XCircle,
   Copy,
   RefreshCw,
   Sparkles,
   TrendingUp,
   Target
 } from 'lucide-react';
 import { format } from 'date-fns';
 import { it } from 'date-fns/locale';
 
 interface LinkedInOutreach {
   id: string;
   investor_id: string | null;
   investor_name: string;
   linkedin_url: string | null;
   outreach_type: string;
   message_content: string | null;
   template_used: string | null;
   status: string;
   sent_at: string | null;
   replied_at: string | null;
   notes: string | null;
   assigned_to: string | null;
   created_at: string;
 }
 
 interface WarmConnection {
   id: string;
   investor_id: string | null;
   investor_name: string;
   connector_name: string;
   connector_linkedin: string | null;
   connector_relationship: string | null;
   connection_strength: string;
   intro_status: string;
   intro_requested_at: string | null;
   intro_made_at: string | null;
   notes: string | null;
   created_at: string;
 }
 
 interface LinkedInTemplate {
   id: string;
   name: string;
   template_type: string;
   subject: string | null;
   content: string;
   variables: string[] | null;
   is_active: boolean;
   usage_count: number;
   success_rate: number | null;
 }
 
 interface Investor {
   id: string;
   nome: string;
   azienda: string;
   linkedin: string | null;
   email: string | null;
 }
 
 interface ABCLinkedInOutreachProps {
   investors: Investor[];
 }
 
 const statusColors: Record<string, string> = {
   pending: 'bg-yellow-500/20 text-yellow-400',
   sent: 'bg-blue-500/20 text-blue-400',
   replied: 'bg-green-500/20 text-green-400',
   no_response: 'bg-gray-500/20 text-gray-400',
   converted: 'bg-emerald-500/20 text-emerald-400',
 };
 
 const introStatusColors: Record<string, string> = {
   identified: 'bg-purple-500/20 text-purple-400',
   requested: 'bg-yellow-500/20 text-yellow-400',
   intro_made: 'bg-green-500/20 text-green-400',
   declined: 'bg-red-500/20 text-red-400',
 };
 
 export const ABCLinkedInOutreach = ({ investors }: ABCLinkedInOutreachProps) => {
   const [outreachList, setOutreachList] = useState<LinkedInOutreach[]>([]);
   const [warmConnections, setWarmConnections] = useState<WarmConnection[]>([]);
   const [templates, setTemplates] = useState<LinkedInTemplate[]>([]);
   const [loading, setLoading] = useState(true);
   const [selectedTemplate, setSelectedTemplate] = useState<LinkedInTemplate | null>(null);
   const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
   const [generatedMessage, setGeneratedMessage] = useState('');
   const [showNewOutreachDialog, setShowNewOutreachDialog] = useState(false);
   const [showWarmIntroDialog, setShowWarmIntroDialog] = useState(false);
   
   // Warm intro form state
   const [warmIntroForm, setWarmIntroForm] = useState({
     investor_id: '',
     connector_name: '',
     connector_linkedin: '',
     connector_relationship: '',
     connection_strength: 'medium',
     notes: ''
   });
 
   useEffect(() => {
     fetchData();
   }, []);
 
   const fetchData = async () => {
     try {
       setLoading(true);
       const [outreachRes, warmRes, templatesRes] = await Promise.all([
         supabase.from('abc_linkedin_outreach').select('*').order('created_at', { ascending: false }),
         supabase.from('abc_warm_connections').select('*').order('created_at', { ascending: false }),
         supabase.from('abc_linkedin_templates').select('*').eq('is_active', true).order('usage_count', { ascending: false })
       ]);
 
       if (outreachRes.data) setOutreachList(outreachRes.data);
       if (warmRes.data) setWarmConnections(warmRes.data);
       if (templatesRes.data) setTemplates(templatesRes.data);
     } catch (error) {
       console.error('Error fetching data:', error);
       toast.error('Errore nel caricamento dati');
     } finally {
       setLoading(false);
     }
   };
 
   const generateMessage = (template: LinkedInTemplate, investor: Investor, connectorName?: string) => {
     let message = template.content;
     message = message.replace(/\{\{investor_name\}\}/g, investor.nome);
     message = message.replace(/\{\{company_name\}\}/g, investor.azienda);
     if (connectorName) {
       message = message.replace(/\{\{connector_name\}\}/g, connectorName);
     }
     return message;
   };
 
   const handleTemplateSelect = (templateId: string) => {
     const template = templates.find(t => t.id === templateId);
     if (template && selectedInvestor) {
       setSelectedTemplate(template);
       setGeneratedMessage(generateMessage(template, selectedInvestor));
     }
   };
 
   const handleInvestorSelect = (investorId: string) => {
     const investor = investors.find(i => i.id === investorId);
     if (investor) {
       setSelectedInvestor(investor);
       if (selectedTemplate) {
         setGeneratedMessage(generateMessage(selectedTemplate, investor));
       }
     }
   };
 
   const copyToClipboard = async () => {
     try {
       await navigator.clipboard.writeText(generatedMessage);
       toast.success('Messaggio copiato negli appunti');
     } catch {
       toast.error('Errore nella copia');
     }
   };
 
   const saveOutreach = async (status: 'pending' | 'sent') => {
     if (!selectedInvestor || !generatedMessage) return;
     
     try {
       const { error } = await supabase.from('abc_linkedin_outreach').insert({
         investor_id: selectedInvestor.id,
         investor_name: `${selectedInvestor.nome} - ${selectedInvestor.azienda}`,
         linkedin_url: selectedInvestor.linkedin,
         outreach_type: selectedTemplate?.template_type || 'direct_message',
         message_content: generatedMessage,
         template_used: selectedTemplate?.name,
         status,
         sent_at: status === 'sent' ? new Date().toISOString() : null,
         assigned_to: sessionStorage.getItem('abc_authorized_email')
       });
 
       if (error) throw error;
 
       // Update template usage count
       if (selectedTemplate) {
         await supabase.from('abc_linkedin_templates')
           .update({ usage_count: (selectedTemplate.usage_count || 0) + 1 })
           .eq('id', selectedTemplate.id);
       }
 
       toast.success(status === 'sent' ? 'Outreach salvato come inviato' : 'Outreach salvato come bozza');
       setShowNewOutreachDialog(false);
       setSelectedInvestor(null);
       setSelectedTemplate(null);
       setGeneratedMessage('');
       fetchData();
     } catch (error) {
       console.error('Error saving outreach:', error);
       toast.error('Errore nel salvataggio');
     }
   };
 
   const updateOutreachStatus = async (id: string, status: string) => {
     try {
       const updateData: Record<string, unknown> = { status };
       if (status === 'replied') {
         updateData.replied_at = new Date().toISOString();
       }
 
       const { error } = await supabase.from('abc_linkedin_outreach')
         .update(updateData)
         .eq('id', id);
 
       if (error) throw error;
       toast.success('Stato aggiornato');
       fetchData();
     } catch (error) {
       console.error('Error updating status:', error);
       toast.error('Errore nell\'aggiornamento');
     }
   };
 
   const saveWarmConnection = async () => {
     const investor = investors.find(i => i.id === warmIntroForm.investor_id);
     if (!investor || !warmIntroForm.connector_name) {
       toast.error('Compila tutti i campi obbligatori');
       return;
     }
 
     try {
       const { error } = await supabase.from('abc_warm_connections').insert({
         investor_id: investor.id,
         investor_name: `${investor.nome} - ${investor.azienda}`,
         connector_name: warmIntroForm.connector_name,
         connector_linkedin: warmIntroForm.connector_linkedin || null,
         connector_relationship: warmIntroForm.connector_relationship || null,
         connection_strength: warmIntroForm.connection_strength,
         notes: warmIntroForm.notes || null
       });
 
       if (error) throw error;
 
       toast.success('Warm connection salvata');
       setShowWarmIntroDialog(false);
       setWarmIntroForm({
         investor_id: '',
         connector_name: '',
         connector_linkedin: '',
         connector_relationship: '',
         connection_strength: 'medium',
         notes: ''
       });
       fetchData();
     } catch (error) {
       console.error('Error saving warm connection:', error);
       toast.error('Errore nel salvataggio');
     }
   };
 
   const updateIntroStatus = async (id: string, status: string) => {
     try {
       const updateData: Record<string, unknown> = { intro_status: status };
       if (status === 'requested') {
         updateData.intro_requested_at = new Date().toISOString();
       } else if (status === 'intro_made') {
         updateData.intro_made_at = new Date().toISOString();
       }
 
       const { error } = await supabase.from('abc_warm_connections')
         .update(updateData)
         .eq('id', id);
 
       if (error) throw error;
       toast.success('Stato aggiornato');
       fetchData();
     } catch (error) {
       console.error('Error updating intro status:', error);
       toast.error('Errore nell\'aggiornamento');
     }
   };
 
   // Stats
   const outreachStats = {
     total: outreachList.length,
     sent: outreachList.filter(o => o.status === 'sent' || o.status === 'replied' || o.status === 'converted').length,
     replied: outreachList.filter(o => o.status === 'replied' || o.status === 'converted').length,
     converted: outreachList.filter(o => o.status === 'converted').length,
     replyRate: outreachList.filter(o => o.status !== 'pending').length > 0 
       ? ((outreachList.filter(o => o.status === 'replied' || o.status === 'converted').length / 
          outreachList.filter(o => o.status !== 'pending').length) * 100).toFixed(1)
       : '0'
   };
 
   const warmStats = {
     total: warmConnections.length,
     identified: warmConnections.filter(w => w.intro_status === 'identified').length,
     requested: warmConnections.filter(w => w.intro_status === 'requested').length,
     introMade: warmConnections.filter(w => w.intro_status === 'intro_made').length,
   };
 
   // Investors with LinkedIn
   const investorsWithLinkedIn = investors.filter(i => i.linkedin && i.linkedin !== 'null');
 
   if (loading) {
     return (
       <div className="flex items-center justify-center py-12">
         <RefreshCw className="h-6 w-6 animate-spin text-primary" />
       </div>
     );
   }
 
   return (
     <div className="space-y-6">
       {/* Stats Cards */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
           <CardContent className="pt-4">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-blue-500/20">
                 <Linkedin className="h-5 w-5 text-blue-400" />
               </div>
               <div>
                 <p className="text-2xl font-bold text-foreground">{outreachStats.sent}</p>
                 <p className="text-xs text-muted-foreground">Outreach Inviati</p>
               </div>
             </div>
           </CardContent>
         </Card>
         
         <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
           <CardContent className="pt-4">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-green-500/20">
                 <MessageSquare className="h-5 w-5 text-green-400" />
               </div>
               <div>
                 <p className="text-2xl font-bold text-foreground">{outreachStats.replyRate}%</p>
                 <p className="text-xs text-muted-foreground">Reply Rate</p>
               </div>
             </div>
           </CardContent>
         </Card>
         
         <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
           <CardContent className="pt-4">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-purple-500/20">
                 <Users className="h-5 w-5 text-purple-400" />
               </div>
               <div>
                 <p className="text-2xl font-bold text-foreground">{warmStats.total}</p>
                 <p className="text-xs text-muted-foreground">Warm Connections</p>
               </div>
             </div>
           </CardContent>
         </Card>
         
         <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
           <CardContent className="pt-4">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-emerald-500/20">
                 <Target className="h-5 w-5 text-emerald-400" />
               </div>
               <div>
                 <p className="text-2xl font-bold text-foreground">{warmStats.introMade}</p>
                 <p className="text-xs text-muted-foreground">Intro Fatte</p>
               </div>
             </div>
           </CardContent>
         </Card>
       </div>
 
       {/* Info Banner */}
       <Card className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 border-blue-500/30">
         <CardContent className="py-4">
           <div className="flex items-start gap-3">
             <Sparkles className="h-5 w-5 text-blue-400 mt-0.5" />
             <div>
               <h4 className="font-medium text-foreground">LinkedIn Outreach + Warm Intro</h4>
               <p className="text-sm text-muted-foreground mt-1">
                 Gestisci i contatti LinkedIn e identifica connessioni comuni per warm intro. 
                 Tasso risposta LinkedIn: 5-15% vs 1-3% email fredde.
               </p>
             </div>
           </div>
         </CardContent>
       </Card>
 
       <Tabs defaultValue="outreach" className="space-y-4">
         <TabsList className="bg-muted/50">
           <TabsTrigger value="outreach" className="flex items-center gap-2">
             <Linkedin className="h-4 w-4" />
             LinkedIn Outreach
           </TabsTrigger>
           <TabsTrigger value="warm-intro" className="flex items-center gap-2">
             <Users className="h-4 w-4" />
             Warm Intro
           </TabsTrigger>
           <TabsTrigger value="templates" className="flex items-center gap-2">
             <MessageSquare className="h-4 w-4" />
             Templates
           </TabsTrigger>
         </TabsList>
 
         {/* LinkedIn Outreach Tab */}
         <TabsContent value="outreach" className="space-y-4">
           <div className="flex justify-between items-center">
             <div>
               <h3 className="text-lg font-semibold">Outreach LinkedIn</h3>
               <p className="text-sm text-muted-foreground">
                 {investorsWithLinkedIn.length} investitori con profilo LinkedIn disponibile
               </p>
             </div>
             <Dialog open={showNewOutreachDialog} onOpenChange={setShowNewOutreachDialog}>
               <DialogTrigger asChild>
                 <Button className="flex items-center gap-2">
                   <UserPlus className="h-4 w-4" />
                   Nuovo Outreach
                 </Button>
               </DialogTrigger>
               <DialogContent className="max-w-2xl">
                 <DialogHeader>
                   <DialogTitle>Crea Nuovo Outreach LinkedIn</DialogTitle>
                 </DialogHeader>
                 <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Investitore</label>
                       <Select onValueChange={handleInvestorSelect}>
                         <SelectTrigger>
                           <SelectValue placeholder="Seleziona investitore" />
                         </SelectTrigger>
                         <SelectContent>
                           {investorsWithLinkedIn.map(inv => (
                             <SelectItem key={inv.id} value={inv.id}>
                               {inv.nome} - {inv.azienda}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Template</label>
                       <Select onValueChange={handleTemplateSelect}>
                         <SelectTrigger>
                           <SelectValue placeholder="Seleziona template" />
                         </SelectTrigger>
                         <SelectContent>
                           {templates.map(t => (
                             <SelectItem key={t.id} value={t.id}>
                               {t.name}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>
                   </div>
 
                   {selectedInvestor?.linkedin && (
                     <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                       <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                           <Linkedin className="h-4 w-4 text-blue-400" />
                           <span className="text-muted-foreground truncate max-w-[280px]">
                             {selectedInvestor.linkedin}
                           </span>
                         </div>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => {
                             navigator.clipboard.writeText(selectedInvestor.linkedin!);
                             toast.success('URL LinkedIn copiato - incollalo in una nuova tab');
                           }}
                         >
                           <Copy className="h-3 w-3 mr-1" />
                           Copia URL
                         </Button>
                       </div>
                     </div>
                   )}
 
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Messaggio</label>
                     <Textarea
                       value={generatedMessage}
                       onChange={(e) => setGeneratedMessage(e.target.value)}
                       rows={6}
                       placeholder="Seleziona un template per generare il messaggio..."
                       className="resize-none"
                     />
                     <p className="text-xs text-muted-foreground">
                       {generatedMessage.length}/300 caratteri (limite connessione: 300, limite InMail: 1900)
                     </p>
                   </div>
 
                   <div className="flex gap-2 justify-end">
                     <Button variant="outline" onClick={copyToClipboard} disabled={!generatedMessage}>
                       <Copy className="h-4 w-4 mr-2" />
                       Copia
                     </Button>
                     <Button variant="outline" onClick={() => saveOutreach('pending')} disabled={!selectedInvestor}>
                       <Clock className="h-4 w-4 mr-2" />
                       Salva Bozza
                     </Button>
                     <Button onClick={() => saveOutreach('sent')} disabled={!selectedInvestor}>
                       <Send className="h-4 w-4 mr-2" />
                       Segna come Inviato
                     </Button>
                   </div>
                 </div>
               </DialogContent>
             </Dialog>
           </div>
 
           <Card>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Investitore</TableHead>
                   <TableHead>Tipo</TableHead>
                   <TableHead>Stato</TableHead>
                   <TableHead>Inviato</TableHead>
                   <TableHead>Azioni</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {outreachList.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                       Nessun outreach registrato. Clicca "Nuovo Outreach" per iniziare.
                     </TableCell>
                   </TableRow>
                 ) : (
                   outreachList.map(outreach => (
                     <TableRow key={outreach.id}>
                       <TableCell>
                         <div className="font-medium">{outreach.investor_name}</div>
                         {outreach.linkedin_url && (
                           <button
                             onClick={() => {
                               navigator.clipboard.writeText(outreach.linkedin_url!);
                               toast.success('URL LinkedIn copiato');
                             }}
                             className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                             title="Copia URL LinkedIn"
                           >
                             <Linkedin className="h-3 w-3" />
                             <Copy className="h-2.5 w-2.5" />
                           </button>
                         )}
                       </TableCell>
                       <TableCell>
                         <Badge variant="outline" className="text-xs">
                           {outreach.outreach_type === 'direct_message' ? 'DM' : 
                            outreach.outreach_type === 'connection_request' ? 'Connessione' : 
                            'Warm Intro'}
                         </Badge>
                       </TableCell>
                       <TableCell>
                         <Badge className={statusColors[outreach.status] || 'bg-gray-500/20 text-gray-400'}>
                           {outreach.status === 'pending' ? 'In attesa' :
                            outreach.status === 'sent' ? 'Inviato' :
                            outreach.status === 'replied' ? 'Risposto' :
                            outreach.status === 'no_response' ? 'Nessuna risposta' :
                            'Convertito'}
                         </Badge>
                       </TableCell>
                       <TableCell className="text-sm text-muted-foreground">
                         {outreach.sent_at 
                           ? format(new Date(outreach.sent_at), 'dd MMM yyyy', { locale: it })
                           : '-'}
                       </TableCell>
                       <TableCell>
                         <div className="flex gap-1">
                           {outreach.status === 'pending' && (
                             <Button size="sm" variant="ghost" onClick={() => updateOutreachStatus(outreach.id, 'sent')}>
                               <Send className="h-3 w-3" />
                             </Button>
                           )}
                           {outreach.status === 'sent' && (
                             <>
                               <Button size="sm" variant="ghost" onClick={() => updateOutreachStatus(outreach.id, 'replied')}>
                                 <CheckCircle className="h-3 w-3 text-green-400" />
                               </Button>
                               <Button size="sm" variant="ghost" onClick={() => updateOutreachStatus(outreach.id, 'no_response')}>
                                 <XCircle className="h-3 w-3 text-gray-400" />
                               </Button>
                             </>
                           )}
                           {outreach.status === 'replied' && (
                             <Button size="sm" variant="ghost" onClick={() => updateOutreachStatus(outreach.id, 'converted')}>
                               <TrendingUp className="h-3 w-3 text-emerald-400" />
                             </Button>
                           )}
                         </div>
                       </TableCell>
                     </TableRow>
                   ))
                 )}
               </TableBody>
             </Table>
           </Card>
         </TabsContent>
 
         {/* Warm Intro Tab */}
         <TabsContent value="warm-intro" className="space-y-4">
           <div className="flex justify-between items-center">
             <div>
               <h3 className="text-lg font-semibold">Warm Intro Tracker</h3>
               <p className="text-sm text-muted-foreground">
                 Identifica e traccia le connessioni comuni per intro personalizzate
               </p>
             </div>
             <Dialog open={showWarmIntroDialog} onOpenChange={setShowWarmIntroDialog}>
               <DialogTrigger asChild>
                 <Button className="flex items-center gap-2">
                   <Users className="h-4 w-4" />
                   Aggiungi Connessione
                 </Button>
               </DialogTrigger>
               <DialogContent>
                 <DialogHeader>
                   <DialogTitle>Nuova Warm Connection</DialogTitle>
                 </DialogHeader>
                 <div className="space-y-4">
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Investitore Target</label>
                     <Select 
                       value={warmIntroForm.investor_id}
                       onValueChange={(v) => setWarmIntroForm({...warmIntroForm, investor_id: v})}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder="Seleziona investitore" />
                       </SelectTrigger>
                       <SelectContent>
                         {investors.map(inv => (
                           <SelectItem key={inv.id} value={inv.id}>
                             {inv.nome} - {inv.azienda}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
 
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Nome Connettore (chi fa l'intro)</label>
                     <Input
                       value={warmIntroForm.connector_name}
                       onChange={(e) => setWarmIntroForm({...warmIntroForm, connector_name: e.target.value})}
                       placeholder="Es: Marco Rossi"
                     />
                   </div>
 
                   <div className="space-y-2">
                     <label className="text-sm font-medium">LinkedIn del Connettore</label>
                     <Input
                       value={warmIntroForm.connector_linkedin}
                       onChange={(e) => setWarmIntroForm({...warmIntroForm, connector_linkedin: e.target.value})}
                       placeholder="https://linkedin.com/in/..."
                     />
                   </div>
 
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Come conosciamo il connettore</label>
                     <Input
                       value={warmIntroForm.connector_relationship}
                       onChange={(e) => setWarmIntroForm({...warmIntroForm, connector_relationship: e.target.value})}
                       placeholder="Es: Ex collega, cliente, contatto conferenza..."
                     />
                   </div>
 
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Forza della connessione</label>
                     <Select 
                       value={warmIntroForm.connection_strength}
                       onValueChange={(v) => setWarmIntroForm({...warmIntroForm, connection_strength: v})}
                     >
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="weak">Debole - Conoscenza superficiale</SelectItem>
                         <SelectItem value="medium">Media - Rapporto professionale</SelectItem>
                         <SelectItem value="strong">Forte - Rapporto stretto</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
 
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Note</label>
                     <Textarea
                       value={warmIntroForm.notes}
                       onChange={(e) => setWarmIntroForm({...warmIntroForm, notes: e.target.value})}
                       placeholder="Note aggiuntive..."
                       rows={3}
                     />
                   </div>
 
                   <Button onClick={saveWarmConnection} className="w-full">
                     Salva Connessione
                   </Button>
                 </div>
               </DialogContent>
             </Dialog>
           </div>
 
           <Card>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Investitore Target</TableHead>
                   <TableHead>Connettore</TableHead>
                   <TableHead>Relazione</TableHead>
                   <TableHead>Forza</TableHead>
                   <TableHead>Stato</TableHead>
                   <TableHead>Azioni</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {warmConnections.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                       Nessuna warm connection identificata. Aggiungi connessioni comuni per facilitare le intro.
                     </TableCell>
                   </TableRow>
                 ) : (
                   warmConnections.map(conn => (
                     <TableRow key={conn.id}>
                       <TableCell className="font-medium">{conn.investor_name}</TableCell>
                       <TableCell>
                         <div>{conn.connector_name}</div>
                         {conn.connector_linkedin && (
                           <button
                             onClick={() => {
                               navigator.clipboard.writeText(conn.connector_linkedin!);
                               toast.success('URL LinkedIn copiato');
                             }}
                             className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                             title="Copia URL LinkedIn"
                           >
                             <Linkedin className="h-3 w-3" />
                             <Copy className="h-2.5 w-2.5" />
                           </button>
                         )}
                       </TableCell>
                       <TableCell className="text-sm text-muted-foreground">
                         {conn.connector_relationship || '-'}
                       </TableCell>
                       <TableCell>
                         <Badge variant="outline" className={
                           conn.connection_strength === 'strong' ? 'border-green-500 text-green-400' :
                           conn.connection_strength === 'medium' ? 'border-yellow-500 text-yellow-400' :
                           'border-gray-500 text-gray-400'
                         }>
                           {conn.connection_strength === 'strong' ? 'Forte' :
                            conn.connection_strength === 'medium' ? 'Media' : 'Debole'}
                         </Badge>
                       </TableCell>
                       <TableCell>
                         <Badge className={introStatusColors[conn.intro_status] || 'bg-gray-500/20'}>
                           {conn.intro_status === 'identified' ? 'Identificato' :
                            conn.intro_status === 'requested' ? 'Richiesto' :
                            conn.intro_status === 'intro_made' ? 'Intro Fatta' :
                            'Declinato'}
                         </Badge>
                       </TableCell>
                       <TableCell>
                         <div className="flex gap-1">
                           {conn.intro_status === 'identified' && (
                             <Button size="sm" variant="ghost" onClick={() => updateIntroStatus(conn.id, 'requested')}>
                               <Send className="h-3 w-3" />
                             </Button>
                           )}
                           {conn.intro_status === 'requested' && (
                             <>
                               <Button size="sm" variant="ghost" onClick={() => updateIntroStatus(conn.id, 'intro_made')}>
                                 <CheckCircle className="h-3 w-3 text-green-400" />
                               </Button>
                               <Button size="sm" variant="ghost" onClick={() => updateIntroStatus(conn.id, 'declined')}>
                                 <XCircle className="h-3 w-3 text-red-400" />
                               </Button>
                             </>
                           )}
                         </div>
                       </TableCell>
                     </TableRow>
                   ))
                 )}
               </TableBody>
             </Table>
           </Card>
         </TabsContent>
 
         {/* Templates Tab */}
         <TabsContent value="templates" className="space-y-4">
           <div>
             <h3 className="text-lg font-semibold">Templates LinkedIn</h3>
             <p className="text-sm text-muted-foreground">
               Templates pre-configurati per diversi scenari di outreach
             </p>
           </div>
 
           <div className="grid gap-4">
             {templates.map(template => (
               <Card key={template.id} className="p-4">
                 <div className="flex items-start justify-between mb-3">
                   <div>
                     <h4 className="font-medium">{template.name}</h4>
                     <Badge variant="outline" className="mt-1 text-xs">
                       {template.template_type === 'direct_message' ? 'DM Diretto' :
                        template.template_type === 'connection_request' ? 'Richiesta Connessione' :
                        template.template_type === 'warm_intro_request' ? 'Richiesta Intro' :
                        'Follow-up'}
                     </Badge>
                   </div>
                   <div className="text-right text-sm">
                     <div className="text-muted-foreground">Usato {template.usage_count}x</div>
                     {template.success_rate && (
                       <div className="text-green-400">{template.success_rate}% successo</div>
                     )}
                   </div>
                 </div>
                 <div className="p-3 rounded bg-muted/50 text-sm">
                   <pre className="whitespace-pre-wrap font-sans">{template.content}</pre>
                 </div>
                 {template.variables && template.variables.length > 0 && (
                   <div className="mt-2 flex gap-1 flex-wrap">
                     {template.variables.map((v, i) => (
                       <Badge key={i} variant="secondary" className="text-xs">
                         {v}
                       </Badge>
                     ))}
                   </div>
                 )}
               </Card>
             ))}
           </div>
         </TabsContent>
       </Tabs>
     </div>
   );
 };