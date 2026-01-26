import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, CalendarPlus } from "lucide-react";
import { format, addDays } from "date-fns";
import { it } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Reminder {
  investorId: string;
  investorName: string;
  company: string;
}

interface BulkFollowUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminders: Reminder[];
  userEmail: string;
  onSuccess: () => void;
}

const FOLLOW_UP_TYPES = [
  { value: "call", label: "Chiamata" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "linkedin", label: "LinkedIn" },
];

const DATE_OPTIONS = [
  { value: 1, label: "Domani" },
  { value: 3, label: "Fra 3 giorni" },
  { value: 7, label: "Fra 1 settimana" },
  { value: 14, label: "Fra 2 settimane" },
];

export const BulkFollowUpDialog = ({
  open,
  onOpenChange,
  reminders,
  userEmail,
  onSuccess,
}: BulkFollowUpDialogProps) => {
  const [followUpType, setFollowUpType] = useState("call");
  const [daysOffset, setDaysOffset] = useState(3);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetDate = addDays(new Date(), daysOffset);

  const handleCreate = async () => {
    if (reminders.length === 0) return;

    setIsSubmitting(true);
    try {
      const followUps = reminders.map(reminder => ({
        investor_name: `${reminder.investorName} - ${reminder.company}`,
        follow_up_type: followUpType,
        follow_up_date: format(targetDate, 'yyyy-MM-dd'),
        description: description || `Follow-up programmato da reminder automatico`,
        created_by: userEmail,
        status: 'scheduled',
      }));

      const { error } = await supabase
        .from('abc_investor_followups')
        .insert(followUps);

      if (error) throw error;

      toast.success(`${reminders.length} follow-up creati per ${format(targetDate, 'd MMMM', { locale: it })}`);
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFollowUpType("call");
      setDaysOffset(3);
      setDescription("");
    } catch (error) {
      console.error('Error creating bulk follow-ups:', error);
      toast.error("Errore nella creazione dei follow-up");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-primary" />
            Crea Follow-up Multipli
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">
              {reminders.length} contatti selezionati
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {reminders.slice(0, 3).map(r => r.investorName).join(", ")}
              {reminders.length > 3 && ` e altri ${reminders.length - 3}...`}
            </p>
          </div>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Tipo di follow-up</Label>
              <Select value={followUpType} onValueChange={setFollowUpType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FOLLOW_UP_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Quando</Label>
              <Select value={String(daysOffset)} onValueChange={(v) => setDaysOffset(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(targetDate, 'EEEE d MMMM yyyy', { locale: it })}
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label>Nota (opzionale)</Label>
              <Textarea
                placeholder="Descrizione del follow-up..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={handleCreate} disabled={isSubmitting}>
            {isSubmitting ? "Creazione..." : `Crea ${reminders.length} Follow-up`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
