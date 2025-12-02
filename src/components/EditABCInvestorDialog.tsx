import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface Investor {
  id: string;
  nome: string;
  azienda: string;
  ruolo?: string;
  categoria: string;
  citta?: string;
  fonte?: string;
  status: string;
  pipelineValue: number;
  lastContactDate?: string;
  linkedin?: string;
  email?: string;
  phone?: string;
}

interface EditABCInvestorDialogProps {
  investor: Investor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const statusOptions = [
  'To Contact',
  'Contacted',
  'Interested',
  'Meeting Scheduled',
  'In Negotiation',
  'Closed',
  'Not Interested',
];

const categoryOptions = [
  'Family Office',
  'HNWI',
  'Institutional',
  'Corporate',
  'Private Equity',
  'Venture Capital',
  'Other',
];

export const EditABCInvestorDialog = ({ investor, open, onOpenChange, onSave }: EditABCInvestorDialogProps) => {
  const [formData, setFormData] = useState<Partial<Investor>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (investor) {
      setFormData({
        nome: investor.nome,
        azienda: investor.azienda,
        ruolo: investor.ruolo || '',
        categoria: investor.categoria,
        citta: investor.citta || '',
        fonte: investor.fonte || '',
        status: investor.status,
        pipelineValue: investor.pipelineValue,
        linkedin: investor.linkedin || '',
        email: investor.email || '',
        phone: investor.phone || '',
      });
    }
  }, [investor]);

  const handleSave = async () => {
    if (!investor) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('abc_investors' as any)
        .update({
          nome: formData.nome,
          azienda: formData.azienda,
          ruolo: formData.ruolo || null,
          categoria: formData.categoria,
          citta: formData.citta || null,
          fonte: formData.fonte || null,
          status: formData.status,
          pipeline_value: formData.pipelineValue,
          linkedin: formData.linkedin || null,
          email: formData.email || null,
          phone: formData.phone || null,
        })
        .eq('id', investor.id);

      if (error) throw error;

      toast.success('Investor updated successfully');
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating investor:', error);
      toast.error('Failed to update investor');
    } finally {
      setSaving(false);
    }
  };

  if (!investor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Investor</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Name</Label>
              <Input
                id="nome"
                value={formData.nome || ''}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruolo">Role</Label>
              <Input
                id="ruolo"
                value={formData.ruolo || ''}
                onChange={(e) => setFormData({ ...formData, ruolo: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="azienda">Company</Label>
            <Input
              id="azienda"
              value={formData.azienda || ''}
              onChange={(e) => setFormData({ ...formData, azienda: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Category</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="citta">City</Label>
              <Input
                id="citta"
                value={formData.citta || ''}
                onChange={(e) => setFormData({ ...formData, citta: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fonte">Source</Label>
              <Input
                id="fonte"
                value={formData.fonte || ''}
                onChange={(e) => setFormData({ ...formData, fonte: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pipelineValue">Pipeline Value (€)</Label>
            <Input
              id="pipelineValue"
              type="number"
              value={formData.pipelineValue || 0}
              onChange={(e) => setFormData({ ...formData, pipelineValue: Number(e.target.value) })}
            />
          </div>

          <div className="border-t pt-4 mt-2">
            <h4 className="font-medium mb-3">Contact Information</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedin || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
