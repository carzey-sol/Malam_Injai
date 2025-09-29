# Injai Channel - Full Stack Next.js Application

A modern full-stack web application for Injai Channel, a Guigui rap culture hub. Built with Next.js 14, TypeScript, MongoDB, and featuring admin authentication and content management.

## Features

- **Modern Design**: Responsive design with the same aesthetic as the original website
- **Authentication System**: Secure admin login/signup with JWT tokens
- **Content Management**: Admin dashboard for managing artists, videos, and events
- **Database Integration**: MongoDB with Mongoose for data persistence
- **API Routes**: RESTful API endpoints for data fetching and management
- **TypeScript**: Full type safety throughout the application
- **Responsive**: Mobile-first design that works on all devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT tokens with HTTP-only cookies
- **Styling**: CSS with custom properties and responsive design
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd injai-channel-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and update the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/injai-channel
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Set up MongoDB**
   - Install MongoDB locally, or
   - Use MongoDB Atlas (cloud service)
   - Update the `MONGODB_URI` in your `.env.local` file

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```
   This will create sample data including:
   - Admin user (email: admin@injaichannel.com, password: admin123)
   - Sample artists, videos, and events

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── artists/       # Artist management
│   │   ├── videos/        # Video management
│   │   └── events/        # Event management
│   ├── admin/             # Admin pages
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── contexts/              # React contexts (AuthContext)
├── lib/                   # Utility functions
├── models/                # Mongoose models
└── scripts/               # Database seeding scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new admin user
- `POST /api/auth/login` - Login admin user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Artists
- `GET /api/artists` - Get all artists (with filters)
- `POST /api/artists` - Create new artist

### Videos
- `GET /api/videos` - Get all videos (with filters)
- `POST /api/videos` - Create new video

### Events
- `GET /api/events` - Get all events (with filters)
- `POST /api/events` - Create new event

## Database Models

### User
- username, email, password, role
- JWT authentication with bcrypt password hashing

### Artist
- name, bio, category, image, stats, socialLinks, videos
- Categories: pioneers, collaborators, emerging

### Video
- title, artist, youtubeId, description, category, views
- Categories: music, interview, live, behind-scenes

### Event
- title, description, date, location, type, status, lineup
- Types: festival, concert, release, competition, workshop

## Admin Features

- **Dashboard**: Overview of all content with quick actions
- **Artist Management**: Add, edit, and manage artist profiles
- **Video Management**: Upload and organize video content
- **Event Management**: Create and schedule events
- **Authentication**: Secure admin access with role-based permissions

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed to any Node.js hosting platform:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NEXTAUTH_URL` | Base URL for authentication | No |
| `NEXTAUTH_SECRET` | NextAuth secret key | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.

---

**Note**: This is a full-stack conversion of the original static HTML website. All data is now fetched from a MongoDB database instead of being hardcoded, and includes a complete admin authentication and content management system. 

