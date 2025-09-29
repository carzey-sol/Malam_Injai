// Newsletter Database Queries
// Run these in your database or use Prisma Studio

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📧 Newsletter Subscriber Queries\n');

  // 1. Get all active subscribers
  console.log('1. Active Subscribers:');
  const activeSubscribers = await prisma.newsletterSubscription.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' }
  });
  console.log(`Total: ${activeSubscribers.length}`);
  activeSubscribers.forEach(sub => {
    console.log(`- ${sub.email} (${sub.source}) - ${sub.createdAt.toLocaleDateString()}`);
  });

  // 2. Get subscriber statistics
  console.log('\n2. Subscriber Statistics:');
  const total = await prisma.newsletterSubscription.count();
  const active = await prisma.newsletterSubscription.count({
    where: { status: 'active' }
  });
  const unsubscribed = await prisma.newsletterSubscription.count({
    where: { status: 'unsubscribed' }
  });
  const bounced = await prisma.newsletterSubscription.count({
    where: { status: 'bounced' }
  });

  console.log(`Total Subscribers: ${total}`);
  console.log(`Active: ${active}`);
  console.log(`Unsubscribed: ${unsubscribed}`);
  console.log(`Bounced: ${bounced}`);

  // 3. Get subscribers by source
  console.log('\n3. Subscribers by Source:');
  const bySource = await prisma.newsletterSubscription.groupBy({
    by: ['source'],
    where: { status: 'active' },
    _count: { source: true }
  });
  bySource.forEach(group => {
    console.log(`${group.source}: ${group._count.source}`);
  });

  // 4. Get recent subscribers (last 7 days)
  console.log('\n4. Recent Subscribers (Last 7 days):');
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentSubscribers = await prisma.newsletterSubscription.findMany({
    where: {
      status: 'active',
      createdAt: { gte: sevenDaysAgo }
    },
    orderBy: { createdAt: 'desc' }
  });
  console.log(`New subscribers: ${recentSubscribers.length}`);
  recentSubscribers.forEach(sub => {
    console.log(`- ${sub.email} - ${sub.createdAt.toLocaleDateString()}`);
  });

  // 5. Export emails for newsletter
  console.log('\n5. Export Active Emails (for newsletter):');
  const emails = activeSubscribers.map(sub => sub.email);
  console.log('Emails:', emails.join(', '));

  // 6. Check for duplicate emails
  console.log('\n6. Checking for Duplicates:');
  const duplicates = await prisma.newsletterSubscription.groupBy({
    by: ['email'],
    _count: { email: true },
    having: { email: { _count: { gt: 1 } } }
  });
  
  if (duplicates.length > 0) {
    console.log('Duplicate emails found:');
    duplicates.forEach(dup => {
      console.log(`- ${dup.email}: ${dup._count.email} entries`);
    });
  } else {
    console.log('No duplicate emails found ✅');
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
