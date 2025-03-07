import * as React from "react";
import { Search, Menu, LogOut, User, Bell, ChevronDown } from "lucide-react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom"; // Use react-router-dom for navigation

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const navigate = useNavigate(); // React Router's navigation hook

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("accessToken"); // Remove access token
    localStorage.removeItem("refreshToken"); // Remove refresh token
    setIsLoggedIn(false); // Update login state
    navigate("/"); // Navigate to the root route
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center rounded-md bg-primary/10 p-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/23df5bfe05e34071448b6849aa6a1c93fd6d0ac3f66bc043b442e76d6815eb51?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
              alt="Company logo"
              className="h-8 w-8"
            />
          </div>
          <span className="hidden text-xl font-semibold sm:inline-block">
            Event Yatra
          </span>
        </div>

        <nav className="hidden md:flex md:gap-10 jus">
          <button className="text-lg font-medium text-foreground/70 hover:text-foreground">
            Events
          </button>
          <button className="text-lg font-medium text-foreground/70 hover:text-foreground">
            Calendar
          </button>
        </nav>

        <div className="flex items-center gap-4">
         

          {isLoggedIn ? (
            <DropdownMenuPrimitive.Root>
              <DropdownMenuPrimitive.Trigger asChild>
                <button className="flex items-center gap-2 rounded-md p-1 px-2 hover:bg-accent">
                
                  <span className="hidden text-sm font-medium md:inline-block">
                    Subin
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </DropdownMenuPrimitive.Trigger>
              <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                  align="end"
                  className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in"
                  sideOffset={4}
                >
                  <DropdownMenuPrimitive.Item className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
                    <User className="h-4 w-4 mr-2" /> Profile
                  </DropdownMenuPrimitive.Item>
                  <DropdownMenuPrimitive.Item className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
                    Settings
                  </DropdownMenuPrimitive.Item>
                  <DropdownMenuPrimitive.Separator className="-mx-1 my-1 h-px bg-muted" />
                  <DropdownMenuPrimitive.Item
                    onClick={handleLogout}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuPrimitive.Item>
                </DropdownMenuPrimitive.Content>
              </DropdownMenuPrimitive.Portal>
            </DropdownMenuPrimitive.Root>
          ) : (
            <button
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/login")} // Navigate to login page
            >
              Sign In
            </button>
          )}

          <button className="rounded-md p-2 hover:bg-accent hover:text-accent-foreground md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}