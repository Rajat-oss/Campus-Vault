"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageCircle, Send } from "lucide-react"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function ThoughtsPage() {
  const { profile, loading } = useUserProfile()
  const { user } = useAuth()
  const { toast } = useToast()
  const [thought, setThought] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !profile) {
      toast({ title: "Error", description: "Please login to share thoughts", variant: "destructive" })
      return
    }

    if (profile.profession !== 'student') {
      toast({ title: "Error", description: "Only students can share thoughts", variant: "destructive" })
      return
    }

    if (!thought.trim()) {
      toast({ title: "Error", description: "Please write your thought", variant: "destructive" })
      return
    }

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'thoughts'), {
        content: thought.trim(),
        studentName: profile.name || user.email || 'Student',
        studentEmail: user.email,
        createdAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)) // 24 hours from now
      })
      
      toast({ title: "Success", description: "Your thought has been shared!" })
      setThought("")
    } catch (error) {
      console.error('Submit error:', error)
      toast({ title: "Error", description: "Failed to share thought", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  if (profile?.profession !== 'student') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Students Only</h2>
        <p className="text-muted-foreground">This feature is only available for students.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center">
          <MessageCircle className="h-10 w-10 mr-4 text-blue-600" />
          Share Your Thoughts
        </h1>
        <p className="text-muted-foreground text-lg">
          Share your thoughts, problems, or feedback. Your message will be visible on the home page for 24 hours.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What's on your mind?</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="thought">Your Thought</Label>
              <Textarea
                id="thought"
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="Share your thoughts, problems, suggestions, or feedback..."
                rows={6}
                maxLength={500}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {thought.length}/500 characters
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Note:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your thought will appear on the home page</li>
                <li>• It will be automatically deleted after 24 hours</li>
                <li>• Please be respectful and constructive</li>
              </ul>
            </div>

            <Button type="submit" disabled={submitting || !thought.trim()} className="w-full">
              {submitting ? (
                "Sharing..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Share Thought
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}