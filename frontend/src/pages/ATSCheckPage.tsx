import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { initiateATSCheck, getATSCheckResult, applyOptimizationSuggestion } from "@/api/ats"; // Import ATS API functions
import { useToast } from "@/hooks/use-toast"; // Import useToast from hooks
import { useParams, Link } from "react-router-dom"; // Assuming resumeId comes from URL
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"; // Import Loader2

// Assuming resumeId is passed as a URL parameter, e.g., /ats-check/:resumeId
// You would navigate to this page from the user dashboard or resume editor.

export function ATSCheckPage() {
  const { resumeId } = useParams<{ resumeId: string }>(); // Get resumeId from URL
  const resumeIdNumber = resumeId ? parseInt(resumeId) : null;

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [atsScoreId, setAtsScoreId] = useState<number | null>(null);

  const { toast } = useToast();

  // Mutation to initiate ATS check
  const initiateATSCheckMutation = useMutation({
    mutationFn: initiateATSCheck,
    onSuccess: (data) => {
      setAtsScoreId(data.id);
      toast({
        title: "ATS Check Initiated",
        description: "Analyzing your resume against the job description.",
      });
      // The useQuery for results will automatically refetch when atsScoreId changes
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "ATS Check Failed",
        description: error.message || "An error occurred during the ATS check.",
      });
    },
  });

  // Query to fetch ATS check results
  const { data: atsResult, isLoading: isLoadingATSResult, refetch: refetchATSResult, error: atsResultError } = useQuery({
    queryKey: ['atsCheckResult', atsScoreId],
    queryFn: () => getATSCheckResult(atsScoreId!),
    enabled: atsScoreId !== null, // Only run when atsScoreId is available
    refetchInterval: (data) => (data?.score === undefined ? 2000 : false), // Poll until score is available (basic polling)
  });

  // Mutation to apply optimization suggestion
  const applySuggestionMutation = useMutation({
    mutationFn: ({ atsScoreId, suggestionId }: { atsScoreId: number; suggestionId: number }) =>
      applyOptimizationSuggestion(atsScoreId, suggestionId),
    onSuccess: () => {
      toast({
        title: "Suggestion Applied",
        description: "The optimization suggestion has been applied to your resume.",
      });
      refetchATSResult(); // Refetch results to show updated state
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to Apply Suggestion",
        description: error.message || "An error occurred while applying the suggestion.",
      });
    },
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeIdNumber) {
      toast({
        variant: "destructive",
        title: "Resume not selected",
        description: "Please select a resume to perform the ATS check.",
      });
      return;
    }
    if (!jobTitle || !jobDescription) {
      toast({
        variant: "destructive",
        title: "Missing job details",
        description: "Please enter both job title and description.",
      });
      return;
    }

    initiateATSCheckMutation.mutate({
      resume_id: resumeIdNumber,
      job_title: jobTitle,
      job_description: jobDescription,
    });
  };

  const handleApplySuggestion = (suggestionId: number) => {
    if (atsScoreId) {
      applySuggestionMutation.mutate({ atsScoreId, suggestionId });
    }
  };


  return (
    <MainLayout>
      <div className="container py-12 md:py-16">
        <h1 className="text-3xl font-bold gradient-heading mb-8">
          ATS Score Checker
        </h1>

        {!resumeIdNumber && (
           <div className="text-center text-muted-foreground py-12">
            <p>Please select a resume from your dashboard to use the ATS checker.</p>
             <Link to="/dashboard" className="mt-4 inline-block">
               <Button>Go to Dashboard</Button>
             </Link>
          </div>
        )}

        {resumeIdNumber && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Software Engineer"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={8}
                    required
                  />
                </div>
                <Button type="submit" disabled={initiateATSCheckMutation.isPending}>
                  {initiateATSCheckMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Check ATS Score"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}


        {isLoadingATSResult && atsScoreId !== null && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Analyzing Resume...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                 <Progress value={atsResult?.score || 0} className="w-full" />
                 <span>{atsResult?.score || 0}%</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">
                Please wait while we analyze your resume against the job description. This may take a moment.
              </p>
            </CardContent>
          </Card>
        )}

         {atsResultError && atsScoreId !== null && (
           <Card className="mb-8 border-destructive">
             <CardHeader>
               <CardTitle className="text-destructive">Error Analyzing Resume</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-muted-foreground">
                 An error occurred while fetching the ATS check results: {atsResultError.message}
               </p>
                <Button variant="outline" className="mt-4" onClick={() => refetchATSResult()}>Retry Analysis</Button>
             </CardContent>
           </Card>
         )}


        {atsResult && atsResult.score !== undefined && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>ATS Score: {atsResult.score}%</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Keyword Matches */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Keyword Matches</h3>
                {atsResult.keyword_matches && atsResult.keyword_matches.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {atsResult.keyword_matches.map((match) => (
                      <Badge
                        key={match.id}
                        variant={match.found ? "default" : "secondary"}
                        className={`flex items-center justify-center py-2 ${match.found ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                      >
                        {match.found ? <CheckCircle2 className="mr-1 h-4 w-4" /> : <XCircle className="mr-1 h-4 w-4" />}
                        {match.keyword} ({match.importance})
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No keyword matches found yet.</p>
                )}
              </div>

              {/* Optimization Suggestions */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Optimization Suggestions</h3>
                {atsResult.optimization_suggestions && atsResult.optimization_suggestions.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {atsResult.optimization_suggestions.map((suggestion) => (
                      <AccordionItem key={suggestion.id} value={`suggestion-${suggestion.id}`}>
                        <AccordionTrigger>
                          Suggestion for {suggestion.section}
                           {suggestion.applied && <Badge variant="secondary" className="ml-2">Applied</Badge>}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div>
                            <p className="font-medium">Reason:</p>
                            <p className="text-muted-foreground">{suggestion.reason}</p>
                          </div>
                          <div>
                            <p className="font-medium">Original Text:</p>
                            <p className="text-muted-foreground italic">"{suggestion.original_text}"</p>
                          </div>
                          <div>
                            <p className="font-medium">Suggested Text:</p>
                            <p className="text-muted-foreground">"{suggestion.suggested_text}"</p>
                          </div>
                          {!suggestion.applied && (
                             <Button
                               size="sm"
                               onClick={() => handleApplySuggestion(suggestion.id)}
                               disabled={applySuggestionMutation.isPending}
                             >
                               {applySuggestionMutation.isPending ? "Applying..." : "Apply Suggestion"}
                             </Button>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-muted-foreground">No optimization suggestions available yet.</p>
                )}
              </div>

              {/* TODO: Add more analysis details */}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}