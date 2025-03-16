import * as React from "react";
import { Menu, LogOut, User, ChevronDown } from "lucide-react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";
import { IoNotificationsSharp } from "react-icons/io5";
import { selectNotificationCount } from "../../services/notificationSlice";
import { useSelector } from "react-redux";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    !!localStorage.getItem("accessToken")
  );
  const [userName, setUserName] = React.useState(""); 
  const navigate = useNavigate();
  
  // Check for both access and refresh tokens on component mount and updates
  React.useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      
      // Consider user logged in if either token exists
      setIsLoggedIn(!!(accessToken || refreshToken));
      
      // If refresh token exists but access token doesn't, you might want to
      // trigger a token refresh here (calling your refresh API endpoint)
      if (!accessToken && refreshToken) {
        // Optional: Implement token refresh logic here
        // refreshAccessToken(refreshToken);
      }
      
      // Set user name
      const storedUser = localStorage.getItem("name");
      if (storedUser) {
        setUserName(storedUser);
      }
    };
    
    checkAuthStatus();
    
    // Add event listener for storage changes (in case tokens are updated in another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, [isLoggedIn]);

  // Get notification count from Redux store
  const notificationCount = useSelector(selectNotificationCount);

  const handleLogout = () => {
    console.log("Logging out...");
    // Clear both tokens on logout
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("name");
    setUserName(""); 
    setIsLoggedIn(false);
    navigate("/");
  };

  // Optional: You could implement a function to refresh the access token
  // const refreshAccessToken = async (refreshToken) => {
  //   try {
  //     const response = await fetch('/api/refresh-token', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ refreshToken }),
  //     });
  //     const data = await response.json();
  //     if (data.accessToken) {
  //       localStorage.setItem("accessToken", data.accessToken);
  //       // Update login state
  //       setIsLoggedIn(true);
  //     }
  //   } catch (error) {
  //     console.error('Failed to refresh token:', error);
  //     // Handle refresh token failure (maybe redirect to login)
  //     setIsLoggedIn(false);
  //     navigate("/login");
  //   }
  // };

  const goToProfile = () => navigate("/profile");
  const goToHome = () => navigate("/dashboard");
  const goToEvent = () => navigate("/tracking");
  const goToNotification = () => navigate("/notification");
  const goToEventCard = () => navigate("/alleventpage");

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            EventYatra
          </span>
        </div>

        <nav className="hidden md:flex md:gap-10">
          <button
            onClick={goToHome}
            className="text-lg font-medium text-foreground/70 hover:text-foreground"
          >
            Home Page
          </button>
          <button onClick={goToEventCard}
           className="text-lg font-medium text-foreground/70 hover:text-foreground">
            Events
          </button>
          <button onClick={goToEvent}
           className="text-lg font-medium text-foreground/70 hover:text-foreground">
            Calendar
          </button>
         
        </nav>

        <div className="flex items-center gap-4">
        <button 
        onClick={goToNotification}  
        className="text-lg font-medium text-foreground/70 hover:text-foreground relative"
      >            
        <IoNotificationsSharp/>
        {notificationCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </button>
          {isLoggedIn ? (
            <DropdownMenuPrimitive.Root>
              <DropdownMenuPrimitive.Trigger asChild>
                <button className="flex items-center gap-2 rounded-md p-1 px-2 hover:bg-accent">
                  <span className="hidden text-sm font-medium md:inline-block">
                    {userName || "User"} {/* Fallback if name is missing */}
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
                  <DropdownMenuPrimitive.Item
                    onClick={goToProfile}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
                  >
                    <User className="h-4 w-4 mr-2" /> Profile
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
              onClick={() => navigate("/")}
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