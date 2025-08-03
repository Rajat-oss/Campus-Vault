# College Academic Resource Sharing Platform - Firebase Backend

A complete Firebase backend implementation for a college academic resource-sharing platform with authentication, file storage, and real-time data management.

## 🚀 Features

- **Firebase Authentication**: Secure admin authentication with custom claims
- **Firestore Database**: Organized collections for announcements, timetables, notes, PYQs, and requests
- **Firebase Storage**: Structured file storage with security rules
- **Real-time Sync**: Live updates for announcements and data changes
- **Admin Panel Support**: Complete backend for admin operations
- **Security Rules**: Comprehensive security for data and file access

## 📁 Project Structure

\`\`\`
├── lib/firebase/
│   ├── config.ts          # Firebase client configuration
│   ├── admin.ts           # Firebase Admin SDK setup
│   ├── collections.ts     # TypeScript interfaces and collection names
│   ├── auth-utils.ts      # Authentication utilities
│   ├── storage-utils.ts   # File storage utilities
│   └── database-service.ts # Database operations service
├── app/api/
│   ├── auth/verify-admin/ # Admin verification endpoint
│   ├── admin/create-user/ # Admin user creation endpoint
│   └── upload/            # File upload endpoint
├── scripts/
│   ├── init-database.ts   # Database initialization script
│   ├── setup-indexes.ts   # Firestore indexes configuration
│   ├── firestore-rules.sql # Firestore security rules
│   └── storage-rules.sql  # Storage security rules
└── .env.example           # Environment variables template
\`\`\`

## 🛠️ Setup Instructions

### 1. Firebase Project Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database in production mode
4. Enable Firebase Storage
5. Generate a service account key for Admin SDK

### 2. Environment Configuration

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase configuration values:
   - Get client config from Project Settings > General > Your apps
   - Get Admin SDK config from Project Settings > Service accounts

### 3. Security Rules Setup

1. Copy the rules from `scripts/firestore-rules.sql` to Firestore Rules tab
2. Copy the rules from `scripts/storage-rules.sql` to Storage Rules tab
3. Publish the rules in Firebase Console

### 4. Database Initialization

\`\`\`bash
npm install
npm run init-db
\`\`\`

This will:
- Create an initial admin user (admin@college.edu / admin123456)
- Set up sample data structure
- Create initial announcements and requests

### 5. Firestore Indexes

Run the index setup script to see required composite indexes:

\`\`\`bash
npm run setup-indexes
\`\`\`

Copy the output and create these indexes in Firebase Console > Firestore > Indexes.

## 📊 Database Collections

### Announcements
- `title`: string
- `content`: string  
- `type`: 'Exam' | 'Event' | 'General' | 'Holiday' | 'Important'
- `postedBy`: string (admin UID)
- `timestamp`: Date
- `isActive`: boolean
- `priority`: 'low' | 'medium' | 'high'

### Timetables
- `branch`: string
- `semester`: number
- `url`: string (download URL)
- `fileName`: string
- `uploadedAt`: Date
- `uploadedBy`: string
- `academicYear`: string

### Notes
- `subject`: string
- `semester`: number
- `branch`: string
- `noteType`: 'handwritten' | 'typed' | 'slides'
- `downloadURL`: string
- `fileName`: string
- `uploadedBy`: string
- `timestamp`: Date
- `tags`: string[]
- `description`: string (optional)

### PYQs (Previous Year Questions)
- `subject`: string
- `year`: number
- `semester`: number
- `branch`: string
- `url`: string
- `fileName`: string
- `uploader`: string
- `uploadedAt`: Date
- `examType`: 'mid' | 'final' | 'quiz'

### Study Materials
- `title`: string
- `subject`: string
- `semester`: number
- `branch`: string
- `type`: 'formula_sheet' | 'guidebook' | 'reference' | 'tutorial'
- `url`: string
- `fileName`: string
- `uploadedBy`: string
- `uploadedAt`: Date
- `description`: string (optional)

### Requests
- `requestedBy`: string
- `requesterEmail`: string
- `subject`: string
- `semester`: number
- `branch`: string
- `type`: 'notes' | 'pyq' | 'timetable' | 'study_material'
- `description`: string
- `status`: 'pending' | 'fulfilled' | 'rejected'
- `requestedAt`: Date
- `fulfilledAt`: Date (optional)
- `fulfilledBy`: string (optional)

## 🔐 Authentication & Security

### Admin Authentication
- Only authenticated users with `admin: true` custom claims can perform write operations
- Admin users are created through the backend API with proper verification
- All admin operations require valid ID tokens

### Security Rules
- **Read Access**: Public for all academic content
- **Write Access**: Restricted to authenticated admins only
- **File Upload**: Only admins can upload/delete files
- **File Size Limits**: Enforced per content type (10-50MB)

### Storage Structure
\`\`\`
/notes/{branch}/semester_{semester}/{subject}/{filename}
/timetables/{branch}/semester_{semester}/{filename}
/pyqs/{branch}/{subject}/{year}/{filename}
/study_materials/{branch}/semester_{semester}/{subject}/{filename}
\`\`\`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/verify-admin` - Verify admin token
- `POST /api/admin/create-user` - Create new admin user

### File Operations
- `POST /api/upload` - Upload files with metadata

## 📱 Frontend Integration

To connect your React frontend:

1. Install Firebase SDK: `npm install firebase`
2. Import the configuration from `lib/firebase/config.ts`
3. Use the `DatabaseService` class for all database operations
4. Use the `StorageService` class for file operations
5. Implement authentication state management with Firebase Auth

## 🚀 Deployment

This backend is designed to work with:
- **Vercel**: Deploy the Next.js API routes
- **Firebase Hosting**: For static assets (optional)
- **Firebase Functions**: For advanced server-side operations (optional)

## 📞 Support

For issues or questions:
1. Check Firebase Console for error logs
2. Verify environment variables are correctly set
3. Ensure security rules are properly configured
4. Check Firestore indexes are created

## 🔄 Real-time Features

The backend supports real-time updates through Firestore listeners:
- Live announcement updates
- Real-time request status changes
- Instant content availability notifications

Use the `subscribeToAnnouncements` method in `DatabaseService` for real-time data.
