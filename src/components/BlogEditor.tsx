
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { BlogPost } from '@/pages/BlogAdmin';

interface BlogEditorProps {
  post?: BlogPost | null;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}

const BlogEditor = ({ post, onSave, onCancel }: BlogEditorProps) => {
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [author, setAuthor] = useState(post?.author || 'Aries76 Research Team');
  const [readTime, setReadTime] = useState(post?.readTime || '5 min');
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || '');
  const [isPreview, setIsPreview] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in at least the title and content');
      return;
    }

    const slug = generateSlug(title);
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const blogPost: BlogPost = {
      id: post?.id || Date.now().toString(),
      title: title.trim(),
      excerpt: excerpt.trim() || content.substring(0, 150) + '...',
      content: content.trim(),
      date,
      readTime,
      slug,
      author,
      featuredImage: featuredImage || '/lovable-uploads/3fb70498-7bc0-4d2c-aa59-d7605f5f5319.png'
    };

    onSave(blogPost);
  };

  const renderPreview = () => {
    return (
      <div className="prose prose-lg max-w-none">
        <div className="mb-8">
          {featuredImage && (
            <img 
              src={featuredImage} 
              alt={title}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-smooth mb-6"
            />
          )}
          <h1 className="text-3xl md:text-5xl font-display font-bold text-aries-navy mb-4">
            {title}
          </h1>
          {excerpt && (
            <p className="text-xl text-gray-600 mb-6">{excerpt}</p>
          )}
          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-8">
            <span>{new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            <span>By {author}</span>
            <span>{readTime} read</span>
          </div>
        </div>
        <div 
          className="prose-content"
          dangerouslySetInnerHTML={{ 
            __html: content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }} 
        />
      </div>
    );
  };

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
              <h1 className="text-3xl md:text-4xl font-display font-bold text-aries-navy">
                {post ? 'Edit Article' : 'New Article'}
              </h1>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsPreview(!isPreview)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isPreview ? 'Edit' : 'Preview'}
                </Button>
                <Button
                  variant="outline"
                  onClick={onCancel}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-aries-navy hover:bg-aries-blue text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Article
                </Button>
              </div>
            </div>

            {isPreview ? (
              <Card>
                <CardContent className="p-8">
                  {renderPreview()}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Article Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter article title"
                          className="text-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Excerpt
                        </label>
                        <Textarea
                          value={excerpt}
                          onChange={(e) => setExcerpt(e.target.value)}
                          placeholder="Brief description of the article (optional - will be auto-generated from content)"
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content *
                        </label>
                        <Textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Write your article content here. Use **text** for bold formatting."
                          rows={20}
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Tip: Use **text** for bold formatting. Line breaks will be preserved.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Article Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Author
                        </label>
                        <Input
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          placeholder="Author name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Read Time
                        </label>
                        <Input
                          value={readTime}
                          onChange={(e) => setReadTime(e.target.value)}
                          placeholder="e.g., 5 min"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Featured Image URL
                        </label>
                        <Input
                          value={featuredImage}
                          onChange={(e) => setFeaturedImage(e.target.value)}
                          placeholder="Image URL (optional)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Leave empty to use default logo
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">Preview Info</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Slug:</strong> {generateSlug(title) || 'auto-generated'}</p>
                          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogEditor;
