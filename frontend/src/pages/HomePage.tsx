import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, FileText, Search, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";

export function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight gradient-heading">
                Create ATS-Optimized Resumes That Get You Hired
              </h1>
              <p className="text-xl text-muted-foreground">
                Build professional resumes with our ATS-friendly templates and get up to 95% compatibility with job requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/templates">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Browse Templates
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>Free templates available</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-2xl"></div>
              <div className="bg-card border rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">Professional Resume</span>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                    95% ATS Score
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded-md w-3/4"></div>
                  <div className="h-4 bg-muted rounded-md w-full"></div>
                  <div className="h-4 bg-muted rounded-md w-5/6"></div>
                  <div className="h-4 bg-muted rounded-md w-4/5"></div>
                  <div className="h-8 bg-muted rounded-md w-2/3 mt-6"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 bg-muted rounded-md w-full"></div>
                      <div className="h-4 bg-muted rounded-md w-5/6 mt-2"></div>
                      <div className="h-4 bg-muted rounded-md w-4/5 mt-2"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-muted rounded-md w-full"></div>
                      <div className="h-4 bg-muted rounded-md w-5/6 mt-2"></div>
                      <div className="h-4 bg-muted rounded-md w-4/5 mt-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 gradient-heading">
              Why Choose ResumeIt?
            </h2>
            <p className="text-lg text-muted-foreground">
              Our platform is designed to help you create resumes that not only look great but also pass through Applicant Tracking Systems with flying colors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">ATS Optimization</h3>
              <p className="text-muted-foreground">
                Our premium ATS checker analyzes your resume against job descriptions and optimizes it to achieve up to 95% compatibility.
              </p>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Professional Templates</h3>
              <p className="text-muted-foreground">
                Choose from a variety of professionally designed templates that are both visually appealing and ATS-friendly.
              </p>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Referral Program</h3>
              <p className="text-muted-foreground">
                Refer friends and get 6 months of premium subscription free when they sign up for a premium plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold gradient-heading">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of job seekers who have successfully created ATS-optimized resumes with ResumeIt.
              </p>
              <div className="pt-4">
                <Link to="/register">
                  <Button size="lg">
                    Create Your Resume Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}