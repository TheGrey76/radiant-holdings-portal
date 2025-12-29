import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportHero, ReportSection, ReportPaywall } from "@/components/reports";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const ReportDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
    };
    getUser();
  }, []);

  // Fetch report by slug
  const { data: report, isLoading: reportLoading, error: reportError } = useQuery({
    queryKey: ["report", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Fetch report sections
  const { data: sections, isLoading: sectionsLoading } = useQuery({
    queryKey: ["report-sections", report?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("report_sections")
        .select("*")
        .eq("report_id", report!.id)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!report?.id,
  });

  // Check user access
  const { data: hasAccess, isLoading: accessLoading } = useQuery({
    queryKey: ["report-access", slug, userEmail],
    queryFn: async () => {
      if (!userEmail || !slug) return false;
      
      const { data, error } = await supabase
        .rpc("check_report_access", {
          p_report_slug: slug,
          p_user_email: userEmail,
        });

      if (error) {
        console.error("Access check error:", error);
        return false;
      }
      return data;
    },
    enabled: !!slug && !!userEmail,
  });

  // Handle Stripe checkout
  const handlePurchase = async () => {
    if (!report) return;

    // Check if user is logged in
    if (!userEmail) {
      toast.info("Please sign in to purchase this report");
      navigate(`/auth?redirect=/reports/${slug}`);
      return;
    }

    setIsCheckingOut(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-report-checkout", {
        body: {
          reportId: report.id,
          reportSlug: report.slug,
          userEmail: userEmail,
          priceEur: report.price_eur,
          successUrl: `${window.location.origin}/reports/${slug}?success=true`,
          cancelUrl: `${window.location.origin}/reports/${slug}?canceled=true`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Handle success/cancel query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      toast.success("Payment successful! You now have access to the full report.");
      // Clear the query params
      window.history.replaceState({}, "", `/reports/${slug}`);
    } else if (params.get("canceled") === "true") {
      toast.info("Payment was canceled.");
      window.history.replaceState({}, "", `/reports/${slug}`);
    }
  }, [slug]);

  // Loading state
  if (reportLoading) {
    return (
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-[70vh] w-full rounded-2xl" />
        </div>
      </main>
    );
  }

  // Error state
  if (reportError || !report) {
    return (
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Report Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This report doesn't exist or is not yet published.
          </p>
          <Button onClick={() => navigate("/reports")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </Button>
        </div>
      </main>
    );
  }

  // Separate preview and premium sections
  const previewSections = sections?.filter((s) => s.is_preview) || [];
  const premiumSections = sections?.filter((s) => !s.is_preview) || [];
  const previewCount = previewSections.length;

  return (
    <main className="min-h-screen bg-background">
      {/* Back button */}
      <div className="container mx-auto px-4 pt-24 pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/reports")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          All Reports
        </Button>
      </div>

      {/* Hero */}
      <ReportHero
        report={report}
        hasAccess={hasAccess || false}
        onPurchase={handlePurchase}
        isLoading={isCheckingOut || accessLoading}
      />

      {/* Sections */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {sectionsLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {/* Preview Sections - Always visible */}
              {previewSections.map((section, index) => (
                <ReportSection
                  key={section.id}
                  section={section}
                  hasAccess={true}
                  index={index}
                />
              ))}

              {/* Paywall or Premium Content */}
              {hasAccess ? (
                // User has access - show all premium sections
                premiumSections.map((section, index) => (
                  <ReportSection
                    key={section.id}
                    section={section}
                    hasAccess={true}
                    index={previewCount + index}
                  />
                ))
              ) : (
                // User doesn't have access - show paywall
                <>
                  {/* Show first premium section as locked preview */}
                  {premiumSections.slice(0, 1).map((section, index) => (
                    <ReportSection
                      key={section.id}
                      section={section}
                      hasAccess={false}
                      index={previewCount + index}
                    />
                  ))}

                  {/* Paywall */}
                  <ReportPaywall
                    report={report}
                    onPurchase={handlePurchase}
                    isLoading={isCheckingOut}
                    previewSectionsCount={previewCount}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default ReportDetailPage;
