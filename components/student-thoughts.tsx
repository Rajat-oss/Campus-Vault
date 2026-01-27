"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useThoughts } from "@/hooks/use-thoughts"
import Link from "next/link"

export function StudentThoughts() {
  const { data: thoughts, loading } = useThoughts()

  if (loading || thoughts.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <MessageCircle className="h-8 w-8 mr-3 text-blue-600" />
            What Students Say
          </h2>
          <p className="text-muted-foreground">Recent thoughts and feedback from our student community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {thoughts.slice(0, 6).map((thought) => (
            <Card key={thought.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4 italic">"{thought.content}"</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>- {thought.studentName}</span>
                  <span>{new Date(thought.createdAt?.toDate()).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/thoughts">Share Your Thoughts</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}