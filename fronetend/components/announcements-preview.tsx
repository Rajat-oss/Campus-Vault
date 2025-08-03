"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight, Loader2 } from "lucide-react"
import { useAnnouncements } from "@/hooks/use-realtime-data"

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

export function AnnouncementsPreview() {
  const { data: announcements, loading, error } = useAnnouncements({ isActive: true })
  const recentAnnouncements = announcements.slice(0, 4)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Latest Announcements</h2>
            <p className="text-muted-foreground">Stay updated with the latest news and updates</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/announcements">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading announcements...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load announcements</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentAnnouncements.map((announcement: any) => (
              <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getTagColor(announcement.type)}>{announcement.type}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(announcement.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{announcement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && recentAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No announcements available</p>
          </div>
        )}
      </div>
    </section>
  )
}
