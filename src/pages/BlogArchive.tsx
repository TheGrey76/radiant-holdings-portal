import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BlogArchive = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const blogPosts = [
    {
      title: "The Digital Revolution in Structured Products: Tokenization and AI Transform the Market in 2025",
      excerpt: "How blockchain tokenization, AI-powered structuring, and digital distribution are reshaping the €500 billion European structured products market.",
      category: "Structured Products",
      date: "2025-11-10",
      readTime: "8 min read",
      slug: "structured-products-digital-revolution-2025"
    },
    {
      title: "Italy's Structured Products Market Reaches Record €8 Billion in Q3 2025",
      excerpt: "The Italian certificates market achieves unprecedented volumes with €8 billion placed in Q3 2025, marking a 47% year-over-year increase and confirming the structural growth of this dynamic sector.",
      category: "Structured Products",
      date: "2025-11-02",
      readTime: "6 min read",
      slug: "italy-structured-products-record-q3-2025"
    },
    {
      title: "AI-Driven Due Diligence: How Machine Learning is Reshaping Private Markets",
      excerpt: "Artificial intelligence is revolutionizing the way GPs analyze deals and LPs evaluate fund managers. We examine the latest AI applications in private markets due diligence and their impact on investment decisions.",
      category: "AI & Technology",
      date: "2025-11-02",
      readTime: "7 min read",
      slug: "ai-driven-due-diligence-private-markets"
    },
    {
      title: "AIRES: Transforming Investor Targeting with AI-Powered Precision",
      excerpt: "Discover how AIRES leverages artificial intelligence to revolutionize investor targeting in private markets, helping GPs identify and engage the right LPs with unprecedented accuracy.",
      category: "AI & Technology",
      date: "2025-10-28",
      readTime: "6 min read",
      slug: "aires-transforming-investor-targeting"
    },
    {
      title: "GP Equity: The Next Frontier in Private Markets Capital Formation",
      excerpt: "As private markets continue to mature, GP equity is emerging as a critical tool for management company growth. We explore the trends driving this shift and what it means for European GPs.",
      category: "GP Capital Advisory",
      date: "2025-10-15",
      readTime: "8 min read",
      slug: "gp-equity-next-frontier"
    },
    {
      title: "Succession Planning for Private Equity Firms: A Strategic Imperative",
      excerpt: "How second-generation GPs can navigate leadership transitions while maintaining performance and investor confidence. Key considerations for successful succession in private markets.",
      category: "Succession Planning",
      date: "2025-10-01",
      readTime: "6 min read",
      slug: "succession-planning-strategic-imperative"
    },
    {
      title: "Valuing Management Companies: Beyond AUM and Carry",
      excerpt: "Traditional valuation metrics don't capture the full picture of a modern GP platform. We break down the key drivers that sophisticated investors look for when evaluating management companies.",
      category: "Valuation",
      date: "2025-09-20",
      readTime: "10 min read",
      slug: "valuing-management-companies"
    },
    {
      title: "Digital Infrastructure & AI: The New Core Allocation",
      excerpt: "Why institutional investors are increasingly viewing digital infrastructure and AI infrastructure as a strategic core allocation, and what this means for GP fundraising strategies.",
      category: "Market Insights",
      date: "2025-09-05",
      readTime: "7 min read",
      slug: "digital-infrastructure-ai-core-allocation"
    },
    {
      title: "Cross-Border Fund Structuring: Luxembourg vs. Ireland vs. UK",
      excerpt: "A comparative analysis of fund domicile options for European GPs raising global capital. Tax considerations, regulatory frameworks, and investor preferences examined.",
      category: "Fund Structuring",
      date: "2025-08-25",
      readTime: "9 min read",
      slug: "cross-border-fund-structuring"
    }
  ];

  // Extract unique categories and years
  const categories = useMemo(() => {
    const cats = Array.from(new Set(blogPosts.map(post => post.category)));
    return cats.sort();
  }, []);

  const years = useMemo(() => {
    const yrs = Array.from(new Set(blogPosts.map(post => new Date(post.date).getFullYear().toString())));
    return yrs.sort().reverse();
  }, []);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const categoryMatch = selectedCategory === "all" || post.category === selectedCategory;
      const yearMatch = selectedYear === "all" || new Date(post.date).getFullYear().toString() === selectedYear;
      return categoryMatch && yearMatch;
    });
  }, [selectedCategory, selectedYear]);

  const pageUrl = "https://www.aries76.com/blog/archive";

  return (
    <>
      <Helmet>
        <title>Blog Archive - Aries76 Insights & Research</title>
        <meta name="description" content="Browse our complete archive of articles on GP capital advisory, private equity fund formation, structured products, and institutional capital markets. Filter by category and year." />
        <link rel="canonical" href={pageUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content="Blog Archive - Aries76 Insights & Research" />
        <meta property="og:description" content="Browse our complete archive of articles on GP capital advisory, private equity fund formation, structured products, and institutional capital markets." />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.aries76.com/aries76-og-logo.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog Archive - Aries76 Insights & Research" />
        <meta name="twitter:description" content="Browse our complete archive of articles on GP capital advisory, private equity, and structured products." />
        <meta name="twitter:image" content="https://www.aries76.com/aries76-og-logo.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Blog Archive - Aries76 Insights & Research",
            "description": "Complete archive of articles on GP capital advisory, private equity fund formation, structured products, and institutional capital markets",
            "url": pageUrl,
            "mainEntity": {
              "@type": "Blog",
              "name": "Aries76 Insights & Research",
              "description": "Expert insights on GP capital advisory, private equity fund formation, and institutional capital markets",
              "url": "https://www.aries76.com/blog"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Aries76 Ltd",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.aries76.com/aries76-og-logo.png"
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.aries76.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": "https://www.aries76.com/blog"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Archive",
                  "item": pageUrl
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background pt-24 pb-20">
        {/* Hero */}
        <section className="px-6 md:px-10 py-16 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] text-white">
          <div className="max-w-6xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-light tracking-tight mb-6"
            >
              Blog <span className="text-accent">Archive</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl font-light text-white/80 max-w-3xl mb-8"
            >
              Browse our complete collection of insights on GP capital advisory, private markets, and structured products
            </motion.p>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              <div className="flex items-center gap-2 text-white/80">
                <Filter className="w-5 h-5" />
                <span className="font-light">Filter by:</span>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[150px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(selectedCategory !== "all" || selectedYear !== "all") && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedYear("all");
                  }}
                  className="text-sm text-white/60 hover:text-white transition-colors underline"
                >
                  Clear filters
                </button>
              )}
            </motion.div>

            {/* Results count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mt-6 text-white/60 font-light"
            >
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            </motion.p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="px-6 md:px-10 py-20">
          <div className="max-w-6xl mx-auto">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link to={`/blog/${post.slug}`}>
                      <Card className="border-border/50 bg-card hover:shadow-smooth-lg transition-all h-full group cursor-pointer">
                        <CardContent className="p-8">
                          <div className="flex items-center justify-between mb-4">
                            <Badge variant="outline" className="font-light">
                              {post.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-light">{post.readTime}</span>
                          </div>
                          
                          <h2 className="text-xl font-light text-foreground mb-3 tracking-tight group-hover:text-accent transition-colors">
                            {post.title}
                          </h2>
                          
                          <p className="text-muted-foreground font-light leading-relaxed mb-6">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <time dateTime={post.date}>
                                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </time>
                            </div>
                            <ArrowRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-muted-foreground font-light text-lg">
                  No articles found matching your filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedYear("all");
                  }}
                  className="mt-4 text-accent hover:underline"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogArchive;
