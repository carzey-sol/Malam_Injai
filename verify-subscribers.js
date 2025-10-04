// Verify newsletter subscribers table

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySubscribers() {
  try {
    const subscribers = await prisma.newsletterSubscription.findMany();
    console.log('📊 Newsletter Subscribers:');
    subscribers.forEach(sub => {
      console.log(`   • ${sub.name || 'No name'} (${sub.email}) - ${sub.status}`);
    });
    console.log(`\nTotal subscribers: ${subscribers.length}`);
  } catch (error) {
    console.log('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifySubscribers();
