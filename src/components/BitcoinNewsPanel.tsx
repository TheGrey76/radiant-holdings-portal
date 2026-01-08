import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  RefreshCw, 
  ExternalLink, 
  Sparkles, 
  Newspaper,
  Clock,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";

interface NewsItem {
  id: string;
  title: string;
  original_url: string;
  original_content: string | null;
  source_name: string;
  published_at: string | null;
  image_url: string | null;
  category: string;
}

interface BitcoinNewsPanelProps {
  onUseForPost?: (news: NewsItem) => void;
}

export function BitcoinNewsPanel({ onUseForPost }: BitcoinNewsPanelProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("aggregated_news")
        .select("*")
        .or("category.eq.digital_assets,title.ilike.%bitcoin%,title.ilike.%btc%,title.ilike.%crypto%")
        .order("published_at", { ascending: false })
        .limit(30);

      if (error) throw error;
      setNews(data || []);
    } catch (err: any) {
      console.error("Error fetching news:", err);
      toast.error("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  const fetchFinnhubNews = async () => {
    setFetching(true);
    try {
      const { error } = await supabase.functions.invoke("fetch-finnhub-news", {
        body: { category: "crypto" }
      });

      if (error) throw error;
      
      toast.success("Crypto news fetched from Finnhub!");
      await fetchNews();
    } catch (err: any) {
      console.error("Error fetching Finnhub news:", err);
      toast.error("Failed to fetch news from Finnhub");
    } finally {
      setFetching(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Unknown date";
    try {
      return format(new Date(dateStr), "MMM d, HH:mm");
    } catch {
      return "Unknown date";
    }
  };

  const truncateText = (text: string | null, maxLength: number = 120) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-base font-medium text-zinc-300">
              Bitcoin & Crypto News
            </CardTitle>
            <Badge variant="outline" className="border-zinc-700 text-zinc-500 text-xs">
              {news.length} articles
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchNews}
              disabled={loading}
              className="border-zinc-700 text-zinc-400 hover:text-white h-8"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={fetchFinnhubNews}
              disabled={fetching}
              className="bg-amber-600 hover:bg-amber-700 text-white h-8"
            >
              <TrendingUp className={`w-3 h-3 mr-1 ${fetching ? "animate-pulse" : ""}`} />
              Fetch Finnhub
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 text-zinc-500 animate-spin" />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <Newspaper className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No crypto news found</p>
            <p className="text-sm">Click "Fetch Finnhub" to get latest news</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-zinc-200 line-clamp-2">
                        {item.title}
                      </h4>
                      {item.original_content && (
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                          {truncateText(item.original_content)}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-zinc-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.published_at)}
                        </span>
                        <Badge 
                          variant="outline" 
                          className="border-zinc-700 text-zinc-500 text-[10px] h-5"
                        >
                          {item.source_name}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-zinc-500 hover:text-white"
                        onClick={() => window.open(item.original_url, "_blank")}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                      {onUseForPost && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
                          onClick={() => onUseForPost(item)}
                          title="Use as inspiration for post"
                        >
                          <Sparkles className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
