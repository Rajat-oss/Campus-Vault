import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBNqPnhULjDEOgVxQfn3zyQINsSy9AmESM",
  authDomain: "quickdesk-a7914.firebaseapp.com",
  projectId: "quickdesk-a7914",
  storageBucket: "quickdesk-a7914.firebasestorage.app",
  messagingSenderId: "799902089434",
  appId: "1:799902089434:web:8a744e14ccca853e8b65e3",
  measurementId: "G-VCZ19P53Z9"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)