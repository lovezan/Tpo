"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Building, Briefcase, Linkedin, Github, Mail, Award } from "lucide-react"
import { getExperiences } from "@/lib/data-utils"
import { toast } from "@/hooks/use-toast"
import type { Experience } from "@/components/experience-list"

export default function ExperiencePage() {
  const params = useParams()
  const router = useRouter()
  const [experience, setExperience] = useState<Experience | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [relatedExperiences, setRelatedExperiences] = useState<Experience[]>([])

  useEffect(() => {
    const loadExperience = async () => {
      try {
        // Check if user is logged in as admin
        const adminData = localStorage.getItem("currentAdmin")
        setIsAdmin(!!adminData)

        // Get experience by ID
        const id = Number.parseInt(params.id as string)
        const experiences = await getExperiences()
        const foundExperience = experiences.find((exp) => exp.id === id)

        if (foundExperience) {
          setExperience(foundExperience)

          // Find related experiences (same company or same student)
          const related = experiences
            .filter(
              (exp) =>
                exp.id !== id &&
                exp.status === "approved" &&
                (exp.company === foundExperience.company || exp.studentName === foundExperience.studentName),
            )
            .slice(0, 3)

          setRelatedExperiences(related)
        } else {
          // Redirect to experiences page if not found
          toast({
            title: "Experience not found",
            description: "The experience you're looking for doesn't exist or has been removed.",
            variant: "destructive",
          })
          router.push("/experiences")
        }
      } catch (error) {
        console.error("Error loading experience:", error)
        toast({
          title: "Error",
          description: "Failed to load experience details. Please try again.",
          variant: "destructive",
        })
        router.push("/experiences")
      } finally {
        setIsLoading(false)
      }
    }

    loadExperience()
  }, [params.id, router])

  if (isLoading) {
    return (
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading experience details...</p>
        </div>
      </div>
    )
  }

  if (!experience) {
    return (
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <p>Experience not found</p>
      </div>
    )
  }

  // Only show approved experiences to non-admin users
  if (!isAdmin && experience.status !== "approved") {
    return (
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <h1 className="text-2xl font-bold mb-4">Experience Not Available</h1>
        <p>This experience is currently under review and not yet published.</p>
        <Button asChild className="mt-4">
          <Link href="/experiences">Back to Experiences</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/experiences" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Experiences
        </Link>
      </Button>

      {experience.status === "pending" && isAdmin && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
          <p className="font-medium">This experience is pending approval</p>
          <p className="text-sm">Only admins can view pending experiences</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          {/* Header with student info */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={experience.profileImage} alt={experience.studentName} />
                <AvatarFallback>{experience.studentName.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">{experience.studentName}</h1>
                <p className="text-muted-foreground">{experience.branch}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-sm">
                {experience.company}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {experience.type}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {experience.year}
              </Badge>
              {experience.role && (
                <Badge variant="outline" className="text-sm bg-primary/10">
                  {experience.role}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Full Experience Content */}
          <div className="space-y-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">Preparation Strategy</h2>
              <div className="bg-muted/50 p-6 rounded-lg">
                <p className="whitespace-pre-line">
                  {experience.preparationStrategy || "No preparation details provided."}
                </p>
              </div>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">Interview Process</h2>
              <div className="bg-muted/50 p-6 rounded-lg">
                <p className="whitespace-pre-line">{experience.interviewProcess || "No interview details provided."}</p>
              </div>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">Tips for Success</h2>
              <div className="bg-muted/50 p-6 rounded-lg">
                <p className="whitespace-pre-line">{experience.tips || "No tips provided."}</p>
              </div>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">Challenges Faced</h2>
              <div className="bg-muted/50 p-6 rounded-lg">
                <p className="whitespace-pre-line">{experience.challenges || "No challenges provided."}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Company Card */}
          <Card className="p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <Image
                src={experience.companyLogo || "/placeholder.svg"}
                alt={`${experience.company} logo`}
                width={80}
                height={80}
                className="rounded-md"
              />
              <h2 className="text-xl font-semibold">{experience.company}</h2>
              <Separator />
              <div className="grid w-full gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>Placement Type:</span>
                  <span className="ml-auto font-medium">{experience.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Year:</span>
                  <span className="ml-auto font-medium">{experience.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>Role:</span>
                  <span className="ml-auto font-medium">{experience.role || "Software Engineer"}</span>
                </div>
                {experience.package && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span>Package:</span>
                    <span className="ml-auto font-medium">{experience.package}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Contact Card */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Connect with {experience.studentName.split(" ")[0]}</h3>
            <div className="space-y-4">
              {experience.linkedIn && (
                <div className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="text-sm font-medium">LinkedIn</h4>
                    <a
                      href={
                        experience.linkedIn.startsWith("http") ? experience.linkedIn : `https://${experience.linkedIn}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
              )}

              {experience.github && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Github className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                    <div>
                      <h4 className="text-sm font-medium">GitHub</h4>
                      <a
                        href={
                          experience.github.startsWith("http")
                            ? experience.github
                            : `https://github.com/${experience.github}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View GitHub Profile
                      </a>
                    </div>
                  </div>
                </>
              )}

              {experience.personalEmail && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-red-500" />
                    <div>
                      <h4 className="text-sm font-medium">Email</h4>
                      <a href={`mailto:${experience.personalEmail}`} className="text-xs text-primary hover:underline">
                        {experience.personalEmail}
                      </a>
                    </div>
                  </div>
                </>
              )}

              {!experience.linkedIn && !experience.github && !experience.personalEmail && (
                <p className="text-sm text-muted-foreground text-center">No contact information provided</p>
              )}
            </div>
          </Card>

          {/* Related Experiences Card */}
          {relatedExperiences.length > 0 && (
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Related Experiences</h3>
              <div className="space-y-4">
                {relatedExperiences.map((relatedExp) => (
                  <div key={relatedExp.id}>
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={relatedExp.profileImage} alt={relatedExp.studentName} />
                        <AvatarFallback>{relatedExp.studentName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">{relatedExp.studentName}</h4>
                        <p className="text-xs text-muted-foreground">
                          {relatedExp.company}, {relatedExp.year}
                        </p>
                        <Link href={`/experiences/${relatedExp.id}`} className="text-xs text-primary hover:underline">
                          Read Experience
                        </Link>
                      </div>
                    </div>
                    {relatedExperiences.indexOf(relatedExp) < relatedExperiences.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

