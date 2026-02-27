import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Tag, MessageSquare, ExternalLink, Mail, Phone, Linkedin, Building2, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  location: string | null;
  job_title: string | null;
  headline: string | null;
  industry: string | null;
  enrichment_status: string;
  enriched_email: string | null;
  enriched_phone: string | null;
  enriched_title: string | null;
  enriched_company: string | null;
  enriched_location: string | null;
  enriched_linkedin_url: string | null;
}

interface ContactTag {
  id: string;
  contact_id: string;
  tag: string;
}

interface Interaction {
  id: string;
  contact_id: string;
  interaction_type: string;
  subject: string | null;
  content: string | null;
  created_at: string;
}

export function CRMContactHub() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tags, setTags] = useState<ContactTag[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [expandedContact, setExpandedContact] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Add interaction dialog
  const [addInteractionFor, setAddInteractionFor] = useState<string | null>(null);
  const [newInteraction, setNewInteraction] = useState({ type: "note", subject: "", content: "" });

  // Add tag dialog
  const [addTagFor, setAddTagFor] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [contactsRes, tagsRes, interactionsRes] = await Promise.all([
      supabase.from("ariesdb_contacts").select("*").order("name"),
      supabase.from("personal_crm_contact_tags").select("*"),
      supabase.from("personal_crm_interactions").select("*").order("created_at", { ascending: false }),
    ]);
    setContacts(contactsRes.data || []);
    setTags(tagsRes.data || []);
    setInteractions(interactionsRes.data || []);
    setLoading(false);
  };

  const allTags = useMemo(() => {
    const tagSet = new Set(tags.map((t) => t.tag));
    return Array.from(tagSet).sort();
  }, [tags]);

  const filteredContacts = useMemo(() => {
    let result = contacts;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.company?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.enriched_email?.toLowerCase().includes(q) ||
          c.job_title?.toLowerCase().includes(q) ||
          c.headline?.toLowerCase().includes(q)
      );
    }
    if (tagFilter) {
      const taggedIds = new Set(tags.filter((t) => t.tag === tagFilter).map((t) => t.contact_id));
      result = result.filter((c) => taggedIds.has(c.id));
    }
    return result;
  }, [contacts, search, tagFilter, tags]);

  const contactTags = (contactId: string) => tags.filter((t) => t.contact_id === contactId);
  const contactInteractions = (contactId: string) =>
    interactions.filter((i) => i.contact_id === contactId).slice(0, 10);

  const handleAddTag = async () => {
    if (!addTagFor || !newTag.trim()) return;
    const { error } = await supabase
      .from("personal_crm_contact_tags")
      .insert({ contact_id: addTagFor, tag: newTag.trim() });
    if (error) {
      if (error.code === "23505") toast.info("Tag già presente");
      else toast.error("Errore: " + error.message);
    } else {
      toast.success("Tag aggiunto");
      setNewTag("");
      setAddTagFor(null);
      fetchData();
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    await supabase.from("personal_crm_contact_tags").delete().eq("id", tagId);
    fetchData();
  };

  const handleAddInteraction = async () => {
    if (!addInteractionFor || !newInteraction.content?.trim()) return;
    const { error } = await supabase.from("personal_crm_interactions").insert({
      contact_id: addInteractionFor,
      interaction_type: newInteraction.type,
      subject: newInteraction.subject || null,
      content: newInteraction.content,
    });
    if (error) {
      toast.error("Errore: " + error.message);
    } else {
      toast.success("Interazione registrata");
      setNewInteraction({ type: "note", subject: "", content: "" });
      setAddInteractionFor(null);
      fetchData();
    }
  };

  const getEmail = (c: Contact) => c.enriched_email || c.email;
  const getPhone = (c: Contact) => c.enriched_phone || c.phone;
  const getTitle = (c: Contact) => c.enriched_title || c.job_title;
  const getCompany = (c: Contact) => c.enriched_company || c.company;
  const getLocation = (c: Contact) => c.enriched_location || c.location;
  const getLinkedin = (c: Contact) => c.enriched_linkedin_url || c.linkedin_url;

  if (loading) {
    return <div className="text-muted-foreground animate-pulse p-8">Caricamento contatti...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca contatti..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={tagFilter} onValueChange={(v) => setTagFilter(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtra per tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti i tag</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredContacts.length} contatti
        </span>
      </div>

      {/* Contact List */}
      <div className="space-y-2">
        {filteredContacts.slice(0, 50).map((contact) => {
          const isExpanded = expandedContact === contact.id;
          const cTags = contactTags(contact.id);
          const cInteractions = contactInteractions(contact.id);

          return (
            <Card key={contact.id} className="border-border/50">
              <CardContent className="p-4">
                {/* Main row */}
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {contact.name?.charAt(0)?.toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{contact.name}</span>
                      {contact.enrichment_status === "enriched" && (
                        <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600">enriched</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                      {getTitle(contact) && <span>{getTitle(contact)}</span>}
                      {getCompany(contact) && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {getCompany(contact)}
                        </span>
                      )}
                      {getLocation(contact) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {getLocation(contact)}
                        </span>
                      )}
                    </div>
                    {/* Tags */}
                    {cTags.length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {cTags.map((t) => (
                          <Badge
                            key={t.id}
                            variant="secondary"
                            className="text-[10px] cursor-pointer hover:line-through"
                            onClick={() => handleRemoveTag(t.id)}
                          >
                            {t.tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {getEmail(contact) && (
                      <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                        <a href={`mailto:${getEmail(contact)}`}><Mail className="h-3.5 w-3.5" /></a>
                      </Button>
                    )}
                    {getPhone(contact) && (
                      <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                        <a href={`tel:${getPhone(contact)}`}><Phone className="h-3.5 w-3.5" /></a>
                      </Button>
                    )}
                    {getLinkedin(contact) && (
                      <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                        <a href={getLinkedin(contact)!} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => setAddTagFor(contact.id)}
                    >
                      <Tag className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => setAddInteractionFor(contact.id)}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => setExpandedContact(isExpanded ? null : contact.id)}
                    >
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>

                {/* Expanded timeline */}
                {isExpanded && (
                  <div className="mt-4 pl-14 border-l-2 border-border ml-5 space-y-3">
                    {cInteractions.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">Nessuna interazione registrata</p>
                    ) : (
                      cInteractions.map((i) => (
                        <div key={i.id} className="text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] capitalize">{i.interaction_type}</Badge>
                            {i.subject && <span className="font-medium">{i.subject}</span>}
                            <span className="text-xs text-muted-foreground ml-auto">
                              {new Date(i.created_at).toLocaleDateString("it-IT")}
                            </span>
                          </div>
                          {i.content && <p className="text-xs text-muted-foreground mt-1">{i.content}</p>}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filteredContacts.length > 50 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Mostrati 50 di {filteredContacts.length} contatti. Usa la ricerca per filtrare.
          </p>
        )}
      </div>

      {/* Add Tag Dialog */}
      <Dialog open={!!addTagFor} onOpenChange={(open) => !open && setAddTagFor(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Aggiungi Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="es. LP Prospect, Family Office, Priority..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            />
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-xs text-muted-foreground mr-1">Esistenti:</span>
                {allTags.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="text-[10px] cursor-pointer hover:bg-primary/10"
                    onClick={() => { setNewTag(t); }}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            )}
            <Button onClick={handleAddTag} className="w-full">Aggiungi</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Interaction Dialog */}
      <Dialog open={!!addInteractionFor} onOpenChange={(open) => !open && setAddInteractionFor(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registra Interazione</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={newInteraction.type} onValueChange={(v) => setNewInteraction({ ...newInteraction, type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="note">📝 Nota</SelectItem>
                <SelectItem value="call">📞 Chiamata</SelectItem>
                <SelectItem value="email">📧 Email</SelectItem>
                <SelectItem value="meeting">🤝 Meeting</SelectItem>
                <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                <SelectItem value="deal_update">📊 Aggiornamento Deal</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Oggetto (opzionale)"
              value={newInteraction.subject}
              onChange={(e) => setNewInteraction({ ...newInteraction, subject: e.target.value })}
            />
            <Textarea
              placeholder="Dettagli dell'interazione..."
              value={newInteraction.content}
              onChange={(e) => setNewInteraction({ ...newInteraction, content: e.target.value })}
              rows={4}
            />
            <Button onClick={handleAddInteraction} className="w-full">Salva Interazione</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
