// Test Newsletter System
// Run this script to test the newsletter functionality

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testNewsletterSystem() {
  console.log('🧪 Testing Newsletter System\n');

  try {
    // 1. Test database connection
    console.log('1. Testing database connection...');
    const subscriberCount = await prisma.newsletterSubscription.count();
    console.log(`✅ Database connected. Current subscribers: ${subscriberCount}\n`);

    // 2. Test creating a test subscriber
    console.log('2. Testing subscriber creation...');
    const testEmail = `test-${Date.now()}@example.com`;
    
    const newSubscriber = await prisma.newsletterSubscription.create({
      data: {
        email: testEmail,
        source: 'test',
        status: 'active'
      }
    });
    console.log(`✅ Test subscriber created: ${newSubscriber.email}\n`);

    // 3. Test fetching subscribers
    console.log('3. Testing subscriber retrieval...');
    const subscribers = await prisma.newsletterSubscription.findMany({
      where: { status: 'active' },
      take: 5
    });
    console.log(`✅ Found ${subscribers.length} active subscribers`);
    subscribers.forEach(sub => {
      console.log(`   - ${sub.email} (${sub.source})`);
    });
    console.log('');

    // 4. Test updating subscriber status
    console.log('4. Testing status update...');
    const updatedSubscriber = await prisma.newsletterSubscription.update({
      where: { id: newSubscriber.id },
      data: { status: 'unsubscribed' }
    });
    console.log(`✅ Subscriber status updated to: ${updatedSubscriber.status}\n`);

    // 5. Test statistics
    console.log('5. Testing statistics...');
    const stats = {
      total: await prisma.newsletterSubscription.count(),
      active: await prisma.newsletterSubscription.count({ where: { status: 'active' } }),
      unsubscribed: await prisma.newsletterSubscription.count({ where: { status: 'unsubscribed' } })
    };
    console.log('✅ Statistics:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Active: ${stats.active}`);
    console.log(`   Unsubscribed: ${stats.unsubscribed}\n`);

    // 6. Clean up test data
    console.log('6. Cleaning up test data...');
    await prisma.newsletterSubscription.delete({
      where: { id: newSubscriber.id }
    });
    console.log('✅ Test subscriber deleted\n');

    console.log('🎉 All newsletter system tests passed!');
    console.log('\nNext steps:');
    console.log('1. Set up your email configuration in .env file');
    console.log('2. Test the contact form and newsletter signup on your website');
    console.log('3. Create a featured news article to test automatic newsletter sending');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testNewsletterSystem();
