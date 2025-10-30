import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Send, Eye, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NewsletterComposer = () => {
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [ctaText, setCtaText] = useState("Read More");
  const [ctaLink, setCtaLink] = useState("");
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSend = async () => {
    if (!subject || !heading || !content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    try {
      // TODO: Call edge function to send newsletter
      toast({
        title: "Newsletter functionality",
        description: "Email sending will be implemented next. Template is ready!",
      });
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast({
        title: "Error",
        description: "Failed to send newsletter",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Newsletter preview template
  const NewsletterPreview = () => (
    <div className="bg-white p-8 max-w-2xl mx-auto" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-200">
        <div className="text-3xl font-light tracking-wider mb-2">
          ARIES<span style={{ color: '#D97706' }}>76</span>
        </div>
        <p className="text-sm text-gray-500 uppercase tracking-widest">
          Building Bridges Between Capital and Opportunity
        </p>
      </div>

      {/* Preheader */}
      {preheader && (
        <p className="text-xs text-gray-400 mb-4">{preheader}</p>
      )}

      {/* Main Content */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-6">
          {heading || "Newsletter Heading"}
        </h1>
        
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
          {content || "Your newsletter content will appear here..."}
        </div>

        {/* CTA Button */}
        {ctaText && ctaLink && (
          <div className="text-center my-8">
            <a 
              href={ctaLink}
              style={{
                display: 'inline-block',
                backgroundColor: '#D97706',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
        <p className="mb-2">© 2025 Aries76 Ltd — All rights reserved.</p>
        <p className="mb-4">
          27 Old Gloucester Street, London, United Kingdom, WC1N 3AX
        </p>
        <a href="#" className="text-gray-400 hover:text-gray-600 underline">
          Unsubscribe
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-light tracking-wider text-white uppercase">
                ARIES<span className="text-accent">76</span>
              </Link>
              <span className="text-white/40">|</span>
              <span className="text-white/70 text-sm">Newsletter Composer</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin')}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <Tabs defaultValue="compose" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="compose" className="gap-2">
              <Mail className="w-4 h-4" />
              Compose
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white font-light text-2xl">
                    Email Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="subject" className="text-white/70">
                      Subject Line *
                    </Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter email subject..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preheader" className="text-white/70">
                      Preheader Text
                    </Label>
                    <Input
                      id="preheader"
                      value={preheader}
                      onChange={(e) => setPreheader(e.target.value)}
                      placeholder="Preview text that appears in email inbox..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white font-light text-2xl">
                    Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="heading" className="text-white/70">
                      Main Heading *
                    </Label>
                    <Input
                      id="heading"
                      value={heading}
                      onChange={(e) => setHeading(e.target.value)}
                      placeholder="Newsletter heading..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content" className="text-white/70">
                      Body Content *
                    </Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your newsletter content here..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[300px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ctaText" className="text-white/70">
                        CTA Button Text
                      </Label>
                      <Input
                        id="ctaText"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        placeholder="Read More"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ctaLink" className="text-white/70">
                        CTA Link URL
                      </Label>
                      <Input
                        id="ctaLink"
                        value={ctaLink}
                        onChange={(e) => setCtaLink(e.target.value)}
                        placeholder="https://..."
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={isSending || !subject || !heading || !content}
                  className="bg-accent hover:bg-accent/90 text-white gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? 'Sending...' : 'Send Newsletter'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <Card className="bg-white border-white/10">
              <CardContent className="p-0">
                <NewsletterPreview />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NewsletterComposer;
