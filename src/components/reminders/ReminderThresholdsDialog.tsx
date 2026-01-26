import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";

export interface ReminderThresholds {
  hotProspect: number;      // engagement >= 50
  standard: number;         // default
  toContact: number;        // never contacted
  postMeeting: number;      // after meeting scheduled
}

const DEFAULT_THRESHOLDS: ReminderThresholds = {
  hotProspect: 5,
  standard: 7,
  toContact: 3,
  postMeeting: 2,
};

interface ReminderThresholdsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (thresholds: ReminderThresholds) => void;
}

export const ReminderThresholdsDialog = ({
  open,
  onOpenChange,
  onSave,
}: ReminderThresholdsDialogProps) => {
  const [thresholds, setThresholds] = useState<ReminderThresholds>(DEFAULT_THRESHOLDS);

  useEffect(() => {
    const saved = localStorage.getItem('abc_reminder_thresholds');
    if (saved) {
      try {
        setThresholds(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing thresholds:', e);
      }
    }
  }, [open]);

  const handleSave = () => {
    localStorage.setItem('abc_reminder_thresholds', JSON.stringify(thresholds));
    onSave(thresholds);
    toast.success("Soglie aggiornate");
    onOpenChange(false);
  };

  const handleReset = () => {
    setThresholds(DEFAULT_THRESHOLDS);
    localStorage.removeItem('abc_reminder_thresholds');
    toast.success("Soglie ripristinate ai valori predefiniti");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configura Soglie Reminder
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Imposta i giorni di inattività dopo i quali viene generato un reminder.
          </p>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="hotProspect" className="text-sm">
                Hot Prospect (engagement ≥50)
              </Label>
              <Input
                id="hotProspect"
                type="number"
                min={1}
                max={30}
                value={thresholds.hotProspect}
                onChange={(e) => setThresholds(prev => ({ ...prev, hotProspect: Number(e.target.value) }))}
                className="w-24"
              />
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="standard" className="text-sm">
                Contatti standard
              </Label>
              <Input
                id="standard"
                type="number"
                min={1}
                max={30}
                value={thresholds.standard}
                onChange={(e) => setThresholds(prev => ({ ...prev, standard: Number(e.target.value) }))}
                className="w-24"
              />
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="toContact" className="text-sm">
                Mai contattati (To Contact)
              </Label>
              <Input
                id="toContact"
                type="number"
                min={1}
                max={30}
                value={thresholds.toContact}
                onChange={(e) => setThresholds(prev => ({ ...prev, toContact: Number(e.target.value) }))}
                className="w-24"
              />
            </div>
            
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="postMeeting" className="text-sm">
                Post meeting schedulato
              </Label>
              <Input
                id="postMeeting"
                type="number"
                min={1}
                max={30}
                value={thresholds.postMeeting}
                onChange={(e) => setThresholds(prev => ({ ...prev, postMeeting: Number(e.target.value) }))}
                className="w-24"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="ghost" onClick={handleReset} className="mr-auto">
            Ripristina default
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Salva
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const getStoredThresholds = (): ReminderThresholds => {
  const saved = localStorage.getItem('abc_reminder_thresholds');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing thresholds:', e);
    }
  }
  return DEFAULT_THRESHOLDS;
};
