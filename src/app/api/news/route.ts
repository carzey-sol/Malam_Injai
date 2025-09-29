import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Check if we're in build mode or database is not available
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    
    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = category.toUpperCase();
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    const articles = await prisma.newsArticle.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: 50
    });
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Return empty array during build instead of error
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const body = await request.json();
    const {
      title,
      content,
      image,
      excerpt,
      author,
      category,
      featured = false,
      links = []
    } = body;
    
    if (!title || !content || !image || !excerpt || !author || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const article = await prisma.newsArticle.create({
      data: {
        title,
        content,
        image,
        excerpt,
        author,
        category: category.toUpperCase(),
        featured,
        links
      }
    });

    // Send newsletter if this is a featured article
    if (featured) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/newsletter`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            articleId: article.id,
            subject: `New Featured Article: ${title}`,
            content: content
          }),
        });
      } catch (error) {
        console.error('Failed to send newsletter:', error);
        // Don't fail the article creation if newsletter fails
      }
    }
    
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating news article:', error);
    return NextResponse.json(
      { error: 'Failed to create news article' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id, ...articleData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    const updated = await prisma.newsArticle.update({
      where: { id },
      data: {
        title: articleData.title,
        content: articleData.content,
        image: articleData.image,
        excerpt: articleData.excerpt,
        author: articleData.author,
        category: articleData.category?.toUpperCase(),
        featured: articleData.featured,
        links: articleData.links
      }
    });

    return NextResponse.json(
      { message: 'Article updated successfully', article: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    await prisma.newsArticle.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Article deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
