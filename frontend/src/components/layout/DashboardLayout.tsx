import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FileText, 
  LayoutDashboard, 
  Settings, 
  CreditCard, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function SidebarItem({ icon, label, href, active }: SidebarItemProps) {
  return (
    <Link to={href}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
          active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
        )}
      >
        {icon}
        <span>{label}</span>
        {active && <ChevronRight className="ml-auto h-4 w-4" />}
      </div>
    </Link>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

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

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-background">
          <div className="flex flex-col gap-2 p-4">
            <SidebarItem
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Dashboard"
              href="/dashboard"
              active={isActive("/dashboard")}
            />
            <SidebarItem
              icon={<FileText className="h-5 w-5" />}
              label="My Resumes"
              href="/resumes"
              active={isActive("/resumes")}
            />
            <SidebarItem
              icon={<FileText className="h-5 w-5" />}
              label="Templates"
              href="/templates"
              active={isActive("/templates")}
            />
            <SidebarItem
              icon={<CreditCard className="h-5 w-5" />}
              label="Subscription"
              href="/subscription"
              active={isActive("/subscription")}
            />
            <SidebarItem
              icon={<Users className="h-5 w-5" />}
              label="Referrals"
              href="/referrals"
              active={isActive("/referrals")}
            />
            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              href="/settings"
              active={isActive("/settings")}
            />
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background p-4 shadow-lg">
              <div className="flex flex-col gap-2">
                <SidebarItem
                  icon={<LayoutDashboard className="h-5 w-5" />}
                  label="Dashboard"
                  href="/dashboard"
                  active={isActive("/dashboard")}
                />
                <SidebarItem
                  icon={<FileText className="h-5 w-5" />}
                  label="My Resumes"
                  href="/resumes"
                  active={isActive("/resumes")}
                />
                <SidebarItem
                  icon={<FileText className="h-5 w-5" />}
                  label="Templates"
                  href="/templates"
                  active={isActive("/templates")}
                />
                <SidebarItem
                  icon={<CreditCard className="h-5 w-5" />}
                  label="Subscription"
                  href="/subscription"
                  active={isActive("/subscription")}
                />
                <SidebarItem
                  icon={<Users className="h-5 w-5" />}
                  label="Referrals"
                  href="/referrals"
                  active={isActive("/referrals")}
                />
                <SidebarItem
                  icon={<Settings className="h-5 w-5" />}
                  label="Settings"
                  href="/settings"
                  active={isActive("/settings")}
                />
                <div className="mt-auto pt-4">
                  <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}