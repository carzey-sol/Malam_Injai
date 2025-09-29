# Newsletter System Setup Instructions

## 1. Email Configuration

Add these variables to your `.env` file:

```env
# Email Configuration (for contact form and newsletter)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
CONTACT_EMAIL="contact@injai.com"

# Site Configuration
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

## 2. Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. This is required for App Passwords

### Step 2: Generate App Password
1. Go to Google Account → Security
2. Under "2-Step Verification", click "App passwords"
3. Generate a new app password for "Mail"
4. Use this password as `EMAIL_PASS` in your .env file

### Step 3: Test Configuration
```bash
# Test your email configuration
npm run dev
# Then test the contact form and newsletter signup
```

## 3. How the Newsletter System Works

### Database Storage
- All newsletter subscriptions are automatically saved to the database
- Table: `NewsletterSubscription`
- Fields: email, status, source, createdAt, updatedAt

### Newsletter Flow
1. User subscribes → Email saved to database
2. Welcome email sent to user
3. When featured news is published → Newsletter sent to all subscribers
4. Users can unsubscribe anytime

## 4. Using the Newsletter System

### For Users (Frontend)
- Newsletter signup appears on news page
- Users enter email and click subscribe
- They receive welcome email
- They get newsletters when featured news is published

### For Admins (Backend)
- Featured news articles automatically send newsletters
- All subscriber emails are stored in database
- You can view/manage subscribers through database

## 5. Database Queries

### View All Subscribers
```sql
SELECT * FROM "NewsletterSubscription" WHERE status = 'active';
```

### View Subscriber Stats
```sql
SELECT 
  COUNT(*) as total_subscribers,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscribers,
  COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) as unsubscribed
FROM "NewsletterSubscription";
```

### View Subscribers by Source
```sql
SELECT source, COUNT(*) as count 
FROM "NewsletterSubscription" 
WHERE status = 'active' 
GROUP BY source;
```

## 6. Manual Newsletter Sending

You can manually send newsletters by calling the API:

```javascript
// Send newsletter to all subscribers
const response = await fetch('/api/newsletter', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    articleId: 'your-article-id',
    subject: 'Your Newsletter Subject',
    content: 'Your newsletter content'
  }),
});
```

## 7. Email Templates

The system includes professional email templates:
- Welcome email for new subscribers
- Newsletter emails with article content
- Unsubscribe confirmation emails

## 8. Unsubscribe Management

- Users can unsubscribe via link in emails
- Unsubscribe page: `/unsubscribe?email=user@example.com`
- Unsubscribed emails are marked in database but not deleted

## 9. Testing

### Test Newsletter Signup
1. Go to news page
2. Scroll to newsletter section
3. Enter test email
4. Check database for new subscription
5. Check email for welcome message

### Test Contact Form
1. Go to contact page
2. Fill out contact form
3. Submit form
4. Check your email for contact submission
5. Check sender's email for auto-reply

## 10. Production Deployment

### Environment Variables
Make sure to set these in your production environment:
- `EMAIL_USER`
- `EMAIL_PASS` 
- `CONTACT_EMAIL`
- `NEXT_PUBLIC_SITE_URL`

### Database Migration
Run the migration to create newsletter tables:
```bash
npx prisma migrate deploy
```

### Test in Production
1. Test newsletter signup
2. Test contact form
3. Verify emails are being sent
4. Check database for proper storage
