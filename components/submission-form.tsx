"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { saveExperienceToFirestore } from "@/lib/firebase"
import { getCompaniesFromFirestore } from "@/lib/firebase"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid NIT Hamirpur email." })
    .endsWith("@nith.ac.in", { message: "Please use your NIT Hamirpur email." }),
  branch: z.string({ required_error: "Please select your branch." }),
  graduationYear: z.string({ required_error: "Please select your graduation year." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  role: z.string().min(2, { message: "Job role must be at least 2 characters." }),
  placementType: z.string({ required_error: "Please select placement type." }),
  placementYear: z.string({ required_error: "Please select placement year." }),
  package: z.string().optional(),
  preparationStrategy: z.string().min(50, { message: "Please provide more details about your preparation strategy." }),
  interviewProcess: z.string().min(50, { message: "Please provide more details about the interview process." }),
  tips: z.string().min(50, { message: "Please provide more tips for future candidates." }),
  challenges: z.string().min(50, { message: "Please share the challenges you faced." }),
  linkedIn: z.string().optional(),
  github: z.string().optional(),
  personalEmail: z.string().email().optional(),
  profilePicture: z.any().optional(),
  companyLogo: z.any().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, { message: "You must accept the terms and conditions." }),
})

export default function SubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [companies, setCompanies] = useState<string[]>([])

  // Get existing companies for autocomplete
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        console.log("Fetching companies for autocomplete")
        const companiesData = await getCompaniesFromFirestore()
        const companyNames = companiesData.map((company) => company.name)
        setCompanies(companyNames)
        console.log("Companies fetched:", companyNames)
      } catch (error) {
        console.error("Error fetching companies:", error)
        toast({
          title: "Error",
          description: "Failed to load companies. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchCompanies()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      branch: "",
      graduationYear: "",
      company: "",
      role: "",
      placementType: "",
      placementYear: "",
      package: "",
      preparationStrategy: "",
      interviewProcess: "",
      tips: "",
      challenges: "",
      linkedIn: "",
      github: "",
      personalEmail: "",
      termsAccepted: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return // Prevent multiple submissions

    setIsSubmitting(true)

    try {
      console.log("Submitting form with values:", values)
      // Create an excerpt from the preparation strategy
      const excerpt = values.preparationStrategy.substring(0, 200) + "..."

      // Create a new experience object
      const newExperience = {
        id: Date.now(),
        studentName: values.name,
        branch: getBranchName(values.branch),
        company: values.company,
        year: Number.parseInt(values.placementYear),
        type: getPlacementTypeName(values.placementType),
        excerpt,
        profileImage: "/placeholder.svg?height=100&width=100",
        companyLogo: "/placeholder.svg?height=40&width=40",
        status: "pending" as const,
        email: values.email,
        role: values.role,
        graduationYear: values.graduationYear,
        package: values.package || "Not disclosed",
        preparationStrategy: values.preparationStrategy,
        interviewProcess: values.interviewProcess,
        tips: values.tips,
        challenges: values.challenges,
        linkedIn: values.linkedIn || "",
        github: values.github || "",
        personalEmail: values.personalEmail || "",
      }

      console.log("Saving experience to Firestore:", newExperience)
      // Save to Firestore
      await saveExperienceToFirestore(newExperience)

      toast({
        title: "Experience submitted successfully!",
        description: "Thank you for sharing your placement journey. It will be reviewed by an admin.",
      })

      // Set submitted state to true to show success message
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Something went wrong.",
        description: "Your experience couldn't be submitted. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper functions to get full names from values
  function getBranchName(value: string): string {
    const branchMap: Record<string, string> = {
      "computer-science": "Computer Science",
      electronics: "Electronics & Communication",
      electrical: "Electrical Engineering",
      mechanical: "Mechanical Engineering",
      civil: "Civil Engineering",
      chemical: "Chemical Engineering",
      "material-science": "Material Science",
      architecture: "Architecture",
    }
    return branchMap[value] || value
  }

  function getPlacementTypeName(value: string): string {
    const typeMap: Record<string, string> = {
      "on-campus": "On-Campus",
      "off-campus": "Off-Campus",
      internship: "Internship",
    }
    return typeMap[value] || value
  }

  // Handle tab navigation
  const handleTabChange = (value: string) => {
    // Validate current tab before allowing change
    if (value === "placement" && activeTab === "personal") {
      const personalFields = ["name", "email", "branch", "graduationYear"]
      const isValid = personalFields.every((field) => {
        return form.getFieldState(field as any).invalid !== true
      })

      if (!isValid) {
        // Trigger validation on all personal fields
        personalFields.forEach((field) => form.trigger(field as any))
        return // Don't change tab if validation fails
      }
    } else if (value === "experience" && activeTab === "placement") {
      const placementFields = ["company", "role", "placementType", "placementYear"]
      const isValid = placementFields.every((field) => {
        return form.getFieldState(field as any).invalid !== true
      })

      if (!isValid) {
        // Trigger validation on all placement fields
        placementFields.forEach((field) => form.trigger(field as any))
        return // Don't change tab if validation fails
      }
    }

    setActiveTab(value)
  }

  const goToNextTab = async () => {
    if (activeTab === "personal") {
      // Validate personal fields before proceeding
      const personalFields = ["name", "email", "branch", "graduationYear"]
      const isValid = await form.trigger(personalFields as any)

      if (isValid) {
        setActiveTab("placement")
      }
    } else if (activeTab === "placement") {
      // Validate placement fields before proceeding
      const placementFields = ["company", "role", "placementType", "placementYear"]
      const isValid = await form.trigger(placementFields as any)

      if (isValid) {
        setActiveTab("experience")
      }
    } else if (activeTab === "experience") {
      // Validate experience fields before proceeding
      const experienceFields = ["preparationStrategy", "interviewProcess", "tips", "challenges"]
      const isValid = await form.trigger(experienceFields as any)

      if (isValid) {
        setActiveTab("connect")
      }
    }
  }

  const goToPreviousTab = () => {
    if (activeTab === "placement") {
      setActiveTab("personal")
    } else if (activeTab === "experience") {
      setActiveTab("placement")
    } else if (activeTab === "connect") {
      setActiveTab("experience")
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Thank You!</CardTitle>
          <CardDescription className="text-center">Your experience has been submitted successfully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Submission Successful</AlertTitle>
            <AlertDescription>
              Your placement experience has been submitted for review. It will be published after moderation by an
              admin.
            </AlertDescription>
          </Alert>
          <div className="text-center space-y-2">
            <p>Thank you for sharing your placement journey with the NIT Hamirpur community.</p>
            <p className="text-muted-foreground">Your insights will help juniors in their placement preparation.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => (window.location.href = "/")}>Return to Home</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Placement Experience Form</CardTitle>
        <CardDescription>Share your placement journey to help juniors prepare better</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="placement">Placement Details</TabsTrigger>
                <TabsTrigger value="experience">Your Experience</TabsTrigger>
                <TabsTrigger value="connect">Connect Info</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6 pt-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Please use your NIT Hamirpur email (@nith.ac.in) for verification.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@nith.ac.in" {...field} />
                        </FormControl>
                        <FormDescription>Must be your NIT Hamirpur email</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your branch" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="computer-science">Computer Science</SelectItem>
                            <SelectItem value="electronics">Electronics & Communication</SelectItem>
                            <SelectItem value="electrical">Electrical Engineering</SelectItem>
                            <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                            <SelectItem value="civil">Civil Engineering</SelectItem>
                            <SelectItem value="chemical">Chemical Engineering</SelectItem>
                            <SelectItem value="material-science">Material Science</SelectItem>
                            <SelectItem value="architecture">Architecture</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="graduationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                            <SelectItem value="2021">2021</SelectItem>
                            <SelectItem value="2020">2020</SelectItem>
                            <SelectItem value="2019">2019</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <Input id="profilePicture" type="file" accept="image/*" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={goToNextTab}>
                    Next: Placement Details
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="placement" className="space-y-6 pt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Microsoft, Google" {...field} list="company-suggestions" />
                        </FormControl>
                        <datalist id="company-suggestions">
                          {companies.map((name, index) => (
                            <option key={index} value={name} />
                          ))}
                        </datalist>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Software Engineer, Analyst" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="placementType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placement Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="on-campus">On-Campus</SelectItem>
                            <SelectItem value="off-campus">Off-Campus</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="placementYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placement Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                            <SelectItem value="2021">2021</SelectItem>
                            <SelectItem value="2020">2020</SelectItem>
                            <SelectItem value="2019">2019</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="package"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., ₹15 LPA" {...field} />
                      </FormControl>
                      <FormDescription>This information will be kept confidential</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="companyLogo">Company Logo (Optional)</Label>
                  <Input id="companyLogo" type="file" accept="image/*" />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPreviousTab}>
                    Back: Personal Info
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next: Your Experience
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="experience" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="preparationStrategy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preparation Strategy</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share how you prepared for the placement process..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Include resources, study plan, and time management</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interviewProcess"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interview Process</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the interview rounds and selection process..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include details about each round, questions asked, and your approach
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tips"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tips for Success</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share tips and advice for future candidates..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>What would you recommend to juniors preparing for this company?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="challenges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenges Faced</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe challenges you faced and how you overcame them..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Share difficulties and how you handled them</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPreviousTab}>
                    Back: Placement Details
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next: Connect Info
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="connect" className="space-y-6 pt-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Optional Information</AlertTitle>
                  <AlertDescription>
                    This information will help juniors connect with you for guidance. All fields are optional.
                  </AlertDescription>
                </Alert>

                <FormField
                  control={form.control}
                  name="linkedIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., linkedin.com/in/yourprofile" {...field} />
                      </FormControl>
                      <FormDescription>Share your LinkedIn profile for networking</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Profile (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., github.com/yourusername" {...field} />
                      </FormControl>
                      <FormDescription>Share your GitHub profile for technical connections</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Email (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., your.email@gmail.com" {...field} />
                      </FormControl>
                      <FormDescription>Share your personal email for direct contact</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I agree to the terms and conditions</FormLabel>
                        <FormDescription>
                          By submitting this form, you agree that your experience may be shared on the NIT Hamirpur
                          Placement Portal.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPreviousTab}>
                    Back: Your Experience
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Experience"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

