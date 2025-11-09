import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import SocialShare from '@/components/SocialShare';
import ErrorBoundary from '@/components/ErrorBoundary';
import StructuredData from '@/components/StructuredData';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  image: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  category: 'GENERAL' | 'RELEASES' | 'EVENTS' | 'INTERVIEWS' | 'INDUSTRY';
  featured: boolean;
  links: any;
}

interface NewsArticlePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  try {
    const article = await prisma.newsArticle.findUnique({
      where: { id: params.id }
    });

    if (!article) {
      return generateSEOMetadata({
        title: 'Article Not Found',
        description: 'The requested article could not be found.',
        noindex: true,
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://injai-channel.com';
    const articleUrl = `${siteUrl}/news/${article.id}`;

    return generateSEOMetadata({
      title: article.title,
      description: article.excerpt.substring(0, 160), // Ensure description is not too long
      keywords: ['Guigui rap', 'music news', article.category.toLowerCase(), 'rap culture'],
      image: article.image,
      url: articleUrl,
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      author: article.author,
      section: article.category,
      tags: [article.category],
      canonical: articleUrl,
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return generateSEOMetadata({
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
      noindex: true,
    });
  }
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  let article: NewsArticle | null = null;
  let shareUrl = '';

  try {
    article = await prisma.newsArticle.findUnique({
      where: { id: params.id }
    });

    if (!article) {
      notFound();
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://injai-channel.com';
    shareUrl = `${siteUrl}/news/${article.id}`;
  } catch (error) {
    console.error('Error fetching article:', error);
    notFound();
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <StructuredData 
        type="Article" 
        data={{
          headline: article.title,
          description: article.excerpt,
          image: article.image,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          author: {
            '@type': 'Person',
            name: article.author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Injai Channel',
            logo: {
              '@type': 'ImageObject',
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://injai-channel.com'}/logo.png`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://injai-channel.com'}/news/${article.id}`,
          },
          articleSection: article.category,
          keywords: ['Guigui rap', 'music news', article.category.toLowerCase()],
        }} 
      />
      
      {/* Article Header */}
      <section className="article-header">
        <div className="container">
          <div className="article-meta">
            <span className="article-category">{article.category}</span>
            <span className="article-date">{formatDate(article.publishedAt)}</span>
            <span className="article-author">By {article.author}</span>
          </div>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-excerpt">{article.excerpt}</p>
        </div>
      </section>

      {/* Article Image */}
      <section className="article-image-section">
        <div className="container">
          <div className="article-image">
            <Image
              src={article.image}
              alt={article.title}
              fill
              style={{ objectFit: 'contain' }}
              priority
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
            {article.links && Array.isArray(article.links) && article.links.length > 0 && (
              <div className="article-links">
                <h3>Related Links</h3>
                <div className="links-grid">
                  {article.links.map((link: any, index: number) => (
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