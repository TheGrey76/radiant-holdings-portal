import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, GripVertical, Euro, Calendar, User, Trash2 } from "lucide-react";
import { toast } from "sonner";

const STAGES = [
  { id: "lead", label: "Lead", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { id: "contacted", label: "Contattato", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "meeting", label: "Meeting", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "proposal", label: "Proposta", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "negotiation", label: "Negoziazione", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { id: "won", label: "Vinto ✅", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "lost", label: "Perso", color: "bg-red-50 text-red-700 border-red-200" },
];

interface Deal {
  id: string;
  contact_id: string | null;
  title: string;
  description: string | null;
  stage: string;
  priority: string;
  value: number;
  currency: string;
  probability: number;
  expected_close: string | null;
  tags: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Contact {
  id: string;
  name: string;
  company: string | null;
}

export function CRMDealPipeline() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: "",
    description: "",
    contact_id: "",
    stage: "lead",
    priority: "medium",
    value: 0,
    probability: 0,
    expected_close: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [dealsRes, contactsRes] = await Promise.all([
      supabase.from("personal_crm_deals").select("*").order("created_at", { ascending: false }),
      supabase.from("ariesdb_contacts").select("id, name, company").order("name"),
    ]);
    setDeals(dealsRes.data || []);
    setContacts(contactsRes.data || []);
    setLoading(false);
  };

  const handleAddDeal = async () => {
    if (!newDeal.title.trim()) return;
    const { error } = await supabase.from("personal_crm_deals").insert({
      title: newDeal.title,
      description: newDeal.description || null,
      contact_id: newDeal.contact_id || null,
      stage: newDeal.stage,
      priority: newDeal.priority,
      value: newDeal.value,
      probability: newDeal.probability,
      expected_close: newDeal.expected_close || null,
    });
    if (error) {
      toast.error("Errore: " + error.message);
    } else {
      toast.success("Deal creato");
      setShowAddDeal(false);
      setNewDeal({ title: "", description: "", contact_id: "", stage: "lead", priority: "medium", value: 0, probability: 0, expected_close: "" });
      fetchData();
    }
  };

  const moveToStage = async (dealId: string, newStage: string) => {
    await supabase.from("personal_crm_deals").update({ stage: newStage }).eq("id", dealId);
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)));
    toast.success("Deal spostato");
  };

  const deleteDeal = async (dealId: string) => {
    await supabase.from("personal_crm_deals").delete().eq("id", dealId);
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
    toast.success("Deal eliminato");
  };

  const getContactName = (contactId: string | null) => {
    if (!contactId) return null;
    const c = contacts.find((c) => c.id === contactId);
    return c ? c.name : null;
  };

  const stageTotal = (stageId: string) =>
    deals.filter((d) => d.stage === stageId).reduce((sum, d) => sum + (d.value || 0), 0);

  if (loading) {
    return <div className="text-muted-foreground animate-pulse p-8">Caricamento pipeline...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {deals.length} deal totali • Pipeline: €{deals.filter((d) => !["won", "lost"].includes(d.stage)).reduce((s, d) => s + (d.value || 0), 0).toLocaleString()}
        </div>
        <Button size="sm" onClick={() => setShowAddDeal(true)}>
          <Plus className="h-4 w-4 mr-1" /> Nuovo Deal
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id);
          return (
            <div key={stage.id} className="min-w-[260px] flex-shrink-0">
              <div className={`rounded-t-lg px-3 py-2 border ${stage.color} flex items-center justify-between`}>
                <span className="text-xs font-semibold">{stage.label}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">{stageDeals.length}</Badge>
                  {stageTotal(stage.id) > 0 && (
                    <span className="text-[10px] font-mono">€{stageTotal(stage.id).toLocaleString()}</span>
                  )}
                </div>
              </div>
              <div className="bg-muted/30 border border-t-0 rounded-b-lg p-2 space-y-2 min-h-[200px]">
                {stageDeals.map((deal) => (
                  <Card key={deal.id} className="border-border/50 shadow-sm">
                    <CardContent className="p-3">
                      <div className="font-medium text-sm mb-1">{deal.title}</div>
                      {getContactName(deal.contact_id) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <User className="h-3 w-3" /> {getContactName(deal.contact_id)}
                        </div>
                      )}
                      {deal.value > 0 && (
                        <div className="flex items-center gap-1 text-xs font-mono text-foreground mb-1">
                          <Euro className="h-3 w-3" /> {deal.value.toLocaleString()}
                          {deal.probability > 0 && (
                            <span className="text-muted-foreground ml-1">({deal.probability}%)</span>
                          )}
                        </div>
                      )}
                      {deal.expected_close && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <Calendar className="h-3 w-3" /> {new Date(deal.expected_close).toLocaleDateString("it-IT")}
                        </div>
                      )}
                      {/* Stage move buttons */}
                      <div className="flex gap-1 flex-wrap">
                        <Select onValueChange={(v) => moveToStage(deal.id, v)}>
                          <SelectTrigger className="h-6 text-[10px] w-auto px-2">
                            <SelectValue placeholder="Sposta →" />
                          </SelectTrigger>
                          <SelectContent>
                            {STAGES.filter((s) => s.id !== deal.stage).map((s) => (
                              <SelectItem key={s.id} value={s.id} className="text-xs">{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => deleteDeal(deal.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Deal Dialog */}
      <Dialog open={showAddDeal} onOpenChange={setShowAddDeal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nuovo Deal</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Titolo del deal *"
              value={newDeal.title}
              onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
            />
            <Textarea
              placeholder="Descrizione"
              value={newDeal.description}
              onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })}
              rows={2}
            />
            <Select value={newDeal.contact_id || "none"} onValueChange={(v) => setNewDeal({ ...newDeal, contact_id: v === "none" ? "" : v })}>
              <SelectTrigger>
                <SelectValue placeholder="Collega a un contatto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nessun contatto</SelectItem>
                {contacts.slice(0, 100).map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ""}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Select value={newDeal.stage} onValueChange={(v) => setNewDeal({ ...newDeal, stage: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={newDeal.priority} onValueChange={(v) => setNewDeal({ ...newDeal, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Bassa</SelectItem>
                  <SelectItem value="medium">🟡 Media</SelectItem>
                  <SelectItem value="high">🔴 Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Valore (€)"
                value={newDeal.value || ""}
                onChange={(e) => setNewDeal({ ...newDeal, value: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Probabilità %"
                min={0}
                max={100}
                value={newDeal.probability || ""}
                onChange={(e) => setNewDeal({ ...newDeal, probability: Number(e.target.value) })}
              />
            </div>
            <Input
              type="date"
              value={newDeal.expected_close}
              onChange={(e) => setNewDeal({ ...newDeal, expected_close: e.target.value })}
            />
            <Button onClick={handleAddDeal} className="w-full">Crea Deal</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
