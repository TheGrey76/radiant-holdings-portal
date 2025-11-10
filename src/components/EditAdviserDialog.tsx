import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FinancialAdviser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string;
  age: number;
  city: string;
  province: string;
  intermediary: string;
  phone: string;
  email: string;
  role: string;
  region: string;
  portfolio: string;
  linkedinUrl: string;
}

interface EditAdviserDialogProps {
  adviser: FinancialAdviser;
  onUpdate: () => void;
}

export default function EditAdviserDialog({ adviser, onUpdate }: EditAdviserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: adviser.firstName,
    last_name: adviser.lastName,
    full_name: adviser.fullName,
    birth_date: adviser.birthDate,
    age: adviser.age,
    city: adviser.city,
    province: adviser.province,
    intermediary: adviser.intermediary,
    phone: adviser.phone,
    email: adviser.email,
    role: adviser.role,
    region: adviser.region,
    portfolio: adviser.portfolio,
    linkedin_url: adviser.linkedinUrl,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('financial_advisers')
        .update(formData)
        .eq('id', adviser.id);

      if (error) throw error;

      toast.success("Consulente aggiornato con successo");
      setOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating adviser:', error);
      toast.error("Errore durante l'aggiornamento del consulente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-white/10 text-white/80 hover:text-white"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f1729] border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Modifica Consulente</DialogTitle>
          <DialogDescription className="text-white/60">
            Aggiorna le informazioni del consulente finanziario
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-white">Nome</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-white">Cognome</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-white">Nome Completo</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="bg-white/10 text-white border-white/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Telefono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin_url" className="text-white">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              type="url"
              placeholder="https://www.linkedin.com/in/..."
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              className="bg-white/10 text-white border-white/20 placeholder:text-white/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-white">Città</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province" className="text-white">Provincia</Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region" className="text-white">Regione</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="bg-white/10 text-white border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="intermediary" className="text-white">Intermediario</Label>
            <Input
              id="intermediary"
              value={formData.intermediary}
              onChange={(e) => setFormData({ ...formData, intermediary: e.target.value })}
              className="bg-white/10 text-white border-white/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">Ruolo</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio" className="text-white">Portfolio</Label>
              <Input
                id="portfolio"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birth_date" className="text-white">Data di Nascita</Label>
              <Input
                id="birth_date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="text-white">Età</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Salvataggio..." : "Salva Modifiche"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
