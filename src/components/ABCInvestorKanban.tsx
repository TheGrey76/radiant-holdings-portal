import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Building2, MapPin, Euro, Calendar, Linkedin, Pencil, Trash2, CheckCircle, Clock, XCircle, ChevronDown } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { format } from "date-fns";
import { EditABCInvestorDialog } from './EditABCInvestorDialog';

type ApprovalStatus = 'pending' | 'approved' | 'not_approved';

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
  approvalStatus?: ApprovalStatus;
}

interface ABCInvestorKanbanProps {
  investors: Investor[];
  onStatusChange: () => void;
}

const statusColumns = [
  { id: 'To Contact', label: 'To Contact', color: 'bg-slate-100 border-slate-300' },
  { id: 'Contacted', label: 'Contacted', color: 'bg-blue-50 border-blue-200' },
  { id: 'Interested', label: 'Interested', color: 'bg-purple-50 border-purple-200' },
  { id: 'Meeting Scheduled', label: 'Meeting Scheduled', color: 'bg-amber-50 border-amber-200' },
  { id: 'In Negotiation', label: 'In Negotiation', color: 'bg-orange-50 border-orange-200' },
  { id: 'Closed', label: 'Closed', color: 'bg-green-50 border-green-200' },
  { id: 'Not Interested', label: 'Not Interested', color: 'bg-red-50 border-red-200' },
];

const approvalStatusConfig: Record<ApprovalStatus, { label: string; icon: typeof CheckCircle; className: string }> = {
  pending: { label: 'Pending Approval', icon: Clock, className: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  approved: { label: 'Approved', icon: CheckCircle, className: 'bg-green-500/10 text-green-600 border-green-200' },
  not_approved: { label: 'Not Approved', icon: XCircle, className: 'bg-red-500/10 text-red-600 border-red-200' },
};

export const ABCInvestorKanban = ({ investors, onStatusChange }: ABCInvestorKanbanProps) => {
  const [localInvestors, setLocalInvestors] = useState(investors);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [investorToDelete, setInvestorToDelete] = useState<Investor | null>(null);

  const getInvestorsByStatus = (status: string) => {
    return localInvestors.filter(inv => inv.status === status);
  };

  const isWorkable = (investor: Investor) => {
    return investor.approvalStatus !== 'not_approved';
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceStatus = result.source.droppableId;
    const destStatus = result.destination.droppableId;

    if (sourceStatus === destStatus) return;

    const investorId = result.draggableId;
    const investor = localInvestors.find(inv => inv.id === investorId);

    if (!investor) return;

    // Block drag for not_approved investors
    if (investor.approvalStatus === 'not_approved') {
      toast.error("Investitore non approvato da ABC Company");
      return;
    }

    // Optimistic update
    const updatedInvestors = localInvestors.map(inv =>
      inv.id === investorId ? { ...inv, status: destStatus } : inv
    );
    setLocalInvestors(updatedInvestors);

    try {
      const { error } = await supabase
        .from('abc_investors' as any)
        .update({ status: destStatus })
        .eq('id', investorId);

      if (error) throw error;

      toast.success(`${investor.nome} moved to ${destStatus}`);
      onStatusChange();
    } catch (error) {
      console.error('Error updating investor status:', error);
      toast.error('Failed to update investor status');
      setLocalInvestors(localInvestors);
    }
  };

  const handleEditClick = (e: React.MouseEvent, investor: Investor) => {
    e.stopPropagation();
    setEditingInvestor(investor);
    setEditDialogOpen(true);
  };

  const handleLinkedInClick = (e: React.MouseEvent, linkedin: string) => {
    e.stopPropagation();
    window.open(linkedin, '_blank', 'noopener,noreferrer');
  };

  const handleSaveInvestor = () => {
    onStatusChange();
  };

  const handleChangeApprovalStatus = async (e: React.MouseEvent, investor: Investor, newStatus: ApprovalStatus) => {
    e.stopPropagation();
    
    // Optimistic update
    setLocalInvestors(prev => prev.map(inv => 
      inv.id === investor.id ? { ...inv, approvalStatus: newStatus } : inv
    ));

    try {
      const { error } = await supabase
        .from('abc_investors' as any)
        .update({ approval_status: newStatus })
        .eq('id', investor.id);

      if (error) throw error;

      const statusLabels: Record<ApprovalStatus, string> = {
        pending: 'in attesa di approvazione',
        approved: 'approvato',
        not_approved: 'non approvato',
      };
      toast.success(`${investor.nome} ${statusLabels[newStatus]}`);
      onStatusChange();
    } catch (error) {
      console.error('Error updating approval status:', error);
      toast.error('Errore durante l\'aggiornamento');
      setLocalInvestors(prev => prev.map(inv => 
        inv.id === investor.id ? { ...inv, approvalStatus: investor.approvalStatus } : inv
      ));
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, investor: Investor) => {
    e.stopPropagation();
    setInvestorToDelete(investor);
  };

  const confirmDelete = async () => {
    if (!investorToDelete) return;
    try {
      const { error } = await supabase
        .from('abc_investors' as any)
        .delete()
        .eq('id', investorToDelete.id);
      if (error) throw error;
      
      setLocalInvestors(prev => prev.filter(inv => inv.id !== investorToDelete.id));
      toast.success(`${investorToDelete.nome} eliminato`);
      onStatusChange();
    } catch (error) {
      console.error('Error deleting investor:', error);
      toast.error('Errore durante l\'eliminazione');
    }
    setInvestorToDelete(null);
  };

  useEffect(() => {
    setLocalInvestors(investors);
  }, [investors]);

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
          {statusColumns.map((column) => {
            const columnInvestors = getInvestorsByStatus(column.id);
            
            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className={`rounded-lg border-2 ${column.color} h-full`}>
                  <div className="p-4 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{column.label}</h3>
                      <Badge variant="outline" className="bg-background">
                        {columnInvestors.length}
                      </Badge>
                    </div>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-3 space-y-3 min-h-[500px] transition-colors ${
                          snapshot.isDraggingOver ? 'bg-accent/20' : ''
                        }`}
                      >
                        {columnInvestors.map((investor, index) => {
                          const approvalStatus = investor.approvalStatus || 'pending';
                          const statusConfig = approvalStatusConfig[approvalStatus];
                          const StatusIcon = statusConfig.icon;
                          const workable = isWorkable(investor);

                          return (
                            <Draggable
                              key={investor.id}
                              draggableId={investor.id}
                              index={index}
                              isDragDisabled={!workable}
                            >
                              {(provided, snapshot) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`transition-all ${
                                    workable 
                                      ? 'cursor-grab hover:shadow-md' 
                                      : 'opacity-50 cursor-not-allowed grayscale'
                                  } ${
                                    snapshot.isDragging ? 'shadow-lg ring-2 ring-primary cursor-grabbing' : ''
                                  }`}
                                >
                                  <CardContent className="p-4 space-y-3">
                                    {/* Approval Status Dropdown */}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                                          <Badge className={`${statusConfig.className} text-xs cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1`}>
                                            <StatusIcon className="h-3 w-3" />
                                            {statusConfig.label}
                                            <ChevronDown className="h-3 w-3 ml-1" />
                                          </Badge>
                                        </button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="start">
                                        <DropdownMenuItem onClick={(e) => handleChangeApprovalStatus(e as any, investor, 'pending')}>
                                          <Clock className="h-4 w-4 mr-2 text-amber-600" />
                                          Pending Approval
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => handleChangeApprovalStatus(e as any, investor, 'approved')}>
                                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                          Approved
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => handleChangeApprovalStatus(e as any, investor, 'not_approved')}>
                                          <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                          Not Approved
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>

                                    <div className="flex items-start justify-between">
                                      <div className="flex-1 min-w-0">
                                        <h4 className={`font-semibold mb-1 truncate ${workable ? 'text-foreground' : 'text-muted-foreground'}`}>
                                          {investor.nome}
                                        </h4>
                                        {investor.ruolo && (
                                          <p className="text-xs text-muted-foreground truncate">
                                            {investor.ruolo}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1 ml-2">
                                        {investor.linkedin && (
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-[#0A66C2] hover:text-[#0A66C2]/80"
                                            onClick={(e) => handleLinkedInClick(e, investor.linkedin!)}
                                          >
                                            <Linkedin className="h-4 w-4" />
                                          </Button>
                                        )}
                                        {workable && (
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={(e) => handleEditClick(e, investor)}
                                          >
                                            <Pencil className="h-4 w-4" />
                                          </Button>
                                        )}
                                        {column.id === 'To Contact' && (
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-destructive hover:text-destructive"
                                            onClick={(e) => handleDeleteClick(e, investor)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2 text-sm">
                                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                      <span className="text-muted-foreground line-clamp-2">
                                        {investor.azienda}
                                      </span>
                                    </div>

                                    {investor.citta && (
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>{investor.citta}</span>
                                      </div>
                                    )}

                                    <div className="pt-2 border-t border-border/50 space-y-2">
                                      <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1.5">
                                          <Euro className="h-4 w-4 text-primary" />
                                          <span className={`font-semibold ${workable ? 'text-primary' : 'text-muted-foreground'}`}>
                                            €{investor.pipelineValue.toLocaleString()}
                                          </span>
                                        </div>
                                      </div>

                                      {investor.lastContactDate && (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                          <Calendar className="h-3 w-3" />
                                          <span>
                                            {format(new Date(investor.lastContactDate), 'dd MMM yyyy')}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    <Badge variant="outline" className="text-xs">
                                      {investor.categoria}
                                    </Badge>
                                  </CardContent>
                                </Card>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <EditABCInvestorDialog
        investor={editingInvestor}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveInvestor}
      />

      <AlertDialog open={!!investorToDelete} onOpenChange={(open) => !open && setInvestorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare <strong>{investorToDelete?.nome}</strong> ({investorToDelete?.azienda})?
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
