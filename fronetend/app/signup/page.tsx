"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { signUp } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [profession, setProfession] = useState<string | null>(null)
  const [department, setDepartment] = useState("")

  const [employeeId, setEmployeeId] = useState("")
  const [college, setCollege] = useState("")
  const [collegeName, setCollegeName] = useState("")
  const [collegeId, setCollegeId] = useState("")
  const [loading, setLoading] = useState(false)
  const [colleges, setColleges] = useState<Array<{name: string, id: string}>>([])

  const router = useRouter()
  const { toast } = useToast()

  const fetchColleges = async () => {
    if (profession === 'student') {
      try {
        const q = query(collection(db, 'users'), where('profession', '==', 'faculty'))
        const snapshot = await getDocs(q)
        const collegeMap = new Map()
        snapshot.docs.forEach(doc => {
          const collegeId = doc.data().collegeId
          if (collegeId && !collegeMap.has(collegeId)) {
            collegeMap.set(collegeId, { name: doc.data().college, id: collegeId })
          }
        })
        setColleges(Array.from(collegeMap.values()))
      } catch (error) {
        console.error('Error fetching colleges:', error)
      }
    }
  }

  useEffect(() => {
    fetchColleges()
  }, [profession])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast({ 
        title: "Error", 
        description: "Passwords don't match",
        variant: "destructive" 
      })
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, {
        name,
        profession: profession as 'student' | 'faculty',
        college: profession === 'faculty' ? collegeName : college,
        employeeId: profession === 'faculty' ? employeeId : undefined
      })
      
      toast({ title: "Success", description: "Account created successfully" })
      setTimeout(() => {
        router.push("/")
      }, 100)
    } catch (error: any) {
      toast({ 
        title: "Signup failed", 
        description: error.message || "Failed to create account",
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  if (!profession) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Choose Your Role</CardTitle>
            <p className="text-center text-muted-foreground">Select your profession to continue</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setProfession('student')} 
              className="w-full h-16 text-lg"
              variant="outline"
            >
              Student
            </Button>
            <Button 
              onClick={() => setProfession('faculty')} 
              className="w-full h-16 text-lg"
              variant="outline"
            >
              Faculty
            </Button>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {profession === 'student' ? 'Student' : 'Faculty'} Sign Up
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setProfession(null)}
            className="mx-auto"
          >
            ← Change Role
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {profession === 'faculty' && (
              <div>
                <Label htmlFor="collegeName">College Name</Label>
                <Input
                  id="collegeName"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="Enter your college name"
                  required
                />
              </div>
            )}

            {profession === 'student' && (
              <>
                <div>
                  <Label htmlFor="collegeId">College ID</Label>
                  <Input
                    id="collegeId"
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    placeholder="Enter college ID provided by faculty"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="college">College</Label>
                  <Select value={college} onValueChange={setCollege}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your college" />
                    </SelectTrigger>
                    <SelectContent>
                      {colleges.map((col, index) => (
                        <SelectItem key={`${col.id}-${index}`} value={col.name}>
                          {col.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {profession === 'faculty' && (
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Enter employee ID"
                  required
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
