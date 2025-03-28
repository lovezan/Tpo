import type { Metadata } from "next"
import CompanyList from "@/components/company-list"
import CompanySearch from "@/components/company-search"

export const metadata: Metadata = {
  title: "Companies | NIT Hamirpur",
  description: "Explore companies that recruit from NIT Hamirpur",
}

export default function CompaniesPage() {
  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Search and explore companies that recruit from NIT Hamirpur</p>
        </div>

        <CompanySearch />
        <CompanyList />
      </div>
    </div>
  )
}

