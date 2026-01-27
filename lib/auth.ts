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
  collegeId?: string
}

const generateCollegeId = (): string => {
  return 'COLLEGE_' + Math.random().toString(36).substr(2, 9).toUpperCase()
}

export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

export const signUp = async (email: string, password: string, userData?: Partial<UserData>) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  
  const collegeId = userData?.profession === 'faculty' ? generateCollegeId() : undefined
  
  // Save user profile to Firestore
  await addDoc(collection(db, 'users'), {
    uid: userCredential.user.uid,
    email,
    name: userData?.name || 'User',
    profession: userData?.profession || 'student',
    college: userData?.college || '',
    department: userData?.department || '',
    employeeId: userData?.employeeId,
    collegeId: collegeId,
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