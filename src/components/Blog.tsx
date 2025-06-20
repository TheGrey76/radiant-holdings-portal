
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

const BlogPost = ({ title, excerpt, date, readTime, delay, slug }: { 
  title: string; 
  excerpt: string; 
  date: string; 
  readTime: string; 
  delay: number;
  slug: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  
  return (
    <motion.article 
      ref={ref}
      className="bg-white rounded-xl shadow-smooth p-6 transition-all duration-300 hover:shadow-smooth-lg group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <Calendar className="w-4 h-4 mr-2" />
        <span>{date}</span>
        <span className="mx-2">•</span>
        <span>{readTime} read</span>
      </div>
      
      <h3 className="text-xl font-semibold text-aries-navy mb-3 group-hover:text-aries-blue transition-colors">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {excerpt}
      </p>
      
      <Link 
        to={`/blog/${slug}`}
        className="flex items-center text-aries-navy font-medium group-hover:text-aries-blue transition-colors"
      >
        <span>Read more</span>
        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.article>
  );
};

const Blog = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  
  const blogPosts = [
    {
      title: "The Future of AI in Financial Services",
      excerpt: "Exploring how artificial intelligence is revolutionizing the financial sector, from automated trading to personalized banking experiences and risk assessment.",
      date: "Dec 15, 2024",
      readTime: "5 min",
      slug: "future-ai-financial-services"
    },
    {
      title: "Bitcoin's Role in Modern Portfolio Diversification",
      excerpt: "An analysis of cryptocurrency's evolution from speculative asset to legitimate store of value and its implications for institutional investors.",
      date: "Dec 10, 2024",
      readTime: "7 min",
      slug: "bitcoin-portfolio-diversification"
    },
    {
      title: "Pre-IPO Investment Strategies in Tech",
      excerpt: "Understanding the opportunities and risks in pre-public company investments, with insights from our experience with Kraken and Upgrade Inc.",
      date: "Dec 5, 2024",
      readTime: "6 min",
      slug: "pre-ipo-investment-strategies"
    }
  ];
  
  return (
    <section id="blog" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16" ref={sectionRef}>
          <motion.span 
            className="inline-block px-3 py-1 bg-aries-gray text-aries-navy rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            Insights
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Latest Insights & Analysis
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Stay informed with our expert perspectives on AI, fintech, and emerging market opportunities.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <BlogPost 
              key={index}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              readTime={post.readTime}
              slug={post.slug}
              delay={0.3 + (index * 0.1)}
            />
          ))}
        </div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.a 
            href="#blog" 
            className="inline-flex items-center px-6 py-3 bg-transparent border border-aries-navy text-aries-navy rounded-md font-medium transition-all hover:bg-aries-navy/5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            View All Articles
            <ArrowRight className="w-4 h-4 ml-2" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
