const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn']
  });

  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}`);
    
    const artistCount = await prisma.artist.count();
    console.log(`🎤 Total artists in database: ${artistCount}`);
    
    const newsCount = await prisma.newsArticle.count();
    console.log(`📰 Total news articles in database: ${newsCount}`);
    
    const newsletterCount = await prisma.newsletterSubscription.count();
    console.log(`📧 Total newsletter subscriptions: ${newsletterCount}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    
    if (error.code === 'P1001') {
      console.error('💡 This usually means the database server is not running or the connection string is incorrect.');
    } else if (error.code === 'P1003') {
      console.error('💡 This usually means the database does not exist.');
    } else if (error.code === 'P1017') {
      console.error('💡 This usually means the database connection was closed.');
    }
    
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Make sure PostgreSQL is running');
    console.error('2. Check your DATABASE_URL in .env file');
    console.error('3. Ensure the database exists');
    console.error('4. Verify username/password are correct');
    
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
