// Database initialization script
// Run this script to set up initial data and admin users

import { adminDb } from "../lib/firebase/admin"
import { createAdminUser } from "../lib/firebase/auth-utils"
import { COLLECTIONS } from "../lib/firebase/collections"

async function initializeDatabase() {
  try {
    console.log("🚀 Initializing Firebase database...")

    // Create initial admin user
    console.log("👤 Creating initial admin user...")
    const adminUser = await createAdminUser("admin@college.edu", "admin123456", "System Administrator")
    console.log("✅ Admin user created:", adminUser.email)

    // Create sample announcement
    console.log("📢 Creating sample announcement...")
    await adminDb.collection(COLLECTIONS.ANNOUNCEMENTS).add({
      title: "Welcome to Academic Resource Platform",
      content:
        "This platform helps students access academic resources including notes, timetables, and previous year papers.",
      type: "General",
      postedBy: adminUser.uid,
      timestamp: new Date(),
      isActive: true,
      priority: "high",
    })

    // Create sample branches and subjects data
    console.log("🏫 Setting up academic structure...")
    const branches = ["CSE", "ECE", "ME", "CE", "EEE"]
    const subjects = {
      1: ["Mathematics-I", "Physics", "Chemistry", "English", "Programming"],
      2: ["Mathematics-II", "Data Structures", "Digital Logic", "Economics", "Environmental Science"],
      3: ["Database Systems", "Computer Networks", "Operating Systems", "Software Engineering", "Web Technologies"],
      4: ["Machine Learning", "Compiler Design", "Computer Graphics", "Mobile Computing", "Cyber Security"],
    }

    // Create sample requests
    console.log("📝 Creating sample requests...")
    await adminDb.collection(COLLECTIONS.REQUESTS).add({
      requestedBy: "student123",
      requesterEmail: "student@college.edu",
      subject: "Data Structures",
      semester: 2,
      branch: "CSE",
      type: "notes",
      description: "Need handwritten notes for linked lists and trees",
      status: "pending",
      requestedAt: new Date(),
    })

    console.log("✅ Database initialization completed successfully!")
    console.log("\n📋 Next steps:")
    console.log("1. Update your .env.local file with Firebase configuration")
    console.log("2. Apply Firestore and Storage security rules in Firebase Console")
    console.log("3. Enable Authentication with Email/Password in Firebase Console")
    console.log("4. Set up composite indexes for complex queries")
    console.log("\n🔐 Admin credentials:")
    console.log("Email: admin@college.edu")
    console.log("Password: admin123456")
  } catch (error) {
    console.error("❌ Error initializing database:", error)
  }
}

// Run the initialization
initializeDatabase()
