"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { getExperiences } from "@/lib/data-utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

export type Experience = {
  id: number;
  studentName: string;
  branch: string;
  company: string;
  companyType?: string;
  year: number;
  type: string;
  excerpt: string;
  profileImage: string;
  companyLogo: string;
  status: "pending" | "approved" | "rejected";
  role?: string;
  uid?: string;
};

export default function ExperienceList() {
  const searchParams = useSearchParams();
  const { user, isAdmin, isAuthenticated, loading } = useAuth();
  const [displayedExperiences, setDisplayedExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true);
        const experiences = await getExperiences();
        setDisplayedExperiences(experiences.filter((exp) => exp.status === "approved"));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load experiences. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {displayedExperiences.map((experience) => (
        <Card key={experience.id} className="flex flex-col overflow-hidden">
          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src={experience.profileImage} alt={experience.studentName} />
                  <AvatarFallback>{experience.studentName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm sm:text-lg line-clamp-1">{experience.studentName}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm line-clamp-1">{experience.branch}</CardDescription>
                </div>
              </div>
              <Image
                src={experience.companyLogo || "/placeholder.svg"}
                alt={`${experience.company} logo`}
                width={32}
                height={32}
                className="rounded-md h-8 w-8 sm:h-10 sm:w-10 object-contain"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-3 sm:p-4 pt-0 sm:pt-0">
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
              <Badge variant="outline">{experience.company}</Badge>
              <Badge variant="secondary">{experience.type}</Badge>
              <Badge variant="outline">{experience.year}</Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 sm:line-clamp-4">
              {experience.excerpt}
            </p>
          </CardContent>
          <CardFooter className="p-3 sm:p-4">
            <Button variant="outline" asChild>
              <Link href={`/experience/${experience.id}`}>Read More</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
