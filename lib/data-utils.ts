import type { Experience } from "@/components/experience-list"
import {
  getExperiencesFromFirestore,
  getCompaniesFromFirestore,
  saveExperienceToFirestore,
  updateExperienceInFirestore,
  deleteExperienceFromFirestore,
  companyExistsInFirestore,
  getCompanyByNameFromFirestore,
  addOrUpdateCompanyInFirestore,
  approveExperienceInFirestore,
  rejectExperienceInFirestore,
  getPendingExperiencesFromFirestore,
  loginAdmin,
  logoutAdmin,
} from "./firebase"

// Company type definition
export type Company = {
  id: number
  name: string
  logo: string
  category?: string
  studentsPlaced: number
  experiencesCount?: number
}

// Admin type definition
export type Admin = {
  uid?: string
  email: string
  password?: string
  name: string
}

// Function to get experiences
export async function getExperiences(): Promise<Experience[]> {
  try {
    const experiences = await getExperiencesFromFirestore()

    // Check if user is admin
    const isAdmin = checkIfUserIsAdmin()

    // If user is admin, return all experiences, otherwise filter to show only approved ones
    if (isAdmin) {
      return experiences.length > 0 ? experiences : getMockExperiences()
    } else {
      const approvedExperiences = experiences.filter((exp) => exp.status === "approved")
      return approvedExperiences.length > 0
        ? approvedExperiences
        : getMockExperiences().filter((exp) => exp.status === "approved")
    }
  } catch (error) {
    console.error("Error getting experiences:", error)
    // Return mock data if Firebase fails, but only approved experiences for non-admin users
    const isAdmin = checkIfUserIsAdmin()
    if (isAdmin) {
      return getMockExperiences()
    } else {
      return getMockExperiences().filter((exp) => exp.status === "approved")
    }
  }
}

// Function to get companies
export async function getCompanies(): Promise<Company[]> {
  try {
    const companies = await getCompaniesFromFirestore()
    return companies.length > 0 ? companies : getMockCompanies()
  } catch (error) {
    console.error("Error getting companies:", error)
    // Return mock data if Firebase fails
    return getMockCompanies()
  }
}

// Function to check if a company exists by name
export async function companyExists(companyName: string): Promise<boolean> {
  try {
    return await companyExistsInFirestore(companyName)
  } catch (error) {
    console.error("Error checking if company exists:", error)
    return false
  }
}

// Function to get a company by name
export async function getCompanyByName(companyName: string): Promise<Company | null> {
  try {
    return await getCompanyByNameFromFirestore(companyName)
  } catch (error) {
    console.error("Error getting company by name:", error)
    return null
  }
}

// Function to add or update a company
export async function addOrUpdateCompany(companyName: string, companyLogo = "/placeholder.svg?height=80&width=80") {
  try {
    return await addOrUpdateCompanyInFirestore(companyName, companyLogo)
  } catch (error) {
    console.error("Error adding or updating company:", error)
    return false
  }
}

// Function to check if an experience with the same ID already exists
export async function experienceExists(id: number): Promise<boolean> {
  try {
    const experiences = await getExperiences()
    return experiences.some((exp) => exp.id === id)
  } catch (error) {
    console.error("Error checking if experience exists:", error)
    return false
  }
}

// Update the saveExperience function to handle the case where companyType might be undefined
export async function saveExperience(experience: Experience) {
  try {
    return await saveExperienceToFirestore(experience)
  } catch (error) {
    console.error("Error saving experience:", error)
    // Store in localStorage as fallback
    try {
      const experiences = JSON.parse(localStorage.getItem("experiences") || "[]")
      experiences.push(experience)
      localStorage.setItem("experiences", JSON.stringify(experiences))
      return true
    } catch (localError) {
      console.error("Error saving to localStorage:", localError)
      return false
    }
  }
}

// Function to update an experience
export async function updateExperience(updatedExperience: Experience) {
  try {
    return await updateExperienceInFirestore(updatedExperience)
  } catch (error) {
    console.error("Error updating experience:", error)
    return false
  }
}

// Function to delete an experience
export async function deleteExperience(id: number) {
  try {
    return await deleteExperienceFromFirestore(id)
  } catch (error) {
    console.error("Error deleting experience:", error)
    return false
  }
}

// Function to authenticate admin
export async function authenticateAdmin(email: string, password: string): Promise<Admin | null> {
  try {
    // For development purposes - REMOVE IN PRODUCTION
    if (email === "admin@nith.ac.in" && password === "password") {
      return {
        uid: "demo-admin",
        email: email,
        name: "Demo Admin",
      }
    }

    // Try Firebase authentication
    return await loginAdmin(email, password)
  } catch (error) {
    console.error("Error authenticating admin:", error)

    // For development purposes - REMOVE IN PRODUCTION
    if (email === "admin@nith.ac.in" && password === "password") {
      return {
        uid: "demo-admin",
        email: email,
        name: "Demo Admin",
      }
    }

    return null
  }
}

// Function to logout admin
export async function logoutAdminUser() {
  try {
    return await logoutAdmin()
  } catch (error) {
    console.error("Error logging out admin:", error)
    // Clear localStorage anyway
    localStorage.removeItem("currentAdmin")
    return true
  }
}

// Function to get pending experiences
export async function getPendingExperiences(): Promise<Experience[]> {
  try {
    return await getPendingExperiencesFromFirestore()
  } catch (error) {
    console.error("Error getting pending experiences:", error)
    return []
  }
}

// Function to approve an experience
export async function approveExperience(id: number) {
  try {
    return await approveExperienceInFirestore(id)
  } catch (error) {
    console.error("Error approving experience:", error)
    return false
  }
}

// Function to reject an experience
export async function rejectExperience(id: number) {
  try {
    return await rejectExperienceInFirestore(id)
  } catch (error) {
    console.error("Error rejecting experience:", error)
    return false
  }
}

// Function to get placement stats
export async function getPlacementStats(): Promise<{
  totalExperiences: number
  totalCompanies: number
  jobProfiles: number
  highestPackage: string
}> {
  try {
    // Get experiences and companies from Firestore
    const experiences = await getExperiences()
    const companies = await getCompanies()

    // Calculate stats
    const totalExperiences = experiences.length
    const totalCompanies = companies.length

    // Get unique job profiles
    const uniqueRoles = new Set<string>()
    experiences.forEach((exp) => {
      if (exp.role) uniqueRoles.add(exp.role)
    })
    const jobProfiles = uniqueRoles.size

    // Find highest package
    let highestPackage = "₹0 LPA"
    experiences.forEach((exp) => {
      if (exp.package) {
        // Extract numeric value from package string (e.g., "₹45 LPA" -> 45)
        const packageValue = Number.parseFloat(exp.package.replace(/[^\d.]/g, ""))
        const currentHighest = Number.parseFloat(highestPackage.replace(/[^\d.]/g, ""))

        if (packageValue > currentHighest) {
          highestPackage = exp.package
        }
      }
    })

    return {
      totalExperiences,
      totalCompanies,
      jobProfiles: jobProfiles || 50, // Fallback to 50 if no roles found
      highestPackage: highestPackage || "₹45 LPA", // Fallback to ₹45 LPA if no packages found
    }
  } catch (error) {
    console.error("Error getting placement stats:", error)
    // Return default values if there's an error
    return {
      totalExperiences: 500,
      totalCompanies: 120,
      jobProfiles: 50,
      highestPackage: "₹45 LPA",
    }
  }
}

// Function to get featured experiences
export async function getFeaturedExperiences(limit = 3): Promise<Experience[]> {
  try {
    // Get all experiences
    const allExperiences = await getExperiences()

    // Filter for approved experiences only
    const approvedExperiences = allExperiences.filter((exp) => exp.status === "approved")

    // Sort by submission date (newest first)
    const sortedExperiences = approvedExperiences.sort((a, b) => {
      const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
      const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
      return dateB - dateA
    })

    // Return the top experiences based on limit
    return sortedExperiences.slice(0, limit)
  } catch (error) {
    console.error("Error getting featured experiences:", error)
    // Return mock data if there's an error
    return getMockExperiences().slice(0, limit)
  }
}

// Mock data functions for fallback
function getMockExperiences(): Experience[] {
  return [
    {
      id: 1,
      studentName: "Rahul Sharma",
      branch: "Computer Science",
      company: "Microsoft",
      companyType: "tech",
      year: 2023,
      type: "On-Campus",
      excerpt:
        "The interview process consisted of 3 technical rounds and 1 HR round. The technical rounds focused on data structures, algorithms, and system design...",
      profileImage: "/placeholder.svg?height=100&width=100",
      companyLogo: "/placeholder.svg?height=40&width=40",
      status: "approved",
      preparationStrategy:
        "I focused on strengthening my fundamentals in data structures and algorithms. I solved problems on LeetCode daily, starting with easy ones and gradually moving to medium and hard.",
      interviewProcess:
        "The interview process at Microsoft consisted of 3 technical rounds and 1 HR round. The first round focused on problem-solving with data structures like arrays and strings.",
      tips: "Start your preparation early, at least 3-4 months before the placement season. Focus on understanding concepts rather than memorizing solutions.",
      challenges:
        "The most challenging part was the system design round as I had limited experience in this area. I overcame this by studying system design principles and practicing designing simple systems.",
      role: "Software Engineer",
    },
    {
      id: 2,
      studentName: "Priya Patel",
      branch: "Electronics & Communication",
      company: "Amazon",
      companyType: "tech",
      year: 2023,
      type: "On-Campus",
      excerpt:
        "Preparation for Amazon required strong fundamentals in data structures and algorithms. The interview process was rigorous with 4 rounds...",
      profileImage: "/placeholder.svg?height=100&width=100",
      companyLogo: "/placeholder.svg?height=40&width=40",
      status: "approved",
      preparationStrategy:
        "I prepared for Amazon by focusing on their leadership principles alongside technical skills. I solved at least 200 LeetCode problems, focusing on medium and hard difficulty.",
      interviewProcess:
        "Amazon's interview process had 4 rounds: an online assessment followed by 3 interview rounds. The online assessment had 2 coding problems and some MCQs.",
      tips: "For Amazon, understand their leadership principles thoroughly and prepare examples from your experience that demonstrate these principles.",
      challenges:
        "The biggest challenge was balancing technical preparation with behavioral question preparation. Amazon places a lot of emphasis on their leadership principles.",
      role: "Software Development Engineer",
    },
  ]
}

function getMockCompanies(): Company[] {
  return [
    {
      id: 1,
      name: "Microsoft",
      logo: "/placeholder.svg?height=80&width=80",
      category: "Tech",
      studentsPlaced: 20,
      experiencesCount: 20,
    },
    {
      id: 2,
      name: "Google",
      logo: "/placeholder.svg?height=80&width=80",
      category: "Tech",
      studentsPlaced: 15,
      experiencesCount: 15,
    },
    {
      id: 3,
      name: "Amazon",
      logo: "/placeholder.svg?height=80&width=80",
      category: "Tech",
      studentsPlaced: 18,
      experiencesCount: 18,
    },
    {
      id: 4,
      name: "Goldman Sachs",
      logo: "/placeholder.svg?height=80&width=80",
      category: "Finance",
      studentsPlaced: 12,
      experiencesCount: 12,
    },
    {
      id: 5,
      name: "JPMorgan Chase",
      logo: "/placeholder.svg?height=80&width=80",
      category: "Finance",
      studentsPlaced: 10,
      experiencesCount: 10,
    },
    {
      id: 6,
      name: "Tata Motors",
      logo: "/placeholder.svg?height=80&width=80",
      category: "Core",
      studentsPlaced: 8,
      experiencesCount: 8,
    },
    {
      id: 7,
      name: "Flipkart",
      logo: "/placeholder.svg?height=80&width=80",
      category: "Product",
      studentsPlaced: 14,
      experiencesCount: 14,
    },
    {
      id: 8,
      name: "Infosys",
      logo: "/placeholder.svg?height=80&width=80",
      category: "Service",
      studentsPlaced: 25,
      experiencesCount: 25,
    },
    {
      id: 9,
      name: "TCS",
      logo: "/placeholder.svg?height=80&width=80",
      category: "Service",
      studentsPlaced: 30,
      experiencesCount: 30,
    },
  ]
}

// Helper function to check if current user is admin
function checkIfUserIsAdmin(): boolean {
  try {
    const adminData = localStorage.getItem("currentAdmin")
    return !!adminData
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

// Helper function to get company type name
export function getCompanyTypeName(value: string): string {
  const typeMap: Record<string, string> = {
    tech: "Tech",
    finance: "Finance",
    core: "Core",
    product: "Product",
    service: "Service",
    consulting: "Consulting",
    ecommerce: "E-Commerce",
    healthcare: "Healthcare",
    manufacturing: "Manufacturing",
    other: "Other",
  }
  return typeMap[value] || value
}

