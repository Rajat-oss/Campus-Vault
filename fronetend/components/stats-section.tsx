import { Card, CardContent } from "@/components/ui/card"
import { Bell, BookOpen, FileText, Clock } from "lucide-react"

const stats = [
  {
    title: "Total Announcements",
    value: "156",
    icon: Bell,
    description: "Active announcements",
    color: "text-blue-600",
  },
  {
    title: "Notes Uploaded",
    value: "2,847",
    icon: BookOpen,
    description: "Study materials available",
    color: "text-green-600",
  },
  {
    title: "PYQs Available",
    value: "1,234",
    icon: FileText,
    description: "Previous year papers",
    color: "text-purple-600",
  },
  {
    title: "Active Timetables",
    value: "24",
    icon: Clock,
    description: "Current semester schedules",
    color: "text-orange-600",
  },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform Statistics</h2>
          <p className="text-muted-foreground">See what our community has achieved together</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="font-semibold mb-1">{stat.title}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
