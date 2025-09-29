import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

// Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const { email, source = 'website' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email }
    });

    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        return NextResponse.json(
          { error: 'Email is already subscribed' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscription.update({
          where: { email },
          data: { status: 'active', source }
        });
      }
    } else {
      // Create new subscription
      await prisma.newsletterSubscription.create({
        data: { email, source }
      });
    }

    // Send welcome email
    await sendWelcomeEmail(email);

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}

// Unsubscribe from newsletter
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await prisma.newsletterSubscription.update({
      where: { email },
      data: { status: 'unsubscribed' }
    });

    return NextResponse.json(
      { message: 'Successfully unsubscribed from newsletter' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
}

// Send newsletter to all subscribers
export async function PUT(request: NextRequest) {
  try {
    const { articleId, subject, content } = await request.json();

    if (!articleId || !subject || !content) {
      return NextResponse.json(
        { error: 'Article ID, subject, and content are required' },
        { status: 400 }
      );
    }

    // Get all active subscribers
    const subscribers = await prisma.newsletterSubscription.findMany({
      where: { status: 'active' }
    });

    // Get article details
    const article = await prisma.newsArticle.findUnique({
      where: { id: articleId }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Send newsletter to all subscribers
    const results = await sendNewsletterToSubscribers(subscribers, article, subject, content);

    return NextResponse.json(
      { 
        message: `Newsletter sent to ${results.success} subscribers`,
        failed: results.failed 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}

async function sendWelcomeEmail(email: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Injai Channel Newsletter!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #000; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; color: #ff0000;">Welcome to Injai Channel!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">The Premier Destination for Guigui Rap Culture</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #ddd;">
          <h2 style="color: #333; margin-top: 0;">Thank You for Subscribing!</h2>
          
          <p>You're now part of the Injai Channel community and will receive:</p>
          
          <ul style="color: #555; line-height: 1.6;">
            <li>Latest news and updates from the Guigui rap scene</li>
            <li>Exclusive artist interviews and behind-the-scenes content</li>
            <li>Event announcements and ticket pre-sales</li>
            <li>New music releases and video premieres</li>
            <li>Community highlights and featured content</li>
          </ul>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff0000;">
            <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
            <p style="margin: 0; color: #555;">Stay tuned for our next newsletter with the latest updates from the Guigui rap world!</p>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666;">
          <p>You can unsubscribe at any time by clicking the link in any newsletter email.</p>
          <p>© 2024 Injai Channel. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function sendNewsletterToSubscribers(subscribers: any[], article: any, subject: string, content: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let success = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: `Injai Channel Newsletter: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #000; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; color: #ff0000;">Injai Channel Newsletter</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Latest from the Guigui Rap Scene</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #ddd;">
              <h2 style="color: #333; margin-top: 0;">${subject}</h2>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">${article.title}</h3>
                <p style="color: #666; margin: 10px 0;">By ${article.author} • ${new Date(article.publishedAt).toLocaleDateString()}</p>
                <p style="color: #555; line-height: 1.6;">${article.excerpt}</p>
              </div>
              
              <div style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h3 style="color: #333; margin-top: 0;">Full Article</h3>
                <div style="color: #555; line-height: 1.6;">${content}</div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/news/${article.id}" 
                   style="background: #ff0000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Read Full Article
                </a>
              </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666;">
              <p>You're receiving this because you subscribed to Injai Channel newsletter.</p>
              <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/unsubscribe?email=${subscriber.email}" style="color: #666;">Unsubscribe</a></p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      success++;
    } catch (error) {
      console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
      failed++;
    }
  }

  return { success, failed };
}
