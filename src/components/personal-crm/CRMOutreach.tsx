import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Send, Mail, Users, BarChart3, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  campaign_type: string;
  status: string;
  template_subject: string | null;
  template_body: string | null;
  target_tags: string[];
  sent_count: number;
  open_count: number;
  reply_count: number;
  created_at: string;
}

export function CRMOutreach() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    campaign_type: "email",
    template_subject: "",
    template_body: "",
    target_tags: [] as string[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [campaignsRes, tagsRes] = await Promise.all([
      supabase.from("personal_crm_campaigns").select("*").order("created_at", { ascending: false }),
      supabase.from("personal_crm_contact_tags").select("tag"),
    ]);
    setCampaigns(campaignsRes.data || []);
    const tagSet = new Set((tagsRes.data || []).map((t: any) => t.tag));
    setAllTags(Array.from(tagSet).sort());
    setLoading(false);
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.name.trim()) return;
    const { error } = await supabase.from("personal_crm_campaigns").insert({
      name: newCampaign.name,
      description: newCampaign.description || null,
      campaign_type: newCampaign.campaign_type,
      template_subject: newCampaign.template_subject || null,
      template_body: newCampaign.template_body || null,
      target_tags: newCampaign.target_tags,
    });
    if (error) {
      toast.error("Errore: " + error.message);
    } else {
      toast.success("Campagna creata");
      setShowCreate(false);
      setNewCampaign({ name: "", description: "", campaign_type: "email", template_subject: "", template_body: "", target_tags: [] });
      fetchData();
    }
  };

  const deleteCampaign = async (id: string) => {
    await supabase.from("personal_crm_campaigns").delete().eq("id", id);
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    toast.success("Campagna eliminata");
  };

  const copyTemplate = (campaign: Campaign) => {
    const text = `Subject: ${campaign.template_subject || ""}\n\n${campaign.template_body || ""}`;
    navigator.clipboard.writeText(text);
    toast.success("Template copiato negli appunti");
  };

  const toggleTag = (tag: string) => {
    setNewCampaign((prev) => ({
      ...prev,
      target_tags: prev.target_tags.includes(tag)
        ? prev.target_tags.filter((t) => t !== tag)
        : [...prev.target_tags, tag],
    }));
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-slate-100 text-slate-700";
      case "active": return "bg-emerald-100 text-emerald-700";
      case "paused": return "bg-amber-100 text-amber-700";
      case "completed": return "bg-blue-100 text-blue-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return <div className="text-muted-foreground animate-pulse p-8">Caricamento campagne...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{campaigns.length} campagne</div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-1" /> Nuova Campagna
        </Button>
      </div>

      {/* Campaign Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="border-border/50 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{campaign.name}</CardTitle>
                <Badge className={`text-[10px] ${statusColor(campaign.status)}`}>
                  {campaign.status}
                </Badge>
              </div>
              {campaign.description && (
                <p className="text-xs text-muted-foreground">{campaign.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Stats */}
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Send className="h-3 w-3 text-muted-foreground" />
                  <span>{campaign.sent_count} inviati</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span>{campaign.open_count} aperti</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3 text-muted-foreground" />
                  <span>{campaign.reply_count} risposte</span>
                </div>
              </div>

              {/* Target tags */}
              {campaign.target_tags?.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {campaign.target_tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>
              )}

              {/* Template preview */}
              {campaign.template_subject && (
                <div className="text-xs bg-muted/50 rounded p-2">
                  <div className="font-medium mb-0.5">📧 {campaign.template_subject}</div>
                  <div className="text-muted-foreground line-clamp-2">{campaign.template_body}</div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => copyTemplate(campaign)}>
                  <Copy className="h-3 w-3 mr-1" /> Copia
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 ml-auto"
                  onClick={() => deleteCampaign(campaign.id)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && (
        <Card className="border-dashed border-2 border-border">
          <CardContent className="p-8 text-center">
            <Send className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Nessuna campagna ancora. Crea la tua prima campagna outreach!
            </p>
            <Button size="sm" onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4 mr-1" /> Crea Campagna
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Campaign Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nuova Campagna Outreach</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Nome campagna *"
              value={newCampaign.name}
              onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
            />
            <Input
              placeholder="Descrizione (opzionale)"
              value={newCampaign.description}
              onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
            />
            <Select value={newCampaign.campaign_type} onValueChange={(v) => setNewCampaign({ ...newCampaign, campaign_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="email">📧 Email</SelectItem>
                <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                <SelectItem value="call">📞 Chiamata</SelectItem>
                <SelectItem value="mixed">🔄 Multi-canale</SelectItem>
              </SelectContent>
            </Select>

            {/* Target Tags */}
            {allTags.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Target per tag:</label>
                <div className="flex flex-wrap gap-1">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={newCampaign.target_tags.includes(tag) ? "default" : "outline"}
                      className="text-[10px] cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-border pt-3">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Template Email</label>
              <Input
                placeholder="Oggetto email"
                value={newCampaign.template_subject}
                onChange={(e) => setNewCampaign({ ...newCampaign, template_subject: e.target.value })}
                className="mb-2"
              />
              <Textarea
                placeholder="Corpo email... Usa {{name}}, {{company}} per variabili"
                value={newCampaign.template_body}
                onChange={(e) => setNewCampaign({ ...newCampaign, template_body: e.target.value })}
                rows={6}
              />
            </div>

            <Button onClick={handleCreateCampaign} className="w-full">Crea Campagna</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
