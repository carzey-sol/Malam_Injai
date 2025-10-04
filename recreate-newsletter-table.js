// Drop and recreate newsletter subscribers table with name column

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function recreateNewsletterTable() {
  try {
    console.log('🗑️  Dropping existing newsletter subscribers table...');
    
    // Drop the existing table
    await prisma.$executeRaw`DROP TABLE IF EXISTS "NewsletterSubscription"`;
    console.log('✅ Table dropped successfully');

    console.log('\n🔨 Recreating table with name column...');
    
    // Create the new table with name column
    await prisma.$executeRaw`
      CREATE TABLE "NewsletterSubscription" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "name" TEXT,
        "status" TEXT NOT NULL DEFAULT 'active',
        "source" TEXT NOT NULL DEFAULT 'website',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      )
    `;
    console.log('✅ Table recreated successfully');

    console.log('\n📝 Adding sample subscribers with names...');
    
    const sampleSubscribers = [
      {
        id: 'clx1234567890',
        email: 'subscriber1@example.com',
        name: 'John Doe',
        source: 'contact_form',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'clx1234567891',
        email: 'subscriber2@example.com',
        name: 'Jane Smith',
        source: 'homepage',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'clx1234567892',
        email: 'subscriber3@example.com',
        name: 'Mike Johnson',
        source: 'events_page',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'clx1234567893',
        email: 'bajgainmukesh73@gmail.com',
        name: 'Mukesh Bajgain',
        source: 'manual',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const subscriber of sampleSubscribers) {
      try {
        await prisma.$executeRaw`
          INSERT INTO "NewsletterSubscription" (id, email, name, status, source, "createdAt", "updatedAt")
          VALUES (${subscriber.id}, ${subscriber.email}, ${subscriber.name}, ${subscriber.status}, ${subscriber.source}, ${subscriber.createdAt}, ${subscriber.updatedAt})
        `;
        console.log(`✅ Added: ${subscriber.name} (${subscriber.email})`);
      } catch (error) {
        console.log(`❌ Error adding ${subscriber.email}:`, error.message);
      }
    }

    // Verify the table
    const count = await prisma.$executeRaw`SELECT COUNT(*) as total FROM "NewsletterSubscription"`;
    console.log(`\n📊 Total subscribers: ${count}`);

    console.log('\n🎉 Newsletter table recreated successfully with name column!');

  } catch (error) {
    console.error('❌ Error recreating table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
recreateNewsletterTable();
