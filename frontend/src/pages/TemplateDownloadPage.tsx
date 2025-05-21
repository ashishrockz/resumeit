import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TemplateDownloadPage() {
  const { resumeId } = useParams<{ resumeId: string }>();

  const handleDownload = () => {
    // TODO: Implement resume download logic
    console.log(`Downloading resume with ID: ${resumeId}`);
    // This would typically trigger a backend process to generate and return the PDF
  };

  return (
    <MainLayout>
      <div className="container py-12 md:py-16">
        <h1 className="text-3xl font-bold gradient-heading mb-8">
          Download Your Resume
        </h1>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Resume Preview (Placeholder)</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              A preview of your resume based on the selected template and your data would appear here.
            </p>
            {/* TODO: Implement actual resume preview */}
            <div className="bg-muted/50 h-60 flex items-center justify-center rounded-md mb-6">
              <span className="text-muted-foreground">Resume Preview Area</span>
            </div>
            <Button size="lg" onClick={handleDownload}>
              Download Resume as PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}