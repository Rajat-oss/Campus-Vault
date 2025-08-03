"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Loader2, Trash2 } from "lucide-react"
import { useAnnouncements } from "@/hooks/use-realtime-data"
import { deleteAnnouncement } from "@/lib/firebase-operations"
import { useToast } from "@/hooks/use-toast"
import { useUserProfile } from "@/hooks/use-user-profile"

const getTagColor = (tag: string) => {
  const colors: Record<string, string> = {
    exam: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    event: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    notice: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    holiday: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    placement: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  }
  return colors[tag.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
}

export function RealtimeAnnouncements() {
  const { data: announcements, loading, error } = useAnnouncements({ isActive: true })
  const { profile } = useUserProfile()
  const { toast } = useToast()

  const handleDelete = async (id: string, createdBy: string) => {
    if (profile?.name !== createdBy && profile?.profession !== 'faculty') {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading announcements...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load announcements</p>
      </div>
    )
  }

  const recentAnnouncements = announcements.slice(0, 3)

  return (
    <div className="space-y-4">
      {recentAnnouncements.map((announcement: any) => (
        <Card key={announcement.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start mb-2">
              <Badge className={getTagColor(announcement.type)}>{announcement.type}</Badge>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(announcement.timestamp?.toDate()).toLocaleDateString()}
                </div>
                {(profile?.name === announcement.createdBy || profile?.profession === 'faculty') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(announcement.id, announcement.createdBy)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <CardTitle className="text-lg leading-tight">{announcement.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">{announcement.content}</p>
            <p className="text-xs text-muted-foreground mt-2">By: {announcement.createdBy}</p>
          </CardContent>
        </Card>
      ))}
      
      {recentAnnouncements.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No announcements available</p>
        </div>
      )}
    </div>
  )
}