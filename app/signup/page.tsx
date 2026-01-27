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
import { GraduationCap, ArrowLeft, Mail, Lock, User, Building, IdCard, Users, BookOpen } from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [profession, setProfession] = useState<string | null>(null)
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
      router.push("/home")
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
      <div className="min-h-screen bg-black text-white flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-12 flex-col justify-between">
          <div>
            <Link href="/landing" className="flex items-center space-x-3 text-white hover:text-gray-300 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold">CampusVault</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight">
                Join the Future of
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Academic Excellence
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Connect with thousands of students and educators. Access premium resources and transform your learning experience.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">10K+</div>
              <div className="text-sm text-gray-400">Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">50K+</div>
              <div className="text-sm text-gray-400">Resources</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">500+</div>
              <div className="text-sm text-gray-400">Colleges</div>
            </div>
          </div>
        </div>

        {/* Right Side - Role Selection */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Header */}
            <div className="lg:hidden text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">CampusVault</span>
              </div>
              <Link href="/landing" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>

            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold text-white mb-2">Choose Your Role</CardTitle>
                <p className="text-gray-400">Select how you'll be using CampusVault</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => setProfession('student')} 
                  className="w-full h-20 bg-gray-800/50 hover:bg-blue-600/20 border border-gray-700 hover:border-blue-500 text-white transition-all duration-300 group"
                  variant="outline"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-colors">
                      <BookOpen className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-semibold">Student</div>
                      <div className="text-sm text-gray-400">Access study materials and connect with peers</div>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => setProfession('faculty')} 
                  className="w-full h-20 bg-gray-800/50 hover:bg-green-600/20 border border-gray-700 hover:border-green-500 text-white transition-all duration-300 group"
                  variant="outline"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-600/20 rounded-lg group-hover:bg-green-600/30 transition-colors">
                      <Users className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-semibold">Faculty</div>
                      <div className="text-sm text-gray-400">Manage resources and connect with students</div>
                    </div>
                  </div>
                </Button>

                <div className="text-center pt-4 border-t border-gray-800">
                  <p className="text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-12 flex-col justify-between">
        <div>
          <Link href="/landing" className="flex items-center space-x-3 text-white hover:text-gray-300 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold">CampusVault</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              Create Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Academic Account
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Join as a {profession} and unlock access to premium educational resources and collaborative tools.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">10K+</div>
            <div className="text-sm text-gray-400">Students</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">50K+</div>
            <div className="text-sm text-gray-400">Resources</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">500+</div>
            <div className="text-sm text-gray-400">Colleges</div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-2 bg-blue-600 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">CampusVault</span>
            </div>
            <Link href="/landing" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <CardTitle className="text-2xl font-bold text-white capitalize">{profession} Registration</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setProfession(null)}
                  className="text-gray-400 hover:text-white"
                >
                  Change
                </Button>
              </div>
              <p className="text-gray-400">Fill in your details to create your account</p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300 font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                {profession === 'faculty' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="collegeName" className="text-gray-300 font-medium">College Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="collegeName"
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                          className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                          placeholder="Enter your college name"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeId" className="text-gray-300 font-medium">Employee ID</Label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="employeeId"
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                          placeholder="Enter employee ID"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {profession === 'student' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="collegeId" className="text-gray-300 font-medium">College ID</Label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="collegeId"
                          value={collegeId}
                          onChange={(e) => setCollegeId(e.target.value)}
                          className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                          placeholder="Enter college ID from faculty"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="college" className="text-gray-300 font-medium">Select College</Label>
                      <Select value={college} onValueChange={setCollege}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                          <SelectValue placeholder="Select your college" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {colleges.map((col, index) => (
                            <SelectItem key={`${col.id}-${index}`} value={col.name} className="text-white hover:bg-gray-700">
                              {col.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300 font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors mt-6" 
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-gray-800 mt-6">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}