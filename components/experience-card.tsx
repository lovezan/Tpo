import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, Calendar, Building, DollarSign, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Experience {
  id: string | number
  studentName: string
  branch: string
  company: string
  companyType?: string
  year: number
  type: string
  excerpt: string
  profileImage?: string
  companyLogo?: string
  status: "pending" | "approved" | "rejected"
  role?: string
  package?: string
}

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center gap-3">
        <Avatar>
          <AvatarImage src={experience.profileImage} alt={experience.studentName} />
          <AvatarFallback>{getInitials(experience.studentName)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-1">{experience.studentName}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{experience.branch}</p>
        </div>
        <Badge variant={experience.type.toLowerCase() === "internship" ? "secondary" : "default"} className="ml-auto">
          {experience.type}
        </Badge>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        {experience.role && (
          <div className="flex items-center text-sm mb-1">
            <Briefcase className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className="font-medium line-clamp-1">{experience.role}</span>
          </div>
        )}

        <div className="flex items-center text-xs text-muted-foreground mb-1">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          <span>{experience.year}</span>
        </div>

        {experience.package && (
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <DollarSign className="h-3.5 w-3.5 mr-1.5" />
            <span>{experience.package}</span>
          </div>
        )}

        <p className="text-sm line-clamp-3 mb-3">{experience.excerpt}</p>

        <div className="flex items-center text-xs text-muted-foreground">
          <Building className="h-3.5 w-3.5 mr-1.5" />
          <span className="line-clamp-1">{experience.company}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t">
        <Link
          href={`/experiences/${experience.id}`}
          className="flex items-center justify-between w-full text-sm text-primary hover:underline"
        >
          <span>Read Full Experience</span>
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Link>
      </CardFooter>
    </Card>
  )
}

