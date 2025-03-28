import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Building, Search, Users } from "lucide-react"
import FeaturedExperiences from "@/components/featured-experiences"
import StatsSection from "@/components/stats-section"

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-8">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="inline-flex items-center rounded-full border border-green-600 bg-green-100 dark:bg-green-900/30 nith-theme:bg-gold/20 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400 nith-theme:text-gold nith-theme:border-gold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    Official NITH Affiliated Portal
                  </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Learn from the Success Stories of Your Seniors
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Discover placement experiences, interview insights, and preparation strategies from NIT Hamirpur
                  alumni.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/experiences">Browse Experiences</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/submit">Share Your Story</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/nith.png"
                alt="Students celebrating placement success"
                width={500}
                height={500}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 md:px-6 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Explore Experiences</CardTitle>
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Browse through detailed placement experiences shared by your seniors</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Filter by company, branch, or placement type to find relevant insights for your preparation.
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/experiences" className="flex items-center justify-between">
                  <span>View All Experiences</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Company Profiles</CardTitle>
                <Building className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Learn about companies that recruit from NIT Hamirpur</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Discover company details, job roles offered, and placement statistics over the years.
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/companies" className="flex items-center justify-between">
                  <span>Explore Companies</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Share Your Journey</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Contribute your placement experience to help juniors</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Share your preparation strategy, interview process, and tips to help future batches succeed.
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/submit" className="flex items-center justify-between">
                  <span>Submit Your Story</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Real-time Update Message */}
      <div className="container px-3 sm:px-4 md:px-6 py-2">
        <div className="bg-muted/50 rounded-lg p-2 sm:p-3 text-center text-[10px] sm:text-xs md:text-sm text-muted-foreground">
          <p>Data is updated in real-time to reflect the most current information from our database.</p>
        </div>
      </div>

      {/* Featured Experiences */}
      <section className="container px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Featured Experiences</h2>
            <Button asChild variant="ghost" className="self-start sm:self-auto">
              <Link href="/experiences" className="flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <FeaturedExperiences />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 md:px-6 py-12 md:py-24 lg:py-32 bg-muted rounded-lg">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
            Ready to Share Your Placement Journey?
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Your experience can guide and inspire juniors on their placement journey. Share your story today!
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/submit">Submit Your Experience</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

