import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBNqPnhULjDEOgVxQfn3zyQINsSy9AmESM",
  authDomain: "quickdesk-a7914.firebaseapp.com",
  projectId: "quickdesk-a7914",
  storageBucket: "quickdesk-a7914.firebasestorage.app",
  messagingSenderId: "799902089434",
  appId: "1:799902089434:web:8a744e14ccca853e8b65e3",
  measurementId: "G-VCZ19P53Z9"
}

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
