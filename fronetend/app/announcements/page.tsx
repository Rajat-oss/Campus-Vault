"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Filter, Loader2, Trash2 } from "lucide-react"
import { useAnnouncements } from "@/hooks/use-realtime-data"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useToast } from "@/hooks/use-toast"
import { deleteAnnouncement } from "@/lib/firebase-operations"
import { Button } from "@/components/ui/button"

const getTagColor = (tag: string) => {
  const colors: Record<string, string> = {
    exam: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    event: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    notice: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    holiday: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    placement: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    workshop: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  }
  return colors[tag.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
}

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTag, setFilterTag] = useState("all")
  
  const { data: announcements, loading, error } = useAnnouncements({ isActive: true })
  const { profile } = useUserProfile()
  const { toast } = useToast()

  const handleDelete = async (id: string, createdBy: string) => {
    console.log('Profile:', profile)
    console.log('CreatedBy:', createdBy)
    
    const canDelete = profile?.name === createdBy || 
                     profile?.email === createdBy || 
                     profile?.profession === 'faculty'
    
    if (!canDelete) {
      toast({ title: "Error", description: "You can only delete your own announcements", variant: "destructive" })
      return
    }
    
    try {
      await deleteAnnouncement(id)
      toast({ title: "Success", description: "Announcement deleted successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete announcement", variant: "destructive" })
    }
  }

  const filteredAnnouncements = announcements.filter((announcement: any) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterTag === "all" || announcement.type.toLowerCase() === filterTag.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const uniqueTags = ["all", ...Array.from(new Set(announcements.map((a: any) => a.type.toLowerCase())))]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Announcements</h1>
        <p className="text-muted-foreground text-lg">Stay updated with the latest news and updates from the college</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterTag} onValueChange={setFilterTag}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              {uniqueTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag === "all" ? "All Tags" : tag.charAt(0).toUpperCase() + tag.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading announcements...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      )}

      {/* Announcements Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements.map((announcement: any) => (
            <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getTagColor(announcement.type)}>{announcement.type}</Badge>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(announcement.timestamp?.toDate()).toLocaleDateString()}
                    </div>
                    {(profile && (profile.name === announcement.createdBy || profile.email === announcement.createdBy || profile.profession === 'faculty')) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(announcement.id, announcement.createdBy)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{announcement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{announcement.content}</p>
                <p className="text-xs text-muted-foreground">
                  By: {announcement.createdBy && !announcement.createdBy.includes('@') 
                    ? announcement.createdBy 
                    : announcement.createdBy?.split('@')[0] || 'Unknown'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && filteredAnnouncements.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No announcements found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
