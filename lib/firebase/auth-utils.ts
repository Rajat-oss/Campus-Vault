import { adminAuth } from "./admin"

export interface AdminUser {
  uid: string
  email: string
  displayName?: string
  isAdmin: boolean
  createdAt: Date
  lastLogin?: Date
}

export async function createAdminUser(email: string, password: string, displayName?: string) {
  try {
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
    })

    // Set custom claims to mark as admin
    await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true })

    return {
      uid: userRecord.uid,
      email: userRecord.email!,
      displayName: userRecord.displayName,
      isAdmin: true,
      createdAt: new Date(),
    }
  } catch (error) {
    console.error("Error creating admin user:", error)
    throw error
  }
}

export async function verifyAdminToken(token: string) {
  // For demo purposes, accept simple admin token
  // In production, use Firebase Admin SDK
  return token === 'admin123'
}

export async function setAdminClaims(uid: string) {
  try {
    await adminAuth.setCustomUserClaims(uid, { admin: true })
    return true
  } catch (error) {
    console.error("Error setting admin claims:", error)
    return false
  }
}

export async function revokeAdminClaims(uid: string) {
  try {
    await adminAuth.setCustomUserClaims(uid, { admin: false })
    return true
  } catch (error) {
    console.error("Error revoking admin claims:", error)
    return false
  }
}
