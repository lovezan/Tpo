import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

// Mock data for featured experiences
const featuredExperiences = [
  {
    id: 1,
    studentName: "Rahul Sharma",
    branch: "Computer Science",
    company: "Microsoft",
    year: 2023,
    type: "On-Campus",
    excerpt:
      "The interview process consisted of 3 technical rounds and 1 HR round. The technical rounds focused on data structures, algorithms, and system design...",
    profileImage: "/placeholder.svg?height=100&width=100",
    companyLogo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    studentName: "Priya Patel",
    branch: "Electronics & Communication",
    company: "Amazon",
    year: 2023,
    type: "On-Campus",
    excerpt:
      "Preparation for Amazon required strong fundamentals in data structures and algorithms. The interview process was rigorous with 4 rounds...",
    profileImage: "/placeholder.svg?height=100&width=100",
    companyLogo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    studentName: "Amit Kumar",
    branch: "Mechanical Engineering",
    company: "Tata Motors",
    year: 2023,
    type: "Off-Campus",
    excerpt:
      "I applied through the company website and got a call for an interview after 2 weeks. The process included technical assessment, case study, and HR rounds...",
    profileImage: "/placeholder.svg?height=100&width=100",
    companyLogo: "/placeholder.svg?height=40&width=40",
  },
]

export default function FeaturedExperiences() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featuredExperiences.map((experience) => (
        <Card key={experience.id} className="flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={experience.profileImage} alt={experience.studentName} />
                  <AvatarFallback>{experience.studentName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{experience.studentName}</CardTitle>
                  <CardDescription>{experience.branch}</CardDescription>
                </div>
              </div>
              <Image
                src={experience.companyLogo || "/placeholder.svg"}
                alt={`${experience.company} logo`}
                width={40}
                height={40}
                className="rounded-md"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">{experience.company}</Badge>
              <Badge variant="secondary">{experience.type}</Badge>
              <Badge variant="outline">{experience.year}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-4">{experience.excerpt}</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" className="w-full">
              <Link href={`/experiences/${experience.id}`} className="flex items-center justify-between">
                <span>Read Full Experience</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

