"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, BookOpen, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { logout } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Announcements", href: "/announcements" },
  { name: "Timetable", href: "/timetable" },
  { name: "Notes", href: "/notes" },
  { name: "PYQs", href: "/pyqs" },
  { name: "Request", href: "/request" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      toast({ title: "Success", description: "Logged out successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to logout", variant: "destructive" })
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">CampusVault</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && (
              user ? (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin">Admin</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )
            )}
            <ThemeToggle />

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!loading && (
                user ? (
                  <div className="space-y-1 pt-2 border-t">
                    <div className="px-3 py-2 text-sm text-muted-foreground">{user.email}</div>
                    <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent" onClick={() => setIsOpen(false)}>Admin</Link>
                    <button onClick={() => { handleLogout(); setIsOpen(false) }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent">Logout</button>
                  </div>
                ) : (
                  <div className="space-y-1 pt-2 border-t">
                    <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent" onClick={() => setIsOpen(false)}>Login</Link>
                    <Link href="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent" onClick={() => setIsOpen(false)}>Sign Up</Link>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
