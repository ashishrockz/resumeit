import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getTemplates } from "@/api/template"; // Assuming you'll create this API function
import { Skeleton } from "@/components/ui/skeleton";

// Assuming a basic type for template data
interface Template {
  id: number;
  name: string;
  thumbnail?: string; // URL to thumbnail image
  is_premium: boolean;
  // Add other relevant fields
}

export function TemplateSelectionPage() {
  // Fetch available templates
  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['templates'],
    queryFn: getTemplates, // Implement this function to fetch templates
  });

  return (
    <MainLayout>
      <div className="container py-12 md:py-16">
        <h1 className="text-3xl font-bold gradient-heading mb-8">
          Select a Template
        </h1>

        {isLoadingTemplates ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-60 w-full" />
            <Skeleton className="h-60 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        ) : templates && templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="template-card">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {template.thumbnail && (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  )}
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${template.is_premium ? 'text-yellow-600' : 'text-green-600'}`}>
                      {template.is_premium ? "Premium" : "Free"}
                    </span>
                    <Link to={`/templates/${template.id}/create`}>
                      <Button size="sm">Select</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p>No templates available at the moment.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// Placeholder for the API call - you will need to implement this
async function getTemplates(): Promise<Template[]> {
  // Replace with actual API call to fetch templates
  // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/templates/`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch templates');
  // }
  // return response.json();

  // Returning mock data for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Classic Professional", is_premium: false, thumbnail: "placeholder.svg" },
        { id: 2, name: "Modern Minimalist", is_premium: true, thumbnail: "placeholder.svg" },
        { id: 3, name: "Creative Portfolio", is_premium: true, thumbnail: "placeholder.svg" },
      ]);
    }, 1000);
  });
}