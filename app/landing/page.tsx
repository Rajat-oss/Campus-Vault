import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Calendar, FileText, GraduationCap, Star, ArrowRight, CheckCircle, Shield, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">CampusVault</span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" asChild className="text-gray-300 hover:text-white">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <section className="py-24 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-sm font-medium mb-8">
            <Star className="h-4 w-4 mr-2" />
            Trusted by 10,000+ students worldwide
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            The Future of
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Academic Excellence
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your academic journey with our comprehensive platform. Access premium study materials, 
            connect with peers, and achieve excellence with tools designed for modern education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 rounded-lg group">
              <Link href="/signup" className="flex items-center">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-700 text-gray-300 hover:bg-gray-800 text-lg px-8 py-4 rounded-lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive tools and resources designed for academic success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-600/50 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-blue-600/10 border border-blue-600/20 rounded-xl w-fit group-hover:bg-blue-600/20 transition-colors">
                  <BookOpen className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="text-xl text-white">Premium Study Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-400">
                  Curated notes, textbooks, and comprehensive study guides for all subjects
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-green-600/50 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-green-600/10 border border-green-600/20 rounded-xl w-fit group-hover:bg-green-600/20 transition-colors">
                  <FileText className="h-8 w-8 text-green-400" />
                </div>
                <CardTitle className="text-xl text-white">Question Banks</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-400">
                  Extensive collection of previous year questions and practice tests
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-600/50 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-purple-600/10 border border-purple-600/20 rounded-xl w-fit group-hover:bg-purple-600/20 transition-colors">
                  <Calendar className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-xl text-white">Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-400">
                  Intelligent timetables and exam schedules to optimize your time
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-orange-600/50 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-orange-600/10 border border-orange-600/20 rounded-xl w-fit group-hover:bg-orange-600/20 transition-colors">
                  <Users className="h-8 w-8 text-orange-400" />
                </div>
                <CardTitle className="text-xl text-white">Academic Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-400">
                  Connect with peers, share knowledge, and collaborate effectively
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold mb-8">Why Choose CampusVault?</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Verified Content</h4>
                    <p className="text-gray-400">All materials are reviewed and verified by academic experts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Shield className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Secure & Private</h4>
                    <p className="text-gray-400">Enterprise-grade security protecting your academic data</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Zap className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Lightning Fast</h4>
                    <p className="text-gray-400">Instant access to resources with optimized performance</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-gray-800 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-400 mb-2">98%</div>
                <div className="text-xl text-gray-300 mb-4">Student Success Rate</div>
                <p className="text-gray-400">Students using CampusVault show significant improvement in academic performance</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">10K+</div>
              <div className="text-gray-400">Active Students</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-400 mb-2">50K+</div>
              <div className="text-gray-400">Study Materials</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-gray-400">Partner Colleges</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-400">Support Available</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <Card className="border-0 bg-gradient-to-r from-grey-600 to-grey-600 text-white">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-4xl md:text-5xl font-bold mb-6">Ready to Excel?</CardTitle>
              <CardDescription className="text-blue-100 text-xl max-w-2xl mx-auto">
                Join thousands of students who have transformed their academic journey with CampusVault
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4 rounded-lg mb-6 bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/signup">Start Free Today</Link>
              </Button>
              <p className="text-blue-100">
                Already have an account?{" "}
                <Link href="/login" className="text-white hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">CampusVault</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Empowering students worldwide with cutting-edge academic resources and collaborative learning tools.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 CampusVault. All rights reserved. Transforming education globally.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}