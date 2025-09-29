import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return NextResponse.json(settings || { socialLinks: [], team: [], getInTouch: {}, featuredPlaylist: {} });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const existing = await prisma.siteSettings.findFirst();

    // Build partial update object, merging nested JSON where needed
    const updateData: any = {};
    if (body.socialLinks !== undefined) updateData.socialLinks = body.socialLinks;
    if (body.team !== undefined) updateData.team = body.team;
    if (body.featuredPlaylist !== undefined) updateData.featuredPlaylist = body.featuredPlaylist;
    if (body.getInTouch !== undefined) {
      const current = (existing && typeof (existing as any).getInTouch === 'object' && !Array.isArray((existing as any).getInTouch))
        ? (existing as any).getInTouch
        : {};
      const incoming = (body && typeof body.getInTouch === 'object' && !Array.isArray(body.getInTouch))
        ? body.getInTouch
        : {};
      updateData.getInTouch = { ...(current as any), ...(incoming as any) };
    }

    const saved = existing
      ? await prisma.siteSettings.update({ where: { id: existing.id }, data: updateData })
      : await prisma.siteSettings.create({ data: {
          socialLinks: body.socialLinks ?? [],
          team: body.team ?? [],
          featuredPlaylist: body.featuredPlaylist ?? {},
          getInTouch: body.getInTouch ?? {},
        }});
    return NextResponse.json({ message: 'Settings saved', settings: saved });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}


