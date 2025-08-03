import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { AnnouncementsPreview } from "@/components/announcements-preview"
import { TestimonialBar } from "@/components/testimonial-bar"

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <StatsSection />
      <AnnouncementsPreview />
      <TestimonialBar />
    </div>
  )
}
