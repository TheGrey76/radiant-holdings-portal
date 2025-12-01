import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { toast } from "sonner";

interface ProgressData {
  targetAmount: number;
  raisedAmount: number;
  deadline: string;
}

interface EditableOverallProgressProps {
  data: ProgressData;
  onUpdate: (data: ProgressData) => void;
}

export function EditableOverallProgress({ data, onUpdate }: EditableOverallProgressProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [editForm, setEditForm] = useState<ProgressData>(data);

  const progressPercentage = Math.round((data.raisedAmount / data.targetAmount) * 100);
  const daysRemaining = Math.ceil(
    (new Date(data.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleEdit = () => {
    setEditForm({ ...data });
    setShowDialog(true);
  };

  const handleSave = () => {
    onUpdate(editForm);
    setShowDialog(false);
    toast.success("Overall progress updated");
  };

  const handleReset = () => {
    const defaultData: ProgressData = {
      targetAmount: 10000000,
      raisedAmount: 0,
      deadline: "2026-06-30",
    };
    onUpdate(defaultData);
    toast.success("Progress reset to default");
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {daysRemaining} days remaining until {new Date(data.deadline).toLocaleDateString()}
            </p>
            <p className="text-lg font-semibold text-foreground">
              €{(data.raisedAmount / 1000000).toFixed(1)}M / €{(data.targetAmount / 1000000).toFixed(1)}M raised
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <Progress value={progressPercentage} className="h-3" />
        <p className="text-sm text-muted-foreground text-right">
          {progressPercentage}% complete
        </p>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Overall Progress</DialogTitle>
            <DialogDescription>
              Customize the fundraising target, raised amount, and deadline.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target-amount">Target Amount (€)</Label>
              <Input
                id="target-amount"
                type="number"
                value={editForm.targetAmount}
                onChange={(e) =>
                  setEditForm({ ...editForm, targetAmount: parseFloat(e.target.value) || 0 })
                }
                placeholder="e.g., 10000000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="raised-amount">Amount Raised (€)</Label>
              <Input
                id="raised-amount"
                type="number"
                value={editForm.raisedAmount}
                onChange={(e) =>
                  setEditForm({ ...editForm, raisedAmount: parseFloat(e.target.value) || 0 })
                }
                placeholder="e.g., 3500000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={editForm.deadline}
                onChange={(e) =>
                  setEditForm({ ...editForm, deadline: e.target.value })
                }
              />
            </div>

            <div className="pt-2 space-y-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-semibold">
                  {Math.round((editForm.raisedAmount / editForm.targetAmount) * 100)}%
                </span>
              </div>
              <Progress 
                value={Math.round((editForm.raisedAmount / editForm.targetAmount) * 100)} 
                className="h-2"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
              Reset to Default
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1 sm:flex-initial">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 sm:flex-initial">
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
