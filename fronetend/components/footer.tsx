import Link from "next/link"
import { BookOpen, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">CampusVault</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your one-stop portal for all academic needs. Access notes, papers, timetables, and more.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/announcements" className="block text-sm text-muted-foreground hover:text-primary">
                Announcements
              </Link>
              <Link href="/notes" className="block text-sm text-muted-foreground hover:text-primary">
                Study Notes
              </Link>
              <Link href="/pyqs" className="block text-sm text-muted-foreground hover:text-primary">
                Previous Papers
              </Link>
              <Link href="/timetable" className="block text-sm text-muted-foreground hover:text-primary">
                Timetables
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <div className="space-y-2">
              <Link href="/request" className="block text-sm text-muted-foreground hover:text-primary">
                Request Material
              </Link>
              <Link href="/admin" className="block text-sm text-muted-foreground hover:text-primary">
                Admin Panel
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary">
                Help & Support
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>admin@campusvault.in</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 12345 67890</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Your College Campus</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CampusVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
