import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { AlertCircle, Lock, ArrowLeft, Calendar, Building2, FileText, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Advisory document content renderer
import AdvisoryDocumentRenderer from "@/components/advisory/AdvisoryDocumentRenderer";

const AdvisoryDocument = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [showToc, setShowToc] = useState(false);

  // Check session storage for existing access
  useEffect(() => {
    const storedAccess = sessionStorage.getItem(`advisory_access_${slug}`);
    if (storedAccess === 'granted') {
      setHasAccess(true);
    }
  }, [slug]);

  // Fetch document by slug
  const { data: document, isLoading, error } = useQuery({
    queryKey: ["advisory-document", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strategic_advisory_documents")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Handle email verification
  const handleVerifyAccess = async () => {
    if (!email || !slug) {
      toast.error("Inserisci un'email valida");
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('check-page-access', {
        body: { 
          email: email.toLowerCase().trim(),
          pageSlug: `advisory/${slug}`,
        },
      });

      if (error) throw error;

      if (data?.hasAccess) {
        setHasAccess(true);
        sessionStorage.setItem(`advisory_access_${slug}`, 'granted');
        toast.success("Accesso verificato");
      } else {
        toast.error("Email non autorizzata per questo documento");
      }
    } catch (error: any) {
      console.error("Access check error:", error);
      toast.error("Errore nella verifica dell'accesso");
    } finally {
      setIsVerifying(false);
    }
  };

  // Generate table of contents from content
  const contentArray = Array.isArray(document?.content) ? document.content : [];
  const tableOfContents = contentArray
    .filter((section: any) => section.type === 'heading' && section.level <= 2)
    .map((section: any, index: number) => ({
      id: `section-${index}`,
      title: section.content,
      level: section.level,
    }));

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-[70vh] w-full rounded-2xl" />
        </div>
      </main>
    );
  }

  // Error state
  if (error || !document) {
    return (
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Documento Non Trovato</h1>
          <p className="text-muted-foreground mb-6">
            Questo documento non esiste o non è ancora pubblicato.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alla Home
          </Button>
        </div>
      </main>
    );
  }

  // Access gate
  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Documento Riservato
                </h1>
                <p className="text-muted-foreground text-sm">
                  Questo documento è riservato ai clienti autorizzati
                </p>
              </div>

              {/* Document Info */}
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <h2 className="font-semibold text-foreground mb-1">{document.title}</h2>
                <p className="text-sm text-muted-foreground">{document.client_name}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(document.document_date), "d MMMM yyyy", { locale: it })}
                </div>
              </div>

              {/* Email Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Inserisci la tua email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@esempio.com"
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyAccess()}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleVerifyAccess}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Verifica in corso...
                    </>
                  ) : (
                    "Verifica Accesso"
                  )}
                </Button>
              </div>

              {/* Contact */}
              <p className="text-center text-xs text-muted-foreground mt-6">
                Non hai accesso? Contatta{" "}
                <a href="mailto:advisory@aries76.com" className="text-primary hover:underline">
                  advisory@aries76.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // Document View
  return (
    <main className="min-h-screen bg-background print:bg-white">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border print:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Esci
            </Button>
            
            {tableOfContents.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowToc(!showToc)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Indice
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showToc ? 'rotate-180' : ''}`} />
              </Button>
            )}
          </div>

          {/* Table of Contents Dropdown */}
          <AnimatePresence>
            {showToc && tableOfContents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="py-4 border-t border-border mt-3">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Indice</h4>
                  <ul className="space-y-1">
                    {tableOfContents.map((item: any, index: number) => (
                      <li key={index}>
                        <a
                          href={`#${item.id}`}
                          className={`block text-sm hover:text-primary transition-colors ${
                            item.level === 1 ? 'font-medium' : 'pl-4 text-muted-foreground'
                          }`}
                          onClick={() => setShowToc(false)}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Document Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <article className="max-w-4xl mx-auto">
          {/* Cover */}
          <header className="mb-12 pb-12 border-b border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Building2 className="w-4 h-4" />
              <span>{document.client_name}</span>
              <span className="mx-2">•</span>
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(document.document_date), "d MMMM yyyy", { locale: it })}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {document.title}
            </h1>
            
            {document.description && (
              <p className="text-lg text-muted-foreground">
                {document.description}
              </p>
            )}

            {/* Aries76 Branding */}
            <div className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A76</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">ARIES76</p>
                <p className="text-xs text-muted-foreground">Strategic Advisory</p>
              </div>
            </div>
          </header>

          {/* Content Sections */}
          <AdvisoryDocumentRenderer 
            content={Array.isArray(document.content) ? document.content : []} 
          />

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Documento riservato — {document.client_name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © {new Date().getFullYear()} ARIES76 Ltd. All rights reserved.
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
};

export default AdvisoryDocument;