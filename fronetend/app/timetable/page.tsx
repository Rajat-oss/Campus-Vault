"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, Clock, Loader2 } from "lucide-react"

const branches = [
  "Computer Science Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Electrical Engineering",
]

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

const timetableData = {
  "Computer Science Engineering": {
    "3rd Semester": {
      title: "CSE 3rd Semester Timetable",
      uploadDate: "2024-01-10",
      format: "PDF",
      size: "2.3 MB",
      url: "/placeholder.svg?height=600&width=800&text=CSE+3rd+Semester+Timetable",
    },
    "4th Semester": {
      title: "CSE 4th Semester Timetable",
      uploadDate: "2024-01-08",
      format: "PDF",
      size: "2.1 MB",
      url: "/placeholder.svg?height=600&width=800&text=CSE+4th+Semester+Timetable",
    },
  },
  "Electronics & Communication": {
    "3rd Semester": {
      title: "ECE 3rd Semester Timetable",
      uploadDate: "2024-01-09",
      format: "PDF",
      size: "2.0 MB",
      url: "/placeholder.svg?height=600&width=800&text=ECE+3rd+Semester+Timetable",
    },
  },
}

export default function TimetablePage() {
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [loading, setLoading] = useState(false)

  const currentTimetable = selectedBranch && selectedSemester ? timetableData[selectedBranch]?.[selectedSemester] : null

  const handleDownload = () => {
    setLoading(true)
    // Simulate download delay
    setTimeout(() => {
      setLoading(false)
      // In a real app, this would trigger the actual download
      console.log("Downloading timetable...")
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Timetables</h1>
        <p className="text-muted-foreground text-lg">Access your class schedules and exam timetables</p>
      </div>

      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Select Branch</label>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger>
              <SelectValue placeholder="Choose your branch" />
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
          <label className="block text-sm font-medium mb-2">Select Semester</label>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger>
              <SelectValue placeholder="Choose your semester" />
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

      {/* Timetable Display */}
      {currentTimetable ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{currentTimetable.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Uploaded: {new Date(currentTimetable.uploadDate).toLocaleDateString()}
                    </div>
                    <Badge variant="secondary">{currentTimetable.format}</Badge>
                    <span>{currentTimetable.size}</span>
                  </div>
                </div>
                <Button onClick={handleDownload} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={currentTimetable.url || "/placeholder.svg"}
                  alt={currentTimetable.title}
                  className="w-full h-auto"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : selectedBranch && selectedSemester ? (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Timetable Not Available</h3>
            <p className="text-muted-foreground">
              The timetable for {selectedBranch} - {selectedSemester} is not yet available. Please check back later or
              contact the admin.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select Branch and Semester</h3>
            <p className="text-muted-foreground">
              Please select your branch and semester to view the corresponding timetable.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
