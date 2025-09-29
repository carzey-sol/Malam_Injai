import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const { id } = params;

    if (!status || !['active', 'unsubscribed', 'bounced'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updatedSubscriber = await prisma.newsletterSubscription.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedSubscriber);

  } catch (error) {
    console.error('Error updating subscriber status:', error);
    return NextResponse.json(
      { error: 'Failed to update subscriber status' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.newsletterSubscription.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Subscriber deleted successfully' });

  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}
