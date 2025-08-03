"use client"

import { useState } from "react"
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
  const [activeTab, setActiveTab] = useState("announcement")
  const { profile, loading } = useUserProfile()
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
        college: profile?.college || ''
      })
      
      toast({ title: "Success", description: "Announcement uploaded successfully" })
      setAnnouncementForm({ title: "", content: "", type: "" })
    } catch (error) {
      console.error('Upload error:', error)
      toast({ title: "Error", description: `Failed to upload: ${error.message}`, variant: "destructive" })
    }
  }

  const handleNoteSubmit = async () => {
    if (!user) {
      toast({ title: "Error", description: "Please login to upload", variant: "destructive" })
      return
    }

    if (!noteForm.title || !noteForm.subject || !noteForm.semester || !noteForm.department) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" })
      return
    }

    try {
      let fileUrl = ''
      if (noteForm.file) {
        const fileRef = ref(storage, `notes/${Date.now()}_${noteForm.file.name}`)
        await uploadBytes(fileRef, noteForm.file)
        fileUrl = await getDownloadURL(fileRef)
      }

      await addDoc(collection(db, 'notes'), {
        title: noteForm.title,
        subject: noteForm.subject,
        semester: parseInt(noteForm.semester),
        branch: noteForm.department,
        noteType: "uploaded",
        description: noteForm.description,
        fileName: noteForm.file?.name || "",
        fileUrl: fileUrl,
        uploadedAt: Timestamp.now(),
        uploadedBy: profile?.name || user?.email || 'Unknown',
        uploaderProfession: profile?.profession || 'student',
        college: profile?.college || ''
      })
      
      toast({ title: "Success", description: "Notes uploaded successfully" })
      setNoteForm({ title: "", subject: "", semester: "", department: "", description: "", file: null })
    } catch (error) {
      console.error('Upload error:', error)
      toast({ title: "Error", description: `Failed to upload: ${error.message}`, variant: "destructive" })
    }
  }

  const handlePyqSubmit = async () => {
    try {
      let fileUrl = ''
      if (pyqForm.file) {
        const fileRef = ref(storage, `pyqs/${Date.now()}_${pyqForm.file.name}`)
        await uploadBytes(fileRef, pyqForm.file)
        fileUrl = await getDownloadURL(fileRef)
      }

      await addDoc(collection(db, 'pyqs'), {
        title: pyqForm.title,
        subject: pyqForm.subject,
        year: parseInt(pyqForm.year),
        semester: parseInt(pyqForm.semester),
        branch: pyqForm.department,
        examType: pyqForm.examType,
        fileName: pyqForm.file?.name || "",
        fileUrl: fileUrl,
        uploadedAt: Timestamp.now(),
        uploadedBy: profile?.name || user?.email || 'Unknown',
        uploaderProfession: profile?.profession || 'student',
        college: profile?.college || ''
      })
      
      toast({ title: "Success", description: "PYQ uploaded successfully" })
      setPyqForm({ title: "", subject: "", year: "", semester: "", department: "", examType: "", file: null })
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload PYQ", variant: "destructive" })
    }
  }

  const handleTimetableSubmit = async () => {
    try {
      let fileUrl = ''
      if (timetableForm.file) {
        const fileRef = ref(storage, `timetables/${Date.now()}_${timetableForm.file.name}`)
        await uploadBytes(fileRef, timetableForm.file)
        fileUrl = await getDownloadURL(fileRef)
      }

      await addDoc(collection(db, 'timetables'), {
        title: timetableForm.title,
        branch: timetableForm.department,
        semester: parseInt(timetableForm.semester),
        fileName: timetableForm.file?.name || "",
        fileUrl: fileUrl,
        uploadedAt: Timestamp.now(),
        uploadedBy: profile?.name || user?.email || 'Unknown',
        uploaderProfession: profile?.profession || 'student',
        college: profile?.college || ''
      })
      
      toast({ title: "Success", description: "Timetable uploaded successfully" })
      setTimetableForm({ title: "", department: "", semester: "", file: null })
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload timetable", variant: "destructive" })
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
        <p className="text-muted-foreground text-lg">Share announcements, notes, PYQs, and timetables with the community</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="announcement">Announcement</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="pyq">PYQ</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
        </TabsList>

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
              <Button onClick={handleNoteSubmit} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Notes
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
              <Button onClick={handlePyqSubmit} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload PYQ
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

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
              <Button onClick={handleTimetableSubmit} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Timetable
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}