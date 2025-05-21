import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createTemplate } from "@/api/template"; // We will create this function next
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export function TemplateCreationPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [category, setCategory] = useState<number | null>(null); // Assuming category is an ID
  const [htmlStructure, setHtmlStructure] = useState("");
  const [cssStyles, setCssStyles] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // TODO: Fetch categories for the select input

  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      toast({
        title: "Template created successfully",
        description: "Your new template is now available.",
      });
      navigate("/templates"); // Navigate back to template selection after creation
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to create template",
        description: error.message || "An error occurred.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!templateName || !htmlStructure) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Template Name and HTML Structure are required.",
      });
      return;
    }

    createTemplateMutation.mutate({
      name: templateName,
      description: templateDescription,
      category: category, // Pass category ID
      html_structure: htmlStructure,
      css_styles: cssStyles,
      is_premium: isPremium,
      is_active: isActive,
      sections: [] // Assuming sections are added separately or generated from HTML
    });
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

           {/* TODO: Add Category Select Input */}
           {/* <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => setCategory(parseInt(value))} value={category?.toString() || ""}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                 TODO: Map over fetched categories
                <SelectItem value="1">Category 1</SelectItem>
                <SelectItem value="2">Category 2</SelectItem>
              </SelectContent>
            </Select>
          </div> */}


          <div>
            <Label htmlFor="htmlStructure">HTML Structure</Label>
            <Textarea
              id="htmlStructure"
              value={htmlStructure}
              onChange={(e) => setHtmlStructure(e.target.value)}
              placeholder="Enter HTML structure for the template"
              rows={15}
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
              rows={15}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPremium"
              checked={isPremium}
              onCheckedChange={(checked) => setIsPremium(Boolean(checked))}
            />
            <Label htmlFor="isPremium">Premium Template</Label>
          </div>

           <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(Boolean(checked))}
            />
            <Label htmlFor="isActive">Active Template</Label>
          </div>


          <Button type="submit" disabled={createTemplateMutation.isPending}>
            {createTemplateMutation.isPending ? "Creating..." : (templateId ? "Save Changes" : "Create Template")}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}