import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { AnnouncementsPreview } from "@/components/announcements-preview"
import { StudentThoughts } from "@/components/student-thoughts"
import { TestimonialBar } from "@/components/testimonial-bar"

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <StatsSection />
      <AnnouncementsPreview />
      <StudentThoughts />
      <TestimonialBar />
    </div>
  )
}
