import { Link } from "react-router-dom";
import { FileText, PlusCircle, Star } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getUserResumes } from "@/api/resume"; // Assuming you'll create this API function
import { Skeleton } from "@/components/ui/skeleton";

// Assuming a basic type for resume data
interface Resume {
  id: number;
  title: string;
  updated_at: string;
  // Add other relevant fields
}

export function UserDashboardPage() {
  // Fetch user resumes
  const { data: resumes, isLoading: isLoadingResumes } = useQuery({
    queryKey: ['userResumes'],
    queryFn: getUserResumes, // Implement this function to fetch user's resumes
  });

  // Placeholder data for quick status cards
  const subscriptionStatus = "Premium"; // Replace with actual data
  const daysRemaining = 45; // Replace with actual data
  const numberOfResumes = resumes?.length || 0;
  const latestATSScore = 85; // Replace with actual data

  return (
    <MainLayout>
      <div className="container py-12 md:py-16">
        <h1 className="text-3xl font-bold gradient-heading mb-8">
          Your Dashboard
        </h1>

        {/* Quick Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscription Status
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscriptionStatus}</div>
              <p className="text-xs text-muted-foreground">
                {daysRemaining} days remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Resumes Created
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{numberOfResumes}</div>
              <p className="text-xs text-muted-foreground">
                Total resumes in your account
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Latest ATS Score
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestATSScore}%</div>
              <p className="text-xs text-muted-foreground">
                From your last check
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resume Gallery */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Resumes</h2>
          <Link to="/templates">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Resume
            </Button>
          </Link>
        </div>

        {isLoadingResumes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : resumes && resumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="resume-card">
                <CardHeader>
                  <CardTitle className="text-lg">{resume.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Last updated: {new Date(resume.updated_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/resume/${resume.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Link to={`/resume/${resume.id}/download`}>
                       <Button variant="secondary" size="sm">Download</Button>
                    </Link>
                    {/* Add more actions like Delete, ATS Check */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p>You haven't created any resumes yet.</p>
            <Link to="/templates" className="mt-4 inline-block">
              <Button>Create Your First Resume</Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// Placeholder for the API call - you will need to implement this
async function getUserResumes(): Promise<Resume[]> {
  // Replace with actual API call to fetch user's resumes
  // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resumes/`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch resumes');
  // }
  // return response.json();

  // Returning mock data for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Software Engineer Resume", updated_at: "2023-10-27T10:00:00Z" },
        { id: 2, title: "Data Scientist CV", updated_at: "2023-10-26T14:30:00Z" },
      ]);
    }, 1000);
  });
}