"use client"

import { useState } from "react"
import { usePYQs } from "@/hooks/use-realtime-data"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Eye, Search, TrendingUp } from "lucide-react"

const pyqs: any[] = []

const branches = ["All", "CSE", "ECE", "Mechanical", "Civil", "IT", "Electrical"]
const years = ["All", "2023", "2022", "2021", "2020"]
const subjects = ["All"]
const examTypes = ["All", "End Semester", "Mid Semester", "Sessional"]

export default function PYQsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("All")
  const [selectedYear, setSelectedYear] = useState("All")
  const [selectedSubject, setSelectedSubject] = useState("All")
  const [selectedExamType, setSelectedExamType] = useState("All")
  const [sortBy, setSortBy] = useState("newest")

  const { data: pyqs, loading, error } = usePYQs()

  let filteredPYQs = pyqs.filter((pyq: any) => {
    const matchesSearch =
      pyq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pyq.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBranch = selectedBranch === "All" || pyq.branch === selectedBranch
    const matchesYear = selectedYear === "All" || pyq.year.toString() === selectedYear
    const matchesSubject = selectedSubject === "All" || pyq.subject === selectedSubject
    const matchesExamType = selectedExamType === "All" || pyq.examType === selectedExamType

    return matchesSearch && matchesBranch && matchesYear && matchesSubject && matchesExamType
  })

  // Sort filtered results
  filteredPYQs = filteredPYQs.sort((a: any, b: any) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      case "oldest":
        return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
      case "downloads":
        return (b.downloads || 0) - (a.downloads || 0)
      case "year":
        return Number.parseInt(b.year) - Number.parseInt(a.year)
      default:
        return 0
    }
  })

  const mostDownloaded = pyqs.sort((a: any, b: any) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Previous Year Papers</h1>
        <p className="text-muted-foreground text-lg">
          Access question papers from previous years to prepare for your exams
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading PYQs...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      )}

      {/* Most Downloaded Section */}
      {!loading && !error && mostDownloaded.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
            Most Downloaded Papers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mostDownloaded.map((pyq: any) => (
              <Card key={pyq.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{pyq.year}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Download className="h-4 w-4 mr-1" />
                      {pyq.downloads || 0}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{pyq.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {pyq.subject} • {pyq.examType}
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
            placeholder="Search papers by title or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <label className="block text-sm font-medium mb-2">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
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

          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="downloads">Most Downloaded</SelectItem>
                <SelectItem value="year">By Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* PYQs Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPYQs.map((pyq: any) => (
            <Card key={pyq.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs">
                    {pyq.year}
                  </Badge>
                  <Badge variant={pyq.examType === "End Semester" ? "default" : "secondary"} className="text-xs">
                    {pyq.examType}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{pyq.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {pyq.subject} • {pyq.semester} • {pyq.branch}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Format:</span>
                    <span className="font-medium">
                      PDF • {pyq.fileSize || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Downloads:</span>
                    <span className="font-medium">{pyq.downloads || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Uploaded:</span>
                    <span className="font-medium">{new Date(pyq.uploadedAt).toLocaleDateString()}</span>
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
      )}

      {!loading && !error && filteredPYQs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Papers Found</h3>
          <p className="text-muted-foreground">
            No question papers available yet. Check back later or contact admin to upload papers.
          </p>
        </div>
      )}
    </div>
  )
}
