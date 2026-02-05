import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, Euro, Linkedin, Pencil, Trash2, CheckCircle, Clock, XCircle, ChevronDown, X, Filter, Eye, Plus, Sparkles, Mail, Send, UserCheck, UserX, UserMinus, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { EditABCInvestorDialog } from './EditABCInvestorDialog';
import { AddABCInvestorDialog } from './AddABCInvestorDialog';

type ApprovalStatus = 'pending' | 'approved' | 'not_approved';
type LinkedInConnectionStatus = 'unknown' | 'connected' | 'not_connected' | 'pending_request';

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
  linkedinConnectionStatus?: LinkedInConnectionStatus;
}

interface ABCInvestorKanbanProps {
  investors: Investor[];
  onStatusChange: () => void;
  initialEditInvestorId?: string | null;
  onEditDialogClosed?: () => void;
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

const linkedinConnectionConfig: Record<LinkedInConnectionStatus, { label: string; icon: typeof UserCheck; className: string }> = {
  unknown: { label: 'Unknown', icon: UserMinus, className: 'bg-slate-100 text-slate-600' },
  connected: { label: 'Connected', icon: UserCheck, className: 'bg-green-100 text-green-700' },
  not_connected: { label: 'Not Connected', icon: UserX, className: 'bg-amber-100 text-amber-700' },
  pending_request: { label: 'Pending Request', icon: Clock, className: 'bg-blue-100 text-blue-700' },
};

export const ABCInvestorKanban = ({ investors, onStatusChange, initialEditInvestorId, onEditDialogClosed }: ABCInvestorKanbanProps) => {
  const navigate = useNavigate();
  const [localInvestors, setLocalInvestors] = useState(investors);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [investorToDelete, setInvestorToDelete] = useState<Investor | null>(null);
  const [selectedInvestors, setSelectedInvestors] = useState<Set<string>>(new Set());
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [approvalFilter, setApprovalFilter] = useState<'all' | ApprovalStatus>('all');
  const [enrichedFilter, setEnrichedFilter] = useState<'all' | 'enriched' | 'missing'>('all');
  const [connectionFilter, setConnectionFilter] = useState<'all' | LinkedInConnectionStatus>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSendingToProsp, setIsSendingToProsp] = useState(false);

  const handleViewProfile = (e: React.MouseEvent, investorId: string) => {
    e.stopPropagation();
    navigate(`/abc-company-console/investor/${investorId}`);
  };

  // Auto-open edit dialog when initialEditInvestorId is provided
  useEffect(() => {
    if (initialEditInvestorId) {
      const investor = localInvestors.find(inv => inv.id === initialEditInvestorId);
      if (investor) {
        setEditingInvestor(investor);
        setEditDialogOpen(true);
      }
    }
  }, [initialEditInvestorId, localInvestors]);

  // Handle dialog close and notify parent
  const handleEditDialogClose = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open && onEditDialogClosed) {
      onEditDialogClosed();
    }
  };

  // Helper to check if investor has enriched data
  const isEnriched = (inv: Investor) => {
    const hasEmail = inv.email && inv.email.trim() !== '' && inv.email.trim().toLowerCase() !== 'null';
    const hasLinkedin = inv.linkedin && inv.linkedin.trim() !== '' && inv.linkedin.trim().toLowerCase() !== 'null';
    return hasEmail || hasLinkedin;
  };

  // Filter investors by approval status, enrichment, and connection status
  const filteredInvestors = localInvestors
    .filter(inv => approvalFilter === 'all' || (inv.approvalStatus || 'pending') === approvalFilter)
    .filter(inv => {
      if (enrichedFilter === 'all') return true;
      if (enrichedFilter === 'enriched') return isEnriched(inv);
      if (enrichedFilter === 'missing') return !isEnriched(inv);
      return true;
    })
    .filter(inv => {
      if (connectionFilter === 'all') return true;
      return (inv.linkedinConnectionStatus || 'unknown') === connectionFilter;
    });

  // Pagination logic
  const totalInvestors = filteredInvestors.length;
  const totalPages = Math.ceil(totalInvestors / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvestors = filteredInvestors.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [approvalFilter, enrichedFilter, connectionFilter, itemsPerPage]);

  const getInvestorsByStatus = (status: string) => {
    return paginatedInvestors.filter(inv => inv.status === status);
  };

  const isWorkable = (investor: Investor) => {
    return investor.approvalStatus !== 'not_approved';
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceStatus = result.source.droppableId;
    const destStatus = result.destination.droppableId;

    if (sourceStatus === destStatus) return;

    const draggedInvestorId = result.draggableId;
    const draggedInvestor = localInvestors.find(inv => inv.id === draggedInvestorId);

    if (!draggedInvestor) return;

    // Determine which investors to move - if dragged investor is in selection, move all selected
    // Otherwise, move just the dragged investor
    const isPartOfSelection = selectedInvestors.has(draggedInvestorId);
    const investorIdsToMove = isPartOfSelection 
      ? Array.from(selectedInvestors) 
      : [draggedInvestorId];

    // Filter out not_approved investors from the move
    const investorsToMove = localInvestors.filter(inv => 
      investorIdsToMove.includes(inv.id) && inv.approvalStatus !== 'not_approved'
    );

    if (investorsToMove.length === 0) {
      toast.error("Investitori non approvati non possono essere spostati");
      return;
    }

    const blockedCount = investorIdsToMove.length - investorsToMove.length;
    const idsToMove = investorsToMove.map(inv => inv.id);

    // Optimistic update
    const updatedInvestors = localInvestors.map(inv =>
      idsToMove.includes(inv.id) ? { ...inv, status: destStatus } : inv
    );
    setLocalInvestors(updatedInvestors);

    // Clear selection after multi-drag
    if (isPartOfSelection) {
      clearSelection();
    }

    try {
      const { error } = await supabase
        .from('abc_investors' as any)
        .update({ 
          status: destStatus,
          last_contact_date: new Date().toISOString()
        })
        .in('id', idsToMove);

      if (error) throw error;

      // Log status change activities for Pipeline Velocity tracking
      const currentUserEmail = sessionStorage.getItem('abc_authorized_email') || 'Admin';
      const activityInserts = investorsToMove.map(inv => ({
        investor_name: `${inv.nome} - ${inv.azienda}`,
        activity_type: 'status_change',
        activity_description: `Status: ${inv.status} → ${destStatus}`,
        created_by: currentUserEmail,
        activity_date: new Date().toISOString()
      }));

      await supabase
        .from('abc_investor_activities')
        .insert(activityInserts);

      if (investorsToMove.length === 1) {
        toast.success(`${investorsToMove[0].nome} spostato in ${destStatus}`);
      } else {
        toast.success(`${investorsToMove.length} investitori spostati in ${destStatus}${blockedCount > 0 ? ` (${blockedCount} non approvati esclusi)` : ''}`);
      }
      onStatusChange();
    } catch (error) {
      console.error('Error updating investor status:', error);
      toast.error('Errore durante lo spostamento');
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
    
    const previousStatus = investor.approvalStatus;
    
    // Optimistic update - instant visual feedback
    setLocalInvestors(prev => prev.map(inv => 
      inv.id === investor.id ? { ...inv, approvalStatus: newStatus } : inv
    ));

    const statusLabels: Record<ApprovalStatus, string> = {
      pending: 'in attesa di approvazione',
      approved: 'approvato',
      not_approved: 'non approvato',
    };
    toast.success(`${investor.nome} ${statusLabels[newStatus]}`);

    try {
      const { error } = await supabase
        .from('abc_investors' as any)
        .update({ approval_status: newStatus })
        .eq('id', investor.id);

      if (error) throw error;

      // Only trigger parent refresh for KPI updates, not for visual state
      onStatusChange();
    } catch (error) {
      console.error('Error updating approval status:', error);
      toast.error('Errore durante l\'aggiornamento');
      // Rollback on error
      setLocalInvestors(prev => prev.map(inv => 
        inv.id === investor.id ? { ...inv, approvalStatus: previousStatus } : inv
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

  // Bulk selection handlers
  const toggleInvestorSelection = (e: React.MouseEvent, investorId: string) => {
    e.stopPropagation();
    setSelectedInvestors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(investorId)) {
        newSet.delete(investorId);
      } else {
        newSet.add(investorId);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedInvestors(new Set());
  };

  const handleBulkApprovalChange = async (newStatus: ApprovalStatus) => {
    if (selectedInvestors.size === 0) return;
    
    setIsBulkUpdating(true);
    const selectedIds = Array.from(selectedInvestors);
    
    // Optimistic update
    setLocalInvestors(prev => prev.map(inv => 
      selectedIds.includes(inv.id) ? { ...inv, approvalStatus: newStatus } : inv
    ));

    const statusLabels: Record<ApprovalStatus, string> = {
      pending: 'in attesa',
      approved: 'approvati',
      not_approved: 'non approvati',
    };
    toast.success(`${selectedIds.length} investitori ${statusLabels[newStatus]}`);
    clearSelection();

    try {
      const { error } = await supabase
        .from('abc_investors' as any)
        .update({ approval_status: newStatus })
        .in('id', selectedIds);

      if (error) throw error;
      onStatusChange();
    } catch (error) {
      console.error('Error bulk updating approval status:', error);
      toast.error('Errore durante l\'aggiornamento');
      // Refresh to get correct state
      onStatusChange();
    } finally {
      setIsBulkUpdating(false);
    }
  };

  // Bulk connection status change
  const handleBulkConnectionStatusChange = async (newStatus: LinkedInConnectionStatus) => {
    if (selectedInvestors.size === 0) return;
    
    setIsBulkUpdating(true);
    const selectedIds = Array.from(selectedInvestors);
    
    // Optimistic update
    setLocalInvestors(prev => prev.map(inv => 
      selectedIds.includes(inv.id) ? { ...inv, linkedinConnectionStatus: newStatus } : inv
    ));

    const statusLabels: Record<LinkedInConnectionStatus, string> = {
      unknown: 'sconosciuto',
      connected: 'connesso',
      not_connected: 'non connesso',
      pending_request: 'richiesta inviata',
    };
    toast.success(`${selectedIds.length} investitori aggiornati: ${statusLabels[newStatus]}`);
    clearSelection();

    try {
      const { error } = await supabase
        .from('abc_investors' as any)
        .update({ linkedin_connection_status: newStatus })
        .in('id', selectedIds);

      if (error) throw error;
      onStatusChange();
    } catch (error) {
      console.error('Error bulk updating connection status:', error);
      toast.error('Errore durante l\'aggiornamento');
      onStatusChange();
    } finally {
      setIsBulkUpdating(false);
    }
  };

  // Send selected investors to Prosp.ai
  const handleSendToProsp = async () => {
    if (selectedInvestors.size === 0) {
      toast.error('Seleziona almeno un investitore');
      return;
    }

    // Get selected investors with LinkedIn
    const selectedList = Array.from(selectedInvestors)
      .map(id => localInvestors.find(inv => inv.id === id))
      .filter((inv): inv is Investor => !!inv && !!inv.linkedin);

    if (selectedList.length === 0) {
      toast.error('Gli investitori selezionati non hanno profili LinkedIn');
      return;
    }

    // Check if Prosp settings exist in localStorage
    const savedSettings = localStorage.getItem('prosp_settings');
    if (!savedSettings) {
      toast.error('Configura Campaign ID e List ID nelle impostazioni LinkedIn Outreach');
      return;
    }

    const settings = JSON.parse(savedSettings);
    if (!settings.campaignId || !settings.listId) {
      toast.error('Configura Campaign ID e List ID nelle impostazioni LinkedIn Outreach');
      return;
    }

    setIsSendingToProsp(true);
    let success = 0;
    let failed = 0;

    for (const investor of selectedList) {
      try {
        const { error } = await supabase.functions.invoke('prosp-add-lead', {
          body: {
            investorId: investor.id,
            linkedinUrl: investor.linkedin,
            campaignId: settings.campaignId,
            listId: settings.listId,
            investorName: investor.nome,
            investorEmail: investor.email,
            investorCompany: investor.azienda,
          },
        });

        if (error) {
          console.error(`Error sending ${investor.nome}:`, error);
          failed++;
        } else {
          success++;
          // Update connection status to pending_request
          await supabase
            .from('abc_investors' as any)
            .update({ linkedin_connection_status: 'pending_request' })
            .eq('id', investor.id);
        }
      } catch (err) {
        console.error(`Error sending ${investor.nome}:`, err);
        failed++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsSendingToProsp(false);
    clearSelection();
    
    if (success > 0) {
      toast.success(`${success} investitori inviati a Prosp.ai${failed > 0 ? `, ${failed} falliti` : ''}`);
      onStatusChange();
    } else {
      toast.error('Nessun investitore inviato a Prosp.ai');
    }
  };

  useEffect(() => {
    setLocalInvestors(investors);
  }, [investors]);

  return (
    <>
      {/* Filters + Add Button */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          
          {/* Approval Filter */}
          <Select value={approvalFilter} onValueChange={(value) => setApprovalFilter(value as 'all' | ApprovalStatus)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Approvazione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="flex items-center gap-2">Tutti ({localInvestors.length})</span>
              </SelectItem>
              <SelectItem value="pending">
                <span className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  Pending ({localInvestors.filter(i => (i.approvalStatus || 'pending') === 'pending').length})
                </span>
              </SelectItem>
              <SelectItem value="approved">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  Approved ({localInvestors.filter(i => i.approvalStatus === 'approved').length})
                </span>
              </SelectItem>
              <SelectItem value="not_approved">
                <span className="flex items-center gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-600" />
                  Not Approved ({localInvestors.filter(i => i.approvalStatus === 'not_approved').length})
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Enriched Filter */}
          <Select value={enrichedFilter} onValueChange={(value) => setEnrichedFilter(value as 'all' | 'enriched' | 'missing')}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Dati" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="flex items-center gap-2">Tutti i dati</span>
              </SelectItem>
              <SelectItem value="enriched">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Arricchiti ({localInvestors.filter(i => isEnriched(i)).length})
                </span>
              </SelectItem>
              <SelectItem value="missing">
                <span className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-amber-500" />
                  Dati mancanti ({localInvestors.filter(i => !isEnriched(i)).length})
                </span>
              </SelectItem>
            </SelectContent>
          </Select>


          {(approvalFilter !== 'all' || enrichedFilter !== 'all') && (
            <Button variant="ghost" size="sm" onClick={() => { setApprovalFilter('all'); setEnrichedFilter('all'); }}>
              <X className="h-4 w-4 mr-1" /> Rimuovi filtri
            </Button>
          )}
        </div>
        
        <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Aggiungi Investitore
        </Button>
      </div>

      {/* Add Investor Dialog */}
      <AddABCInvestorDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onInvestorAdded={onStatusChange}
      />

      {/* Bulk Actions Toolbar */}
      {selectedInvestors.size > 0 && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="font-semibold">
              {selectedInvestors.size} selezionati
            </Badge>
            <span className="text-sm text-muted-foreground">Azioni bulk:</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkApprovalChange('pending')}
              disabled={isBulkUpdating}
              className="gap-1.5"
            >
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              Pending
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkApprovalChange('approved')}
              disabled={isBulkUpdating}
              className="gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5 text-green-600" />
              Approva
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkApprovalChange('not_approved')}
              disabled={isBulkUpdating}
              className="gap-1.5"
            >
              <XCircle className="h-3.5 w-3.5 text-red-600" />
              Non Approvare
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={clearSelection}
              className="ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

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
                          const isSelected = selectedInvestors.has(investor.id);
                          const multiDragCount = isSelected ? selectedInvestors.size : 0;

                          return (
                            <Draggable
                              key={investor.id}
                              draggableId={investor.id}
                              index={index}
                              isDragDisabled={!workable}
                            >
                              {(provided, snapshot) => (
                                <div className="relative">
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
                                    } ${
                                      isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                                    }`}
                                  >
                                    {/* Multi-drag indicator badge */}
                                    {snapshot.isDragging && multiDragCount > 1 && (
                                      <div className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold shadow-md">
                                        {multiDragCount}
                                      </div>
                                    )}
                                  <CardContent className="p-3 space-y-2">
                                    {/* Selection checkbox and Approval Status */}
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          checked={selectedInvestors.has(investor.id)}
                                          onCheckedChange={() => {}}
                                          onClick={(e) => toggleInvestorSelection(e, investor.id)}
                                          className="h-4 w-4"
                                        />
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
                                      </div>
                                    </div>
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1 min-w-0">
                                        <h4 className={`font-semibold text-sm truncate ${workable ? 'text-foreground' : 'text-muted-foreground'}`}>
                                          {investor.nome}
                                        </h4>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <p className="text-xs text-muted-foreground truncate cursor-default">
                                                {investor.azienda}
                                              </p>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom" className="max-w-[250px]">
                                              <div className="space-y-1">
                                                <p className="font-medium">{investor.azienda}</p>
                                                {investor.ruolo && <p className="text-xs">{investor.ruolo}</p>}
                                                {investor.citta && investor.citta.length < 50 && (
                                                  <p className="text-xs flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {investor.citta}
                                                  </p>
                                                )}
                                              </div>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </div>
                                      <div className="flex items-center gap-0.5 ml-1">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6"
                                          onClick={(e) => handleViewProfile(e, investor.id)}
                                          title="Vedi profilo completo"
                                        >
                                          <Eye className="h-3.5 w-3.5" />
                                        </Button>
                                        {workable && (
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={(e) => handleEditClick(e, investor)}
                                          >
                                            <Pencil className="h-3.5 w-3.5" />
                                          </Button>
                                        )}
                                        {column.id === 'To Contact' && (
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive hover:text-destructive"
                                            onClick={(e) => handleDeleteClick(e, investor)}
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>

                                    {/* Pipeline Value and LinkedIn Connection Status */}
                                    <div className="flex items-center justify-between pt-1">
                                      <div className="flex items-center gap-1">
                                        <Euro className="h-3.5 w-3.5 text-primary" />
                                        <span className={`text-sm font-semibold ${workable ? 'text-primary' : 'text-muted-foreground'}`}>
                                          €{investor.pipelineValue.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                          {investor.categoria}
                                        </Badge>
                                      </div>
                                    </div>
                                  </CardContent>
                                  </Card>
                                </div>
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select 
            value={itemsPerPage.toString()} 
            onValueChange={(value) => setItemsPerPage(parseInt(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">of {totalInvestors}</span>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <EditABCInvestorDialog
        investor={editingInvestor}
        open={editDialogOpen}
        onOpenChange={handleEditDialogClose}
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
