"use client"

import { useState } from "react"

import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Plus, Edit, Trash2, Eye, Download, Shield } from "lucide-react"

const branches = ["CSE", "ECE", "Mechanical", "Civil", "IT", "Electrical"]
const semesters = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
]

// Empty data for existing content
const existingContent = {
  announcements: [],
  notes: [],
  pyqs: [],
  timetables: [],
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState("announcements")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Form states
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    type: "",
    visibility: "public",
  })
  const [noteForm, setNoteForm] = useState({
    title: "",
    subject: "",
    semester: "",
    branch: "",
    type: "",
    description: "",
    file: null,
  })
  const [pyqForm, setPyqForm] = useState({
    title: "",
    subject: "",
    year: "",
    semester: "",
    branch: "",
    examType: "",
    file: null,
  })
  const [timetableForm, setTimetableForm] = useState({
    title: "",
    branch: "",
    semester: "",
    file: null,
  })

  const { toast } = useToast()

  const handleLogin = async () => {
    try {
      // For demo purposes, using simple password check
      // In production, this would use Firebase Auth
      if (password === "admin123") {
        setIsAuthenticated(true)
        toast({ title: "Login successful", description: "Welcome to admin panel" })
      } else {
        toast({ title: "Login failed", description: "Invalid password", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Login error", description: "Something went wrong", variant: "destructive" })
    }
  }

  const handleFileUpload = async (file: File, type: string) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Admin Access Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="password">Admin Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
                <Button onClick={handleLogin} className="w-full">
                  Login to Admin Panel
                </Button>
                <Alert>
                  <AlertDescription>Demo password: admin123</AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
        <p className="text-muted-foreground text-lg">Manage content and upload new resources</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="pyqs">PYQs</TabsTrigger>
          <TabsTrigger value="timetables">Timetables</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Announcement
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
                  <Select
                    value={announcementForm.type}
                    onValueChange={(value) => setAnnouncementForm({ ...announcementForm, type: value })}
                  >
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
                <div>
                  <Label htmlFor="ann-visibility">Visibility</Label>
                  <Select
                    value={announcementForm.visibility}
                    onValueChange={(value) => setAnnouncementForm({ ...announcementForm, visibility: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full" 
                  onClick={async () => {
                    try {
                      const response = await fetch('http://localhost:3001/api/announcements', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          title: announcementForm.title,
                          content: announcementForm.content,
                          type: announcementForm.type,
                          visibility: announcementForm.visibility,
                          adminToken: 'admin123'
                        })
                      })
                      
                      if (response.ok) {
                        toast({ title: "Success", description: "Announcement published successfully" })
                        setAnnouncementForm({ title: "", content: "", type: "", visibility: "public" })
                      } else {
                        throw new Error('Failed to publish')
                      }
                    } catch (error) {
                      toast({ title: "Error", description: "Failed to publish announcement", variant: "destructive" })
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Publish Announcement
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {existingContent.announcements.length > 0 ? (
                    existingContent.announcements.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Badge variant="outline">{item.type}</Badge>
                            <span>{item.date}</span>
                            <Badge variant={item.status === "Published" ? "default" : "secondary"}>{item.status}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No announcements yet</p>
                      <p className="text-sm">Create your first announcement using the form on the left</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload New Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="note-title">Title</Label>
                  <Input
                    id="note-title"
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                    placeholder="Note title"
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
                    <Label htmlFor="note-type">Type</Label>
                    <Select value={noteForm.type} onValueChange={(value) => setNoteForm({ ...noteForm, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="handwritten">Handwritten</SelectItem>
                        <SelectItem value="typed">Typed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="note-branch">Branch</Label>
                    <Select
                      value={noteForm.branch}
                      onValueChange={(value) => setNoteForm({ ...noteForm, branch: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="note-semester">Semester</Label>
                    <Select
                      value={noteForm.semester}
                      onValueChange={(value) => setNoteForm({ ...noteForm, semester: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester} value={semester}>
                            {semester}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="note-description">Description</Label>
                  <Textarea
                    id="note-description"
                    value={noteForm.description}
                    onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                    placeholder="Brief description of the notes"
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
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <Button 
                  className="w-full" 
                  disabled={isUploading || !noteForm.file}
                  onClick={async () => {
                    if (!noteForm.file) return
                    
                    try {
                      await handleFileUpload(noteForm.file, 'notes')
                      
                      // For demo purposes, just show success
                      // In production, you would upload the file and save metadata
                      
                      toast({ title: "Success", description: "Notes uploaded successfully" })
                      setNoteForm({ title: "", subject: "", semester: "", branch: "", type: "", description: "", file: null })
                    } catch (error) {
                      toast({ title: "Error", description: "Failed to upload notes", variant: "destructive" })
                    }
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Notes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {existingContent.notes.length > 0 ? (
                    existingContent.notes.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Badge variant="outline">{item.subject}</Badge>
                            <span>{item.semester}</span>
                            <Badge variant={item.type === "Handwritten" ? "default" : "secondary"}>{item.type}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No notes uploaded yet</p>
                      <p className="text-sm">Upload your first notes using the form on the left</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pyqs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Previous Year Paper
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
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pyq-branch">Branch</Label>
                    <Select value={pyqForm.branch} onValueChange={(value) => setPyqForm({ ...pyqForm, branch: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pyq-semester">Semester</Label>
                    <Select
                      value={pyqForm.semester}
                      onValueChange={(value) => setPyqForm({ ...pyqForm, semester: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester} value={semester}>
                            {semester}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="pyq-examtype">Exam Type</Label>
                  <Select
                    value={pyqForm.examType}
                    onValueChange={(value) => setPyqForm({ ...pyqForm, examType: value })}
                  >
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
                <Button className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Paper
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Papers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {existingContent.pyqs.length > 0 ? (
                    existingContent.pyqs.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Badge variant="outline">{item.subject}</Badge>
                            <span>{item.year}</span>
                            <Badge variant="secondary">{item.examType}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No PYQs uploaded yet</p>
                      <p className="text-sm">Upload your first previous year paper using the form on the left</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timetables" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
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
                    <Label htmlFor="tt-branch">Branch</Label>
                    <Select
                      value={timetableForm.branch}
                      onValueChange={(value) => setTimetableForm({ ...timetableForm, branch: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tt-semester">Semester</Label>
                    <Select
                      value={timetableForm.semester}
                      onValueChange={(value) => setTimetableForm({ ...timetableForm, semester: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester} value={semester}>
                            {semester}
                          </SelectItem>
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
                <Button className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Timetable
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Timetables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {existingContent.timetables.length > 0 ? (
                    existingContent.timetables.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Badge variant="outline">{item.branch}</Badge>
                            <span>{item.semester}</span>
                            <Badge variant={item.status === "Published" ? "default" : "secondary"}>{item.status}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No timetables uploaded yet</p>
                      <p className="text-sm">Upload your first timetable using the form on the left</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
