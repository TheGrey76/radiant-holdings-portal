import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useEffect, ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import ShareButtons from '@/components/ShareButtons';

interface BlogLayoutProps {
  title: string;
  description: string;
  category: string;
  date: string;
  dateISO: string;
  readTime: string;
  slug: string;
  children: ReactNode;
  keywords?: string[];
}

const BlogLayout = ({
  title,
  description,
  category,
  date,
  dateISO,
  readTime,
  slug,
  children,
  keywords = []
}: BlogLayoutProps) => {
  const articleUrl = `https://www.aries76.com/blog/${slug}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Helmet>
        <title>{title} | Aries76</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={articleUrl} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:image" content="https://www.aries76.com/aries76-og-logo.png" />
        <meta property="og:site_name" content="Aries76" />
        
        {/* Article specific */}
        <meta property="article:published_time" content={`${dateISO}T09:00:00+00:00`} />
        <meta property="article:modified_time" content={`${dateISO}T09:00:00+00:00`} />
        <meta property="article:author" content="Aries76 Ltd" />
        <meta property="article:section" content={category} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://www.aries76.com/aries76-og-logo.png" />
        
        {/* Additional SEO */}
        {keywords.length > 0 && (
          <meta name="keywords" content={keywords.join(', ')} />
        )}
        <meta name="author" content="Aries76 Ltd" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "image": "https://www.aries76.com/aries76-og-logo.png",
            "datePublished": `${dateISO}T09:00:00+00:00`,
            "dateModified": `${dateISO}T09:00:00+00:00`,
            "author": {
              "@type": "Organization",
              "name": "Aries76 Ltd",
              "url": "https://www.aries76.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Aries76 Ltd",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.aries76.com/aries76-og-logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": articleUrl
            },
            "articleSection": category,
            "inLanguage": "en-US"
          })}
        </script>
        
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
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
                "name": title,
                "item": articleUrl
              }
            ]
          })}
        </script>
      </Helmet>
      
      <article className="max-w-4xl mx-auto px-6 md:px-10">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8 font-light"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Insights
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <span className="text-sm text-accent uppercase tracking-wider font-light">{category}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light text-foreground mb-6 tracking-tight">
            {title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={`${dateISO}T09:00:00+00:00`}>{date}</time>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readTime}</span>
            </div>
          </div>

          <ShareButtons 
            title={title}
            url={articleUrl}
          />

          <div className="prose prose-lg max-w-none mt-8">
            {children}
          </div>
        </motion.div>
      </article>
    </div>
  );
};

export default BlogLayout;
