import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface AddABCInvestorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvestorAdded: () => void;
}

const CATEGORIES = [
  "Club Deal Investor",
  "Family Office",
  "Private Equity",
  "Venture Capital",
  "Private Banking",
  "Asset Management",
  "Institutional Investor",
  "HNWI",
  "Other"
];

const SOURCES = [
  "LinkedIn",
  "Referral",
  "Event",
  "Direct Contact",
  "Website",
  "Network",
  "Other"
];

export const AddABCInvestorDialog = ({ open, onOpenChange, onInvestorAdded }: AddABCInvestorDialogProps) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    azienda: '',
    ruolo: '',
    categoria: 'Club Deal Investor',
    citta: '',
    fonte: '',
    linkedin: '',
    email: '',
    phone: '',
    pipeline_value: '0',
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      azienda: '',
      ruolo: '',
      categoria: 'Club Deal Investor',
      citta: '',
      fonte: '',
      linkedin: '',
      email: '',
      phone: '',
      pipeline_value: '0',
    });
  };

  const handleSubmit = async () => {
    if (!formData.nome.trim() || !formData.azienda.trim()) {
      toast.error("Nome e Azienda sono obbligatori");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('abc_investors' as any)
        .insert({
          nome: formData.nome.trim(),
          azienda: formData.azienda.trim(),
          ruolo: formData.ruolo.trim() || null,
          categoria: formData.categoria,
          citta: formData.citta.trim() || null,
          fonte: formData.fonte || null,
          linkedin: formData.linkedin.trim() || null,
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          pipeline_value: parseFloat(formData.pipeline_value) || 0,
          status: 'To Contact',
          approval_status: 'pending',
        });

      if (error) throw error;

      toast.success(`${formData.nome} aggiunto con successo`);
      resetForm();
      onOpenChange(false);
      onInvestorAdded();
    } catch (error) {
      console.error('Error adding investor:', error);
      toast.error("Errore durante l'aggiunta dell'investitore");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Aggiungi Nuovo Investitore</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Mario Rossi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="azienda">Azienda *</Label>
              <Input
                id="azienda"
                value={formData.azienda}
                onChange={(e) => setFormData({ ...formData, azienda: e.target.value })}
                placeholder="ABC Company"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ruolo">Ruolo</Label>
              <Input
                id="ruolo"
                value={formData.ruolo}
                onChange={(e) => setFormData({ ...formData, ruolo: e.target.value })}
                placeholder="CEO, Partner, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={formData.categoria} onValueChange={(v) => setFormData({ ...formData, categoria: v })}>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="citta">Città</Label>
              <Input
                id="citta"
                value={formData.citta}
                onChange={(e) => setFormData({ ...formData, citta: e.target.value })}
                placeholder="Milano"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fonte">Fonte</Label>
              <Select value={formData.fonte} onValueChange={(v) => setFormData({ ...formData, fonte: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona fonte" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map(src => (
                    <SelectItem key={src} value={src}>{src}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+39 123 456 7890"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pipeline_value">Pipeline Value (€)</Label>
              <Input
                id="pipeline_value"
                type="number"
                value={formData.pipeline_value}
                onChange={(e) => setFormData({ ...formData, pipeline_value: e.target.value })}
                placeholder="100000"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Salvataggio..." : "Aggiungi Investitore"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
