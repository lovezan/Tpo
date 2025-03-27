"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function CompanySearch() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex flex-col sm:flex-row gap-4">
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
        <Button variant="outline" size="sm" className="rounded-full">
          All
        </Button>
        <Button variant="secondary" size="sm" className="rounded-full">
          Tech
        </Button>
        <Button variant="outline" size="sm" className="rounded-full">
          Finance
        </Button>
        <Button variant="outline" size="sm" className="rounded-full">
          Core
        </Button>
      </div>
    </div>
  )
}

