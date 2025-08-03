-- Firestore Security Rules (to be applied in Firebase Console)
-- Copy these rules to your Firestore Rules tab in Firebase Console

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all authenticated and unauthenticated users for public collections
    match /announcements/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /timetables/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /notes/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /pyqs/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /study_materials/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Requests can be created by anyone, but only admins can update/delete
    match /requests/{document} {
      allow read, create: if true;
      allow update, delete: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Admin users collection - only accessible by admins
    match /admin_users/{document} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
  }
}
