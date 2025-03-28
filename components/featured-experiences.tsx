"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getFeaturedExperiences } from "@/lib/data-utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { Experience } from "@/components/experience-list"

export default function FeaturedExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true)
        const featuredExperiences = await getFeaturedExperiences(3) // Get top 3 experiences
        setExperiences(featuredExperiences)
      } catch (error) {
        console.error("Error fetching featured experiences:", error)
        setExperiences([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col overflow-hidden">
            <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 sm:h-5 w-24 sm:w-32 mb-1" />
                    <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-md" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-3 sm:p-4 pt-0 sm:pt-0">
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                <Skeleton className="h-4 sm:h-5 w-16 sm:w-20" />
                <Skeleton className="h-4 sm:h-5 w-20 sm:w-24" />
                <Skeleton className="h-4 sm:h-5 w-12 sm:w-16" />
              </div>
              <Skeleton className="h-3 sm:h-4 w-full mb-2" />
              <Skeleton className="h-3 sm:h-4 w-full mb-2" />
              <Skeleton className="h-3 sm:h-4 w-3/4" />
            </CardContent>
            <CardFooter className="p-3 sm:p-4">
              <Skeleton className="h-8 sm:h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (experiences.length === 0) {
    return (
      <div className="text-center py-4 sm:py-6 md:py-8">
        <h3 className="text-base sm:text-lg font-medium">No featured experiences yet</h3>
        <p className="text-muted-foreground mt-2 px-4 text-sm">Be the first to share your experience</p>
        <Button asChild className="mt-4">
          <Link href="/submit">Share Your Experience</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {experiences.map((experience) => (
        <Card key={experience.id} className="flex flex-col overflow-hidden">
          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src={experience.profileImage} alt={experience.studentName} />
                  <AvatarFallback>{experience.studentName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm sm:text-base md:text-lg line-clamp-1">
                    {experience.studentName}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm line-clamp-1">{experience.branch}</CardDescription>
                </div>
              </div>
              <Image
                src={experience.companyLogo || "/placeholder.svg"}
                alt={`${experience.company} logo`}
                width={32}
                height={32}
                className="rounded-md h-8 w-8 sm:h-10 sm:w-10 object-contain"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-3 sm:p-4 pt-0 sm:pt-0">
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
              <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0 h-5">
                {experience.company}
              </Badge>
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 h-5">
                {experience.type}
              </Badge>
              <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0 h-5">
                {experience.year}
              </Badge>
              {experience.role && (
                <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0 h-5 bg-primary/10">
                  {experience.role}
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 sm:line-clamp-4">
              {experience.excerpt}
            </p>
          </CardContent>
          <CardFooter className="p-3 sm:p-4">
            <Button asChild variant="ghost" className="w-full h-8 sm:h-9 text-xs sm:text-sm">
              <Link href={`/experiences/${experience.id}`} className="flex items-center justify-between">
                <span>Read Full Experience</span>
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

