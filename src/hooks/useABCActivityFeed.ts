import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityItem {
  id: string;
  type: 'note' | 'followup' | 'activity' | 'document' | 'status_change' | 'approval_change' | 'investor_added';
  investorName: string;
  description: string;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export const useABCActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllActivities = useCallback(async () => {
    try {
      const [notes, followups, activitiesData, documents] = await Promise.all([
        supabase.from('abc_investor_notes').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('abc_investor_followups').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('abc_investor_activities').select('*').order('activity_date', { ascending: false }).limit(20),
        supabase.from('abc_investor_documents').select('*').order('uploaded_at', { ascending: false }).limit(20),
      ]);

      const allActivities: ActivityItem[] = [
        ...(notes.data || []).map(note => ({
          id: note.id,
          type: 'note' as const,
          investorName: note.investor_name,
          description: note.note_text,
          createdBy: note.created_by,
          createdAt: note.created_at,
        })),
        ...(followups.data || []).map(followup => ({
          id: followup.id,
          type: 'followup' as const,
          investorName: followup.investor_name,
          description: `${followup.follow_up_type}: ${followup.description || 'No description'}`,
          createdBy: followup.created_by,
          createdAt: followup.created_at,
          metadata: { status: followup.status, date: followup.follow_up_date },
        })),
        ...(activitiesData.data || []).map(activity => ({
          id: activity.id,
          type: 'activity' as const,
          investorName: activity.investor_name,
          description: `${activity.activity_type}: ${activity.activity_description}`,
          createdBy: activity.created_by,
          createdAt: activity.activity_date,
        })),
        ...(documents.data || []).map(doc => ({
          id: doc.id,
          type: 'document' as const,
          investorName: doc.investor_name,
          description: `Uploaded ${doc.document_type}: ${doc.document_name}`,
          createdBy: doc.uploaded_by,
          createdAt: doc.uploaded_at,
        })),
      ];

      allActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setActivities(allActivities.slice(0, 50));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllActivities();

    // Subscribe to real-time changes for notes
    const notesChannel = supabase
      .channel('abc-notes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'abc_investor_notes' }, (payload) => {
        if (payload.eventType === 'INSERT' && payload.new) {
          const newActivity: ActivityItem = {
            id: payload.new.id,
            type: 'note',
            investorName: payload.new.investor_name,
            description: payload.new.note_text,
            createdBy: payload.new.created_by,
            createdAt: payload.new.created_at,
          };
          setActivities(prev => [newActivity, ...prev].slice(0, 50));
        }
      })
      .subscribe();

    // Subscribe to real-time changes for followups
    const followupsChannel = supabase
      .channel('abc-followups-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'abc_investor_followups' }, (payload) => {
        if (payload.eventType === 'INSERT' && payload.new) {
          const newActivity: ActivityItem = {
            id: payload.new.id,
            type: 'followup',
            investorName: payload.new.investor_name,
            description: `${payload.new.follow_up_type}: ${payload.new.description || 'No description'}`,
            createdBy: payload.new.created_by,
            createdAt: payload.new.created_at,
            metadata: { status: payload.new.status, date: payload.new.follow_up_date },
          };
          setActivities(prev => [newActivity, ...prev].slice(0, 50));
        }
      })
      .subscribe();

    // Subscribe to real-time changes for activities
    const activitiesChannel = supabase
      .channel('abc-activities-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'abc_investor_activities' }, (payload) => {
        if (payload.eventType === 'INSERT' && payload.new) {
          const newActivity: ActivityItem = {
            id: payload.new.id,
            type: 'activity',
            investorName: payload.new.investor_name,
            description: `${payload.new.activity_type}: ${payload.new.activity_description}`,
            createdBy: payload.new.created_by,
            createdAt: payload.new.activity_date,
          };
          setActivities(prev => [newActivity, ...prev].slice(0, 50));
        }
      })
      .subscribe();

    // Subscribe to real-time changes for documents
    const documentsChannel = supabase
      .channel('abc-documents-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'abc_investor_documents' }, (payload) => {
        if (payload.eventType === 'INSERT' && payload.new) {
          const newActivity: ActivityItem = {
            id: payload.new.id,
            type: 'document',
            investorName: payload.new.investor_name,
            description: `Uploaded ${payload.new.document_type}: ${payload.new.document_name}`,
            createdBy: payload.new.uploaded_by,
            createdAt: payload.new.uploaded_at,
          };
          setActivities(prev => [newActivity, ...prev].slice(0, 50));
        }
      })
      .subscribe();

    // Subscribe to real-time changes for investors (status changes, approval changes)
    const investorsChannel = supabase
      .channel('abc-investors-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'abc_investors' }, (payload) => {
        const oldData = payload.old as any;
        const newData = payload.new as any;
        
        // Track status changes (Kanban movement)
        if (oldData?.status !== newData?.status) {
          const statusActivity: ActivityItem = {
            id: `status-${newData.id}-${Date.now()}`,
            type: 'status_change',
            investorName: newData.nome,
            description: `Status changed: ${oldData?.status || 'Unknown'} → ${newData.status}`,
            createdBy: newData.relationship_owner || 'System',
            createdAt: newData.updated_at,
            metadata: { oldStatus: oldData?.status, newStatus: newData.status },
          };
          setActivities(prev => [statusActivity, ...prev].slice(0, 50));
        }
        
        // Track approval status changes
        if (oldData?.approval_status !== newData?.approval_status) {
          const approvalActivity: ActivityItem = {
            id: `approval-${newData.id}-${Date.now()}`,
            type: 'approval_change',
            investorName: newData.nome,
            description: `Approval status: ${oldData?.approval_status || 'Unknown'} → ${newData.approval_status}`,
            createdBy: newData.relationship_owner || 'System',
            createdAt: newData.updated_at,
            metadata: { oldApproval: oldData?.approval_status, newApproval: newData.approval_status },
          };
          setActivities(prev => [approvalActivity, ...prev].slice(0, 50));
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'abc_investors' }, (payload) => {
        const newData = payload.new as any;
        const newActivity: ActivityItem = {
          id: `investor-${newData.id}-${Date.now()}`,
          type: 'investor_added',
          investorName: newData.nome,
          description: `New investor added: ${newData.azienda} (${newData.categoria})`,
          createdBy: newData.relationship_owner || 'System',
          createdAt: newData.created_at,
        };
        setActivities(prev => [newActivity, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(notesChannel);
      supabase.removeChannel(followupsChannel);
      supabase.removeChannel(activitiesChannel);
      supabase.removeChannel(documentsChannel);
      supabase.removeChannel(investorsChannel);
    };
  }, [fetchAllActivities]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchAllActivities();
  }, [fetchAllActivities]);

  return { activities, loading, refetch };
};
