import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, BookOpen, Building2, FileBarChart, X, Command } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  content_type: string;
  title: string;
  description: string | null;
  url: string;
  tags: string[] | null;
  rank: number;
}

const contentTypeIcons: Record<string, typeof FileText> = {
  blog: BookOpen,
  page: FileText,
  service: Building2,
  report: FileBarChart,
};

const contentTypeLabels: Record<string, string> = {
  blog: 'Blog',
  page: 'Page',
  service: 'Service',
  report: 'Report',
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('search_content', {
        search_query: searchQuery,
        content_type_filter: null,
      });

      if (error) {
        console.error('Search error:', error);
        toast({
          title: 'Search Error',
          description: 'Unable to perform search. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      setResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery('');
    navigate(url);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-foreground/60 hover:text-foreground bg-muted/50 hover:bg-muted rounded-md border border-border/50 transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search articles, services, reports..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : query.length < 2 ? (
            <CommandEmpty>Type at least 2 characters to search</CommandEmpty>
          ) : results.length === 0 ? (
            <CommandEmpty>No results found for "{query}"</CommandEmpty>
          ) : (
            Object.entries(
              results.reduce((acc, result) => {
                const type = result.content_type;
                if (!acc[type]) acc[type] = [];
                acc[type].push(result);
                return acc;
              }, {} as Record<string, SearchResult[]>)
            ).map(([type, typeResults]) => {
              const Icon = contentTypeIcons[type] || FileText;
              return (
                <CommandGroup key={type} heading={contentTypeLabels[type] || type}>
                  {typeResults.map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      onSelect={() => handleSelect(result.url)}
                      className="flex items-start gap-3 py-3 cursor-pointer"
                    >
                      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="font-medium text-sm truncate">
                          {result.title}
                        </span>
                        {result.description && (
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {result.description}
                          </span>
                        )}
                        {result.tags && result.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {result.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
