import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, FileText, User, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth"; // Import the useAuth hook

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, isLoggingOut } = useAuth(); // Use the useAuth hook
  const isLoggedIn = localStorage.getItem('accessToken') !== null; // Check for access token

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ResumeIt</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/templates" className="text-sm font-medium hover:text-primary">
            Templates
          </Link>
          <Link to="/pricing" className="text-sm font-medium hover:text-primary">
            Pricing
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="gap-2">
                   <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/profile">
                <Button size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              {/* Add Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()} // Call the logout function
                disabled={isLoggingOut}
                className="gap-2"
              >
                 <LogOut className="h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 pb-6 border-b">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/templates"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Templates
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            {isLoggedIn ? (
              <div className="flex flex-col space-y-2 pt-2">
                 <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full gap-2">
                     <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                 {/* Add Logout Button */}
                <Button
                  variant="ghost"
                  className="w-full gap-2"
                  onClick={() => { logout(); setIsMenuOpen(false); }} // Call logout and close menu
                  disabled={isLoggingOut}
                >
                   <LogOut className="h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}