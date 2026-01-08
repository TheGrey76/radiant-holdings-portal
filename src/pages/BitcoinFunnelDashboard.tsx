import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Eye, 
  Mail, 
  CreditCard, 
  TrendingUp, 
  ArrowRight, 
  Settings, 
  FileText,
  MessageSquare,
  Zap,
  RefreshCw,
  Plus,
  Save,
  Loader2,
  Calendar,
  Sparkles,
  Edit
} from "lucide-react";
import { FunnelContentCalendar } from "@/components/FunnelContentCalendar";
import { FunnelBlogSelector } from "@/components/FunnelBlogSelector";
import { FunnelPostEditor } from "@/components/FunnelPostEditor";
import { ContentDistribution } from "@/components/ContentDistribution";

interface FunnelLead {
  id: string;
  email: string;
  source: string;
  status: string;
  created_at: string;
  paid_at: string | null;
}

interface LinkedInPost {
  id: string;
  title: string;
  angle: string;
  status: string;
  published_at: string | null;
  notes: string | null;
  scheduled_for: string | null;
  generated_content: string | null;
  blog_post_id: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
}

interface DMTemplate {
  id: string;
  name: string;
  content: string;
  is_active: boolean;
}

interface EmailSequence {
  id: string;
  sequence_order: number;
  name: string;
  subject: string;
  body: string;
  status: string;
  trigger_hours_after_request: number | null;
}

interface FunnelSettings {
  active_cta_copy: string;
  preview_url: string;
  full_access_url: string;
}

interface FunnelNote {
  id: string;
  note_text: string;
  created_by: string | null;
  created_at: string;
}

export default function BitcoinFunnelDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [leads, setLeads] = useState<FunnelLead[]>([]);
  const [linkedInPosts, setLinkedInPosts] = useState<LinkedInPost[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [dmTemplates, setDMTemplates] = useState<DMTemplate[]>([]);
  const [emailSequences, setEmailSequences] = useState<EmailSequence[]>([]);
  const [settings, setSettings] = useState<FunnelSettings>({
    active_cta_copy: "",
    preview_url: "",
    full_access_url: ""
  });
  const [notes, setNotes] = useState<FunnelNote[]>([]);
  const [newNote, setNewNote] = useState("");

  // New post form
  const [newPost, setNewPost] = useState({ title: "", angle: "positioning", notes: "", blog_post_id: "" });
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  
  // Post editor
  const [editingPost, setEditingPost] = useState<LinkedInPost | null>(null);
  const [contentTab, setContentTab] = useState("posts");

  // Check admin access
  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase.rpc("get_current_user_role");
      if (roleData !== "admin") {
        toast.error("Access denied. Admin only.");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await fetchAllData();
      setLoading(false);
    };

    checkAccess();
  }, [navigate]);

  const fetchAllData = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchLeads(),
      fetchLinkedInPosts(),
      fetchBlogPosts(),
      fetchDMTemplates(),
      fetchEmailSequences(),
      fetchSettings(),
      fetchNotes()
    ]);
    setRefreshing(false);
  };

  const fetchLeads = async () => {
    const { data } = await supabase
      .from("bitcoin_funnel_leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setLeads(data);
  };

  const fetchLinkedInPosts = async () => {
    const { data } = await supabase
      .from("bitcoin_funnel_linkedin_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setLinkedInPosts(data as LinkedInPost[]);
  };

  const fetchBlogPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, excerpt")
      .eq("status", "published")
      .limit(100);
    if (data) setBlogPosts(data);
  };

  const fetchDMTemplates = async () => {
    const { data } = await supabase
      .from("bitcoin_funnel_dm_templates")
      .select("*")
      .order("name");
    if (data) setDMTemplates(data);
  };

  const fetchEmailSequences = async () => {
    const { data } = await supabase
      .from("bitcoin_funnel_email_sequences")
      .select("*")
      .order("sequence_order");
    if (data) setEmailSequences(data);
  };

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("bitcoin_funnel_settings")
      .select("*");
    if (data) {
      const settingsObj: FunnelSettings = {
        active_cta_copy: "",
        preview_url: "",
        full_access_url: ""
      };
      data.forEach((s: { setting_key: string; setting_value: string }) => {
        if (s.setting_key === "active_cta_copy") settingsObj.active_cta_copy = s.setting_value;
        if (s.setting_key === "preview_url") settingsObj.preview_url = s.setting_value;
        if (s.setting_key === "full_access_url") settingsObj.full_access_url = s.setting_value;
      });
      setSettings(settingsObj);
    }
  };

  const fetchNotes = async () => {
    const { data } = await supabase
      .from("bitcoin_funnel_notes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setNotes(data);
  };

  // KPI calculations
  const previewCount = leads.filter(l => l.status === "preview").length;
  const requestedCount = leads.filter(l => l.status === "requested").length;
  const paidCount = leads.filter(l => l.status === "paid").length;
  const totalLeads = leads.length;
  const conversionRate = totalLeads > 0 ? ((paidCount / totalLeads) * 100).toFixed(1) : "0";

  // Funnel flow calculations
  const previewToRequested = totalLeads > 0 ? ((requestedCount + paidCount) / totalLeads * 100).toFixed(0) : "0";
  const requestedToPaid = (requestedCount + paidCount) > 0 ? (paidCount / (requestedCount + paidCount) * 100).toFixed(0) : "0";

  // Update handlers
  const updateDMTemplate = async (id: string, content: string) => {
    await supabase
      .from("bitcoin_funnel_dm_templates")
      .update({ content })
      .eq("id", id);
    toast.success("DM template updated");
  };

  const toggleDMActive = async (id: string, is_active: boolean) => {
    await supabase
      .from("bitcoin_funnel_dm_templates")
      .update({ is_active })
      .eq("id", id);
    await fetchDMTemplates();
    toast.success("DM template status updated");
  };

  const updateEmailSequence = async (id: string, updates: Partial<EmailSequence>) => {
    await supabase
      .from("bitcoin_funnel_email_sequences")
      .update(updates)
      .eq("id", id);
    toast.success("Email sequence updated");
  };

  const toggleEmailStatus = async (id: string, status: string) => {
    await supabase
      .from("bitcoin_funnel_email_sequences")
      .update({ status })
      .eq("id", id);
    await fetchEmailSequences();
    toast.success("Email status updated");
  };

  const updateSetting = async (key: string, value: string) => {
    await supabase
      .from("bitcoin_funnel_settings")
      .update({ setting_value: value })
      .eq("setting_key", key);
    toast.success("Setting updated");
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from("bitcoin_funnel_notes")
      .insert({ note_text: newNote, created_by: user?.email });
    setNewNote("");
    await fetchNotes();
    toast.success("Note added");
  };

  const addLinkedInPost = async () => {
    if (!newPost.title.trim()) return;
    await supabase
      .from("bitcoin_funnel_linkedin_posts")
      .insert({
        title: newPost.title,
        angle: newPost.angle,
        notes: newPost.notes,
        blog_post_id: newPost.blog_post_id || null,
        status: "draft"
      });
    setNewPost({ title: "", angle: "positioning", notes: "", blog_post_id: "" });
    setShowNewPostForm(false);
    await fetchLinkedInPosts();
    toast.success("Post added");
  };

  const linkBlogToNewPost = (blogPost: { id: string; title: string }) => {
    setNewPost({ 
      ...newPost, 
      title: newPost.title || blogPost.title,
      blog_post_id: blogPost.id 
    });
    setShowNewPostForm(true);
  };

  const getLinkedBlogPost = (blogPostId: string | null) => {
    if (!blogPostId) return null;
    return blogPosts.find(bp => bp.id === blogPostId) || null;
  };

  const updatePostStatus = async (id: string, status: string) => {
    const updates: Record<string, unknown> = { status };
    if (status === "published") {
      updates.published_at = new Date().toISOString();
    }
    await supabase
      .from("bitcoin_funnel_linkedin_posts")
      .update(updates)
      .eq("id", id);
    await fetchLinkedInPosts();
    toast.success("Post status updated");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Bitcoin 2026 — Funnel Control Panel</h1>
            <p className="text-sm text-zinc-500 mt-1">Internal use only · Not indexed</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAllData}
            disabled={refreshing}
            className="border-zinc-700 text-zinc-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* 1️⃣ KPI Cards */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-zinc-500" />
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">Preview Visits</p>
                    <p className="text-2xl font-semibold text-white">{previewCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-zinc-500" />
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">Access Requests</p>
                    <p className="text-2xl font-semibold text-white">{requestedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-zinc-500" />
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">Paid Access</p>
                    <p className="text-2xl font-semibold text-white">{paidCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-zinc-500" />
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">Conversion Rate</p>
                    <p className="text-2xl font-semibold text-white">{conversionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 2️⃣ Funnel Flow Status */}
        <section>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-zinc-300">Funnel Flow Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4 py-6">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-lg bg-zinc-800 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{totalLeads}</span>
                    <span className="text-xs text-zinc-500">Preview</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <ArrowRight className="w-6 h-6 text-zinc-600" />
                  <span className="text-xs text-zinc-500 mt-1">{previewToRequested}%</span>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-lg bg-zinc-800 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{requestedCount + paidCount}</span>
                    <span className="text-xs text-zinc-500">Requested</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <ArrowRight className="w-6 h-6 text-zinc-600" />
                  <span className="text-xs text-zinc-500 mt-1">{requestedToPaid}%</span>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-lg bg-amber-900/30 border border-amber-800/50 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-amber-400">{paidCount}</span>
                    <span className="text-xs text-amber-500/80">Paid</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 3️⃣ Content Engine */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-zinc-500" />
              <h2 className="text-lg font-medium text-white">Content & Messaging Engine</h2>
            </div>
          </div>

          <Tabs value={contentTab} onValueChange={setContentTab} className="space-y-4">
            <TabsList className="bg-zinc-800 border-zinc-700">
              <TabsTrigger value="posts" className="data-[state=active]:bg-zinc-700 text-zinc-400 data-[state=active]:text-zinc-100">
                <Sparkles className="w-4 h-4 mr-2" />
                LinkedIn Posts
              </TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:bg-zinc-700 text-zinc-400 data-[state=active]:text-zinc-100">
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="blog" className="data-[state=active]:bg-zinc-700 text-zinc-400 data-[state=active]:text-zinc-100">
                <FileText className="w-4 h-4 mr-2" />
                Blog Articles
              </TabsTrigger>
              <TabsTrigger value="distribution" className="data-[state=active]:bg-zinc-700 text-zinc-400 data-[state=active]:text-zinc-100">
                <Zap className="w-4 h-4 mr-2" />
                Distribution
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-4">
              {editingPost ? (
                <FunnelPostEditor
                  post={editingPost}
                  linkedBlogPost={getLinkedBlogPost(editingPost.blog_post_id)}
                  onClose={() => setEditingPost(null)}
                  onUpdate={fetchLinkedInPosts}
                />
              ) : (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-medium text-zinc-300">LinkedIn Posts</CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-zinc-400 h-8"
                      onClick={() => setShowNewPostForm(!showNewPostForm)}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Post
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {showNewPostForm && (
                      <div className="mb-4 p-4 bg-zinc-800/50 rounded-lg space-y-3">
                        <Input
                          placeholder="Post title/hook"
                          value={newPost.title}
                          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                          className="bg-zinc-800 border-zinc-700"
                        />
                        <div className="flex gap-3">
                          <Select
                            value={newPost.angle}
                            onValueChange={(v) => setNewPost({ ...newPost, angle: v })}
                          >
                            <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="de-education">De-education</SelectItem>
                              <SelectItem value="positioning">Positioning</SelectItem>
                              <SelectItem value="qualifying">Qualifying</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Notes"
                            value={newPost.notes}
                            onChange={(e) => setNewPost({ ...newPost, notes: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 flex-1"
                          />
                          <Button size="sm" onClick={addLinkedInPost}>Save</Button>
                        </div>
                        {newPost.blog_post_id && (
                          <div className="flex items-center gap-2 text-xs text-amber-400">
                            <span>Linked to blog article</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-xs"
                              onClick={() => setNewPost({ ...newPost, blog_post_id: "" })}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    <Table>
                      <TableHeader>
                        <TableRow className="border-zinc-800">
                          <TableHead className="text-zinc-500">Title</TableHead>
                          <TableHead className="text-zinc-500">Angle</TableHead>
                          <TableHead className="text-zinc-500">Scheduled</TableHead>
                          <TableHead className="text-zinc-500">Status</TableHead>
                          <TableHead className="text-zinc-500">AI</TableHead>
                          <TableHead className="text-zinc-500">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {linkedInPosts.map((post) => (
                          <TableRow key={post.id} className="border-zinc-800">
                            <TableCell className="text-zinc-300 font-medium max-w-[200px]">
                              <div className="truncate">{post.title}</div>
                              {post.blog_post_id && (
                                <span className="text-xs text-amber-500/70">📎 Blog linked</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                                {post.angle}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-zinc-500 text-sm">
                              {post.scheduled_for 
                                ? new Date(post.scheduled_for).toLocaleDateString() 
                                : "—"}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={post.status}
                                onValueChange={(v) => updatePostStatus(post.id, v)}
                              >
                                <SelectTrigger className="w-28 h-8 bg-zinc-800 border-zinc-700 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="scheduled">Scheduled</SelectItem>
                                  <SelectItem value="published">Published</SelectItem>
                                  <SelectItem value="retired">Retired</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              {post.generated_content ? (
                                <Badge variant="outline" className="text-xs border-green-800 text-green-400">
                                  Ready
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-500">
                                  —
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8"
                                onClick={() => setEditingPost(post)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {linkedInPosts.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
                              No posts yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar">
              <FunnelContentCalendar
                posts={linkedInPosts.map(p => ({
                  id: p.id,
                  title: p.title,
                  scheduled_for: p.scheduled_for || "",
                  status: p.status,
                  angle: p.angle
                }))}
                onSelectDate={() => {}}
                onSelectPost={(post) => {
                  const fullPost = linkedInPosts.find(p => p.id === post.id);
                  if (fullPost) {
                    setEditingPost(fullPost);
                    setContentTab("posts");
                  }
                }}
              />
            </TabsContent>

            {/* Blog Tab */}
            <TabsContent value="blog">
              <FunnelBlogSelector
                onSelectPost={(blogPost) => linkBlogToNewPost(blogPost)}
                selectedPostId={newPost.blog_post_id || null}
              />
            </TabsContent>

            {/* Distribution Tab */}
            <TabsContent value="distribution">
              <ContentDistribution />
            </TabsContent>
          </Tabs>

          {/* B. DM Templates */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-zinc-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> DM Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dmTemplates.map((dm) => (
                <div key={dm.id} className="p-4 bg-zinc-800/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-300">{dm.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">{dm.is_active ? "Active" : "Inactive"}</span>
                      <Switch
                        checked={dm.is_active}
                        onCheckedChange={(checked) => toggleDMActive(dm.id, checked)}
                      />
                    </div>
                  </div>
                  <Textarea
                    defaultValue={dm.content}
                    onBlur={(e) => updateDMTemplate(dm.id, e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-sm min-h-[80px]"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* C. Email Sequences */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-zinc-300 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Sequences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {emailSequences.map((email) => (
                <div key={email.id} className="p-4 bg-zinc-800/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-zinc-300">{email.name}</span>
                      {email.trigger_hours_after_request !== null && (
                        <span className="text-xs text-zinc-500 ml-2">
                          (Trigger: +{email.trigger_hours_after_request}h)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${email.status === "active" ? "border-green-800 text-green-400" : "border-zinc-700 text-zinc-500"}`}
                      >
                        {email.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => toggleEmailStatus(email.id, email.status === "active" ? "paused" : "active")}
                      >
                        {email.status === "active" ? "Pause" : "Activate"}
                      </Button>
                    </div>
                  </div>
                  <Input
                    defaultValue={email.subject}
                    onBlur={(e) => updateEmailSequence(email.id, { subject: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-sm"
                    placeholder="Subject"
                  />
                  <Textarea
                    defaultValue={email.body}
                    onBlur={(e) => updateEmailSequence(email.id, { body: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-sm min-h-[80px]"
                    placeholder="Body"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* 4️⃣ Automation Layer */}
        <section>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-zinc-300 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Automation Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
                  <p className="text-sm text-zinc-400">
                    <span className="text-zinc-300 font-medium">Rule 1:</span> User submits "Request Full Access"
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    → Store email in Supabase · Set status = requested · Send Email 1
                  </p>
                </div>
                <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
                  <p className="text-sm text-zinc-400">
                    <span className="text-zinc-300 font-medium">Rule 2:</span> status = requested AND not paid after 24h
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    → Send Email 2
                  </p>
                </div>
                <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
                  <p className="text-sm text-zinc-400">
                    <span className="text-zinc-300 font-medium">Rule 3:</span> status = requested AND not paid after 72h
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    → Send Email 3
                  </p>
                </div>
                <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
                  <p className="text-sm text-zinc-400">
                    <span className="text-zinc-300 font-medium">Rule 4:</span> Stripe webhook = payment success
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    → Update status = paid · Stop all emails · Log conversion timestamp
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 5️⃣ Control Panel */}
        <section>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-zinc-300 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Control Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-wide">Active CTA Copy</label>
                  <Input
                    value={settings.active_cta_copy}
                    onChange={(e) => setSettings({ ...settings, active_cta_copy: e.target.value })}
                    onBlur={(e) => updateSetting("active_cta_copy", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-wide">Preview URL</label>
                  <Input
                    value={settings.preview_url}
                    onChange={(e) => setSettings({ ...settings, preview_url: e.target.value })}
                    onBlur={(e) => updateSetting("preview_url", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-wide">Full Access URL</label>
                  <Input
                    value={settings.full_access_url}
                    onChange={(e) => setSettings({ ...settings, full_access_url: e.target.value })}
                    onBlur={(e) => updateSetting("full_access_url", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-sm"
                  />
                </div>
              </div>

              <Separator className="bg-zinc-800" />

              {/* Iteration Notes */}
              <div className="space-y-3">
                <label className="text-xs text-zinc-500 uppercase tracking-wide">Iteration Log</label>
                <div className="flex gap-2">
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="bg-zinc-800 border-zinc-700 text-sm min-h-[60px]"
                  />
                  <Button onClick={addNote} className="self-end">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 bg-zinc-800/30 rounded border border-zinc-800">
                      <p className="text-sm text-zinc-300">{note.note_text}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {note.created_by} · {new Date(note.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Leads Table */}
        <section>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-zinc-300">Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-500">Email</TableHead>
                    <TableHead className="text-zinc-500">Source</TableHead>
                    <TableHead className="text-zinc-500">Status</TableHead>
                    <TableHead className="text-zinc-500">Created</TableHead>
                    <TableHead className="text-zinc-500">Paid At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.slice(0, 20).map((lead) => (
                    <TableRow key={lead.id} className="border-zinc-800">
                      <TableCell className="text-zinc-300">{lead.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                          {lead.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            lead.status === "paid"
                              ? "border-green-800 text-green-400"
                              : lead.status === "requested"
                              ? "border-amber-800 text-amber-400"
                              : "border-zinc-700 text-zinc-400"
                          }`}
                        >
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-500 text-sm">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-zinc-500 text-sm">
                        {lead.paid_at ? new Date(lead.paid_at).toLocaleDateString() : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {leads.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-zinc-500 py-8">
                        No leads yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
