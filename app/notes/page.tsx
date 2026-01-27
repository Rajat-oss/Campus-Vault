"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Download, Eye, Search, Star, Loader2, Trash2 } from "lucide-react"
import { useNotes } from "@/hooks/use-realtime-data"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useToast } from "@/hooks/use-toast"
import { deleteNote } from "@/lib/firebase-operations"

const branches = ["All", "CSE", "ECE", "Mechanical", "Civil", "IT", "Electrical"]
const semesters = ["All", 1, 2, 3, 4, 5, 6, 7, 8]

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("All")
  const [selectedSemester, setSelectedSemester] = useState("All")
  const [selectedSubject, setSelectedSubject] = useState("All")
  
  const { data: notes, loading, error } = useNotes()
  const { profile } = useUserProfile()
  const { toast } = useToast()

  const handleDelete = async (id: string, uploadedBy: string) => {
    if (profile?.name !== uploadedBy && profile?.profession !== 'faculty') {
      toast({ title: "Error", description: "You can only delete your own uploads", variant: "destructive" })
      return
    }
    
    try {
      await deleteNote(id)
      toast({ title: "Success", description: "Note deleted successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete note", variant: "destructive" })
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading notes...</span>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Failed to load notes</p>
      </div>
    )
  }
  
  const subjects = ["All", ...Array.from(new Set(notes.map((note) => note.subject)))]

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBranch = selectedBranch === "All" || note.branch === selectedBranch
    const matchesSemester = selectedSemester === "All" || note.semester === selectedSemester
    const matchesSubject = selectedSubject === "All" || note.subject === selectedSubject

    return matchesSearch && matchesBranch && matchesSemester && matchesSubject
  })

  const popularNotes = notes.slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Study Notes</h1>
        <p className="text-muted-foreground text-lg">Access notes and study materials from students</p>
      </div>

      {/* Popular Notes Section */}
      {popularNotes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Star className="h-6 w-6 text-yellow-500 mr-2" />
            Recent Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="default">{note.noteType || 'uploaded'}</Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{note.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {note.subject} • {note.semester}th Semester
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search notes by title or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Branch</label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue />
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
            <label className="block text-sm font-medium mb-2">Semester</label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester === "All" ? "All" : `${semester}th Semester`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 h-48 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-blue-500" />
                <div className="absolute top-2 left-2">
                  <Badge variant="default">{note.noteType || 'uploaded'}</Badge>
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {note.fileName || 'PDF'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2 line-clamp-2">{note.title}</CardTitle>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-medium">{note.subject}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Semester:</span>
                  <span className="font-medium">{note.semester}th</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uploaded by:</span>
                  <span className="font-medium">{note.uploadedBy}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <span className="text-muted-foreground">{note.timestamp ? new Date(note.timestamp.seconds * 1000).toLocaleDateString() : 'Recently'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1" 
                  onClick={() => note.fileUrl && window.open(note.fileUrl, '_blank')}
                  disabled={!note.fileUrl}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    if (note.fileUrl) {
                      const link = document.createElement('a')
                      link.href = note.fileUrl + '?fl_attachment=true'
                      link.download = note.fileName || 'document.pdf'
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }
                  }}
                  disabled={!note.fileUrl}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                {(profile?.name === note.uploadedBy || profile?.profession === 'faculty') && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(note.id, note.uploadedBy)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Notes Found</h3>
          <p className="text-muted-foreground">
            No notes uploaded yet. Be the first to share your notes!
          </p>
        </div>
      )}
    </div>
  )
}