import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/theme-provider";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User, Moon, Sun, Laptop } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const isAdmin = user?.roles.includes("ROLE_ADMIN");
  const isManager = user?.roles.includes("ROLE_MANAGER");

  return (
    <nav className="bg-card border-b shadow-sm sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16 mx-auto px-4">
        <div className="flex items-center">
          <Link to="/dashboard" className="text-xl font-bold mr-8">
            Investment System
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="text-sm font-medium hover:text-primary"
            >
              Dashboard
            </Link>

            <Link
              to="/investments/new"
              className="text-sm font-medium hover:text-primary"
            >
              New Request
            </Link>

            <Link
              to="/investments"
              className="text-sm font-medium hover:text-primary"
            >
              My Requests
            </Link>

            {(isManager || isAdmin) && (
              <Link
                to="/managed-requests"
                className="text-sm font-medium hover:text-primary"
              >
                Managed Requests
              </Link>
            )}

            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-2">
                    <span className="text-sm font-medium">Admin</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/users" className="w-full">
                      Manage Users
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/escalated-requests" className="w-full">
                      Escalated Requests
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                {theme === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Laptop className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Laptop className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">
                  {user?.firstName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.username}
                <p className="text-xs text-muted-foreground mt-1">
                  {user?.designation}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
