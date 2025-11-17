import { Share2, Linkedin, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const { toast } = useToast();
  const [isDistributing, setIsDistributing] = useState(false);
  
  // Ensure we have a full URL for sharing
  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
  
  const handleShare = (platform: 'linkedin' | 'twitter') => {
    let shareUrl = '';
    
    if (platform === 'linkedin') {
      // LinkedIn share - use non-encoded URL for better compatibility
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
    } else {
      // Twitter/X share
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const handleDistribute = async () => {
    setIsDistributing(true);
    try {
      const { data, error } = await supabase.functions.invoke('distribute-content', {
        body: {
          title,
          url: fullUrl,
          excerpt: title,
          platform: 'linkedin'
        }
      });

      if (error) throw error;

      toast({
        title: "Content Distributed",
        description: data.success 
          ? "Successfully sent to LinkedIn via Zapier" 
          : "Failed to distribute content. Check your webhook configuration.",
        variant: data.success ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Distribution error:', error);
      toast({
        title: "Error",
        description: "Failed to distribute content. Make sure your Zapier webhook is configured.",
        variant: "destructive"
      });
    } finally {
      setIsDistributing(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 py-6 border-t border-b border-border/50 my-8">
      <div className="flex items-center gap-3">
        <Share2 className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm font-light text-muted-foreground">Share this article:</span>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('linkedin')}
            className="gap-2"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('twitter')}
            className="gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDistribute}
            disabled={isDistributing}
            className="gap-2"
          >
            <Zap className={`w-4 h-4 ${isDistributing ? 'animate-pulse' : ''}`} />
            {isDistributing ? 'Distributing...' : 'Auto-Distribute'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareButtons;
