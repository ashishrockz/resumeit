import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FileText, LayoutDashboard, Users, FileTextIcon, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background p-4 hidden md:block">
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
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar (Optional, can be included in MainLayout or here) */}
        {/* <Navbar /> */}

        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>

        {/* Footer (Optional) */}
        {/* <Footer /> */}
      </div>
    </div>
  );
}