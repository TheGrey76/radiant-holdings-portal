import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, TrendingUp, TrendingDown, DollarSign, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface Commitment {
  id: string;
  investor_id: string | null;
  investor_name: string;
  commitment_type: string;
  amount: number;
  currency: string;
  commitment_date: string;
  expected_closing_date: string | null;
  notes: string | null;
  status: string;
  created_by: string;
  created_at: string;
}

interface Investor {
  id: string;
  nome: string;
  azienda: string;
}

interface ABCCommitmentTrackerProps {
  investors: Investor[];
}

export function ABCCommitmentTracker({ investors }: ABCCommitmentTrackerProps) {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCommitment, setEditingCommitment] = useState<Commitment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    investor_id: "",
    investor_name: "",
    commitment_type: "soft",
    amount: "",
    currency: "EUR",
    commitment_date: format(new Date(), "yyyy-MM-dd"),
    expected_closing_date: "",
    notes: "",
  });

  useEffect(() => {
    fetchCommitments();
    
    // Setup realtime subscription
    const channel = supabase
      .channel('commitments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'abc_investor_commitments' },
        () => fetchCommitments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCommitments = async () => {
    const { data, error } = await supabase
      .from('abc_investor_commitments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching commitments:', error);
      return;
    }

    setCommitments(data || []);
  };

  const handleSubmit = async () => {
    if (!form.investor_name || !form.amount) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const commitmentData = {
      investor_id: form.investor_id || null,
      investor_name: form.investor_name,
      commitment_type: form.commitment_type,
      amount: parseFloat(form.amount),
      currency: form.currency,
      commitment_date: form.commitment_date,
      expected_closing_date: form.expected_closing_date || null,
      notes: form.notes || null,
      created_by: sessionStorage.getItem('abc_authorized_email') || 'Unknown',
    };

    try {
      if (editingCommitment) {
        const { error } = await supabase
          .from('abc_investor_commitments')
          .update(commitmentData)
          .eq('id', editingCommitment.id);

        if (error) throw error;
        toast({ title: "Commitment aggiornato" });
      } else {
        const { error } = await supabase
          .from('abc_investor_commitments')
          .insert(commitmentData);

        if (error) throw error;
        toast({ title: "Commitment registrato" });
      }

      resetForm();
      setShowAddDialog(false);
      setEditingCommitment(null);
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('abc_investor_commitments')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Commitment eliminato" });
  };

  const handleConvert = async (commitment: Commitment) => {
    const newType = commitment.commitment_type === 'soft' ? 'hard' : 'soft';
    const { error } = await supabase
      .from('abc_investor_commitments')
      .update({ commitment_type: newType })
      .eq('id', commitment.id);

    if (error) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: `Convertito in ${newType} commitment` });
  };

  const handleEdit = (commitment: Commitment) => {
    setEditingCommitment(commitment);
    setForm({
      investor_id: commitment.investor_id || "",
      investor_name: commitment.investor_name,
      commitment_type: commitment.commitment_type,
      amount: commitment.amount.toString(),
      currency: commitment.currency,
      commitment_date: commitment.commitment_date,
      expected_closing_date: commitment.expected_closing_date || "",
      notes: commitment.notes || "",
    });
    setShowAddDialog(true);
  };

  const resetForm = () => {
    setForm({
      investor_id: "",
      investor_name: "",
      commitment_type: "soft",
      amount: "",
      currency: "EUR",
      commitment_date: format(new Date(), "yyyy-MM-dd"),
      expected_closing_date: "",
      notes: "",
    });
  };

  const handleInvestorSelect = (investorId: string) => {
    const investor = investors.find(i => i.id === investorId);
    if (investor) {
      setForm(prev => ({
        ...prev,
        investor_id: investorId,
        investor_name: `${investor.nome} - ${investor.azienda}`,
      }));
    }
  };

  const softCommitments = commitments.filter(c => c.commitment_type === 'soft' && c.status === 'active');
  const hardCommitments = commitments.filter(c => c.commitment_type === 'hard' && c.status === 'active');
  
  const totalSoft = softCommitments.reduce((sum, c) => sum + Number(c.amount), 0);
  const totalHard = hardCommitments.reduce((sum, c) => sum + Number(c.amount), 0);
  const conversionRate = totalSoft > 0 ? ((totalHard / (totalSoft + totalHard)) * 100).toFixed(1) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Soft Commitments</p>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalSoft)}</p>
                <p className="text-xs text-muted-foreground">{softCommitments.length} investitori</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hard Commitments</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalHard)}</p>
                <p className="text-xs text-muted-foreground">{hardCommitments.length} investitori</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Totale Pipeline</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalSoft + totalHard)}</p>
                <p className="text-xs text-muted-foreground">{commitments.length} totali</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">{conversionRate}%</p>
                <p className="text-xs text-muted-foreground">soft → hard</p>
              </div>
              <TrendingDown className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Commitment Button */}
      <div className="flex justify-end">
        <Dialog open={showAddDialog} onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) {
            setEditingCommitment(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Registra Commitment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCommitment ? 'Modifica Commitment' : 'Nuovo Commitment'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Investitore</Label>
                <Select value={form.investor_id} onValueChange={handleInvestorSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona investitore" />
                  </SelectTrigger>
                  <SelectContent>
                    {investors.map(inv => (
                      <SelectItem key={inv.id} value={inv.id}>
                        {inv.nome} - {inv.azienda}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <Select value={form.commitment_type} onValueChange={(v) => setForm(prev => ({ ...prev, commitment_type: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soft">Soft Commitment</SelectItem>
                      <SelectItem value="hard">Hard Commitment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Importo (€)</Label>
                  <Input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="100000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data Commitment</Label>
                  <Input
                    type="date"
                    value={form.commitment_date}
                    onChange={(e) => setForm(prev => ({ ...prev, commitment_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Data Closing Prevista</Label>
                  <Input
                    type="date"
                    value={form.expected_closing_date}
                    onChange={(e) => setForm(prev => ({ ...prev, expected_closing_date: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Note</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Note aggiuntive..."
                  rows={3}
                />
              </div>

              <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
                {isLoading ? 'Salvando...' : (editingCommitment ? 'Aggiorna' : 'Registra')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Commitments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soft Commitments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-amber-600">
              <TrendingUp className="h-5 w-5 mr-2" />
              Soft Commitments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {softCommitments.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">Nessun soft commitment</p>
            ) : (
              softCommitments.map(commitment => (
                <div key={commitment.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{commitment.investor_name}</p>
                    <p className="text-lg font-bold text-amber-600">{formatCurrency(commitment.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(commitment.commitment_date), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleConvert(commitment)}
                      title="Converti in Hard"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleEdit(commitment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleDelete(commitment.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Hard Commitments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              Hard Commitments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {hardCommitments.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">Nessun hard commitment</p>
            ) : (
              hardCommitments.map(commitment => (
                <div key={commitment.id} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{commitment.investor_name}</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(commitment.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(commitment.commitment_date), 'dd/MM/yyyy')}
                      {commitment.expected_closing_date && (
                        <> · Closing: {format(new Date(commitment.expected_closing_date), 'dd/MM/yyyy')}</>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleConvert(commitment)}
                      title="Converti in Soft"
                    >
                      <XCircle className="h-4 w-4 text-amber-500" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleEdit(commitment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleDelete(commitment.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
