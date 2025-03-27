import type { Metadata } from "next"
import ExperienceFilter from "@/components/experience-filter"
import ExperienceList from "@/components/experience-list"

export const metadata: Metadata = {
  title: "Placement Experiences | NIT Hamirpur",
  description: "Browse placement experiences shared by NIT Hamirpur alumni",
}

export default function ExperiencesPage() {
  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Placement Experiences</h1>
          <p className="text-muted-foreground">
            Browse through the placement experiences shared by NIT Hamirpur alumni
          </p>
        </div>

        <ExperienceFilter />
        <ExperienceList />
      </div>
    </div>
  )
}

