
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { BlogPost as BlogPostType } from '@/pages/BlogAdmin';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const isContentInView = useInView(contentRef, { once: true, margin: "-100px 0px" });
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Load post from localStorage
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      const posts: BlogPostType[] = JSON.parse(savedPosts);
      const foundPost = posts.find(p => p.slug === slug);
      if (foundPost) {
        setPost(foundPost);
      }
    }
    
    // If no post found, use default sample post
    if (!post && slug === 'future-ai-financial-services') {
      setPost({
        id: '1',
        title: "The Future of AI in Financial Services",
        excerpt: "Exploring how artificial intelligence is revolutionizing the financial sector",
        date: "December 15, 2024",
        author: "Aries76 Research Team",
        readTime: "5 min read",
        slug: "future-ai-financial-services",
        featuredImage: "/lovable-uploads/3fb70498-7bc0-4d2c-aa59-d7605f5f5319.png",
        content: `
          <p>Artificial Intelligence is fundamentally transforming the financial services landscape, creating unprecedented opportunities for innovation while presenting new challenges for traditional institutions.</p>
          
          <h2>The Current State of AI in Finance</h2>
          <p>Today's financial institutions are leveraging AI across multiple domains, from automated trading algorithms to sophisticated risk assessment models. Machine learning algorithms now process millions of transactions in real-time, identifying patterns and anomalies that would be impossible for human analysts to detect.</p>
          
          <h2>Key Areas of Innovation</h2>
          
          <h3>Automated Trading and Investment Management</h3>
          <p>AI-powered trading systems can analyze market data, news sentiment, and economic indicators simultaneously, making split-second decisions that capitalize on market inefficiencies. These systems have shown remarkable success in generating alpha while managing risk more effectively than traditional approaches.</p>
          
          <h3>Personalized Banking Experiences</h3>
          <p>Financial institutions are using AI to create highly personalized customer experiences. From chatbots that provide instant customer service to recommendation engines that suggest relevant financial products, AI is making banking more intuitive and accessible.</p>
          
          <h3>Risk Assessment and Fraud Detection</h3>
          <p>Advanced machine learning models can identify fraudulent transactions with unprecedented accuracy, often flagging suspicious activity before it impacts customers. Similarly, AI-driven credit scoring models can assess risk more comprehensively than traditional methods.</p>
          
          <h2>The Investment Opportunity</h2>
          <p>As AI continues to mature, we're seeing significant investment opportunities across the fintech ecosystem. Companies that successfully integrate AI into their core operations are demonstrating superior growth metrics and market positioning.</p>
          
          <p>At Aries76, we're particularly focused on identifying early-stage companies that are leveraging AI to solve fundamental problems in financial services. Our portfolio reflects this strategy, with investments in companies that are pioneering new approaches to trading, risk management, and customer engagement.</p>
          
          <h2>Looking Ahead</h2>
          <p>The future of AI in financial services will likely be characterized by even greater integration and sophistication. We anticipate seeing developments in quantum computing applications, advanced natural language processing for regulatory compliance, and more sophisticated predictive analytics.</p>
          
          <p>For investors and financial institutions alike, the message is clear: AI is not just a technological upgrade—it's a fundamental shift that will define the winners and losers in the next decade of financial services.</p>
        `
      });
    }
    
    setLoading(false);
  }, [slug, post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aries-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 pb-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold text-aries-navy mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
            <Link 
              to="/#blog" 
              className="inline-flex items-center text-aries-navy hover:text-aries-blue transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section with Featured Image */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-aries-light to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Link 
              to="/#blog" 
              className="inline-flex items-center text-aries-navy hover:text-aries-blue transition-colors mb-8 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            
            <div className="mb-8">
              <img 
                src={post.featuredImage || '/lovable-uploads/3fb70498-7bc0-4d2c-aa59-d7605f5f5319.png'} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-smooth"
              />
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-5xl font-display font-bold text-aries-navy mb-4">
                {post.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {post.author}
                </div>
                <span>{post.readTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <motion.article
              ref={contentRef}
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0, y: 30 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: '18px',
                lineHeight: '1.8',
                color: '#374151'
              }}
              dangerouslySetInnerHTML={{ 
                __html: post.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }}
            />
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <motion.div 
        className="fixed bottom-8 right-8 z-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Link
          to="#contact"
          className="bg-aries-orange text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 font-medium flex items-center space-x-2"
        >
          <span>Get in Touch</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Newsletter CTA Section */}
      <section className="py-16 bg-aries-light">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-display font-semibold text-aries-navy mb-4">
              Stay Updated with Our Latest Insights
            </h3>
            <p className="text-gray-600 mb-8">
              Get exclusive market analysis and AI investment insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aries-blue"
              />
              <button className="px-6 py-3 bg-aries-navy text-white rounded-md font-medium hover:bg-aries-blue transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
