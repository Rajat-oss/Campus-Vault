-- Firebase Storage Security Rules (to be applied in Firebase Console)
-- Copy these rules to your Storage Rules tab in Firebase Console

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files for everyone
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Only admins can upload/delete files
    match /{allPaths=**} {
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Specific rules for different file types
    match /notes/{branch}/{semester}/{subject}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true &&
                      request.resource.size < 50 * 1024 * 1024; // 50MB limit
    }
    
    match /timetables/{branch}/{semester}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true &&
                      request.resource.size < 10 * 1024 * 1024; // 10MB limit
    }
    
    match /pyqs/{branch}/{subject}/{year}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true &&
                      request.resource.size < 20 * 1024 * 1024; // 20MB limit
    }
    
    match /study_materials/{branch}/{semester}/{subject}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true &&
                      request.resource.size < 30 * 1024 * 1024; // 30MB limit
    }
  }
}
