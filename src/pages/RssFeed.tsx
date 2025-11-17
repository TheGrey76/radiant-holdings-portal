import { useEffect } from 'react';
import { blogPosts } from '@/data/blogPosts';

const RssFeed = () => {
  useEffect(() => {
    const baseUrl = window.location.origin;
    
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Aries76 - Private Markets Intelligence</title>
    <link>${baseUrl}/blog</link>
    <description>Expert insights on private equity, venture capital, and structured products from Aries76</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${blogPosts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <category>${post.category}</category>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`;

    // Create a blob and trigger download
    const blob = new Blob([rssXml], { type: 'application/rss+xml' });
    const url = URL.createObjectURL(blob);
    
    // Set the page content as XML
    document.open();
    document.write(rssXml);
    document.close();
    
    // Clean up
    return () => {
      URL.revokeObjectURL(url);
    };
  }, []);

  return null;
};

export default RssFeed;
