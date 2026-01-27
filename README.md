# College Management System

A full-stack Next.js application with real-time features for managing college announcements, notes, PYQs, and timetables. **Ready for Vercel deployment!**

## Architecture

- **Framework**: Next.js 15 (Full-stack)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth (ready for integration)
- **Deployment**: Vercel-optimized

## Features

- ✅ Real-time announcements
- ✅ Notes management
- ✅ Previous Year Questions (PYQs)
- ✅ Timetable management
- ✅ Admin panel with file uploads
- ✅ Responsive design
- ✅ Vercel deployment ready
- 🔄 Firebase Auth integration (ready)

## Quick Start (Development)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Firebase**:
   - Copy `.env.example` to `.env.local`
   - Add your Firebase configuration

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Application: http://localhost:3000
   - API endpoints: http://localhost:3000/api/*

## Deployment to Vercel

**Ready for one-click deployment!** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy:
```bash
npm i -g vercel
vercel
```

## API Endpoints

- `GET /api/announcements` - Fetch announcements
- `POST /api/announcements` - Create announcement (admin)
- `GET /api/notes` - Fetch notes
- `GET /api/pyqs` - Fetch PYQs
- `GET /api/timetables` - Fetch timetables
- `POST /api/upload` - File upload (admin)
- `POST /api/auth/verify-admin` - Admin verification

## Real-time Features

The app uses custom hooks for real-time data fetching:
- `useAnnouncements()` - Real-time announcements
- `useNotes()` - Real-time notes
- `usePYQs()` - Real-time PYQs
- `useTimetables()` - Real-time timetables

## Environment Variables

Required environment variables (see `.env.example`):
- Firebase configuration
- Firebase Admin credentials
- Cloudinary configuration (optional)
- Admin password

## Admin Access

- Default admin password: `admin123`
- Admin panel: `/admin`

## Project Structure

```
├── app/                    # Next.js app router
│   ├── api/               # API routes (serverless functions)
│   ├── admin/             # Admin pages
│   ├── announcements/     # Announcements pages
│   └── ...                # Other pages
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...               # Feature components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and services
│   ├── firebase/         # Firebase services
│   └── cloudinary/       # Cloudinary services
├── public/               # Static assets
├── .env.example          # Environment variables template
├── DEPLOYMENT.md         # Deployment guide
└── vercel.json           # Vercel configuration
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage, Cloudinary
- **Deployment**: Vercel
- **Real-time**: Custom hooks with Firebase listeners

## Next Steps

1. **Deploy to Vercel**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Configure Firebase**: Set up your Firebase project
3. **Set up Authentication**: Enable Firebase Auth
4. **Customize**: Add your branding and features
5. **Scale**: Add more features as needed