"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react"
import type { Experience } from "@/components/experience-list"
import { approveExperience, rejectExperience, getExperiences, logoutAdminUser } from "@/lib/data-utils"
import { toast } from "@/hooks/use-toast"

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminName, setAdminName] = useState("")
  const [pendingExperiences, setPendingExperiences] = useState<Experience[]>([])
  const [approvedExperiences, setApprovedExperiences] = useState<Experience[]>([])
  const [rejectedExperiences, setRejectedExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Memoize the loadExperiences function to prevent unnecessary re-renders
  const loadExperiences = useCallback(async () => {
    try {
      const allExperiences = await getExperiences()
      setPendingExperiences(allExperiences.filter((exp) => exp.status === "pending"))
      setApprovedExperiences(allExperiences.filter((exp) => exp.status === "approved"))
      setRejectedExperiences(allExperiences.filter((exp) => exp.status === "rejected"))
    } catch (error) {
      console.error("Error loading experiences:", error)
      toast({
        title: "Error",
        description: "Failed to load experiences. Please try again.",
        variant: "destructive",
      })
    }
  }, [])

  useEffect(() => {
    // Check if user is logged in as admin
    const checkAdminStatus = () => {
      try {
        const adminData = localStorage.getItem("currentAdmin")

        if (!adminData) {
          // Redirect to login if not logged in
          router.push("/admin/login")
          return false
        }

        const admin = JSON.parse(adminData)
        setIsAdmin(true)
        setAdminName(admin.name)
        return true
      } catch (error) {
        console.error("Error parsing admin data:", error)
        router.push("/admin/login")
        return false
      } finally {
        setIsLoading(false)
      }
    }

    const isAdminLoggedIn = checkAdminStatus()

    // Only load experiences if admin is logged in
    if (isAdminLoggedIn) {
      loadExperiences()
    }
  }, [router, loadExperiences])

  const handleApprove = async (id: number) => {
    try {
      await approveExperience(id)
      toast({
        title: "Success",
        description: "Experience approved successfully.",
      })
      loadExperiences()
    } catch (error) {
      console.error("Error approving experience:", error)
      toast({
        title: "Error",
        description: "Failed to approve experience. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: number) => {
    try {
      await rejectExperience(id)
      toast({
        title: "Success",
        description: "Experience rejected successfully.",
      })
      loadExperiences()
    } catch (error) {
      console.error("Error rejecting experience:", error)
      toast({
        title: "Error",
        description: "Failed to reject experience. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    try {
      await logoutAdminUser()
      localStorage.removeItem("currentAdmin")
      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error)
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container py-12">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>You need to be logged in as an admin to access this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container px-4 sm:px-6 py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {adminName}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending
              {pendingExperiences.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingExperiences.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingExperiences.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No pending experiences</h3>
                <p className="text-muted-foreground mt-2">All submissions have been reviewed</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {pendingExperiences.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    experience={experience}
                    onApprove={() => handleApprove(experience.id)}
                    onReject={() => handleReject(experience.id)}
                    isPending={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            {approvedExperiences.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No approved experiences</h3>
                <p className="text-muted-foreground mt-2">Approve pending submissions to see them here</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {approvedExperiences.map((experience) => (
                  <ExperienceCard key={experience.id} experience={experience} isPending={false} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            {rejectedExperiences.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No rejected experiences</h3>
                <p className="text-muted-foreground mt-2">Rejected submissions will appear here</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {rejectedExperiences.map((experience) => (
                  <ExperienceCard key={experience.id} experience={experience} isPending={false} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface ExperienceCardProps {
  experience: Experience
  onApprove?: () => void
  onReject?: () => void
  isPending: boolean
}

function ExperienceCard({ experience, onApprove, onReject, isPending }: ExperienceCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl">{experience.studentName}</CardTitle>
            <CardDescription className="text-sm">
              {experience.branch} • {experience.company} • {experience.year}
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            {isPending ? (
              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                  onClick={onReject}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  <span>Reject</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-500 hover:text-green-700 hover:bg-green-50 flex-1 sm:flex-none"
                  onClick={onApprove}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Approve</span>
                </Button>
              </div>
            ) : (
              <Badge variant={experience.status === "approved" ? "success" : "destructive"}>
                {experience.status === "approved" ? "Approved" : "Rejected"}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{experience.company}</Badge>
            <Badge variant="secondary">{experience.type}</Badge>
            <Badge variant="outline">{experience.year}</Badge>
            {experience.role && (
              <Badge variant="outline" className="bg-primary/10">
                {experience.role}
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">{experience.excerpt}</p>

          <div className="pt-2">
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-1"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span>{showDetails ? "Hide Details" : "View Full Experience"}</span>
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {showDetails && (
            <div className="mt-4 space-y-4 border-t pt-4">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-md font-semibold mb-2">Preparation Strategy</h3>
                  <p className="text-sm text-muted-foreground">{experience.preparationStrategy || "Not provided"}</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-2">Interview Process</h3>
                  <p className="text-sm text-muted-foreground">{experience.interviewProcess || "Not provided"}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-md font-semibold mb-2">Tips for Success</h3>
                  <p className="text-sm text-muted-foreground">{experience.tips || "Not provided"}</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-2">Challenges Faced</h3>
                  <p className="text-sm text-muted-foreground">{experience.challenges || "Not provided"}</p>
                </div>
              </div>

              {(experience.linkedIn || experience.github || experience.personalEmail) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-md font-semibold mb-2">Contact Information</h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {experience.linkedIn && (
                        <p className="text-sm text-muted-foreground">LinkedIn: {experience.linkedIn}</p>
                      )}
                      {experience.github && (
                        <p className="text-sm text-muted-foreground">GitHub: {experience.github}</p>
                      )}
                      {experience.personalEmail && (
                        <p className="text-sm text-muted-foreground">Email: {experience.personalEmail}</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

