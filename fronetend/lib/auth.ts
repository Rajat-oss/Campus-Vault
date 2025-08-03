import { auth, db } from './firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'

interface UserData {
  uid: string
  email: string
  name: string
  profession: 'student' | 'faculty'
  college: string
  department: string
  employeeId?: string
}

export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

export const signUp = async (email: string, password: string, userData?: Partial<UserData>) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  
  // Save user profile to Firestore
  await addDoc(collection(db, 'users'), {
    uid: userCredential.user.uid,
    email,
    name: userData?.name || 'User',
    profession: userData?.profession || 'student',
    college: userData?.college || '',
    department: userData?.department || '',
    employeeId: userData?.employeeId,
    createdAt: new Date()
  })
  
  return userCredential
}

export const logout = async () => {
  return await signOut(auth)
}

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}