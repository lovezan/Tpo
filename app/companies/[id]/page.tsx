import { CardDescription } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, Briefcase, Award, TrendingUp, Lock } from "lucide-react"
import CompanyExperiences from "@/components/company-experiences"
import AuthGuard from "@/components/auth-guard"

// This would come from a database in a real implementation
const getCompanyById = (id: string) => {
  const companies = [
    {
      id: "1",
      name: "Microsoft",
      category: "Tech",
      description:
        "Microsoft Corporation is an American multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
      logo: "/placeholder.svg?height=120&width=120",
      website: "https://www.microsoft.com",
      headquarters: "Redmond, Washington, United States",
      founded: 1975,
      studentsPlaced: 25,
      rolesOffered: [
        "Software Engineer",
        "Product Manager",
        "Data Scientist",
        "UX Designer",
        "Technical Program Manager",
      ],
      highestPackage: "₹45 LPA",
      averagePackage: "₹25 LPA",
      placementProcess: `
        <h3>Selection Process</h3>
        <p>Microsoft's selection process typically consists of the following stages:</p>
        <ol>
          <li><strong>Online Assessment:</strong> This includes coding problems and MCQs on technical concepts.</li>
          <li><strong>Technical Interviews:</strong> Usually 3-4 rounds focusing on data structures, algorithms, system design, and problem-solving skills.</li>
          <li><strong>HR Interview:</strong> A discussion about career goals, why Microsoft, and cultural fit.</li>
        </ol>
        
        <h3>Skills Required</h3>
        <p>Microsoft looks for candidates with the following skills:</p>
        <ul>
          <li>Strong problem-solving abilities</li>
          <li>Proficiency in at least one programming language (C++, Java, Python, etc.)</li>
          <li>Knowledge of data structures and algorithms</li>
          <li>Understanding of system design principles</li>
          <li>Good communication and teamwork skills</li>
        </ul>
        
        <h3>Preparation Tips</h3>
        <p>To prepare for Microsoft interviews, focus on:</p>
        <ul>
          <li>Practicing coding problems on platforms like LeetCode, HackerRank, etc.</li>
          <li>Studying system design concepts</li>
          <li>Understanding Microsoft's products and culture</li>
          <li>Preparing for behavioral questions</li>
          <li>Practicing mock interviews</li>
        </ul>
      `,
      placementStats: [
        { year: 2023, studentsPlaced: 25, averagePackage: "₹25 LPA", highestPackage: "₹45 LPA" },
        { year: 2022, studentsPlaced: 20, averagePackage: "₹22 LPA", highestPackage: "₹40 LPA" },
        { year: 2021, studentsPlaced: 18, averagePackage: "₹20 LPA", highestPackage: "₹38 LPA" },
        { year: 2020, studentsPlaced: 15, averagePackage: "₹18 LPA", highestPackage: "₹35 LPA" },
      ],
    },
    // More companies would be here in a real implementation
  ]

  return companies.find((company) => company.id === id)
}

export default function CompanyPage({ params }: { params: { id: string } }) {
  const company = getCompanyById(params.id)

  if (!company) {
    notFound()
  }

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/companies" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Companies
        </Link>
      </Button>

      {/* Preview for non-authenticated users */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle>Authentication Required</CardTitle>
          </div>
          <CardDescription>Login to access detailed company information and placement statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Image
              src={company.logo || "/placeholder.svg"}
              alt={`${company.name} logo`}
              width={80}
              height={80}
              className="rounded-md"
            />
            <div>
              <h2 className="text-xl font-bold">{company.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{company.category}</Badge>
                <span className="text-sm text-muted-foreground">Founded: {company.founded}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            This page contains detailed information about {company.name}, including placement process, statistics, and
            student experiences. Login to access this valuable information.
          </p>
          <Button asChild>
            <Link href={`/auth/login?redirectTo=${encodeURIComponent(`/companies/${params.id}`)}`}>
              Login to View Details
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Protected content */}
      <AuthGuard returnUrl={`/companies/${params.id}`}>
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={company.logo || "/placeholder.svg"}
                  alt={`${company.name} logo`}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">{company.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{company.category}</Badge>
                    <span className="text-sm text-muted-foreground">Founded: {company.founded}</span>
                  </div>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href={company.website} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </Link>
              </Button>
            </div>

            <p className="text-muted-foreground">{company.description}</p>

            <Separator />

            <Tabs defaultValue="process">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="process">Placement Process</TabsTrigger>
                <TabsTrigger value="stats">Placement Stats</TabsTrigger>
                <TabsTrigger value="experiences">Student Experiences</TabsTrigger>
              </TabsList>
              <TabsContent value="process" className="mt-6">
                <div
                  className="prose prose-gray dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: company.placementProcess }}
                />
              </TabsContent>
              <TabsContent value="stats" className="mt-6">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Placement Statistics</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left">Year</th>
                          <th className="py-2 px-4 text-left">Students Placed</th>
                          <th className="py-2 px-4 text-left">Average Package</th>
                          <th className="py-2 px-4 text-left">Highest Package</th>
                        </tr>
                      </thead>
                      <tbody>
                        {company.placementStats.map((stat) => (
                          <tr key={stat.year} className="border-b">
                            <td className="py-2 px-4">{stat.year}</td>
                            <td className="py-2 px-4">{stat.studentsPlaced}</td>
                            <td className="py-2 px-4">{stat.averagePackage}</td>
                            <td className="py-2 px-4">{stat.highestPackage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Placed</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {company.placementStats.reduce((total, stat) => total + stat.studentsPlaced, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">Over the last 4 years</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Roles Offered</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{company.rolesOffered.length}</div>
                        <p className="text-xs text-muted-foreground">Different positions</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Highest Package</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{company.highestPackage}</div>
                        <p className="text-xs text-muted-foreground">2023 placement season</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Package</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{company.averagePackage}</div>
                        <p className="text-xs text-muted-foreground">2023 placement season</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="experiences" className="mt-6">
                <CompanyExperiences companyName={company.name} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Company Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Headquarters:</span>
                  <span className="font-medium">{company.headquarters}</span>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Founded:</span>
                  <span className="font-medium">{company.founded}</span>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{company.category || "Tech"}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Job Roles Offered</h3>
              <div className="space-y-2">
                {company.rolesOffered.map((role, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{role}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Related Companies</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Google logo"
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                  <div>
                    <h4 className="text-sm font-medium">Google</h4>
                    <Link href="/companies/2" className="text-xs text-primary hover:underline">
                      View Profile
                    </Link>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Amazon logo"
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                  <div>
                    <h4 className="text-sm font-medium">Amazon</h4>
                    <Link href="/companies/3" className="text-xs text-primary hover:underline">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </AuthGuard>
    </div>
  )
}

