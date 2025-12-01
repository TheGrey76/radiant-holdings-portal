import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

interface EditableFunnelStageProps {
  stages: FunnelStage[];
  onUpdate: (stages: FunnelStage[]) => void;
}

export function EditableFunnelStage({ stages, onUpdate }: EditableFunnelStageProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FunnelStage | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...stages[index] });
    setIsAddingNew(false);
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditForm({
      stage: "New Stage",
      count: 0,
      percentage: 0,
    });
    setIsAddingNew(true);
    setShowDialog(true);
  };

  const handleDelete = (index: number) => {
    const newStages = stages.filter((_, i) => i !== index);
    onUpdate(newStages);
    toast.success("Stage removed from funnel");
  };

  const handleSave = () => {
    if (!editForm) return;

    let newStages = [...stages];
    
    if (isAddingNew) {
      newStages.push(editForm);
      toast.success("New stage added to funnel");
    } else if (editingIndex !== null) {
      newStages[editingIndex] = editForm;
      toast.success("Funnel stage updated");
    }

    onUpdate(newStages);
    setShowDialog(false);
    setEditForm(null);
    setEditingIndex(null);
  };

  return (
    <>
      <div className="space-y-3">
        {stages.map((stage, idx) => (
          <div key={idx} className="space-y-1 group">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 flex-1">
                <span className="font-medium text-foreground">
                  {stage.count} {stage.stage}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary font-semibold">{stage.percentage}%</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleEdit(idx)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(idx)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <Progress value={stage.percentage} className="h-2" />
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4"
          onClick={handleAdd}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Funnel Stage
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isAddingNew ? "Add Funnel Stage" : "Edit Funnel Stage"}
            </DialogTitle>
            <DialogDescription>
              Customize the funnel stage name, count, and percentage.
            </DialogDescription>
          </DialogHeader>

          {editForm && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stage-name">Stage Name</Label>
                <Input
                  id="stage-name"
                  value={editForm.stage}
                  onChange={(e) =>
                    setEditForm({ ...editForm, stage: e.target.value })
                  }
                  placeholder="e.g., Contacted, Interested, Meeting"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage-count">Count</Label>
                <Input
                  id="stage-count"
                  type="number"
                  value={editForm.count}
                  onChange={(e) =>
                    setEditForm({ ...editForm, count: parseInt(e.target.value) || 0 })
                  }
                  placeholder="Number of investors at this stage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage-percentage">Percentage (%)</Label>
                <Input
                  id="stage-percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.percentage}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      percentage: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                    })
                  }
                  placeholder="0-100"
                />
                <Progress value={editForm.percentage} className="h-2 mt-2" />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isAddingNew ? "Add Stage" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
