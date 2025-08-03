"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Download, Eye, Search, Star } from "lucide-react"

const notes = [
  {
    id: 1,
    title: "Data Structures and Algorithms - Complete Notes",
    subject: "Data Structures",
    semester: "3rd Semester",
    branch: "CSE",
    type: "Handwritten",
    author: "Priya Sharma",
    uploadDate: "2024-01-15",
    views: 1250,
    rating: 4.8,
    thumbnail: "/placeholder.svg?height=200&width=300&text=DSA+Notes",
    format: "PDF",
    size: "15.2 MB",
  },
  {
    id: 2,
    title: "Operating Systems Concepts",
    subject: "Operating Systems",
    semester: "4th Semester",
    branch: "CSE",
    type: "Typed",
    author: "Rahul Kumar",
    uploadDate: "2024-01-12",
    views: 890,
    rating: 4.6,
    thumbnail: "/placeholder.svg?height=200&width=300&text=OS+Notes",
    format: "PDF",
    size: "8.7 MB",
  },
  {
    id: 3,
    title: "Digital Electronics - Gate Preparation",
    subject: "Digital Electronics",
    semester: "3rd Semester",
    branch: "ECE",
    type: "Handwritten",
    author: "Ananya Patel",
    uploadDate: "2024-01-10",
    views: 675,
    rating: 4.9,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Digital+Electronics",
    format: "PDF",
    size: "12.1 MB",
  },
  {
    id: 4,
    title: "Database Management Systems",
    subject: "DBMS",
    semester: "4th Semester",
    branch: "CSE",
    type: "Handwritten",
    author: "Arjun Singh",
    uploadDate: "2024-01-08",
    views: 1100,
    rating: 4.7,
    thumbnail: "/placeholder.svg?height=200&width=300&text=DBMS+Notes",
    format: "PDF",
    size: "18.5 MB",
  },
  {
    id: 5,
    title: "Microprocessors and Microcontrollers",
    subject: "Microprocessors",
    semester: "5th Semester",
    branch: "ECE",
    type: "Typed",
    author: "Sneha Reddy",
    uploadDate: "2024-01-05",
    views: 520,
    rating: 4.5,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Microprocessors",
    format: "PDF",
    size: "9.8 MB",
  },
  {
    id: 6,
    title: "Computer Networks - Complete Guide",
    subject: "Computer Networks",
    semester: "5th Semester",
    branch: "CSE",
    type: "Handwritten",
    author: "Vikash Gupta",
    uploadDate: "2024-01-03",
    views: 980,
    rating: 4.8,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Computer+Networks",
    format: "PDF",
    size: "14.3 MB",
  },
]

const branches = ["All", "CSE", "ECE", "Mechanical", "Civil", "IT", "Electrical"]
const semesters = [
  "All",
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
]
const subjects = ["All", ...Array.from(new Set(notes.map((note) => note.subject)))]

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("All")
  const [selectedSemester, setSelectedSemester] = useState("All")
  const [selectedSubject, setSelectedSubject] = useState("All")

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBranch = selectedBranch === "All" || note.branch === selectedBranch
    const matchesSemester = selectedSemester === "All" || note.semester === selectedSemester
    const matchesSubject = selectedSubject === "All" || note.subject === selectedSubject

    return matchesSearch && matchesBranch && matchesSemester && matchesSubject
  })

  const popularNotes = notes.sort((a, b) => b.views - a.views).slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Study Notes</h1>
        <p className="text-muted-foreground text-lg">Access handwritten notes and study materials from seniors</p>
      </div>

      {/* Popular Notes Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Star className="h-6 w-6 text-yellow-500 mr-2" />
          Most Viewed Notes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {popularNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={note.type === "Handwritten" ? "default" : "secondary"}>{note.type}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Eye className="h-4 w-4 mr-1" />
                    {note.views}
                  </div>
                </div>
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{note.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {note.subject} • {note.semester}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

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
                    {semester}
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
              <div className="relative">
                <img
                  src={note.thumbnail || "/placeholder.svg"}
                  alt={note.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant={note.type === "Handwritten" ? "default" : "secondary"}>{note.type}</Badge>
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {note.format} • {note.size}
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
                  <span className="font-medium">{note.semester}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Author:</span>
                  <span className="font-medium">{note.author}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{note.views} views</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>{note.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
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
            No notes match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  )
}
