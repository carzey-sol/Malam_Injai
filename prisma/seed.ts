import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.video.deleteMany();
  await prisma.event.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.newsArticle.deleteMany();

  // Admin user
  const hashed = await bcrypt.hash('admin123', 12);
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@injaichannel.com',
      password: hashed,
      role: 'admin',
    }
  });

  // Artists
  const straiker = await prisma.artist.create({ data: {
    name: 'Straiker',
    bio: 'A founding figure in Guigui rap, Straiker is known for his energetic flow and street anthems.',
    category: 'pioneers',
    image: 'https://i.ytimg.com/vi/rRhwls8f-Pc/hqdefault.jpg',
    thumbnail: 'https://i.ytimg.com/vi/rRhwls8f-Pc/hqdefault.jpg',
    yearsActive: 10,
    tracksReleased: 40,
    streams: 200000,
    youtube: 'https://www.youtube.com/@straiker',
    instagram: 'https://www.instagram.com/straiker',
    featured: true,
  }});

  const soul = await prisma.artist.create({ data: {
    name: "Soul Bang's",
    bio: 'Guinean R&B icon blending soulful melodies with rap verses.',
    category: 'collaborators',
    image: 'https://i.ytimg.com/vi/ysMKr3c7fx4/hqdefault.jpg',
    thumbnail: 'https://i.ytimg.com/vi/ysMKr3c7fx4/hqdefault.jpg',
    yearsActive: 8,
    tracksReleased: 35,
    streams: 180000,
    youtube: 'https://www.youtube.com/@soulbangs',
    instagram: 'https://www.instagram.com/soulbangs',
    featured: true,
  }});

  const fish = await prisma.artist.create({ data: {
    name: 'Fish Killer',
    bio: "Instinct Killers' dynamic rapper with an impactful stage presence.",
    category: 'pioneers',
    image: 'https://i.ytimg.com/vi/SOIw-SNdsEA/hqdefault.jpg',
    thumbnail: 'https://i.ytimg.com/vi/SOIw-SNdsEA/hqdefault.jpg',
    yearsActive: 12,
    tracksReleased: 50,
    streams: 250000,
    youtube: 'https://www.youtube.com/@fishkiller',
    instagram: 'https://www.instagram.com/fishkiller',
    featured: true,
  }});

  const jin = await prisma.artist.create({ data: {
    name: 'MC Jin',
    bio: 'MC Jin pays homage to Bruce Lee through rap.',
    category: 'collaborators',
    image: 'https://i.ytimg.com/vi/EpX4InYKSbs/hqdefault.jpg',
    thumbnail: 'https://i.ytimg.com/vi/EpX4InYKSbs/hqdefault.jpg',
    yearsActive: 15,
    tracksReleased: 60,
    streams: 300000,
    youtube: 'https://www.youtube.com/@mcjin',
    instagram: 'https://www.instagram.com/mcjin',
    featured: false,
  }});

  // Videos
  await prisma.video.createMany({ data: [
    { title: 'Straiker - Mental (Official Music Video)', artistId: straiker.id, youtubeId: 'rRhwls8f-Pc', description: 'Official music video by Straiker', thumbnail: 'https://i.ytimg.com/vi/rRhwls8f-Pc/hqdefault.jpg', category: 'music', featured: true, views: 202000, uploadDate: new Date('2025-01-15') },
    { title: 'Fish Killer – Woulémakoui (Clip Officiel)', artistId: fish.id, youtubeId: 'nLxvdVZVLWo', description: "Official clip from Instinct Killers's channel", thumbnail: 'https://i.ytimg.com/vi/nLxvdVZVLWo/hqdefault.jpg', category: 'music', featured: true, views: 5000000, uploadDate: new Date('2022-06-15') },
    { title: 'MC Jin – Beat Kune Do', artistId: jin.id, youtubeId: 'EpX4InYKSbs', description: "Official video featuring Jin's signature freestyle style", thumbnail: 'https://i.ytimg.com/vi/EpX4InYKSbs/hqdefault.jpg', category: 'music', featured: true, views: 35000, uploadDate: new Date('2024-03-20') },
    { title: "Soul Bang's – Love Story (Visualizer)", artistId: soul.id, youtubeId: 'ysMKr3c7fx4', description: 'Visualizer collaboration delivering soulful and rap fusion', thumbnail: 'https://i.ytimg.com/vi/ysMKr3c7fx4/hqdefault.jpg', category: 'music', featured: true, views: 5600, uploadDate: new Date('2025-07-10') },
  ]});

  // Events
  await prisma.event.create({ data: {
    title: 'Guigui Rap Festival 2024',
    description: 'Annual celebration of Guigui rap culture with live performances',
    date: new Date('2024-03-15'),
    location: 'Downtown Arena',
    type: 'festival',
    status: 'upcoming',
    image: 'https://i.ytimg.com/vi/rRhwls8f-Pc/hqdefault.jpg',
    featured: true,
    ticketPrice: 50,
    capacity: 1000,
  }});

  await prisma.event.create({ data: {
    title: 'New Album Release',
    description: "MC Flow's highly anticipated new album drops worldwide",
    date: new Date('2024-03-22'),
    location: 'Digital Release',
    type: 'release',
    status: 'upcoming',
    image: 'https://i.ytimg.com/vi/ysMKr3c7fx4/hqdefault.jpg',
  }});

  // News Articles
  await prisma.newsArticle.createMany({ data: [
    {
      title: 'Guigui Rap Scene Reaches New Heights in 2024',
      content: '<h2>The Rise of Guigui Rap</h2><p>The Guigui rap scene has experienced unprecedented growth this year, with artists like <strong>Straiker</strong> and <strong>Fish Killer</strong> leading the charge. The community has seen a surge in both local and international recognition.</p><p>Key highlights include:</p><ul><li>Over 1 million streams across all platforms</li><li>International collaborations with major labels</li><li>Sold-out concerts in major cities</li></ul><p>The future looks bright for Guigui rap culture!</p>',
      image: 'https://i.ytimg.com/vi/rRhwls8f-Pc/hqdefault.jpg',
      excerpt: 'The Guigui rap scene has experienced unprecedented growth this year, with artists leading the charge in both local and international recognition.',
      author: 'Injai Channel Team',
      category: 'INDUSTRY',
      featured: true,
      links: [
        { text: 'Watch Latest Videos', url: '/videos' },
        { text: 'Follow on Instagram', url: 'https://instagram.com/injaichannel' }
      ]
    },
    {
      title: 'New Album Release: Straiker Drops "Mental"',
      content: '<h2>Straiker\'s Latest Masterpiece</h2><p>Straiker has officially released his highly anticipated album <em>"Mental"</em>, featuring 12 tracks that showcase his evolution as an artist. The album combines his signature energetic flow with deeper lyrical content.</p><p>Standout tracks include:</p><ul><li>"Mental" - The title track with an infectious beat</li><li>"Street Dreams" - A reflection on his journey</li><li>"Rise Up" - An anthem for the community</li></ul><p>Available now on all major streaming platforms!</p>',
      image: 'https://i.ytimg.com/vi/rRhwls8f-Pc/hqdefault.jpg',
      excerpt: 'Straiker has officially released his highly anticipated album "Mental", featuring 12 tracks that showcase his evolution as an artist.',
      author: 'Music Reporter',
      category: 'RELEASES',
      featured: false,
      links: [
        { text: 'Stream on Spotify', url: 'https://spotify.com' },
        { text: 'Watch Music Video', url: '/videos' }
      ]
    },
    {
      title: 'Guigui Rap Festival 2024: A Night to Remember',
      content: '<h2>Festival Recap</h2><p>The annual Guigui Rap Festival brought together the best artists in the scene for an unforgettable night of music and culture. Over 1,000 fans packed the Downtown Arena to witness incredible performances.</p><p>Highlights from the night:</p><ul><li>Opening performance by emerging artists</li><li>Collaborative set between Straiker and Fish Killer</li><li>Surprise guest appearance by MC Jin</li><li>Community awards ceremony</li></ul><p>Plans are already underway for next year\'s festival!</p>',
      image: 'https://i.ytimg.com/vi/ysMKr3c7fx4/hqdefault.jpg',
      excerpt: 'The annual Guigui Rap Festival brought together the best artists in the scene for an unforgettable night of music and culture.',
      author: 'Event Coordinator',
      category: 'EVENTS',
      featured: false,
      links: [
        { text: 'View Event Photos', url: '/gallery' },
        { text: 'Get Festival Updates', url: '/events' }
      ]
    }
  ]});

  // Settings
  await prisma.siteSettings.create({ data: {
    socialLinks: [
      { platform: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/', iconClass: 'fab fa-youtube' },
      { platform: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/', iconClass: 'fab fa-instagram' }
    ] as any,
    team: [
      { name: 'Admin One', role: 'Founder', image: '', bio: 'Founder of the platform' }
    ] as any,
    getInTouch: { headline: 'Get in Touch', description: 'Reach out to us', email: 'info@injai-channel.com', phone: '+1 (555) 123-4567', addressLines: ['123 Music Street', 'Hip Hop City, HC 12345'] } as any
  }});
}

main().then(()=>{ console.log('Seeded PostgreSQL successfully'); process.exit(0);}).catch(e=>{ console.error(e); process.exit(1);});


