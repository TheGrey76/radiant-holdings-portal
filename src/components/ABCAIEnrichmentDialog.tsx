import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import ABCAIEnrichment from './ABCAIEnrichment';

interface ABCAIEnrichmentDialogProps {
  onDataUpdated?: () => void;
}

export const ABCAIEnrichmentDialog: React.FC<ABCAIEnrichmentDialogProps> = ({ onDataUpdated }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Enrichment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Data Enrichment
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[calc(85vh-100px)]">
          <ABCAIEnrichment onDataUpdated={onDataUpdated} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ABCAIEnrichmentDialog;
