'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import SocialShare from '@/components/SocialShare';
import ErrorBoundary from '@/components/ErrorBoundary';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  image: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: 'GENERAL' | 'RELEASES' | 'EVENTS' | 'INTERVIEWS' | 'INDUSTRY';
  featured: boolean;
  links?: {
    text: string;
    url: string;
  }[];
}

export default function NewsArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/news/${params.id}`);
    }
  }, [params.id]);

  const fetchArticle = async (id: string) => {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/news/${id}`);
      if (!response.ok) {
        throw new Error('Article not found');
      }
      const data = await response.json();
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'GENERAL': return 'General';
      case 'RELEASES': return 'New Releases';
      case 'EVENTS': return 'Events';
      case 'INTERVIEWS': return 'Interviews';
      case 'INDUSTRY': return 'Industry News';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container">
          <div className="loading">Loading article...</div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container">
          <div className="error">Error: {error || 'Article not found'}</div>
          <Link href="/news" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      {/* Article Header */}
      <section className="article-header">
        <div className="container">
          <div className="article-meta">
            <span className="article-category">{getCategoryLabel(article.category)}</span>
            <span className="article-date">{formatDate(article.publishedAt)}</span>
          </div>
          <h1 className="article-title">{article.title}</h1>
          <div className="article-author">
            <span>By {article.author}</span>
          </div>
        </div>
      </section>

      {/* Article Image */}
      <section className="article-image-section">
        <div className="container">
          <div className="article-image-large">
            <Image
              src={article.image}
              alt={article.title}
              width={800}
              height={400}
              style={{ objectFit: 'cover', borderRadius: '10px' }}
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="article-content-section">
        <div className="container">
          <div className="article-content">
            <div 
              className="article-body"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            
            {/* Social Share */}
            {shareUrl && (
              <ErrorBoundary>
                <SocialShare 
                  url={shareUrl}
                  title={article.title}
                  description={article.excerpt}
                />
              </ErrorBoundary>
            )}
            
            {/* Article Links */}
            {article.links && article.links.length > 0 && (
              <div className="article-links">
                <h3>Related Links</h3>
                <div className="links-grid">
                  {article.links.map((link, index) => (
                    <Link 
                      key={index} 
                      href={link.url} 
                      className="btn btn-outline"
                      target={link.url.startsWith('http') ? '_blank' : '_self'}
                    >
                      {link.text}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="related-articles">
        <div className="container">
          <h2 className="section-title">More News</h2>
          <div className="related-links">
            <Link href="/news" className="btn btn-primary">
              All News
            </Link>
            <Link href="/artists" className="btn btn-secondary">
              Artists
            </Link>
            <Link href="/events" className="btn btn-outline">
              Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
