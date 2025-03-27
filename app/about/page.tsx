import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Building, Award } from "lucide-react"

export const metadata: Metadata = {
  title: "About | NIT Hamirpur Placement Portal",
  description:
    "Learn about the NIT Hamirpur Placement and Training Cell and our mission to help students in their career journey",
}

export default function AboutPage() {
  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">About NIT Hamirpur Placement Portal</h1>
          <p className="text-muted-foreground">
            Connecting students with alumni experiences to foster better career preparation
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p>
              The NIT Hamirpur Placement Portal is dedicated to bridging the gap between current students and alumni by
              providing a platform for sharing placement experiences, insights, and preparation strategies.
            </p>
            <p>
              We believe that learning from the journeys of those who have successfully navigated the placement process
              can significantly enhance the preparation and confidence of students pursuing similar career paths.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt="NIT Hamirpur Campus"
              width={400}
              height={300}
              className="rounded-lg object-cover"
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">About NIT Hamirpur</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <BookOpen className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Academic Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  NIT Hamirpur is known for its rigorous academic programs and quality education in engineering and
                  technology.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Diverse Community</h3>
                <p className="text-sm text-muted-foreground">
                  Our campus hosts students from across India, creating a diverse and inclusive learning environment.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <Building className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Industry Connections</h3>
                <p className="text-sm text-muted-foreground">
                  Strong ties with leading companies ensure excellent placement opportunities for our students.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <Award className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Alumni Network</h3>
                <p className="text-sm text-muted-foreground">
                  Our alumni are working in prestigious organizations worldwide, contributing to various fields.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Placement and Training Cell</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p>
                The Placement and Training Cell at NIT Hamirpur works tirelessly to connect students with industry
                opportunities. Our dedicated team:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Facilitates campus recruitment drives</li>
                <li>Organizes pre-placement training sessions</li>
                <li>Conducts mock interviews and resume workshops</li>
                <li>Arranges industry visits and expert talks</li>
                <li>Maintains relationships with corporate partners</li>
              </ul>
            </div>
            <div>
              <p>
                Over the years, we have established strong relationships with numerous companies across various sectors.
                Our placement statistics have consistently improved, with students securing positions in top
                organizations in India and abroad.
              </p>
              <p className="mt-4">
                The Placement Portal is our latest initiative to leverage the power of alumni experiences to better
                prepare current students for their placement journey.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Whether you're a current student looking for guidance or an alumnus willing to share your experience, we
            welcome you to be part of this knowledge-sharing community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/experiences">Browse Experiences</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/submit" className="flex items-center gap-2">
                Share Your Story <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

