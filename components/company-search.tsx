"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CompanySearch({ onFilter }: { onFilter?: (filters: any) => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Company categories
  const categories = [
    "Tech",
    "Finance",
    "Core",
    "Product",
    "Service",
    "Consulting",
    "E-Commerce",
    "Healthcare",
    "Manufacturing",
  ]

  // Initialize filters from URL params
  useEffect(() => {
    const query = searchParams.get("query") || ""
    const category = searchParams.get("category") || "all"

    setSearchQuery(query)
    setSelectedCategory(category)
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
      category: selectedCategory === "all" ? null : selectedCategory,
    })

    router.push(`${pathname}?${queryString}`)

    if (onFilter) {
      onFilter({
        query: searchQuery,
        category: selectedCategory,
      })
    }

    setIsFilterOpen(false)
  }

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")

    router.push(pathname)

    if (onFilter) {
      onFilter({
        query: "",
        category: "all",
      })
    }
  }

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const queryString = createQueryString({
      query: searchQuery || null,
    })
    router.push(`${pathname}?${queryString}`)

    if (onFilter) {
      onFilter({
        query: searchQuery,
        category: selectedCategory,
      })
    }
  }

  // Handle category quick filter
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)

    const queryString = createQueryString({
      category: category === "all" ? null : category,
    })

    router.push(`${pathname}?${queryString}`)

    if (onFilter) {
      onFilter({
        query: searchQuery,
        category: category,
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col sm:flex-row gap-3 sm:gap-4" onSubmit={handleSearch}>
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search companies..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="default" size="icon" className="shrink-0">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Companies</SheetTitle>
                <SheetDescription>Narrow down companies based on your preferences</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Company Type</h3>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, "-")}>
                          {category}
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
                <Button onClick={applyFilters}>Apply Filters</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </form>

      <div className="flex flex-wrap gap-1 sm:gap-2">
        <Button
          variant={selectedCategory === "all" ? "secondary" : "outline"}
          size="sm"
          className="rounded-full text-xs h-7 sm:h-9 px-2 sm:px-3"
          onClick={() => handleCategoryFilter("all")}
        >
          All
        </Button>
        <Button
          variant={selectedCategory === "tech" ? "secondary" : "outline"}
          size="sm"
          className="rounded-full text-xs h-7 sm:h-9 px-2 sm:px-3"
          onClick={() => handleCategoryFilter("tech")}
        >
          Tech
        </Button>
        <Button
          variant={selectedCategory === "finance" ? "secondary" : "outline"}
          size="sm"
          className="rounded-full text-xs h-7 sm:h-9 px-2 sm:px-3"
          onClick={() => handleCategoryFilter("finance")}
        >
          Finance
        </Button>
        <Button
          variant={selectedCategory === "core" ? "secondary" : "outline"}
          size="sm"
          className="rounded-full text-xs h-7 sm:h-9 px-2 sm:px-3"
          onClick={() => handleCategoryFilter("core")}
        >
          Core
        </Button>
        <Button
          variant={selectedCategory === "product" ? "secondary" : "outline"}
          size="sm"
          className="rounded-full text-xs h-7 sm:h-9 px-2 sm:px-3"
          onClick={() => handleCategoryFilter("product")}
        >
          Product
        </Button>
      </div>
    </div>
  )
}

