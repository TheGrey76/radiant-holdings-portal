import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Mail, Link as LinkIcon, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Proposal {
  id: string;
  name: string;
  accessRoute: string;
  proposalRoute: string;
}

const PROPOSALS: Proposal[] = [
  {
    id: "vettafi",
    name: "VettaFi Proposal",
    accessRoute: "/vettafi-access",
    proposalRoute: "/vettafi-proposal"
  },
  {
    id: "alkemia",
    name: "Alkemia Praesidium FRPA",
    accessRoute: "/alkemia-praesidium-access",
    proposalRoute: "/alkemia-praesidium-proposal"
  },
  {
    id: "abc",
    name: "ABC Company Capital Raise",
    accessRoute: "/abc-company-access",
    proposalRoute: "/abc-company-proposal"
  },
  {
    id: "assetgu",
    name: "Asset G.U. Portfolio Architecture",
    accessRoute: "/asset-gu-access",
    proposalRoute: "/asset-gu-proposal"
  }
];

const ProposalLinkGenerator = () => {
  const [selectedProposal, setSelectedProposal] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
    setBaseUrl(window.location.origin);
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase.rpc('get_current_user_role');
      
      if (roleData !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    }
  };

  const getSelectedProposalData = () => {
    return PROPOSALS.find(p => p.id === selectedProposal);
  };

  const getAccessLink = () => {
    const proposal = getSelectedProposalData();
    if (!proposal) return "";
    return `${baseUrl}${proposal.accessRoute}`;
  };

  const copyToClipboard = async () => {
    const link = getAccessLink();
    if (!link) {
      toast({
        title: "Error",
        description: "Please select a proposal first",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "The proposal link has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const getEmailTemplate = () => {
    const proposal = getSelectedProposalData();
    if (!proposal) return { subject: "", body: "" };

    const link = getAccessLink();
    const name = recipientName || "there";

    return {
      subject: `Confidential: ${proposal.name}`,
      body: `Dear ${name},

I hope this email finds you well.

I'm pleased to share with you a confidential proposal that I believe will be of significant interest to you and your organization.

To access the proposal, please click on the following secure link and enter your email address (${recipientEmail}) for verification:

${link}

The proposal contains detailed information about our strategic partnership opportunity. Please review it at your earliest convenience.

If you have any questions or would like to discuss the proposal further, please don't hesitate to reach out.

Best regards,
Aries76 Team`
    };
  };

  const openEmailClient = () => {
    if (!recipientEmail || !selectedProposal) {
      toast({
        title: "Missing Information",
        description: "Please select a proposal and enter recipient email",
        variant: "destructive",
      });
      return;
    }

    const template = getEmailTemplate();
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
    window.location.href = mailtoLink;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const proposal = getSelectedProposalData();
  const emailTemplate = getEmailTemplate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Proposal Link Generator
          </h1>
          <p className="text-muted-foreground">
            Create secure access links for confidential proposals
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Generate Proposal Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="proposal">Select Proposal</Label>
              <Select value={selectedProposal} onValueChange={setSelectedProposal}>
                <SelectTrigger id="proposal">
                  <SelectValue placeholder="Choose a proposal" />
                </SelectTrigger>
                <SelectContent>
                  {PROPOSALS.map((proposal) => (
                    <SelectItem key={proposal.id} value={proposal.id}>
                      {proposal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                type="text"
                placeholder="Peter Diel"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="peter.diel@tmx.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>

            {selectedProposal && (
              <div className="space-y-2">
                <Label>Generated Access Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={getAccessLink()}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  The recipient will need to enter their email to access the proposal
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedProposal && recipientEmail && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={emailTemplate.subject} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Email Body</Label>
                <Textarea
                  value={emailTemplate.body}
                  readOnly
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              <Button
                onClick={openEmailClient}
                className="w-full"
                size="lg"
              >
                <Mail className="mr-2 h-5 w-5" />
                Open in Email Client
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProposalLinkGenerator;
