"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

export default function ExperienceFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBranch, setSelectedBranch] = useState<string>("all")
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")

  // These would come from API in a real implementation
  const branches = ["Computer Science", "Electronics & Communication", "Mechanical", "Civil", "Electrical", "Chemical"]
  const companies = ["Microsoft", "Google", "Amazon", "Flipkart", "Tata Motors", "Infosys", "TCS", "Wipro"]
  const years = ["2023", "2022", "2021", "2020"]
  const placementTypes = ["On-Campus", "Off-Campus", "Internship"]

  // Initialize filters from URL params only once on mount or when searchParams change
  useEffect(() => {
    const query = searchParams.get("query") || ""
    const branch = searchParams.get("branch") || "all"
    const company = searchParams.get("company") || "all"
    const year = searchParams.get("year") || "all"
    const type = searchParams.get("type") || "all"

    setSearchQuery(query)
    setSelectedBranch(branch)
    setSelectedCompany(company)
    setSelectedYear(year)
    setSelectedType(type)
  }, [searchParams])

  // Create a new URLSearchParams instance and update the URL
  const createQueryString = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "all") {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, value)
      }
    })

    return newSearchParams.toString()
  }

  // Apply filters
  const applyFilters = () => {
    const queryString = createQueryString({
      query: searchQuery || null,
      branch: selectedBranch === "all" ? null : selectedBranch,
      company: selectedCompany === "all" ? null : selectedCompany,
      year: selectedYear === "all" ? null : selectedYear,
      type: selectedType === "all" ? null : selectedType,
    })

    router.push(`${pathname}?${queryString}`)
  }

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedBranch("all")
    setSelectedCompany("all")
    setSelectedYear("all")
    setSelectedType("all")
    router.push(pathname)
  }

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const queryString = createQueryString({
      query: searchQuery || null,
    })
    router.push(`${pathname}?${queryString}`)
  }

  // Handle branch quick filter
  const handleBranchFilter = (branch: string) => {
    setSelectedBranch(branch)

    const queryString = createQueryString({
      branch: branch === "all" ? null : branch,
    })

    router.push(`${pathname}?${queryString}`)
  }

  // Handle type quick filter
  const handleTypeFilter = (type: string) => {
    setSelectedType(type)

    const queryString = createQueryString({
      type: type === "all" ? null : type,
    })

    router.push(`${pathname}?${queryString}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSearch}>
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, company or keyword..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={selectedBranch}
            onValueChange={(value) => {
              setSelectedBranch(value)
              // Don't call handleBranchFilter here to avoid double updates
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch} value={branch.toLowerCase().replace(/\s+/g, "-")}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" variant="default" size="icon" className="shrink-0">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Experiences</SheetTitle>
                <SheetDescription>Narrow down experiences based on your preferences</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Company</h3>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company} value={company.toLowerCase().replace(/\s+/g, "-")}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Year</h3>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Placement Type</h3>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {placementTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, "-")}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
                <Button
                  onClick={() => {
                    applyFilters()
                    document
                      .querySelector<HTMLButtonElement>('[data-state="open"] button[data-state="closed"]')
                      ?.click()
                  }}
                >
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedBranch === "all" ? "secondary" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => handleBranchFilter("all")}
        >
          All
        </Button>
        <Button
          variant={selectedBranch === "computer-science" ? "secondary" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => handleBranchFilter("computer-science")}
        >
          Computer Science
        </Button>
        <Button
          variant={selectedBranch === "electronics" ? "secondary" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => handleBranchFilter("electronics")}
        >
          Electronics
        </Button>
        <Button
          variant={selectedBranch === "mechanical" ? "secondary" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => handleBranchFilter("mechanical")}
        >
          Mechanical
        </Button>
        <Button
          variant={selectedType === "on-campus" ? "secondary" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => handleTypeFilter("on-campus")}
        >
          On-Campus
        </Button>
        <Button
          variant={selectedType === "off-campus" ? "secondary" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => handleTypeFilter("off-campus")}
        >
          Off-Campus
        </Button>
      </div>
    </div>
  )
}

