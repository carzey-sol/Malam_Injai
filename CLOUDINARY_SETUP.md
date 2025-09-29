# Cloudinary Setup Guide

This guide will help you set up Cloudinary for easy image uploads in the admin dashboard.

## 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your Cloudinary Credentials

1. Log into your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy the following values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## 3. Update Your Environment Variables

Add these variables to your `.env.local` file:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Replace the placeholder values with your actual Cloudinary credentials.

## 4. Features Included

With Cloudinary integration, you now have:

- **Drag & Drop Upload**: Simply drag images into the upload areas
- **Image Preview**: See images before uploading
- **Automatic Optimization**: Images are automatically optimized for web
- **Organized Storage**: Images are organized in folders (artists/main, artists/thumbnails, events)
- **Responsive Images**: Images are automatically resized for different screen sizes
- **Format Conversion**: Images are automatically converted to the best format (WebP, AVIF)

## 5. Usage

### For Artists:
- **Main Image**: Upload high-quality artist photos (stored in `artists/main` folder)
- **Thumbnail**: Upload smaller versions for cards (stored in `artists/thumbnails` folder)

### For Events:
- **Event Image**: Upload event banners or promotional images (stored in `events` folder)

## 6. Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB bandwidth per month
- 25,000 transformations per month

This should be sufficient for most small to medium websites.

## 7. Security

- All uploads require admin authentication
- Images are automatically optimized and secured
- Public IDs are generated automatically to prevent conflicts

## Troubleshooting

If you encounter issues:

1. **Check your credentials**: Make sure all three environment variables are correct
2. **Verify account status**: Ensure your Cloudinary account is active
3. **Check file size**: Free tier has a 10MB file size limit
4. **Check file format**: Supported formats are JPG, PNG, GIF, WebP, AVIF

## Support

For more help with Cloudinary:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Support](https://support.cloudinary.com)
