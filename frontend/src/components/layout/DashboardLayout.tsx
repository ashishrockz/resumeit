import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FileText, LayoutDashboard, Users, FileTextIcon, DollarSign, Menu } from "lucide-react"; // Import Menu icon
import { cn } from "@/lib/utils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"; // Import resizable components
import { Separator } from "@/components/ui/separator"; // Import Separator
import { Button } from "@/components/ui/button"; // Import Button
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet for mobile sidebar

interface DashboardLayoutProps {
  children: ReactNode;
  isAdmin?: boolean; // Prop to differentiate between user and admin dashboard
}

export function DashboardLayout({ children, isAdmin = false }: DashboardLayoutProps) {
  const navItems = isAdmin
    ? [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users }, // TODO: Create Admin Users Page
        { name: "Templates", href: "/admin/templates", icon: FileTextIcon }, // TODO: Create Admin Templates Page
        { name: "Subscriptions", href: "/admin/subscriptions", icon: DollarSign }, // Link to subscriptions list (will be on dashboard for now)
        // Add more admin specific links here
      ]
    : [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Resumes", href: "/dashboard/resumes", icon: FileTextIcon }, // TODO: Create User Resumes Page
        { name: "Templates", href: "/templates", icon: FileTextIcon },
        // Add more user specific links here
      ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ResumeIt</span>
            </Link>
          </div>
          {/* TODO: Add any global header elements here (e.g., user profile, notifications) */}

          {/* Mobile Sidebar Trigger */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
               <div className="flex items-center gap-2 mb-6">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">ResumeIt</span>
              </div>
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      // Add active link styling here if needed
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Sidebar Panel */}
        <ResizablePanel defaultSize={15} minSize={10} maxSize={20} className="hidden md:block">
          <div className="flex flex-col h-full p-4">
             <div className="flex items-center gap-2 mb-6">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">ResumeIt</span>
              </div>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    // Add active link styling here if needed
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle withHandle className="hidden md:flex" />

        {/* Content Panel */}
        <ResizablePanel defaultSize={85}>
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Footer (Optional, can be included here or in MainLayout) */}
      {/* <Footer /> */}
    </div>
  );
}