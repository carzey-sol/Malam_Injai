import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/artists/categories
export async function GET() {
  try {
    // Get all unique categories from artists
    const categories = await prisma.artist.findMany({
      select: {
        category: true
      },
      distinct: ['category']
    });

    // Get artist count for each category
    const categoryStats = await prisma.artist.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });

    // Map categories with their display names and counts
    const categoryMap: { [key: string]: { label: string; count: number } } = {
      'pioneers': { label: 'Top 10 Now', count: 0 },
      'collaborators': { label: 'Highlights', count: 0 },
      'emerging': { label: 'New Releases', count: 0 }
    };

    // Update counts
    categoryStats.forEach(stat => {
      if (categoryMap[stat.category]) {
        categoryMap[stat.category].count = stat._count.category;
      }
    });

    // Format response
    const formattedCategories = Object.entries(categoryMap).map(([value, data]) => ({
      value,
      label: data.label,
      count: data.count
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching artist categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/artists/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { category, label } = await request.json();
    
    if (!category || !label) {
      return NextResponse.json(
        { error: 'Category and label are required' },
        { status: 400 }
      );
    }

    // For now, we'll just return the new category
    // In a full implementation, you might want to store categories in a separate table
    return NextResponse.json({
      value: category,
      label: label,
      count: 0
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
