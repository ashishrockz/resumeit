import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RetroGrid } from "@/components/ui/retro-grid";
import Navbar from "@/components/layout/Navbar";
import { CheckCircle, FileText, Zap, Award, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 overflow-hidden">
        <div className="absolute top-0 z-[0] h-screen w-screen bg-blue-50 dark:bg-blue-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(59,130,246,0.3),rgba(255,255,255,0))]" />
        <RetroGrid 
          opacity={0.4} 
          lightLineColor="rgba(59, 130, 246, 0.2)" 
          darkLineColor="rgba(59, 130, 246, 0.2)" 
        />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-4">
              <Zap className="w-4 h-4 mr-2" /> ATS-Optimized Resumes
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Create ATS-friendly resumes that 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"> get you noticed</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Build professional resumes with our AI-powered platform. Get up to 95% ATS compatibility and stand out to recruiters.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="text-base" asChild>
                <Link to="/signup">Create Your Resume</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link to="/templates">Browse Templates</Link>
              </Button>
            </div>
            
            <div className="pt-8 flex justify-center space-x-8">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>ATS Optimized</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>Professional Templates</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
          
          {/* Resume Preview Image */}
          <div className="mt-16 max-w-5xl mx-auto relative">
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 blur-3xl opacity-70 rounded-3xl"></div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 animate-float">
              <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <img 
                  src="https://source.unsplash.com/random/1200x800?resume,professional,document" 
                  alt="Resume Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -right-12 top-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 animate-float animation-delay-2000">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-bold">95%</span>
                </div>
                <span className="text-sm font-medium">ATS Score</span>
              </div>
            </div>
            
            <div className="absolute -left-8 bottom-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 animate-float animation-delay-4000">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Premium Template</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose ResumeIt?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform offers everything you need to create professional, ATS-friendly resumes that help you land your dream job.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ATS-Optimized Templates</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our professionally designed templates are built to pass through Applicant Tracking Systems with flying colors.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Optimization</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our advanced AI analyzes job descriptions and optimizes your resume to achieve up to 95% ATS compatibility.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Referral Program</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Refer friends and get 6 months of premium features free when they subscribe to our premium plan.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to land your dream job?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of job seekers who have successfully used ResumeIt to create professional, ATS-friendly resumes.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
            <Link to="/signup">Get Started for Free</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">ResumeIt</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-xs">
                Create professional, ATS-friendly resumes that help you land your dream job.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link to="/templates" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Templates</Link></li>
                  <li><Link to="/features" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Features</Link></li>
                  <li><Link to="/pricing" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Pricing</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">About</Link></li>
                  <li><Link to="/contact" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Contact</Link></li>
                  <li><Link to="/careers" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Careers</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link to="/privacy" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Privacy</Link></li>
                  <li><Link to="/terms" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} ResumeIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;