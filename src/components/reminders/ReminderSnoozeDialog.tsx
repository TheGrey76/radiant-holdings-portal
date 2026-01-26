import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface ReminderSnoozeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investorName: string;
  onSnooze: (days: number) => void;
}

const SNOOZE_OPTIONS = [
  { value: 7, label: "7 giorni" },
  { value: 14, label: "14 giorni" },
  { value: 30, label: "30 giorni" },
];

export const ReminderSnoozeDialog = ({
  open,
  onOpenChange,
  investorName,
  onSnooze,
}: ReminderSnoozeDialogProps) => {
  const [selectedDays, setSelectedDays] = useState<number>(7);

  const handleConfirm = () => {
    onSnooze(selectedDays);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Posticipa Reminder
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Posticipa il reminder per <strong>{investorName}</strong>
          </p>
          
          <RadioGroup 
            value={String(selectedDays)} 
            onValueChange={(v) => setSelectedDays(Number(v))}
            className="space-y-3"
          >
            {SNOOZE_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem value={String(option.value)} id={`snooze-${option.value}`} />
                <Label htmlFor={`snooze-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={handleConfirm}>
            Posticipa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
