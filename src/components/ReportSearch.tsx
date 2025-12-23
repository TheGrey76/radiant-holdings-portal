import { useState, useMemo } from 'react';
import { Search, X, FileText, BookOpen, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Chapter {
  id: string;
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ReportSearchProps {
  chapters: Chapter[];
  glossary: Record<string, string>;
}

export function ReportSearch({ chapters, glossary }: ReportSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return { chapters: [], glossary: [] };

    const lowerQuery = query.toLowerCase();

    const matchedChapters = chapters.filter(
      (chapter) =>
        chapter.title.toLowerCase().includes(lowerQuery) ||
        chapter.number.toLowerCase().includes(lowerQuery)
    );

    const matchedGlossary = Object.entries(glossary)
      .filter(
        ([term, definition]) =>
          term.toLowerCase().includes(lowerQuery) ||
          definition.toLowerCase().includes(lowerQuery)
      )
      .map(([term, definition]) => ({ term, definition }));

    return { chapters: matchedChapters, glossary: matchedGlossary };
  }, [query, chapters, glossary]);

  const hasResults = results.chapters.length > 0 || results.glossary.length > 0;

  const scrollToChapter = (chapterId: string) => {
    const element = document.getElementById(chapterId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setQuery('');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search chapters, terms..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 bg-background/80 backdrop-blur-sm border-border/50 focus:border-primary/50"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
          <ScrollArea className="max-h-[400px]">
            {!hasResults ? (
              <div className="p-6 text-center text-muted-foreground">
                <p className="text-sm">No results for "{query}"</p>
              </div>
            ) : (
              <div className="p-2">
                {/* Chapters */}
                {results.chapters.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Chapters
                    </p>
                    {results.chapters.map((chapter) => {
                      const IconComponent = chapter.icon;
                      return (
                        <button
                          key={chapter.id}
                          onClick={() => scrollToChapter(chapter.id)}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              Chapter {chapter.number}: {chapter.title}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Glossary */}
                {results.glossary.length > 0 && (
                  <div>
                    <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Glossary Terms
                    </p>
                    {results.glossary.map(({ term, definition }) => (
                      <div
                        key={term}
                        className="px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground capitalize">
                              {term}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {definition}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
