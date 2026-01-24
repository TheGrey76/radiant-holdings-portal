import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  RefreshCw, 
  Download, 
  Users, 
  CheckCircle, 
  Clock, 
  Search,
  Mail,
  Loader2,
  Trash2,
  Send,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Signup {
  id: string;
  email: string;
  verified: boolean;
  verified_at: string | null;
  source: string;
  created_at: string;
}

export default function BitcoinResearchAdmin() {
  const navigate = useNavigate();
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    // Check if user has admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      toast.error("Accesso non autorizzato");
      navigate("/");
      return;
    }

    setIsAuthorized(true);
    fetchSignups();
  };

  const fetchSignups = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const { data, error } = await supabase
        .from("bitcoin_research_signups")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSignups(data || []);
      if (isRefresh) {
        toast.success("Lista aggiornata");
      }
    } catch (error) {
      console.error("Error fetching signups:", error);
      toast.error("Errore nel caricamento");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("bitcoin_research_signups")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setSignups(prev => prev.filter(s => s.id !== id));
      toast.success(`${email} eliminato`);
    } catch (error) {
      console.error("Error deleting signup:", error);
      toast.error("Errore nell'eliminazione");
    } finally {
      setDeletingId(null);
    }
  };

  const handleResendVerification = async (signup: Signup) => {
    setResendingId(signup.id);
    try {
      const { data, error } = await supabase.functions.invoke("bitcoin-research-signup", {
        body: { email: signup.email, action: "request" }
      });

      if (error) throw error;
      
      if (data?.success) {
        toast.success(`Email di verifica reinviata a ${signup.email}`);
      } else if (data?.alreadyVerified) {
        toast.info("L'utente è già verificato");
        fetchSignups(true);
      } else {
        toast.error(data?.error || "Errore nell'invio");
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      toast.error("Errore nell'invio dell'email");
    } finally {
      setResendingId(null);
    }
  };

  const exportCSV = () => {
    const headers = ["Email", "Verified", "Verified At", "Source", "Created At"];
    const rows = signups.map(s => [
      s.email,
      s.verified ? "Yes" : "No",
      s.verified_at || "",
      s.source,
      s.created_at
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bitcoin-research-signups-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("CSV esportato");
  };

  const filteredSignups = signups.filter(s =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredSignups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSignups = filteredSignups.slice(startIndex, endIndex);

  // Reset to page 1 when search or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  const stats = {
    total: signups.length,
    verified: signups.filter(s => s.verified).length,
    pending: signups.filter(s => !s.verified).length
  };

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <span className="text-orange-500">₿</span>
                  Bitcoin Research Admin
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gestione iscritti e accessi
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchSignups(true)}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Aggiornamento...' : 'Refresh'}
              </Button>
              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Esporta CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Signups</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <p className="text-3xl font-bold">{stats.verified}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Verification</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Signups Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Iscritti
                </CardTitle>
                <CardDescription>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredSignups.length)} of {filteredSignups.length} iscritti
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cerca per email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredSignups.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nessun iscritto trovato
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Data Iscrizione</TableHead>
                      <TableHead>Data Verifica</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSignups.map((signup) => (
                      <TableRow key={signup.id}>
                        <TableCell className="font-medium">{signup.email}</TableCell>
                        <TableCell>
                          {signup.verified ? (
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{signup.source}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(signup.created_at), "dd MMM yyyy, HH:mm", { locale: it })}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {signup.verified_at
                            ? format(new Date(signup.verified_at), "dd MMM yyyy, HH:mm", { locale: it })
                            : "-"
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!signup.verified && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResendVerification(signup)}
                                disabled={resendingId === signup.id}
                              >
                                {resendingId === signup.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  disabled={deletingId === signup.id}
                                >
                                  {deletingId === signup.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Sei sicuro di voler eliminare <strong>{signup.email}</strong>?
                                    <br />
                                    Questa azione non può essere annullata.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(signup.id, signup.email)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Elimina
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Pagina {currentPage} di {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Precedente
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              className="w-9"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Successiva
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
