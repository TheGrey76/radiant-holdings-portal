import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Link, ExternalLink } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  published_at: string | null;
}

interface FunnelBlogSelectorProps {
  onSelectPost: (post: BlogPost) => void;
  selectedPostId?: string | null;
}

export function FunnelBlogSelector({ onSelectPost, selectedPostId }: FunnelBlogSelectorProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, category, excerpt, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(50);
      
      if (data) setPosts(data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.category.toLowerCase().includes(search.toLowerCase())
  );

  const bitcoinRelated = filteredPosts.filter(p => 
    p.title.toLowerCase().includes("bitcoin") || 
    p.category.toLowerCase().includes("bitcoin") ||
    p.category.toLowerCase().includes("crypto")
  );

  const otherPosts = filteredPosts.filter(p => 
    !p.title.toLowerCase().includes("bitcoin") && 
    !p.category.toLowerCase().includes("bitcoin") &&
    !p.category.toLowerCase().includes("crypto")
  );

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-zinc-300 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Blog Articles for Promotion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-zinc-800 border-zinc-700"
          />
        </div>

        {loading ? (
          <div className="text-center text-zinc-500 py-4">Loading articles...</div>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {bitcoinRelated.length > 0 && (
              <div>
                <h4 className="text-xs text-amber-500/80 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Bitcoin Related
                </h4>
                <div className="space-y-2">
                  {bitcoinRelated.map(post => (
                    <PostItem 
                      key={post.id} 
                      post={post} 
                      isSelected={selectedPostId === post.id}
                      onSelect={onSelectPost}
                    />
                  ))}
                </div>
              </div>
            )}

            {otherPosts.length > 0 && (
              <div>
                <h4 className="text-xs text-zinc-500 uppercase tracking-wide mb-2">
                  Other Articles
                </h4>
                <div className="space-y-2">
                  {otherPosts.slice(0, 10).map(post => (
                    <PostItem 
                      key={post.id} 
                      post={post} 
                      isSelected={selectedPostId === post.id}
                      onSelect={onSelectPost}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredPosts.length === 0 && (
              <p className="text-center text-zinc-600 py-4">No articles found</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PostItem({ 
  post, 
  isSelected, 
  onSelect 
}: { 
  post: BlogPost; 
  isSelected: boolean;
  onSelect: (post: BlogPost) => void;
}) {
  return (
    <div 
      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
        isSelected 
          ? "bg-amber-900/20 border-amber-800/50" 
          : "bg-zinc-800/30 border-zinc-800 hover:border-zinc-700"
      }`}
      onClick={() => onSelect(post)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-zinc-300 font-medium truncate">{post.title}</p>
          {post.excerpt && (
            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{post.excerpt}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-500">
            {post.category}
          </Badge>
          {isSelected && (
            <Link className="w-4 h-4 text-amber-400" />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-zinc-600">
          {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Draft"}
        </span>
        <a 
          href={`/blog/${post.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          Preview <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
