"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Plus, FileText, Calendar, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useAuth } from "@/hooks/use-auth"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"

const departments = ["CSE", "ECE", "Mechanical", "Civil", "IT", "Electrical"]
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"]

export default function UploadPage() {
  const { profile, loading } = useUserProfile()
  const [activeTab, setActiveTab] = useState("notes")

  // Update active tab when profile loads
  useEffect(() => {
    if (profile?.profession === 'faculty' && activeTab === 'notes') {
      setActiveTab('announcement')
    }
  }, [profile?.profession, activeTab])
  const { user } = useAuth()
  const { toast } = useToast()

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    type: "",
  })

  const [noteForm, setNoteForm] = useState({
    title: "",
    subject: "",
    semester: "",
    department: "",
    description: "",
    file: null as File | null,
  })

  const [pyqForm, setPyqForm] = useState({
    title: "",
    subject: "",
    year: "",
    semester: "",
    department: "",
    examType: "",
    file: null as File | null,
  })

  const [timetableForm, setTimetableForm] = useState({
    title: "",
    department: "",
    semester: "",
    file: null as File | null,
  })

  const handleAnnouncementSubmit = async () => {
    if (!user) {
      toast({ title: "Error", description: "Please login to upload", variant: "destructive" })
      return
    }

    if (!announcementForm.title || !announcementForm.content || !announcementForm.type) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" })
      return
    }

    try {
      console.log('Uploading announcement...', announcementForm)
      await addDoc(collection(db, 'announcements'), {
        title: announcementForm.title,
        content: announcementForm.content,
        type: announcementForm.type,
        isActive: true,
        timestamp: Timestamp.now(),
        createdBy: profile?.name || user?.email || 'Unknown',
        department: profile?.department || '',
        profession: profile?.profession || 'student',
        college: profile?.college || '',
        collegeId: profile?.collegeId || ''
      })
      
      toast({ title: "Success", description: "Announcement uploaded successfully" })
      setAnnouncementForm({ title: "", content: "", type: "" })
    } catch (error) {
      console.error('Upload error:', error)
      toast({ title: "Error", description: `Failed to upload: ${error.message}`, variant: "destructive" })
    }
  }

  const [uploading, setUploading] = useState(false)

  const handleNoteSubmit = async () => {
    if (!user) {
      toast({ title: "Error", description: "Please login to upload", variant: "destructive" })
      return
    }

    if (!noteForm.title || !noteForm.subject || !noteForm.semester || !noteForm.department) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" })
      return
    }

    if (!noteForm.file) {
      toast({ title: "Error", description: "Please select a file", variant: "destructive" })
      return
    }

    setUploading(true)
    toast({ title: "Uploading...", description: "Please wait while we upload your file" })

    try {
      const formData = new FormData()
      formData.append('file', noteForm.file)
      formData.append('type', 'notes')
      formData.append('title', noteForm.title)
      formData.append('subject', noteForm.subject)
      formData.append('semester', noteForm.semester)
      formData.append('branch', noteForm.department)
      formData.append('description', noteForm.description)
      formData.append('college', profile?.college || '')
      formData.append('collegeId', profile?.collegeId || '')
      if (profile?.profession === 'faculty') {
        formData.append('adminToken', 'admin123')
      }

      const response = await fetch('http://localhost:3001/api/notes', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success || response.ok) {
        toast({ title: "Success", description: "Notes uploaded successfully to Cloudinary" })
        setNoteForm({ title: "", subject: "", semester: "", department: "", description: "", file: null })
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast({ title: "Error", description: `Upload failed: ${error.message}`, variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handlePyqSubmit = async () => {
    if (!pyqForm.file) {
      toast({ title: "Error", description: "Please select a file", variant: "destructive" })
      return
    }

    setUploading(true)
    toast({ title: "Uploading...", description: "Please wait while we upload your PYQ" })

    try {
      const formData = new FormData()
      formData.append('file', pyqForm.file)
      formData.append('subject', pyqForm.subject)
      formData.append('year', pyqForm.year)
      formData.append('semester', pyqForm.semester)
      formData.append('branch', pyqForm.department)
      formData.append('examType', pyqForm.examType)
      formData.append('college', profile?.college || '')
      formData.append('collegeId', profile?.collegeId || '')
      if (profile?.profession === 'faculty') {
        formData.append('adminToken', 'admin123')
      }

      const response = await fetch('http://localhost:3001/api/pyqs', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success || response.ok) {
        toast({ title: "Success", description: "PYQ uploaded successfully to Cloudinary" })
        setPyqForm({ title: "", subject: "", year: "", semester: "", department: "", examType: "", file: null })
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error: any) {
      toast({ title: "Error", description: `Upload failed: ${error.message}`, variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleTimetableSubmit = async () => {
    if (!timetableForm.file) {
      toast({ title: "Error", description: "Please select a file", variant: "destructive" })
      return
    }

    setUploading(true)
    toast({ title: "Uploading...", description: "Please wait while we upload your timetable" })

    try {
      const formData = new FormData()
      formData.append('file', timetableForm.file)
      formData.append('title', timetableForm.title)
      formData.append('branch', timetableForm.department)
      formData.append('semester', timetableForm.semester)
      formData.append('college', profile?.college || '')
      formData.append('collegeId', profile?.collegeId || '')
      formData.append('adminToken', 'admin123')

      const response = await fetch('http://localhost:3001/api/timetables', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success || response.ok) {
        toast({ title: "Success", description: "Timetable uploaded successfully to Cloudinary" })
        setTimetableForm({ title: "", department: "", semester: "", file: null })
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error: any) {
      toast({ title: "Error", description: `Upload failed: ${error.message}`, variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Upload Content</h1>
        <p className="text-muted-foreground text-lg">
          {profile?.profession === 'faculty' 
            ? 'Share announcements, notes, PYQs, and timetables with the community'
            : 'Share notes and PYQs with the community'
          }
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {profile?.profession === 'faculty' ? (
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="announcement">Announcement</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="pyq">PYQ</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
          </TabsList>
        ) : (
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="pyq">PYQ</TabsTrigger>
          </TabsList>
        )}

        {profile?.profession === 'faculty' && (
          <TabsContent value="announcement" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Announcement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ann-title">Title</Label>
                  <Input
                    id="ann-title"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    placeholder="Announcement title"
                  />
                </div>
                <div>
                  <Label htmlFor="ann-type">Type</Label>
                  <Select value={announcementForm.type} onValueChange={(value) => setAnnouncementForm({ ...announcementForm, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="notice">Notice</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="placement">Placement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ann-content">Content</Label>
                  <Textarea
                    id="ann-content"
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                    placeholder="Announcement content"
                    rows={4}
                  />
                </div>
                <Button onClick={handleAnnouncementSubmit} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Announcement
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Upload Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="note-title">Title</Label>
                <Input
                  id="note-title"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  placeholder="Notes title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="note-subject">Subject</Label>
                  <Input
                    id="note-subject"
                    value={noteForm.subject}
                    onChange={(e) => setNoteForm({ ...noteForm, subject: e.target.value })}
                    placeholder="Subject name"
                  />
                </div>
                <div>
                  <Label htmlFor="note-department">Department</Label>
                  <Select value={noteForm.department} onValueChange={(value) => setNoteForm({ ...noteForm, department: value })}>
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
              </div>
              <div>
                <Label htmlFor="note-semester">Semester</Label>
                <Select value={noteForm.semester} onValueChange={(value) => setNoteForm({ ...noteForm, semester: value })}>
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
              <div>
                <Label htmlFor="note-description">Description</Label>
                <Textarea
                  id="note-description"
                  value={noteForm.description}
                  onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                  placeholder="Brief description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="note-file">Upload File</Label>
                <Input
                  id="note-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setNoteForm({ ...noteForm, file: e.target.files?.[0] || null })}
                />
              </div>
              <Button onClick={handleNoteSubmit} className="w-full" disabled={uploading}>
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Notes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pyq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Upload PYQ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pyq-title">Title</Label>
                <Input
                  id="pyq-title"
                  value={pyqForm.title}
                  onChange={(e) => setPyqForm({ ...pyqForm, title: e.target.value })}
                  placeholder="Paper title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pyq-subject">Subject</Label>
                  <Input
                    id="pyq-subject"
                    value={pyqForm.subject}
                    onChange={(e) => setPyqForm({ ...pyqForm, subject: e.target.value })}
                    placeholder="Subject name"
                  />
                </div>
                <div>
                  <Label htmlFor="pyq-year">Year</Label>
                  <Select value={pyqForm.year} onValueChange={(value) => setPyqForm({ ...pyqForm, year: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pyq-department">Department</Label>
                  <Select value={pyqForm.department} onValueChange={(value) => setPyqForm({ ...pyqForm, department: value })}>
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
                <div>
                  <Label htmlFor="pyq-semester">Semester</Label>
                  <Select value={pyqForm.semester} onValueChange={(value) => setPyqForm({ ...pyqForm, semester: value })}>
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
              </div>
              <div>
                <Label htmlFor="pyq-examtype">Exam Type</Label>
                <Select value={pyqForm.examType} onValueChange={(value) => setPyqForm({ ...pyqForm, examType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="End Semester">End Semester</SelectItem>
                    <SelectItem value="Mid Semester">Mid Semester</SelectItem>
                    <SelectItem value="Sessional">Sessional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pyq-file">Upload File</Label>
                <Input
                  id="pyq-file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPyqForm({ ...pyqForm, file: e.target.files?.[0] || null })}
                />
              </div>
              <Button onClick={handlePyqSubmit} className="w-full" disabled={uploading}>
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload PYQ'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {profile?.profession === 'faculty' && (
          <TabsContent value="timetable" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upload Timetable
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tt-title">Title</Label>
                  <Input
                    id="tt-title"
                    value={timetableForm.title}
                    onChange={(e) => setTimetableForm({ ...timetableForm, title: e.target.value })}
                    placeholder="Timetable title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tt-department">Department</Label>
                    <Select value={timetableForm.department} onValueChange={(value) => setTimetableForm({ ...timetableForm, department: value })}>
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
                  <div>
                    <Label htmlFor="tt-semester">Semester</Label>
                    <Select value={timetableForm.semester} onValueChange={(value) => setTimetableForm({ ...timetableForm, semester: value })}>
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
                </div>
                <div>
                  <Label htmlFor="tt-file">Upload File</Label>
                  <Input
                    id="tt-file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setTimetableForm({ ...timetableForm, file: e.target.files?.[0] || null })}
                  />
                </div>
                <Button onClick={handleTimetableSubmit} className="w-full" disabled={uploading}>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Timetable'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}