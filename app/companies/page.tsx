import { Suspense } from "react"
import { PageHeader } from "@/components/page-header"
import CompanyList from "@/components/company-list"
import { Briefcase } from "lucide-react"

export const metadata = {
  title: "Companies | NIT Hamirpur Placement Portal",
  description: "Browse companies that have recruited from NIT Hamirpur",
}

export default function CompaniesPage() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Companies"
        description="Browse companies that have recruited from NIT Hamirpur"
        icon={<Briefcase className="h-6 w-6 mr-2" />}
      />

      <Suspense fallback={<CompanyListSkeleton />}>
        <CompanyList />
      </Suspense>
    </div>
  )
}

function CompanyListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-48 bg-muted rounded-lg animate-pulse"></div>
      ))}
    </div>
  )
}

