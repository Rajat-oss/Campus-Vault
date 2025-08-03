# College Management System

A full-stack Next.js application with real-time features for managing college announcements, notes, PYQs, and timetables.

## Architecture

- **Frontend**: Next.js 15 (Port 3000)
- **Backend**: Next.js API Routes (Port 3001)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth (ready for integration)

## Features

- ✅ Real-time announcements
- ✅ Notes management
- ✅ Previous Year Questions (PYQs)
- ✅ Timetable management
- ✅ Admin panel with file uploads
- ✅ Responsive design
- 🔄 Firebase Auth integration (ready)

## Quick Start

1. **Install dependencies**:
   ```bash
   cd backend && npm install
   cd ../fronetend && npm install
   ```

2. **Configure Firebase**:
   - Update `.env.local` files in both frontend and backend
   - Add your Firebase configuration

3. **Start development servers**:
   ```bash
   # Option 1: Use the batch script (Windows)
   start-dev.bat
   
   # Option 2: Manual start
   cd backend && npm run dev
   cd fronetend && npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

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

## Firebase Integration

When you're ready to add Firebase:

1. Create a Firebase project
2. Enable Firestore, Storage, and Authentication
3. Update environment variables
4. The database service and auth utilities are already configured

## Admin Access

- Default admin password: `admin123`
- Admin panel: http://localhost:3000/admin

## Project Structure

```
├── backend/                 # Backend API server
│   ├── app/api/            # API routes
│   └── lib/firebase/       # Firebase services
├── fronetend/              # Frontend application
│   ├── app/                # Next.js app router
│   ├── components/         # React components
│   ├── hooks/              # Custom hooks
│   └── lib/                # Utilities
└── start-dev.bat           # Development server starter
```

## Next Steps

1. Configure Firebase with your project credentials
2. Set up Firebase Authentication
3. Deploy to your preferred platform
4. Add more features as needed