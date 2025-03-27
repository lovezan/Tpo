import type { Metadata } from "next"
import SubmissionForm from "@/components/submission-form"

export const metadata: Metadata = {
  title: "Submit Your Experience | NIT Hamirpur",
  description: "Share your placement experience to help juniors at NIT Hamirpur",
}

export default function SubmitPage() {
  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Share Your Placement Experience</h1>
          <p className="text-muted-foreground">
            Help juniors by sharing your placement journey, interview process, and preparation tips
          </p>
        </div>

        <SubmissionForm />
      </div>
    </div>
  )
}

