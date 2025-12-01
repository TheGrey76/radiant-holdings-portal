import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, LucideIcon } from "lucide-react";
import { toast } from "sonner";

interface KPIData {
  current: number;
  target: number;
  percentage: number;
}

interface EditableKPIProps {
  title: string;
  data: KPIData;
  icon: LucideIcon;
  onUpdate: (data: KPIData) => void;
  formatter?: (value: number) => string;
}

export function EditableKPI({ title, data, icon: Icon, onUpdate, formatter }: EditableKPIProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [editForm, setEditForm] = useState<KPIData>(data);

  const formatValue = formatter || ((val: number) => val.toString());

  const handleEdit = () => {
    setEditForm({ ...data });
    setShowDialog(true);
  };

  const handleSave = () => {
    const percentage = Math.round((editForm.current / editForm.target) * 100);
    const updatedData = { ...editForm, percentage };
    onUpdate(updatedData);
    setShowDialog(false);
    toast.success(`${title} updated`);
  };

  return (
    <>
      <Card className="relative group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">{title.toUpperCase()}</div>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {formatValue(data.current)}/{formatValue(data.target)}
          </div>
          <p className="text-sm text-primary font-semibold">{data.percentage}%</p>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {title}</DialogTitle>
            <DialogDescription>
              Customize the current value and target for {title.toLowerCase()}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-value">Current Value</Label>
              <Input
                id="current-value"
                type="number"
                value={editForm.current}
                onChange={(e) =>
                  setEditForm({ ...editForm, current: parseInt(e.target.value) || 0 })
                }
                placeholder="Current number achieved"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-value">Target Value</Label>
              <Input
                id="target-value"
                type="number"
                value={editForm.target}
                onChange={(e) =>
                  setEditForm({ ...editForm, target: parseInt(e.target.value) || 0 })
                }
                placeholder="Target to reach"
              />
            </div>

            <div className="pt-2 space-y-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-semibold">
                  {Math.round((editForm.current / editForm.target) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
