// Run this script to initialize Firebase with sample data
// node init-firebase.js

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'

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
const db = getFirestore(app)

const sampleAnnouncements = [
  {
    title: "Mid-Semester Examination Schedule Released",
    content: "The mid-semester examination schedule for all branches has been released. Students are advised to check their respective timetables and prepare accordingly.",
    type: "exam",
    isActive: true,
    timestamp: Timestamp.now(),
    createdBy: "admin"
  },
  {
    title: "Technical Fest Registration Open",
    content: "Registration for the annual technical fest 'TechnoVision 2024' is now open. Students can participate in various competitions including coding contests, robotics, and project exhibitions.",
    type: "event",
    isActive: true,
    timestamp: Timestamp.now(),
    createdBy: "admin"
  },
  {
    title: "Library Hours Extended",
    content: "Library hours have been extended during the examination period to facilitate better study environment for students. New timings: 7:00 AM to 11:00 PM.",
    type: "notice",
    isActive: true,
    timestamp: Timestamp.now(),
    createdBy: "admin"
  }
]

async function initializeData() {
  try {
    console.log('Adding sample announcements...')
    
    for (const announcement of sampleAnnouncements) {
      await addDoc(collection(db, 'announcements'), announcement)
      console.log('Added:', announcement.title)
    }
    
    console.log('Firebase initialized with sample data!')
  } catch (error) {
    console.error('Error initializing Firebase:', error)
  }
}

initializeData()