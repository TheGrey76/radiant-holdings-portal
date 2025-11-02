import { Share2, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-3 py-6 border-t border-b border-border/50 my-8">
      <Share2 className="w-5 h-5 text-muted-foreground" />
      <span className="text-sm font-light text-muted-foreground">Share this article:</span>
      <div className="flex gap-2">
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
      </div>
    </div>
  );
};

export default ShareButtons;
