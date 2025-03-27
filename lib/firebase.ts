import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  deleteDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore"
import { auth, db } from "./firebase-config"
import type { Experience } from "@/components/experience-list"
import type { Company } from "@/lib/data-utils"

// Authentication functions
export async function loginAdmin(email: string, password: string) {
  try {
    console.log("Attempting login with:", email)
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log("User authenticated:", user.uid)

    // Get admin details from Firestore
    const adminDoc = await getDoc(doc(db, "admins", user.uid))
    if (!adminDoc.exists()) {
      console.error("Admin document not found for uid:", user.uid)
      // Instead of throwing an error, return a basic admin object
      return {
        uid: user.uid,
        email: user.email,
        name: "Admin User",
      }
    }

    const adminData = adminDoc.data()
    console.log("Admin data retrieved:", adminData.name)

    return {
      uid: user.uid,
      email: user.email,
      name: adminData.name || "Admin User",
    }
  } catch (error: any) {
    console.error("Login error:", error.code, error.message)
    throw error
  }
}

export async function logoutAdmin() {
  try {
    await signOut(auth)
    return true
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}

// Firestore data functions
export async function getExperiencesFromFirestore() {
  try {
    console.log("Fetching experiences from Firestore")
    const experiencesRef = collection(db, "experiences")
    const experiencesSnapshot = await getDocs(experiencesRef)

    const experiences: Experience[] = []
    experiencesSnapshot.forEach((doc) => {
      const data = doc.data()
      experiences.push({
        id: Number.parseInt(doc.id) || Date.now(),
        studentName: data.studentName || "",
        branch: data.branch || "",
        company: data.company || "",
        year: data.year || new Date().getFullYear(),
        type: data.type || "On-Campus",
        excerpt: data.excerpt || "",
        profileImage: data.profileImage || "/placeholder.svg?height=100&width=100",
        companyLogo: data.companyLogo || "/placeholder.svg?height=40&width=40",
        status: data.status || "pending",
        linkedIn: data.linkedIn || "",
        github: data.github || "",
        personalEmail: data.personalEmail || "",
        preparationStrategy: data.preparationStrategy || "",
        interviewProcess: data.interviewProcess || "",
        tips: data.tips || "",
        challenges: data.challenges || "",
        role: data.role || "",
        submittedAt: data.submittedAt ? new Date(data.submittedAt.toDate()).toISOString() : new Date().toISOString(),
      })
    })

    console.log(`Retrieved ${experiences.length} experiences`)
    return experiences
  } catch (error) {
    console.error("Error getting experiences:", error)
    // Return empty array instead of throwing error
    return []
  }
}

export async function getCompaniesFromFirestore() {
  try {
    console.log("Fetching companies from Firestore")
    const companiesRef = collection(db, "companies")
    const companiesSnapshot = await getDocs(companiesRef)

    const companies: Company[] = []
    companiesSnapshot.forEach((doc) => {
      const data = doc.data()
      companies.push({
        id: Number.parseInt(doc.id) || Date.now(),
        name: data.name || "",
        logo: data.logo || "/placeholder.svg?height=80&width=80",
        category: data.category || "Tech",
        studentsPlaced: data.studentsPlaced || 0,
      })
    })

    console.log(`Retrieved ${companies.length} companies`)
    return companies
  } catch (error) {
    console.error("Error getting companies:", error)
    // Return empty array instead of throwing error
    return []
  }
}

export async function saveExperienceToFirestore(experience: Experience) {
  try {
    console.log("Saving experience to Firestore:", experience.id)

    // Add timestamp
    const experienceWithTimestamp = {
      ...experience,
      submittedAt: serverTimestamp(),
    }

    // Save experience
    await setDoc(doc(db, "experiences", experience.id.toString()), experienceWithTimestamp)

    // Update company information
    await addOrUpdateCompanyInFirestore(experience.company, experience.companyLogo)

    console.log("Experience saved successfully")
    return true
  } catch (error: any) {
    console.error("Error saving experience:", error)

    // Check if it's a permission error
    if (error.code === "permission-denied") {
      throw new Error("Permission denied: Please check your Firebase security rules.")
    }

    throw error
  }
}

export async function updateExperienceInFirestore(experience: Experience) {
  try {
    console.log("Updating experience in Firestore:", experience.id)
    await updateDoc(doc(db, "experiences", experience.id.toString()), {
      ...experience,
      updatedAt: serverTimestamp(),
    })
    console.log("Experience updated successfully")
    return true
  } catch (error: any) {
    console.error("Error updating experience:", error)

    // Check if it's a permission error
    if (error.code === "permission-denied") {
      throw new Error("Permission denied: Please check your Firebase security rules.")
    }

    throw error
  }
}

export async function deleteExperienceFromFirestore(id: number) {
  try {
    console.log("Deleting experience from Firestore:", id)
    await deleteDoc(doc(db, "experiences", id.toString()))
    console.log("Experience deleted successfully")
    return true
  } catch (error: any) {
    console.error("Error deleting experience:", error)

    // Check if it's a permission error
    if (error.code === "permission-denied") {
      throw new Error("Permission denied: Please check your Firebase security rules.")
    }

    throw error
  }
}

export async function companyExistsInFirestore(companyName: string) {
  try {
    console.log("Checking if company exists in Firestore:", companyName)
    const companiesRef = collection(db, "companies")
    const q = query(companiesRef, where("name", "==", companyName))
    const querySnapshot = await getDocs(q)
    const exists = !querySnapshot.empty
    console.log(`Company ${companyName} exists: ${exists}`)
    return exists
  } catch (error) {
    console.error("Error checking if company exists:", error)
    return false
  }
}

export async function getCompanyByNameFromFirestore(companyName: string) {
  try {
    console.log("Getting company by name from Firestore:", companyName)
    const companiesRef = collection(db, "companies")
    const q = query(companiesRef, where("name", "==", companyName))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log(`Company ${companyName} not found`)
      return null
    }

    const doc = querySnapshot.docs[0]
    const data = doc.data()

    console.log(`Company ${companyName} found`)
    return {
      id: Number.parseInt(doc.id) || Date.now(),
      name: data.name || "",
      logo: data.logo || "/placeholder.svg?height=80&width=80",
      category: data.category || "Tech",
      studentsPlaced: data.studentsPlaced || 0,
    }
  } catch (error) {
    console.error("Error getting company by name:", error)
    return null
  }
}

export async function addOrUpdateCompanyInFirestore(
  companyName: string,
  companyLogo = "/placeholder.svg?height=80&width=80",
) {
  try {
    console.log("Adding or updating company in Firestore:", companyName)
    const companiesRef = collection(db, "companies")
    const q = query(companiesRef, where("name", "==", companyName))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      // Update existing company
      const docRef = querySnapshot.docs[0].ref
      const currentData = querySnapshot.docs[0].data()

      await updateDoc(docRef, {
        studentsPlaced: (currentData.studentsPlaced || 0) + 1,
        logo: companyLogo !== "/placeholder.svg" ? companyLogo : currentData.logo,
        updatedAt: serverTimestamp(),
      })
      console.log(`Company ${companyName} updated`)
    } else {
      // Add new company
      await addDoc(collection(db, "companies"), {
        name: companyName,
        logo: companyLogo,
        studentsPlaced: 1,
        createdAt: serverTimestamp(),
      })
      console.log(`Company ${companyName} added`)
    }

    return true
  } catch (error: any) {
    console.error("Error adding or updating company:", error)

    // Check if it's a permission error
    if (error.code === "permission-denied") {
      throw new Error("Permission denied: Please check your Firebase security rules.")
    }

    return false
  }
}

export async function approveExperienceInFirestore(id: number) {
  try {
    console.log("Approving experience in Firestore:", id)
    const experienceRef = doc(db, "experiences", id.toString())
    const experienceDoc = await getDoc(experienceRef)

    if (!experienceDoc.exists()) {
      console.error(`Experience ${id} not found`)
      throw new Error("Experience not found")
    }

    const experienceData = experienceDoc.data()

    await updateDoc(experienceRef, {
      status: "approved",
      updatedAt: serverTimestamp(),
    })

    // Update company information when experience is approved
    await addOrUpdateCompanyInFirestore(experienceData.company, experienceData.companyLogo)

    console.log(`Experience ${id} approved`)
    return true
  } catch (error: any) {
    console.error("Error approving experience:", error)

    // Check if it's a permission error
    if (error.code === "permission-denied") {
      throw new Error("Permission denied: Please check your Firebase security rules.")
    }

    throw error
  }
}

export async function rejectExperienceInFirestore(id: number) {
  try {
    console.log("Rejecting experience in Firestore:", id)
    await updateDoc(doc(db, "experiences", id.toString()), {
      status: "rejected",
      updatedAt: serverTimestamp(),
    })
    console.log(`Experience ${id} rejected`)
    return true
  } catch (error: any) {
    console.error("Error rejecting experience:", error)

    // Check if it's a permission error
    if (error.code === "permission-denied") {
      throw new Error("Permission denied: Please check your Firebase security rules.")
    }

    throw error
  }
}

export async function getPendingExperiencesFromFirestore() {
  try {
    console.log("Fetching pending experiences from Firestore")
    const experiencesRef = collection(db, "experiences")
    const q = query(experiencesRef, where("status", "==", "pending"))
    const querySnapshot = await getDocs(q)

    const pendingExperiences: Experience[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      pendingExperiences.push({
        id: Number.parseInt(doc.id) || Date.now(),
        studentName: data.studentName || "",
        branch: data.branch || "",
        company: data.company || "",
        year: data.year || new Date().getFullYear(),
        type: data.type || "On-Campus",
        excerpt: data.excerpt || "",
        profileImage: data.profileImage || "/placeholder.svg?height=100&width=100",
        companyLogo: data.companyLogo || "/placeholder.svg?height=40&width=40",
        status: data.status || "pending",
        linkedIn: data.linkedIn || "",
        github: data.github || "",
        personalEmail: data.personalEmail || "",
        preparationStrategy: data.preparationStrategy || "",
        interviewProcess: data.interviewProcess || "",
        tips: data.tips || "",
        challenges: data.challenges || "",
        role: data.role || "",
        submittedAt: data.submittedAt ? new Date(data.submittedAt.toDate()).toISOString() : new Date().toISOString(),
      })
    })

    console.log(`Retrieved ${pendingExperiences.length} pending experiences`)
    return pendingExperiences
  } catch (error) {
    console.error("Error getting pending experiences:", error)
    return []
  }
}

