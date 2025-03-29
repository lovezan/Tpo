import type { Metadata } from "next"
import CompaniesClientPage from "./CompaniesClientPage"

export const metadata: Metadata = {
  title: "Companies | NIT Hamirpur",
  description: "Explore companies that recruit from NIT Hamirpur",
}

export default function CompaniesPage() {
  return <CompaniesClientPage />
}

