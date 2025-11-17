import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Archive } from 'lucide-react';
import { useEffect } from 'react';

const Blog = () => {

  const blogPosts = [
    {
      title: "Does Venture Capital Still Make Sense in 2025? A Strategic Reassessment",
      excerpt: "After challenging years for VC, we examine whether venture capital still offers value to sophisticated investors and explore emerging structural alternatives in the innovation economy.",
      category: "Venture Capital",
      date: "2025-01-15",
      readTime: "10 min read",
      slug: "venture-capital-value-proposition-2025"
    },
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
        title: "AIRES: Transforming Investor Targeting with AI-Powered Precision",
        excerpt: "Discover how AIRES leverages artificial intelligence to revolutionize investor targeting in private markets, helping GPs identify and engage the right LPs with unprecedented accuracy.",
        category: "AI & Technology",
        date: "2025-10-28",
        readTime: "6 min read",
        slug: "aires-transforming-investor-targeting"
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

  // Inject Blog Schema
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Aries76 Insights & Research",
      "description": "Expert insights on GP capital advisory, private equity fund formation, and institutional capital markets",
      "url": "https://www.aries76.com/blog",
      "publisher": {
        "@type": "Organization",
        "name": "Aries76 Ltd",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.aries76.com/aries76-og-logo.png"
        }
      }
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
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
            Insights & <span className="text-accent">Research</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl font-light text-white/80 max-w-3xl mb-8"
          >
            Expert perspectives on GP capital advisory, private markets trends, and institutional capital formation
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/blog/archive">
              <Button variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Archive className="w-4 h-4" />
                Browse Archive
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(0, 6).map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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

          {/* View All Link */}
          <div className="mt-16 text-center">
            <Link to="/blog/archive">
              <Button variant="outline" size="lg" className="gap-2">
                <Archive className="w-5 h-5" />
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Blog;