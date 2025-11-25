import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Archive } from 'lucide-react';
import { useEffect } from 'react';
import { blogPosts } from '@/data/blogPosts';

const Blog = () => {
  // Sort blog posts by date (newest first)
  const sortedBlogPosts = [...blogPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
            {sortedBlogPosts.slice(0, 6).map((post, index) => (
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