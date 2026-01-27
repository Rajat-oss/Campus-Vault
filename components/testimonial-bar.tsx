"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    text: "CampusVault has made accessing study materials so much easier. I can find notes from seniors instantly!",
    author: "Priya S., CSE 3rd Year",
  },
  {
    text: "The previous year papers section helped me prepare effectively for my exams. Highly recommended!",
    author: "Rahul M., ECE 2nd Year",
  },
  {
    text: "Finally, a platform where all academic resources are organized in one place. Great work!",
    author: "Ananya K., IT 4th Year",
  },
  {
    text: "The timetable feature keeps me updated with all schedule changes. Very convenient!",
    author: "Arjun P., Mechanical 1st Year",
  },
]

export function TestimonialBar() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What Students Say</h2>

          <Card className="relative overflow-hidden">
            <CardContent className="p-8">
              <Quote className="h-8 w-8 text-primary mx-auto mb-6" />
              <div className="transition-all duration-500 ease-in-out">
                <p className="text-lg italic mb-4">"{testimonials[currentIndex].text}"</p>
                <p className="font-semibold text-primary">— {testimonials[currentIndex].author}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-muted"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
