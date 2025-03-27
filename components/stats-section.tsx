import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Briefcase, Users, Award } from "lucide-react"

export default function StatsSection() {
  return (
    <section className="container px-4 md:px-6 py-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Placement Highlights</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Experiences</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">500+</div>
            <p className="text-xs text-muted-foreground">Shared by alumni</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120+</div>
            <p className="text-xs text-muted-foreground">Recruiting from campus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Profiles</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50+</div>
            <p className="text-xs text-muted-foreground">Diverse opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Package</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45 LPA</div>
            <p className="text-xs text-muted-foreground">2023 placement season</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

