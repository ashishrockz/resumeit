import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function TemplateCreationPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [htmlStructure, setHtmlStructure] = useState("");
  const [cssStyles, setCssStyles] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement logic to save the template
    console.log("Saving template:", {
      templateId,
      templateName,
      templateDescription,
      htmlStructure,
      cssStyles,
    });
    // You would typically make an API call here to save the template data
  };

  return (
    <MainLayout>
      <div className="container py-12 md:py-16">
        <h1 className="text-3xl font-bold gradient-heading mb-8">
          {templateId ? `Edit Template ${templateId}` : "Create New Template"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="templateName">Template Name</Label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
              required
            />
          </div>

          <div>
            <Label htmlFor="templateDescription">Description</Label>
            <Textarea
              id="templateDescription"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Enter template description"
            />
          </div>

          <div>
            <Label htmlFor="htmlStructure">HTML Structure</Label>
            <Textarea
              id="htmlStructure"
              value={htmlStructure}
              onChange={(e) => setHtmlStructure(e.target.value)}
              placeholder="Enter HTML structure for the template"
              rows={10}
              required
            />
          </div>

          <div>
            <Label htmlFor="cssStyles">CSS Styles</Label>
            <Textarea
              id="cssStyles"
              value={cssStyles}
              onChange={(e) => setCssStyles(e.target.value)}
              placeholder="Enter CSS styles for the template"
              rows={10}
            />
          </div>

          <Button type="submit">
            {templateId ? "Save Changes" : "Create Template"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}