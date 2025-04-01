import type { Metadata } from "next"
import ExperienceFilter from "@/components/experience-filter"
import ExperienceList from "@/components/experience-list"

export const metadata: Metadata = {
  title: "Placement Experiences | NIT Hamirpur",
  description: "Browse placement experiences shared by NIT Hamirpur alumni",
}

export default function ExperiencesPage() {
  return (
    <div className="container px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Placement Experiences</h2>
         
        </div>

        <ExperienceFilter />
        <ExperienceList />
      </div>
    </div>
  )
}

