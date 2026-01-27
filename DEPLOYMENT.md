# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Firebase Project**: Ensure your Firebase project is set up with:
   - Firestore Database
   - Firebase Storage
   - Firebase Authentication (optional)

## Deployment Steps

### 1. Prepare Your Repository

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit for Vercel deployment"

# Push to GitHub/GitLab/Bitbucket
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: campus-vault (or your preferred name)
# - Directory: ./ (current directory)
# - Override settings? No
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Configure Environment Variables

In your Vercel project dashboard, go to Settings > Environment Variables and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_PASSWORD=your_admin_password
```

### 4. Firebase Service Account Setup

For server-side Firebase operations, you need a service account:

1. Go to Firebase Console > Project Settings > Service Accounts
2. Generate a new private key
3. Copy the values to your Vercel environment variables:
   - `FIREBASE_ADMIN_PROJECT_ID`: Project ID
   - `FIREBASE_ADMIN_CLIENT_EMAIL`: Client email from the JSON
   - `FIREBASE_ADMIN_PRIVATE_KEY`: Private key (keep the `\\n` characters)

### 5. Domain Configuration

- Your app will be available at `https://your-project-name.vercel.app`
- You can add a custom domain in Vercel dashboard > Settings > Domains

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify Firebase connection
- [ ] Test file uploads (if using Cloudinary)
- [ ] Check admin panel functionality
- [ ] Test real-time features
- [ ] Verify responsive design on mobile

## Troubleshooting

### Common Issues:

1. **Build Errors**: Check the build logs in Vercel dashboard
2. **Environment Variables**: Ensure all required variables are set
3. **Firebase Errors**: Verify Firebase configuration and service account
4. **API Routes**: All API routes are now at `/api/*` instead of separate backend

### Support:
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Firebase Documentation: [firebase.google.com/docs](https://firebase.google.com/docs)

## Performance Optimization

- Images are automatically optimized by Vercel
- API routes are serverless functions
- Static assets are served from CDN
- Automatic HTTPS and compression