import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Linkedin, RefreshCw, Settings } from "lucide-react";

interface Distribution {
  id: string;
  platform: string;
  webhook_url: string;
  is_active: boolean;
}

export const ContentDistribution = () => {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDistributions();
  }, []);

  const loadDistributions = async () => {
    const { data, error } = await supabase
      .from("content_distributions")
      .select("*")
      .eq("platform", "linkedin");

    if (error) {
      console.error("Error loading distributions:", error);
      return;
    }

    setDistributions(data || []);
    if (data && data.length > 0) {
      setWebhookUrl(data[0].webhook_url);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (distributions.length > 0) {
        // Update existing
        const { error } = await supabase
          .from("content_distributions")
          .update({ webhook_url: webhookUrl })
          .eq("id", distributions[0].id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from("content_distributions")
          .insert({
            platform: "linkedin",
            webhook_url: webhookUrl,
            is_active: true,
          });

        if (error) throw error;
      }

      toast({
        title: "Saved",
        description: "Webhook URL saved successfully",
      });
      loadDistributions();
    } catch (error) {
      console.error("Error saving webhook:", error);
      toast({
        title: "Error",
        description: "Failed to save webhook URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from("content_distributions")
      .update({ is_active: !currentState })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: currentState ? "Disabled" : "Enabled",
      description: `Distribution ${currentState ? "disabled" : "enabled"}`,
    });
    loadDistributions();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Content Distribution Settings
        </CardTitle>
        <CardDescription>
          Configure Zapier webhooks for automatic content distribution to LinkedIn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Linkedin className="h-6 w-6 text-[#0A66C2]" />
            <div className="flex-1">
              <h3 className="font-semibold">LinkedIn Distribution</h3>
              <p className="text-sm text-muted-foreground">
                Automatically post new blog articles to LinkedIn
              </p>
            </div>
            {distributions.length > 0 && (
              <Switch
                checked={distributions[0].is_active}
                onCheckedChange={() =>
                  handleToggle(distributions[0].id, distributions[0].is_active)
                }
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-url">Zapier Webhook URL</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Create a Zap with a "Catch Hook" trigger and connect it to LinkedIn
            </p>
          </div>

          <Button onClick={handleSave} disabled={isLoading || !webhookUrl}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Configuration"
            )}
          </Button>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Create a Zap on Zapier.com</li>
            <li>Choose "Webhooks by Zapier" as trigger</li>
            <li>Select "Catch Hook" and copy the webhook URL</li>
            <li>Paste the URL above and save</li>
            <li>Connect LinkedIn as action in your Zap</li>
            <li>Map the fields: title, url, excerpt</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
