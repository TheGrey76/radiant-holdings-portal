
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogEditor from '@/components/BlogEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  slug: string;
  author: string;
  featuredImage?: string;
}

const BlogAdmin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Load posts from localStorage
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const savePosts = (updatedPosts: BlogPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  };

  const handleSavePost = (post: BlogPost) => {
    if (editingPost) {
      // Update existing post
      const updatedPosts = posts.map(p => p.id === post.id ? post : p);
      savePosts(updatedPosts);
    } else {
      // Add new post
      savePosts([...posts, post]);
    }
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditing(true);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const updatedPosts = posts.filter(p => p.id !== postId);
      savePosts(updatedPosts);
    }
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <BlogEditor
        post={editingPost}
        onSave={handleSavePost}
        onCancel={() => {
          setIsEditing(false);
          setEditingPost(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <Link 
                  to="/" 
                  className="inline-flex items-center text-aries-navy hover:text-aries-blue transition-colors mb-4 font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-aries-navy">
                  Blog Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Create and manage your blog articles
                </p>
              </div>
              <Button 
                onClick={handleNewPost}
                className="bg-aries-navy hover:bg-aries-blue text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
            </div>

            {posts.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <h3 className="text-xl font-semibold text-gray-600 mb-4">
                    No articles yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start by creating your first blog post
                  </p>
                  <Button 
                    onClick={handleNewPost}
                    className="bg-aries-navy hover:bg-aries-blue text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Article
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-aries-navy mb-2">
                            {post.title}
                          </CardTitle>
                          <p className="text-gray-600 mb-2">{post.excerpt}</p>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span>{post.date}</span>
                            <span>{post.readTime}</span>
                            <span>By {post.author}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPost(post)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogAdmin;
