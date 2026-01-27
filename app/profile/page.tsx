"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Save, Loader2, Copy } from "lucide-react"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

const departments = ["CSE", "ECE", "Mechanical", "Civil", "IT", "Electrical"]
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"]

export default function ProfilePage() {
  const { profile, loading } = useUserProfile()
  const { user } = useAuth()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    semester: "",
    employeeId: ""
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        department: profile.department || "",
        semester: profile.semester?.toString() || "",
        employeeId: profile.employeeId || ""
      })
    }
  }, [profile])

  const handleSave = async () => {
    if (!user || !profile) {
      toast({ title: "Error", description: "Please login to update profile", variant: "destructive" })
      return
    }

    setSaving(true)
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user.uid))
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0]
        await updateDoc(doc(db, 'users', userDoc.id), {
          name: formData.name,
          department: formData.department,
          semester: formData.semester ? parseInt(formData.semester) : null,
          employeeId: formData.employeeId || null
        })
        
        toast({ title: "Success", description: "Profile updated successfully" })
      }
    } catch (error) {
      console.error('Update error:', error)
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const copyCollegeId = () => {
    if (profile?.collegeId) {
      navigator.clipboard.writeText(profile.collegeId)
      toast({ title: "Copied", description: "College ID copied to clipboard" })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center">
          <User className="h-10 w-10 mr-4 text-blue-600" />
          My Profile
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your profile information and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Avatar */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {formData.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold">{formData.name || 'User'}</h3>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <p className="text-sm text-muted-foreground capitalize">{profile?.profession}</p>
              {formData.name && (
                <p className="text-xs text-green-600 mt-1">✓ Username from signup</p>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile?.email || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {profile?.profession === 'student' && (
              <div>
                <Label htmlFor="semester">Current Semester</Label>
                <Select value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>{sem}th Semester</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {profile?.profession === 'faculty' && (
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  placeholder="Enter employee ID"
                />
              </div>
            )}

            <div>
              <Label htmlFor="college">College</Label>
              <Input
                id="college"
                value={profile?.college || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="profession">Role</Label>
              <Input
                id="profession"
                value={profile?.profession || ""}
                disabled
                className="bg-muted capitalize"
              />
            </div>
          </div>

          {/* Faculty College ID */}
          {profile?.profession === 'faculty' && (
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">College Environment</h4>
              <div className="space-y-2">
                <Label htmlFor="collegeId">Your Unique College ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="collegeId"
                    value={profile?.collegeId || ""}
                    disabled
                    className="bg-muted font-mono text-sm"
                  />
                  <Button
                    onClick={copyCollegeId}
                    variant="outline"
                    size="icon"
                    title="Copy College ID"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Share this ID with students so they can join your college environment</p>
              </div>
            </div>
          )}

          {/* Account Info */}
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Account Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">User ID:</span>
                <p className="font-mono text-xs bg-muted p-2 rounded mt-1">{profile?.uid}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Member Since:</span>
                <p className="mt-1">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button onClick={handleSave} disabled={saving} className="px-8">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
