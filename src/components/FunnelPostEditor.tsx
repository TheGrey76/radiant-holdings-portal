import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Calendar as CalendarIcon, 
  Loader2,
  X,
  Save
} from "lucide-react";

interface LinkedInPost {
  id: string;
  title: string;
  angle: string;
  status: string;
  scheduled_for: string | null;
  generated_content: string | null;
  blog_post_id: string | null;
  notes: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
}

interface FunnelPostEditorProps {
  post: LinkedInPost;
  linkedBlogPost?: BlogPost | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function FunnelPostEditor({ post, linkedBlogPost, onClose, onUpdate }: FunnelPostEditorProps) {
  const [title, setTitle] = useState(post.title);
  const [angle, setAngle] = useState(post.angle);
  const [notes, setNotes] = useState(post.notes || "");
  const [generatedContent, setGeneratedContent] = useState(post.generated_content || "");
  const [scheduledFor, setScheduledFor] = useState<Date | undefined>(
    post.scheduled_for ? new Date(post.scheduled_for) : undefined
  );
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateContent = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-linkedin-post", {
        body: {
          title,
          angle,
          blogExcerpt: linkedBlogPost?.excerpt || null,
          targetUrl: "https://www.aries76.com/bitcoin-2026-report-preview"
        }
      });

      if (error) throw error;
      
      setGeneratedContent(data.content);
      toast.success("Content generated!");
    } catch (err: any) {
      console.error("Generation error:", err);
      toast.error("Failed to generate content");
    } finally {
      setGenerating(false);
    }
  };

  const savePost = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("bitcoin_funnel_linkedin_posts")
        .update({
          title,
          angle,
          notes,
          generated_content: generatedContent || null,
          scheduled_for: scheduledFor?.toISOString() || null
        })
        .eq("id", post.id);

      if (error) throw error;
      
      toast.success("Post saved!");
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedContent) return;
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-zinc-300">Edit Post</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title & Angle */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-zinc-500">Title/Hook</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500">Angle</label>
            <Select value={angle} onValueChange={setAngle}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de-education">De-education</SelectItem>
                <SelectItem value="positioning">Positioning</SelectItem>
                <SelectItem value="qualifying">Qualifying</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-500">Schedule For</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {scheduledFor ? format(scheduledFor, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800">
              <Calendar
                mode="single"
                selected={scheduledFor}
                onSelect={setScheduledFor}
                initialFocus
                className="bg-zinc-900"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Linked Blog Post */}
        {linkedBlogPost && (
          <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-800">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs border-amber-800/50 text-amber-400">
                Linked Article
              </Badge>
            </div>
            <p className="text-sm text-zinc-300">{linkedBlogPost.title}</p>
            {linkedBlogPost.excerpt && (
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{linkedBlogPost.excerpt}</p>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-500">Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal notes..."
            className="bg-zinc-800 border-zinc-700 min-h-[60px]"
          />
        </div>

        {/* Generated Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-zinc-500">Generated Content</label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-zinc-700"
                onClick={generateContent}
                disabled={generating}
              >
                {generating ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 mr-1" />
                )}
                {generating ? "Generating..." : "Generate AI"}
              </Button>
              {generatedContent && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-zinc-700"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="w-3 h-3 mr-1 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 mr-1" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
            </div>
          </div>
          <Textarea
            value={generatedContent}
            onChange={(e) => setGeneratedContent(e.target.value)}
            placeholder="Click 'Generate AI' to create content or write manually..."
            className="bg-zinc-800 border-zinc-700 min-h-[200px] font-mono text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="border-zinc-700">
            Cancel
          </Button>
          <Button onClick={savePost} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
